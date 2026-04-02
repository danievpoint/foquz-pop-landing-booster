import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SHOPIFY_API_VERSION = "2025-07";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function getShopifyAccessToken(): Promise<string> {
  const clientId = Deno.env.get("SHOPIFY_CLIENT_ID");
  const clientSecret = Deno.env.get("SHOPIFY_CLIENT_SECRET");
  const shop = Deno.env.get("SHOPIFY_SHOP");

  console.log("ENV check:", { clientId: !!clientId, clientSecret: !!clientSecret, shop });

  if (!clientId || !clientSecret || !shop) {
    throw new Error("Missing SHOPIFY_CLIENT_ID, SHOPIFY_CLIENT_SECRET, or SHOPIFY_SHOP");
  }

  const tokenUrl = `https://${shop}.myshopify.com/admin/oauth/access_token`;
  console.log("Token URL:", tokenUrl);
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

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to get access token: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data.access_token;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    const shop = Deno.env.get("SHOPIFY_SHOP");
    if (!shop) throw new Error("SHOPIFY_SHOP not configured");

    const storeDomain = `${shop}.myshopify.com`;
    const accessToken = await getShopifyAccessToken();

    // Search for existing customer
    const searchUrl = `https://${storeDomain}/admin/api/${SHOPIFY_API_VERSION}/customers/search.json?query=email:${encodeURIComponent(trimmedEmail)}`;
    const searchRes = await fetch(searchUrl, {
      headers: { "X-Shopify-Access-Token": accessToken },
    });
    const searchData = await searchRes.json();

    if (searchData.customers && searchData.customers.length > 0) {
      const customerId = searchData.customers[0].id;
      const updateUrl = `https://${storeDomain}/admin/api/${SHOPIFY_API_VERSION}/customers/${customerId}.json`;
      await fetch(updateUrl, {
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
              opt_in_level: "single_opt_in",
            },
          },
        }),
      });

      return new Response(JSON.stringify({ success: true, existing: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create new customer
    const createUrl = `https://${storeDomain}/admin/api/${SHOPIFY_API_VERSION}/customers.json`;
    const createRes = await fetch(createUrl, {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer: {
          email: trimmedEmail,
          email_marketing_consent: {
            state: "subscribed",
            opt_in_level: "single_opt_in",
          },
          tags: "newsletter",
        },
      }),
    });

    const createData = await createRes.json();

    if (createData.errors) {
      console.error("Shopify create customer error:", createData.errors);
      return new Response(JSON.stringify({ error: "Failed to subscribe" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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
