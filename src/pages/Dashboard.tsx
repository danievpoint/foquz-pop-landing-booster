import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { LogOut, TrendingUp, ShoppingCart, DollarSign } from "lucide-react";

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

const getErrorMessage = (err: unknown) => (err instanceof Error ? err.message : "Failed to load data");

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUserEmail(session.user.email || "");

      // Get promo code
      const { data: profile } = await supabase
        .from("profiles")
        .select("promo_code")
        .eq("id", session.user.id)
        .single();
      setPromoCode(profile?.promo_code || "");

      fetchOrders();
    };
    checkAuth();
  }, [navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: result, error: fnError } = await supabase.functions.invoke(
        "get-orders-by-promo"
      );
      if (fnError) throw fnError;
      if (result?.error && result.error !== "No promo code configured") {
        throw new Error(result.error);
      }
      setData(result || { total_sales: 0, total_revenue: 0, orders: [] });
    } catch (err: unknown) {
      setError(getErrorMessage(err));
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  // Prepare chart data - group by day
  const chartData = data?.orders
    ? Object.entries(
        data.orders.reduce((acc: Record<string, number>, order) => {
          const day = new Date(order.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
          acc[day] = (acc[day] || 0) + order.revenue;
          return acc;
        }, {})
      )
        .map(([date, revenue]) => ({ date, revenue: Math.round(revenue * 100) / 100 }))
        .reverse()
    : [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Dashboard</h1>
            <p className="text-xs text-slate-500">{userEmail}</p>
          </div>
          <div className="flex items-center gap-3">
            {promoCode && (
              <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
                Code: {promoCode}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
                  <div className="h-4 bg-slate-100 rounded w-24 mb-3" />
                  <div className="h-8 bg-slate-100 rounded w-16" />
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 h-64 animate-pulse" />
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl border border-red-200 p-8 text-center">
            <p className="text-red-600 text-sm mb-3">{error}</p>
            <button
              onClick={fetchOrders}
              className="text-sm text-slate-900 font-medium hover:underline"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-1">
                  <ShoppingCart size={14} className="text-slate-400" />
                  <span className="text-sm text-slate-500">Total Sales</span>
                </div>
                <p className="text-2xl font-semibold text-slate-900">
                  {data?.total_sales || 0}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign size={14} className="text-slate-400" />
                  <span className="text-sm text-slate-500">Total Revenue</span>
                </div>
                <p className="text-2xl font-semibold text-slate-900">
                  €{(data?.total_revenue || 0).toFixed(2)}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp size={14} className="text-slate-400" />
                  <span className="text-sm text-slate-500">Avg. Order Value</span>
                </div>
                <p className="text-2xl font-semibold text-slate-900">
                  €{data && data.total_sales > 0
                    ? (data.total_revenue / data.total_sales).toFixed(2)
                    : "0.00"}
                </p>
              </div>
            </div>

            {/* Chart */}
            {chartData.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-sm font-medium text-slate-900 mb-4">Revenue Over Time</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                      <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          fontSize: "13px",
                        }}
                        formatter={(value: number) => [`€${value.toFixed(2)}`, "Revenue"]}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#0f172a"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Orders Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="text-sm font-medium text-slate-900">Recent Orders</h2>
              </div>
              {data?.orders && data.orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Revenue
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Discount Code
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.orders.map((order, i) => (
                        <tr
                          key={order.order_id + i}
                          className="border-b border-slate-50 hover:bg-slate-25"
                        >
                          <td className="px-6 py-3 font-medium text-slate-900">
                            {order.order_id}
                          </td>
                          <td className="px-6 py-3 text-slate-500">
                            {new Date(order.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-3 text-right text-slate-900">
                            €{order.revenue.toFixed(2)}
                          </td>
                          <td className="px-6 py-3">
                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-medium">
                              {order.discount_code}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="px-6 py-12 text-center text-slate-400 text-sm">
                  No orders found for your promo code yet.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
