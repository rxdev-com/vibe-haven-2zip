import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Package,
  TrendingUp,
  ShoppingBag,
  Clock,
  CheckCircle,
  Loader2,
  IndianRupee,
} from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { useAuth } from "@/contexts/AuthContext";
import { materialsAPI, ordersAPI } from "@/lib/api";

const STATUS_COLOR = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-indigo-100 text-indigo-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function SupplierDashboard() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) return;
    let cancelled = false;
    Promise.all([
      materialsAPI.getBySupplier(user._id, { limit: 100 }),
      ordersAPI.getAll({ limit: 50 }),
    ])
      .then(([m, o]) => {
        if (cancelled) return;
        setMaterials(m.materials || []);
        setOrders(o.orders || []);
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [user]);

  const stats = useMemo(() => {
    const pending = orders.filter((o) => o.status === "pending").length;
    const completed = orders.filter((o) => o.status === "delivered");
    const revenue = completed.reduce((s, o) => s + (o.totalAmount || 0), 0);
    const lowStock = materials.filter(
      (m) => (m.stock || 0) > 0 && (m.stock || 0) < 10,
    ).length;
    return { pending, completed: completed.length, revenue, lowStock };
  }, [orders, materials]);

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader
        title="Supplier Dashboard"
        badgeColor="bg-emerald-100 text-emerald-700"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Welcome, {user?.name?.split(" ")[0] || "Supplier"}!
            </h1>
            <p className="text-gray-600">
              Manage your inventory, orders, and grow your business
            </p>
          </div>
          <Link to="/supplier/inventory">
            <Button className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600">
              <Plus className="w-4 h-4 mr-2" /> Add Product
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Pending Orders",
              value: stats.pending,
              icon: Clock,
              color: "text-yellow-500",
              to: "/supplier/pending-orders",
            },
            {
              label: "Active Products",
              value: materials.length,
              icon: Package,
              color: "text-blue-500",
              to: "/supplier/inventory",
            },
            {
              label: "Completed Orders",
              value: stats.completed,
              icon: CheckCircle,
              color: "text-emerald-500",
              to: "/supplier/completed-orders",
            },
            {
              label: "Total Revenue",
              value: `₹${stats.revenue.toLocaleString("en-IN")}`,
              icon: IndianRupee,
              color: "text-saffron-500",
              to: "/supplier/revenue",
            },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={s.to}>
                <Card className="hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer h-full">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center">
                      <s.icon className={`w-7 h-7 ${s.color} mr-3 flex-shrink-0`} />
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-gray-600">{s.label}</p>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                          {s.value}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {stats.lowStock > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-orange-500" />
                  <span className="text-sm text-orange-900">
                    <strong>{stats.lowStock}</strong> product(s) are low on stock
                  </span>
                </div>
                <Link to="/supplier/inventory">
                  <Button size="sm" variant="outline">
                    Restock
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Orders</CardTitle>
              <Link to="/supplier/pending-orders">
                <Button variant="ghost" size="sm">
                  View all
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                </div>
              ) : recentOrders.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No orders yet</p>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((o) => (
                    <div
                      key={o._id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:border-emerald-300 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">
                          {o.orderNumber}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {o.vendorId?.businessName || o.vendorId?.name || "Vendor"} ·{" "}
                          {o.items?.length || 0} item(s)
                        </p>
                      </div>
                      <div className="text-right ml-3">
                        <p className="font-semibold text-sm">₹{o.totalAmount}</p>
                        <Badge
                          className={`${STATUS_COLOR[o.status] || "bg-gray-100 text-gray-700"} text-xs`}
                        >
                          {o.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Top Products</CardTitle>
              <Link to="/supplier/inventory">
                <Button variant="ghost" size="sm">
                  Manage
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                </div>
              ) : materials.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500 mb-4">No products listed yet</p>
                  <Link to="/supplier/inventory">
                    <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
                      <Plus className="w-4 h-4 mr-1" /> Add your first product
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {materials.slice(0, 5).map((m) => (
                    <div
                      key={m._id}
                      className="flex items-center gap-3 p-3 rounded-lg border hover:border-emerald-300 transition-colors"
                    >
                      <div className="w-12 h-12 rounded bg-gradient-to-br from-saffron-100 to-emerald-100 flex-shrink-0 overflow-hidden">
                        {m.image ? (
                          <img
                            src={m.image}
                            alt={m.name}
                            className="w-full h-full object-cover"
                            onError={(e) => (e.currentTarget.style.display = "none")}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-5 h-5 text-saffron-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{m.name}</p>
                        <p className="text-xs text-gray-500">
                          ₹{m.price}/{m.unit} · {m.stock} in stock
                        </p>
                      </div>
                      <Badge
                        className={
                          m.stock <= 0
                            ? "bg-red-100 text-red-700"
                            : m.stock < 10
                            ? "bg-orange-100 text-orange-700"
                            : "bg-emerald-100 text-emerald-700"
                        }
                      >
                        {m.stock <= 0
                          ? "Out"
                          : m.stock < 10
                          ? "Low"
                          : "OK"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
