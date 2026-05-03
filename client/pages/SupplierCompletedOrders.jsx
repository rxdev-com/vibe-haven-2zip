import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft, CheckCircle, Package, Loader2, Phone,
  MapPin, Search, IndianRupee, Star,
} from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { useToast } from "@/hooks/use-toast";
import { ordersAPI } from "@/lib/api";

function fmtINR(v) { return `₹${Number(v || 0).toLocaleString("en-IN")}`; }
function fmtDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function SupplierCompletedOrders() {
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const refresh = async () => {
    setLoading(true);
    try {
      const d = await ordersAPI.getAll({ status: "delivered", limit: 100 });
      setOrders(d.orders || []);
    } catch (e) {
      toast({ title: "Could not load orders", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const filtered = orders.filter((o) => {
    const vendor = o.vendor || {};
    const name = (vendor.businessName || vendor.name || "").toLowerCase();
    const num = (o.orderNumber || "").toLowerCase();
    const q = search.toLowerCase();
    return !search || name.includes(q) || num.includes(q);
  });

  const totalRevenue = filtered.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const ratedCount = filtered.filter((o) => o.rating?.rating).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="Supplier Dashboard" badgeColor="bg-emerald-100 text-emerald-700" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/supplier/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-emerald-600">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Completed Orders</h1>
            <p className="text-sm text-gray-500">All successfully delivered orders</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          {[
            { label: "Completed", value: orders.length, icon: CheckCircle, color: "text-emerald-600" },
            { label: "Total Revenue", value: fmtINR(totalRevenue), icon: IndianRupee, color: "text-blue-600" },
            { label: "Rated Orders", value: ratedCount, icon: Star, color: "text-yellow-500" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <s.icon className={`w-6 h-6 ${s.color}`} />
                  <div>
                    <p className="text-xs text-gray-500">{s.label}</p>
                    <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order number or vendor name..."
            className="pl-9"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>
        ) : filtered.length === 0 ? (
          <Card><CardContent className="text-center py-16">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">{search ? "No orders match your search" : "No completed orders yet"}</p>
          </CardContent></Card>
        ) : (
          <AnimatePresence>
            <div className="space-y-3">
              {filtered.map((o, i) => {
                const vendor = o.vendor || {};
                const vName = vendor.businessName || vendor.name || "Vendor";
                const vPhone = vendor.phone || "";
                const vAddr = vendor.address || "";
                const itemSummary = (o.items || []).map((it) => `${it.name} (${it.quantity} ${it.unit})`).join(", ");
                const hasRating = o.rating?.rating;

                return (
                  <motion.div key={o._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 10) * 0.04 }}>
                    <Card className="border-emerald-100">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">{o.orderNumber}</span>
                            <Badge className="bg-emerald-100 text-emerald-700">delivered</Badge>
                            {hasRating && (
                              <Badge className="bg-yellow-100 text-yellow-700 flex items-center gap-0.5">
                                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                {o.rating.rating}/5
                              </Badge>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-emerald-600">{fmtINR(o.totalAmount)}</p>
                            <p className="text-xs text-gray-400">{fmtDate(o.deliveredAt || o.createdAt)}</p>
                          </div>
                        </div>

                        <div className="border rounded-lg p-3 bg-gray-50 mb-3">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Vendor</p>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-saffron-100 text-saffron-700 flex items-center justify-center text-xs font-bold">
                              {vName[0] || "V"}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-sm">{vName}</p>
                              <div className="flex gap-3 text-xs text-gray-500 mt-0.5">
                                {vPhone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{vPhone}</span>}
                                {vAddr && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{vAddr}</span>}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="text-sm text-gray-600">
                          <span className="font-medium text-gray-700">Items: </span>{itemSummary}
                        </div>

                        {o.rating?.review && (
                          <div className="mt-2 text-xs bg-yellow-50 border border-yellow-200 rounded px-3 py-2 text-gray-700">
                            <span className="font-medium">Customer review: </span>"{o.rating.review}"
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
