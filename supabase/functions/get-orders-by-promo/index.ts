import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const SHOPIFY_SHOP = Deno.env.get("SHOPIFY_SHOP")!;
const SHOPIFY_ACCESS_TOKEN = Deno.env.get("SHOPIFY_ACCESS_TOKEN")!;

interface ShopifyOrder {
  id: number;
  name: string;
  created_at: string;
  total_price: string;
  financial_status: string;
  discount_codes: Array<{ code: string; amount: string; type: string }>;
}

async function fetchShopifyOrders(promoCode: string): Promise<ShopifyOrder[]> {
  const allOrders: ShopifyOrder[] = [];
  let url = `https://${SHOPIFY_SHOP}/admin/api/2025-07/orders.json?status=any&limit=250&financial_status=paid`;
  
  while (url) {
    const res = await fetch(url, {
      headers: {
        "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Shopify API error ${res.status}: ${text}`);
    }

    const data = await res.json();
    const orders: ShopifyOrder[] = data.orders || [];
    
    // Filter by promo code
    const filtered = orders.filter((o) =>
      o.discount_codes?.some(
        (dc) => dc.code.toLowerCase() === promoCode.toLowerCase()
      )
    );
    allOrders.push(...filtered);

    // Pagination
    const linkHeader = res.headers.get("link");
    const nextMatch = linkHeader?.match(/<([^>]+)>;\s*rel="next"/);
    url = nextMatch ? nextMatch[1] : "";
  }

  return allOrders;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Verify JWT
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get user's promo code from profiles
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("promo_code")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.promo_code) {
      return new Response(
        JSON.stringify({
          error: "No promo code configured",
          total_sales: 0,
          total_revenue: 0,
          orders: [],
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const orders = await fetchShopifyOrders(profile.promo_code);

    const total_sales = orders.length;
    const total_revenue = orders.reduce(
      (sum, o) => sum + parseFloat(o.total_price),
      0
    );

    const orderList = orders.map((o) => ({
      order_id: o.name,
      date: o.created_at,
      revenue: parseFloat(o.total_price),
      discount_code: o.discount_codes
        ?.find((dc) => dc.code.toLowerCase() === profile.promo_code!.toLowerCase())
        ?.code || "",
    }));

    // Sort by date desc
    orderList.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return new Response(
      JSON.stringify({ total_sales, total_revenue, orders: orderList }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
