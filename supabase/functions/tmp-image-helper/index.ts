import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SHOPIFY_API_VERSION = "2025-07";
const SHOP = Deno.env.get("SHOPIFY_SHOP");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function getShopifyAccessToken(): Promise<string> {
  const clientId = Deno.env.get("SHOPIFY_CLIENT_ID");
  const clientSecret = Deno.env.get("SHOPIFY_CLIENT_SECRET");
  if (!clientId || !clientSecret || !SHOP) {
    throw new Error("Missing Shopify credentials");
  }
  const res = await fetch(`https://${SHOP}.myshopify.com/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }).toString(),
  });
  if (!res.ok) throw new Error(`token failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.access_token;
}

async function adminFetch(token: string, path: string, init?: RequestInit) {
  const res = await fetch(`https://${SHOP}.myshopify.com/admin/api/${SHOPIFY_API_VERSION}${path}`, {
    ...init,
    headers: {
      "X-Shopify-Access-Token": token,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const text = await res.text();
  return { status: res.status, body: text };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { action, product_id } = await req.json();
    const token = await getShopifyAccessToken();

    if (action === "get_images") {
      const r = await adminFetch(token, `/products/${product_id}.json?fields=id,images`);
      return new Response(r.body, { status: r.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "add_image") {
      const { src, alt, position } = await req.json();
      const r = await adminFetch(token, `/products/${product_id}/images.json`, {
        method: "POST",
        body: JSON.stringify({ image: { src, alt, position } }),
      });
      return new Response(r.body, { status: r.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "unknown action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
