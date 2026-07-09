import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple in-memory rate limiter (per function instance)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    rateLimitMap.set(ip, recent);
    return true;
  }
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
}

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function getSiteBaseUrl(req: Request): string {
  const origin = req.headers.get("origin");
  if (origin && /^https?:\/\//.test(origin)) return origin.replace(/\/$/, "");
  return "https://foquz.de";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") || "unknown";
    if (isRateLimited(ip)) {
      return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json", "Retry-After": "60" },
      });
    }

    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail) || trimmedEmail.length > 255) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, supabaseServiceKey);

    // Look up existing row (case-insensitive via unique index on lower(email))
    const { data: existing } = await admin
      .from("newsletter_subscribers")
      .select("id, confirmed")
      .ilike("email", trimmedEmail)
      .maybeSingle();

    // If already confirmed, respond success without re-sending
    if (existing?.confirmed) {
      return new Response(JSON.stringify({ success: true, alreadyConfirmed: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = generateToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

    if (existing) {
      const { error: updErr } = await admin
        .from("newsletter_subscribers")
        .update({
          confirm_token: token,
          confirm_token_expires_at: expiresAt,
        })
        .eq("id", existing.id);
      if (updErr) {
        console.error("update err", updErr);
        return new Response(JSON.stringify({ error: "Subscription failed" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } else {
      const { error: insErr } = await admin
        .from("newsletter_subscribers")
        .insert({
          email: trimmedEmail,
          confirmed: false,
          confirm_token: token,
          confirm_token_expires_at: expiresAt,
        });
      if (insErr) {
        console.error("insert err", insErr);
        return new Response(JSON.stringify({ error: "Subscription failed" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Build confirmation URL (uses request origin for correct env)
    const base = getSiteBaseUrl(req);
    const confirmUrl = `${base}/newsletter/bestaetigen?token=${token}`;

    // Send confirmation email via the transactional email pipeline
    const { error: mailErr } = await admin.functions.invoke("send-transactional-email", {
      body: {
        templateName: "newsletter-confirmation",
        recipientEmail: trimmedEmail,
        idempotencyKey: `newsletter-confirm-${token}`,
        templateData: {
          confirmUrl,
          recipientEmail: trimmedEmail,
        },
      },
    });
    if (mailErr) {
      console.error("send-transactional-email invoke error:", mailErr);
    }

    // Uniform response
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
