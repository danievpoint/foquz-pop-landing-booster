import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SHOPIFY_STORE_DOMAIN = "foquz-pop-landing-booster-xb8ca.myshopify.com";
const SHOPIFY_API_VERSION = "2025-07";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    const accessToken = Deno.env.get("SHOPIFY_ACCESS_TOKEN");
    if (!accessToken) {
      throw new Error("SHOPIFY_ACCESS_TOKEN not configured");
    }

    // Search for existing customer
    const searchUrl = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/customers/search.json?query=email:${encodeURIComponent(trimmedEmail)}`;
    const searchRes = await fetch(searchUrl, {
      headers: { "X-Shopify-Access-Token": accessToken },
    });
    const searchData = await searchRes.json();

    if (searchData.customers && searchData.customers.length > 0) {
      // Customer exists — update marketing consent
      const customerId = searchData.customers[0].id;
      const updateUrl = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/customers/${customerId}.json`;
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

    // Create new customer with marketing consent
    const createUrl = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/customers.json`;
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
