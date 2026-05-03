import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, TrendingUp, IndianRupee, Package, CheckCircle,
  Loader2, Clock, Calendar,
} from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { useToast } from "@/hooks/use-toast";
import { ordersAPI } from "@/lib/api";

function fmtINR(v) { return `₹${Number(v || 0).toLocaleString("en-IN")}`; }
function fmtDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function groupByMonth(orders) {
  const map = {};
  orders.forEach((o) => {
    const d = new Date(o.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleString("en-IN", { month: "long", year: "numeric" });
    if (!map[key]) map[key] = { key, label, revenue: 0, orders: 0 };
    map[key].revenue += o.totalAmount || 0;
    map[key].orders++;
  });
  return Object.values(map).sort((a, b) => b.key.localeCompare(a.key));
}

export default function SupplierRevenue() {
  const { toast } = useToast();
  const [stats, setStats] = useState(null);
  const [delivered, setDelivered] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const [statsData, ordersData] = await Promise.all([
        ordersAPI.getStats(),
        ordersAPI.getAll({ status: "delivered", limit: 100 }),
      ]);
      setStats(statsData);
      setDelivered(ordersData.orders || []);
    } catch (e) {
      toast({ title: "Could not load revenue data", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const monthly = groupByMonth(delivered);
  const avgOrderValue = delivered.length > 0
    ? (delivered.reduce((s, o) => s + (o.totalAmount || 0), 0) / delivered.length)
    : 0;

  const statCards = [
    { label: "Total Revenue", value: fmtINR(stats?.totalRevenue), icon: IndianRupee, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "This Month", value: fmtINR(stats?.monthlyRevenue), icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Orders", value: stats?.total || 0, icon: Package, color: "text-saffron-600", bg: "bg-orange-50" },
    { label: "Avg Order Value", value: fmtINR(avgOrderValue), icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="Supplier Dashboard" badgeColor="bg-emerald-100 text-emerald-700" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/supplier/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-emerald-600">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Revenue Analytics</h1>
            <p className="text-sm text-gray-500">Track your earnings and financial performance</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {statCards.map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <Card>
                    <CardContent className="p-4">
                      <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
                        <s.icon className={`w-5 h-5 ${s.color}`} />
                      </div>
                      <p className="text-xs text-gray-500 mb-0.5">{s.label}</p>
                      <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Monthly breakdown */}
            <div className="grid md:grid-cols-2 gap-5">
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-1">Monthly Performance</h3>
                  <p className="text-xs text-gray-500 mb-4">Revenue and order count per month</p>
                  {monthly.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-8">No completed orders yet</p>
                  ) : (
                    <div className="space-y-3">
                      {monthly.map((m, i) => {
                        const maxRev = Math.max(...monthly.map((x) => x.revenue), 1);
                        const pct = Math.round((m.revenue / maxRev) * 100);
                        return (
                          <motion.div key={m.key} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium text-gray-700">{m.label}</span>
                              <div className="text-right">
                                <span className="text-sm font-bold text-emerald-600">{fmtINR(m.revenue)}</span>
                                <span className="text-xs text-gray-400 ml-2">{m.orders} orders</span>
                              </div>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                              <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent delivered orders */}
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-1">Recent Payments</h3>
                  <p className="text-xs text-gray-500 mb-4">Latest completed and paid orders</p>
                  {delivered.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-8">No completed orders yet</p>
                  ) : (
                    <div className="space-y-3">
                      {delivered.slice(0, 8).map((o) => {
                        const vendor = o.vendor || {};
                        return (
                          <div key={o._id} className="flex items-center justify-between py-2 border-b last:border-0">
                            <div>
                              <p className="text-sm font-medium text-gray-800">{o.orderNumber}</p>
                              <p className="text-xs text-gray-500">{vendor.businessName || vendor.name || "Vendor"}</p>
                              <p className="text-xs text-gray-400">{fmtDate(o.deliveredAt || o.createdAt)}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-emerald-600">{fmtINR(o.totalAmount)}</p>
                              <Badge className="bg-emerald-100 text-emerald-700 text-xs">Paid</Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Status Summary */}
            <Card className="mt-5">
              <CardContent className="p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Order Status Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Pending", value: stats?.pending || 0, color: "text-orange-600", bg: "bg-orange-50" },
                    { label: "Active", value: stats?.active || 0, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Delivered", value: stats?.delivered || 0, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Cancelled", value: stats?.cancelled || 0, color: "text-red-600", bg: "bg-red-50" },
                  ].map((s) => (
                    <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center`}>
                      <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                      <p className="text-xs text-gray-600 mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
