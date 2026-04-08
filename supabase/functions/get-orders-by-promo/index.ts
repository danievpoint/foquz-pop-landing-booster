import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const SHOPIFY_SHOP = Deno.env.get("SHOPIFY_SHOP")!;
const SHOPIFY_ACCESS_TOKEN = Deno.env.get("SHOPIFY_ACCESS_TOKEN")!;
const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json" };

interface ShopifyOrder {
  id: number;
  name: string;
  created_at: string;
  total_price: string;
  discount_codes: Array<{ code: string; amount: string; type: string }>;
}

interface OrderSummary {
  order_id: string;
  date: string;
  revenue: number;
  discount_code: string;
}

interface OrdersResponse {
  total_sales: number;
  total_revenue: number;
  orders: OrderSummary[];
}

function respond(body: { ok: boolean; data?: OrdersResponse; error?: string }) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: jsonHeaders,
  });
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
      throw new Error(`Shopify API error ${res.status}: ${await res.text()}`);
    }

    const data = await res.json();
    const orders: ShopifyOrder[] = data.orders || [];

    allOrders.push(
      ...orders.filter((order) =>
        order.discount_codes?.some(
          (discount) => discount.code.toLowerCase() === promoCode.toLowerCase(),
        ),
      ),
    );

    const linkHeader = res.headers.get("link");
    const nextMatch = linkHeader?.match(/<([^>]+)>;\s*rel="next"/);
    url = nextMatch?.[1] || "";
  }

  return allOrders;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization") ?? req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return respond({ ok: false, error: "Unauthorized" });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);

    if (claimsError || !claimsData?.claims?.sub) {
      return respond({ ok: false, error: "Unauthorized" });
    }

    const userId = claimsData.claims.sub;
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("promo_code")
      .eq("id", userId)
      .single();

    if (profileError) {
      return respond({ ok: false, error: "Failed to load profile" });
    }

    if (!profile?.promo_code) {
      return respond({
        ok: true,
        data: { total_sales: 0, total_revenue: 0, orders: [] },
      });
    }

    const orders = await fetchShopifyOrders(profile.promo_code);
    const mappedOrders: OrderSummary[] = orders
      .map((order) => ({
        order_id: order.name,
        date: order.created_at,
        revenue: Number.parseFloat(order.total_price),
        discount_code:
          order.discount_codes?.find(
            (discount) => discount.code.toLowerCase() === profile.promo_code!.toLowerCase(),
          )?.code || profile.promo_code,
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const total_revenue = mappedOrders.reduce((sum, order) => sum + order.revenue, 0);

    return respond({
      ok: true,
      data: {
        total_sales: mappedOrders.length,
        total_revenue,
        orders: mappedOrders,
      },
    });
  } catch (error) {
    return respond({
      ok: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
});
