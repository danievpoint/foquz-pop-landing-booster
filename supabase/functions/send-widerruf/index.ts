import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { handleWithdrawal } from './logic.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const FROM = 'FOQUZ <noreply@foquz.de>';
const TO_SHOP = 'info@foquz.de';

async function sendMail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY missing');
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
    body: JSON.stringify({ from: FROM, to: [to], subject, html }),
  });
  if (!r.ok) throw new Error(`Resend ${r.status}: ${await r.text()}`);
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json(405, { error: 'Method not allowed' });

  let raw: unknown;
  try {
    const text = await req.text();
    if (text.length > 20000) return json(413, { error: 'Anfrage zu groß.' });
    raw = JSON.parse(text);
  } catch {
    return json(400, { error: 'Ungültige Anfrage.' });
  }

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('cf-connecting-ip') || null;
  const userAgent = req.headers.get('user-agent')?.slice(0, 500) ?? null;

  try {
    const result = await handleWithdrawal(raw, { ip, userAgent }, {
      shopAddress: TO_SHOP,
      now: () => new Date(),
      sendMail,
      recentCount: async (addr) => {
        const since = new Date(Date.now() - 3600_000).toISOString();
        const { count } = await supabase
          .from('withdrawal_requests')
          .select('id', { count: 'exact', head: true })
          .eq('ip_address', addr)
          .gte('created_at', since);
        return count ?? 0;
      },
      store: async (v, meta) => {
        const { data, error } = await supabase
          .from('withdrawal_requests')
          .insert({
            customer_name: v.name,
            customer_email: v.email,
            customer_address: v.address,
            order_number: v.orderNumber,
            contract_description: v.contractDescription,
            order_date: v.orderDate,
            withdrawal_body: v.statement,
            received_at: meta.receivedAt,
            ip_address: meta.ip,
            user_agent: meta.userAgent,
          })
          .select('id, received_at')
          .single();
        if (error || !data) throw error ?? new Error('insert failed');
        return { id: data.id, receivedAt: new Date(data.received_at).toISOString() };
      },
      markSent: async (id, field, err) => {
        const now = new Date().toISOString();
        const patch = field === 'confirmation'
          ? (err ? { confirmation_error: err } : { confirmation_sent_at: now, confirmation_error: null })
          : (err ? { notification_error: err } : { notification_sent_at: now, notification_error: null });
        await supabase.from('withdrawal_requests').update(patch).eq('id', id);
      },
    });
    return json(result.status, result.body);
  } catch (e) {
    console.error('send-widerruf store error', e);
    // Nicht gespeichert → Kunde muss es erneut versuchen oder per E-Mail widerrufen.
    return json(500, { error: 'Ihr Widerruf konnte nicht gespeichert werden.' });
  }
});
