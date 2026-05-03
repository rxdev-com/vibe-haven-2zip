import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, BarChart2, TrendingUp, Package,
  Loader2, CheckCircle, Clock, XCircle, Star,
} from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ordersAPI, materialsAPI } from "@/lib/api";

function fmtINR(v) { return `₹${Number(v || 0).toLocaleString("en-IN")}`; }

export default function SupplierAnalytics() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user?._id) return;
      setLoading(true);
      try {
        const [statsData, ordersData, matData] = await Promise.all([
          ordersAPI.getStats(),
          ordersAPI.getAll({ limit: 200 }),
          materialsAPI.getBySupplier(user._id, { limit: 100 }),
        ]);
        setStats(statsData);
        setOrders(ordersData.orders || []);
        setMaterials(matData.materials || []);
      } catch (e) {
        toast({ title: "Could not load analytics", description: e.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?._id]);

  // Top products by orders
  const topProducts = useMemo(() => {
    const map = {};
    orders.forEach((o) => {
      (o.items || []).forEach((item) => {
        const key = item.name;
        if (!map[key]) map[key] = { name: item.name, orders: 0, revenue: 0, qty: 0 };
        map[key].orders++;
        map[key].revenue += item.total || 0;
        map[key].qty += item.quantity || 0;
      });
    });
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 6);
  }, [orders]);

  // Fulfillment rate
  const fulfillmentRate = stats?.total
    ? Math.round((stats.delivered / stats.total) * 100)
    : 0;

  // Category breakdown from materials
  const categoryBreakdown = useMemo(() => {
    const map = {};
    materials.forEach((m) => {
      if (!map[m.category]) map[m.category] = { count: 0, revenue: 0 };
      map[m.category].count++;
      map[m.category].revenue += m.totalRevenue || 0;
    });
    return Object.entries(map)
      .map(([cat, d]) => ({ cat, ...d }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [materials]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="Supplier Dashboard" badgeColor="bg-emerald-100 text-emerald-700" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/supplier/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-emerald-600">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics &amp; Reports</h1>
            <p className="text-sm text-gray-500">Business performance insights</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>
        ) : (
          <div className="space-y-5">
            {/* Summary KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Revenue", value: fmtINR(stats?.totalRevenue), icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Total Orders", value: stats?.total || 0, icon: Package, color: "text-saffron-600", bg: "bg-orange-50" },
                { label: "Fulfillment Rate", value: `${fulfillmentRate}%`, icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Active Products", value: materials.filter((m) => m.stock > 0).length, icon: BarChart2, color: "text-purple-600", bg: "bg-purple-50" },
              ].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <Card>
                    <CardContent className="p-4">
                      <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
                        <s.icon className={`w-5 h-5 ${s.color}`} />
                      </div>
                      <p className="text-xs text-gray-500">{s.label}</p>
                      <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Order pipeline */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Order Pipeline</h3>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: "Pending", value: stats?.pending || 0, icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
                    { label: "Active", value: stats?.active || 0, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Delivered", value: stats?.delivered || 0, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Cancelled", value: stats?.cancelled || 0, icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
                  ].map((s) => (
                    <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
                      <s.icon className={`w-6 h-6 ${s.color} mx-auto mb-1`} />
                      <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                      <p className="text-xs text-gray-500">{s.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Top products */}
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-1">Top Products by Revenue</h3>
                  <p className="text-xs text-gray-500 mb-4">Your best selling items</p>
                  {topProducts.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-6">No orders data yet</p>
                  ) : (
                    <div className="space-y-3">
                      {topProducts.map((p, i) => {
                        const maxRev = Math.max(...topProducts.map((x) => x.revenue), 1);
                        const pct = Math.round((p.revenue / maxRev) * 100);
                        return (
                          <div key={i}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium text-gray-700">{p.name}</span>
                              <span className="text-emerald-600 font-semibold">{fmtINR(p.revenue)}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2 mb-0.5">
                              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <p className="text-xs text-gray-400">{p.orders} orders · {p.qty} units sold</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Category breakdown */}
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-1">Category Breakdown</h3>
                  <p className="text-xs text-gray-500 mb-4">Products by category</p>
                  {categoryBreakdown.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-6">No products yet</p>
                  ) : (
                    <div className="space-y-3">
                      {categoryBreakdown.map((c, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-sm font-medium text-gray-700">{c.cat}</span>
                            <Badge className="bg-gray-100 text-gray-600 text-xs">{c.count} products</Badge>
                          </div>
                          <span className="text-sm font-semibold text-emerald-600">{fmtINR(c.revenue)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Inventory health */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Inventory Health</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "In Stock", value: materials.filter((m) => m.stock > 5).length, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Low Stock (≤5)", value: materials.filter((m) => m.stock > 0 && m.stock <= 5).length, color: "text-orange-600", bg: "bg-orange-50" },
                    { label: "Out of Stock", value: materials.filter((m) => m.stock === 0).length, color: "text-red-600", bg: "bg-red-50" },
                  ].map((s) => (
                    <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center`}>
                      <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                      <p className="text-xs text-gray-600 mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
