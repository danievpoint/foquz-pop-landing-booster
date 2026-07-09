import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const SHOPIFY_API_VERSION = "2025-07";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function getShopifyAccessToken(): Promise<string> {
  const clientId = Deno.env.get("SHOPIFY_CLIENT_ID");
  const clientSecret = Deno.env.get("SHOPIFY_CLIENT_SECRET");
  const shop = Deno.env.get("SHOPIFY_SHOP");
  if (!clientId || !clientSecret || !shop) {
    throw new Error("Missing Shopify env vars");
  }
  const tokenUrl = `https://${shop}.myshopify.com/admin/oauth/access_token`;
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
  });
  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) throw new Error(`Token failed: ${res.status}`);
  const data = await res.json();
  return data.access_token as string;
}

async function syncToShopify(email: string) {
  const shop = Deno.env.get("SHOPIFY_SHOP");
  if (!shop) throw new Error("SHOPIFY_SHOP not configured");
  const storeDomain = `${shop}.myshopify.com`;
  const accessToken = await getShopifyAccessToken();

  const searchUrl = `https://${storeDomain}/admin/api/${SHOPIFY_API_VERSION}/customers/search.json?query=email:${encodeURIComponent(email)}`;
  const searchRes = await fetch(searchUrl, {
    headers: { "X-Shopify-Access-Token": accessToken },
  });
  const searchData = await searchRes.json();

  if (searchData.customers && searchData.customers.length > 0) {
    const customerId = searchData.customers[0].id;
    await fetch(`https://${storeDomain}/admin/api/${SHOPIFY_API_VERSION}/customers/${customerId}.json`, {
      method: "PUT",
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer: {
          id: customerId,
          email_marketing_consent: {
            state: "subscribed",
            opt_in_level: "confirmed_opt_in",
          },
        },
      }),
    });
  } else {
    await fetch(`https://${storeDomain}/admin/api/${SHOPIFY_API_VERSION}/customers.json`, {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer: {
          email,
          email_marketing_consent: {
            state: "subscribed",
            opt_in_level: "confirmed_opt_in",
          },
          tags: "newsletter",
        },
      }),
    });
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    if (!token || token.length < 20 || token.length > 128) {
      return new Response(JSON.stringify({ error: "invalid_token" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, supabaseServiceKey);

    const { data: sub, error: findErr } = await admin
      .from("newsletter_subscribers")
      .select("id, email, confirmed, confirm_token_expires_at")
      .eq("confirm_token", token)
      .maybeSingle();

    if (findErr) {
      console.error("lookup error", findErr);
      return new Response(JSON.stringify({ error: "server_error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!sub) {
      return new Response(JSON.stringify({ error: "invalid_token" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (sub.confirmed) {
      return new Response(JSON.stringify({ status: "already_confirmed", email: sub.email }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (sub.confirm_token_expires_at && new Date(sub.confirm_token_expires_at).getTime() < Date.now()) {
      return new Response(JSON.stringify({ error: "expired" }), {
        status: 410,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error: updErr } = await admin
      .from("newsletter_subscribers")
      .update({
        confirmed: true,
        confirmed_at: new Date().toISOString(),
        confirm_token: null,
        confirm_token_expires_at: null,
      })
      .eq("id", sub.id);

    if (updErr) {
      console.error("update error", updErr);
      return new Response(JSON.stringify({ error: "server_error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    try {
      await syncToShopify(sub.email);
    } catch (e) {
      console.error("Shopify sync error (non-fatal):", e);
    }

    return new Response(JSON.stringify({ status: "confirmed", email: sub.email }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("newsletter-confirm error", e);
    return new Response(JSON.stringify({ error: "server_error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
