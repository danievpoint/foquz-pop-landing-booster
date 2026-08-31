import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const SHOPIFY_API_VERSION = "2025-07";
const SITE_URL = "https://www.foquz.de";

async function getShopifyAccessToken(): Promise<string> {
  const clientId = Deno.env.get("SHOPIFY_CLIENT_ID");
  const clientSecret = Deno.env.get("SHOPIFY_CLIENT_SECRET");
  const shop = Deno.env.get("SHOPIFY_SHOP");
  if (!clientId || !clientSecret || !shop) throw new Error("Missing Shopify config");

  const res = await fetch(`https://${shop}.myshopify.com/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }).toString(),
  });
  if (!res.ok) throw new Error(`Token error: ${res.status}`);
  return (await res.json()).access_token;
}

function redirect(status: string) {
  return new Response(null, {
    status: 302,
    headers: { Location: `${SITE_URL}/newsletter-bestaetigt?status=${status}` },
  });
}

Deno.serve(async (req) => {
  try {
    const token = new URL(req.url).searchParams.get("token");
    if (!token || token.length < 20) return redirect("invalid");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: row } = await supabaseAdmin
      .from("newsletter_subscribers")
      .select("id, email, confirmed, confirm_token_expires_at")
      .eq("confirm_token", token)
      .maybeSingle();

    if (!row) return redirect("invalid");
    if (row.confirmed) return redirect("already");
    if (row.confirm_token_expires_at && new Date(row.confirm_token_expires_at) < new Date()) {
      return redirect("expired");
    }

    // Mark confirmed in our DB
    await supabaseAdmin
      .from("newsletter_subscribers")
      .update({ confirmed: true, confirmed_at: new Date().toISOString(), confirm_token: null })
      .eq("id", row.id);

    // Set Shopify marketing consent to subscribed
    const shop = Deno.env.get("SHOPIFY_SHOP");
    if (shop) {
      const storeDomain = `${shop}.myshopify.com`;
      const accessToken = await getShopifyAccessToken();
      const searchRes = await fetch(
        `https://${storeDomain}/admin/api/${SHOPIFY_API_VERSION}/customers/search.json?query=email:${encodeURIComponent(row.email)}`,
        { headers: { "X-Shopify-Access-Token": accessToken } },
      );
      const searchData = await searchRes.json();
      const consent = {
        state: "subscribed",
        opt_in_level: "confirmed_opt_in",
        consent_updated_at: new Date().toISOString(),
      };

      if (searchData.customers?.length > 0) {
        const customer = searchData.customers[0];
        await fetch(
          `https://${storeDomain}/admin/api/${SHOPIFY_API_VERSION}/customers/${customer.id}.json`,
          {
            method: "PUT",
            headers: {
              "X-Shopify-Access-Token": accessToken,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              customer: { id: customer.id, email_marketing_consent: consent },
            }),
          },
        );
      } else {
        await fetch(`https://${storeDomain}/admin/api/${SHOPIFY_API_VERSION}/customers.json`, {
          method: "POST",
          headers: {
            "X-Shopify-Access-Token": accessToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer: { email: row.email, email_marketing_consent: consent, tags: "newsletter" },
          }),
        });
      }
    }

    return redirect("ok");
  } catch (error) {
    console.error("Newsletter confirm error:", error);
    return redirect("error");
  }
});
