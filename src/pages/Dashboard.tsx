import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface Order {
  order_id: string;
  date: string;
  revenue: number;
  discount_code: string;
}

interface DashboardData {
  total_sales: number;
  total_revenue: number;
  orders: Order[];
}

interface OrdersApiResponse {
  ok: boolean;
  data?: DashboardData;
  error?: string;
}

const emptyData: DashboardData = {
  total_sales: 0,
  total_revenue: 0,
  orders: [],
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [savingPromoCode, setSavingPromoCode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData>(emptyData);

  useEffect(() => {
    const initializeDashboard = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/auth");
        return;
      }

      setUserId(session.user.id);
      setUserEmail(session.user.email || "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("promo_code")
        .eq("id", session.user.id)
        .single();

      const currentPromoCode = profile?.promo_code || "";
      setPromoCode(currentPromoCode);
      setPromoCodeInput(currentPromoCode || String(session.user.user_metadata?.promo_code || ""));

      await fetchOrders(session.access_token);
    };

    void initializeDashboard();
  }, [navigate]);

  const fetchOrders = async (accessToken?: string) => {
    setLoading(true);
    setError(null);

    try {
      let token = accessToken;
      if (!token) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        token = session?.access_token;
      }

      if (!token) {
        throw new Error("Bitte melde dich erneut an.");
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-orders-by-promo`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({}),
        },
      );

      const result: OrdersApiResponse = await response.json();

      if (!result.ok) {
        throw new Error(result.error || "Dashboard-Daten konnten nicht geladen werden.");
      }

      setData(result.data || emptyData);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Dashboard-Daten konnten nicht geladen werden.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const savePromoCode = async () => {
    const trimmedPromoCode = promoCodeInput.trim();
    if (!trimmedPromoCode || !userId) {
      toast.error("Bitte gib einen Promo-Code ein.");
      return;
    }

    setSavingPromoCode(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ promo_code: trimmedPromoCode })
        .eq("id", userId);

      if (error) throw error;

      setPromoCode(trimmedPromoCode);
      toast.success("Promo-Code gespeichert.");
      await fetchOrders();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Promo-Code konnte nicht gespeichert werden.");
    } finally {
      setSavingPromoCode(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const chartData = Object.entries(
    data.orders.reduce<Record<string, number>>((acc, order) => {
      const key = new Date(order.date).toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
      });
      acc[key] = (acc[key] || 0) + order.revenue;
      return acc;
    }, {}),
  ).map(([date, revenue]) => ({ date, revenue }));

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">{userEmail}</p>
          </div>

          <div className="flex items-center gap-3">
            {promoCode && (
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                Code: {promoCode}
              </span>
            )}
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        {!promoCode && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Promo-Code hinterlegen</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 sm:flex-row">
              <Input
                value={promoCodeInput}
                onChange={(e) => setPromoCodeInput(e.target.value)}
                placeholder="DEINCODE"
              />
              <Button onClick={savePromoCode} disabled={savingPromoCode}>
                {savingPromoCode ? "Speichert..." : "Speichern"}
              </Button>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="grid gap-4 md:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <Card key={item}>
                <CardContent className="space-y-3 pt-6">
                  <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                  <div className="h-8 w-20 animate-pulse rounded bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="mb-4 text-sm text-destructive">{error}</p>
              <Button variant="outline" onClick={() => void fetchOrders()}>
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <ShoppingCart className="h-4 w-4" />
                    Total Sales
                  </div>
                  <p className="text-3xl font-semibold text-foreground">{data.total_sales}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    Total Revenue
                  </div>
                  <p className="text-3xl font-semibold text-foreground">€{data.total_revenue.toFixed(2)}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    Avg. Order Value
                  </div>
                  <p className="text-3xl font-semibold text-foreground">
                    €{data.total_sales ? (data.total_revenue / data.total_sales).toFixed(2) : "0.00"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Revenue over time</CardTitle>
              </CardHeader>
              <CardContent>
                {chartData.length > 0 ? (
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            borderColor: "hsl(var(--border))",
                            borderRadius: "12px",
                          }}
                          formatter={(value: number) => [`€${value.toFixed(2)}`, "Revenue"]}
                        />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="hsl(var(--foreground))"
                          strokeWidth={2}
                          dot={{ r: 3, fill: "hsl(var(--foreground))" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Noch keine Umsatzdaten vorhanden.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent orders</CardTitle>
              </CardHeader>
              <CardContent>
                {data.orders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-muted-foreground">
                          <th className="pb-3 font-medium">Order ID</th>
                          <th className="pb-3 font-medium">Date</th>
                          <th className="pb-3 font-medium text-right">Revenue</th>
                          <th className="pb-3 font-medium">Discount Code</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.orders.map((order) => (
                          <tr key={`${order.order_id}-${order.date}`} className="border-b border-border/60">
                            <td className="py-3 font-medium text-foreground">{order.order_id}</td>
                            <td className="py-3 text-muted-foreground">
                              {new Date(order.date).toLocaleDateString("de-DE")}
                            </td>
                            <td className="py-3 text-right text-foreground">€{order.revenue.toFixed(2)}</td>
                            <td className="py-3 text-muted-foreground">{order.discount_code}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Noch keine Bestellungen für deinen Promo-Code.</p>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
