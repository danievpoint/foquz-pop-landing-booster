import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const FROM = 'FOQUZ <noreply@foquz.de>';
const TO_SHOP = 'info@foquz.de';

interface Payload {
  name: string;
  email: string;
  address: string;
  orderNumber?: string;
  orderDate: string;
  body: string;
}

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}

async function sendMail(to: string, subject: string, html: string) {
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({ from: FROM, to: [to], subject, html }),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`Resend ${r.status}: ${t}`);
  }
  return r.json();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const p = (await req.json()) as Payload;
    if (!p.name || !p.email || !p.address || !p.orderDate || !p.body) {
      return new Response(JSON.stringify({ error: 'Pflichtfelder fehlen' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) {
      return new Response(JSON.stringify({ error: 'Ungültige E-Mail' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
    const ua = req.headers.get('user-agent') ?? null;

    const { data: row, error: insErr } = await supabase
      .from('withdrawal_requests')
      .insert({
        customer_name: p.name,
        customer_email: p.email,
        customer_address: p.address,
        order_number: p.orderNumber ?? null,
        order_date: p.orderDate,
        withdrawal_body: p.body,
        ip_address: ip,
        user_agent: ua,
      })
      .select('id')
      .single();
    if (insErr) throw insErr;

    const dateStr = new Date(p.orderDate).toLocaleDateString('de-DE');

    // Notification to shop
    const shopHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#111;">
        <h2 style="margin:0 0 16px">Neuer Widerruf eingegangen</h2>
        <table style="border-collapse:collapse;width:100%;font-size:14px">
          <tr><td style="padding:6px 0;width:160px"><b>Name</b></td><td>${esc(p.name)}</td></tr>
          <tr><td style="padding:6px 0"><b>E-Mail</b></td><td>${esc(p.email)}</td></tr>
          <tr><td style="padding:6px 0"><b>Anschrift</b></td><td>${esc(p.address)}</td></tr>
          <tr><td style="padding:6px 0"><b>Bestellnummer</b></td><td>${esc(p.orderNumber ?? '—')}</td></tr>
          <tr><td style="padding:6px 0"><b>Bestellt am</b></td><td>${esc(dateStr)}</td></tr>
        </table>
        <h3 style="margin:20px 0 8px">Widerrufstext</h3>
        <p style="white-space:pre-wrap;background:#f6f6f6;padding:12px;border-radius:8px">${esc(p.body)}</p>
        <p style="color:#666;font-size:12px;margin-top:24px">ID: ${row.id}<br/>IP: ${esc(ip ?? '—')}</p>
      </div>`;

    // Confirmation to customer
    const custHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#111;">
        <h2 style="margin:0 0 16px">Bestätigung Ihres Widerrufs</h2>
        <p>Hallo ${esc(p.name)},</p>
        <p>wir haben Ihren Widerruf erhalten und bestätigen hiermit dessen Eingang. Wir kümmern uns schnellstmöglich um die Bearbeitung.</p>
        <h3 style="margin:20px 0 8px;font-size:15px">Ihre Angaben</h3>
        <table style="border-collapse:collapse;width:100%;font-size:14px">
          <tr><td style="padding:6px 0;width:160px"><b>Name</b></td><td>${esc(p.name)}</td></tr>
          <tr><td style="padding:6px 0"><b>Anschrift</b></td><td>${esc(p.address)}</td></tr>
          <tr><td style="padding:6px 0"><b>Bestellnummer</b></td><td>${esc(p.orderNumber ?? '—')}</td></tr>
          <tr><td style="padding:6px 0"><b>Bestellt am</b></td><td>${esc(dateStr)}</td></tr>
        </table>
        <p style="white-space:pre-wrap;background:#f6f6f6;padding:12px;border-radius:8px;margin-top:16px">${esc(p.body)}</p>
        <p style="margin-top:24px">Bei Rückfragen erreichen Sie uns unter <a href="mailto:info@foquz.de">info@foquz.de</a>.</p>
        <p style="margin-top:24px">Viele Grüße<br/>Ihr FOQUZ Team</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
        <p style="color:#888;font-size:12px">FOQUZ GmbH · Gewerbering am Brand 8 · 82549 Königsdorf</p>
      </div>`;

    await sendMail(TO_SHOP, `Neuer Widerruf – ${p.name}`, shopHtml);
    await sendMail(p.email, 'Bestätigung Ihres Widerrufs – FOQUZ', custHtml);

    await supabase
      .from('withdrawal_requests')
      .update({ confirmation_sent_at: new Date().toISOString(), notification_sent_at: new Date().toISOString() })
      .eq('id', row.id);

    return new Response(JSON.stringify({ ok: true, id: row.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('send-widerruf error', e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
