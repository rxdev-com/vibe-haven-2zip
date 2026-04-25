import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  TrendingUp,
  ShoppingBag,
  IndianRupee,
  Package,
  Loader2,
  Calendar,
} from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { useToast } from "@/hooks/use-toast";
import { ordersAPI } from "@/lib/api";

export default function VendorRevenue() {
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersAPI
      .getAll({ limit: 200 })
      .then((d) => setOrders(d.orders || []))
      .catch((e) =>
        toast({
          title: "Could not load",
          description: e.message,
          variant: "destructive",
        }),
      )
      .finally(() => setLoading(false));
  }, [toast]);

  const stats = useMemo(() => {
    const completed = orders.filter((o) => o.status === "delivered");
    const totalSpent = completed.reduce((s, o) => s + (o.totalAmount || 0), 0);
    const avg = completed.length ? totalSpent / completed.length : 0;
    const thisMonth = completed.filter((o) => {
      const d = new Date(o.createdAt);
      const now = new Date();
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    });
    const monthSpend = thisMonth.reduce((s, o) => s + (o.totalAmount || 0), 0);
    // Top suppliers
    const bySupplier = {};
    completed.forEach((o) => {
      const key = o.supplierId?.businessName || o.supplierId?.name || "Unknown";
      bySupplier[key] = (bySupplier[key] || 0) + (o.totalAmount || 0);
    });
    const top = Object.entries(bySupplier)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    return { totalSpent, avg, monthSpend, completed: completed.length, top };
  }, [orders]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="Spending" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/vendor/dashboard"
          className="inline-flex items-center text-sm text-gray-600 hover:text-saffron-600 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to dashboard
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6"
        >
          Spending Overview
        </motion.h1>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-saffron-500" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                {
                  label: "Total Spent",
                  value: `₹${stats.totalSpent.toLocaleString("en-IN")}`,
                  icon: IndianRupee,
                  color: "text-saffron-500",
                },
                {
                  label: "This Month",
                  value: `₹${stats.monthSpend.toLocaleString("en-IN")}`,
                  icon: Calendar,
                  color: "text-emerald-500",
                },
                {
                  label: "Orders Done",
                  value: stats.completed,
                  icon: ShoppingBag,
                  color: "text-blue-500",
                },
                {
                  label: "Avg. Order",
                  value: `₹${Math.round(stats.avg).toLocaleString("en-IN")}`,
                  icon: TrendingUp,
                  color: "text-purple-500",
                },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card>
                    <CardContent className="p-5">
                      <div className="flex items-center">
                        <s.icon className={`w-7 h-7 ${s.color} mr-3 flex-shrink-0`} />
                        <div className="min-w-0">
                          <p className="text-xs text-gray-600">{s.label}</p>
                          <p className="text-lg font-bold text-gray-900 truncate">
                            {s.value}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top Suppliers (by spend)</CardTitle>
              </CardHeader>
              <CardContent>
                {stats.top.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500 mb-4">
                      No completed orders yet
                    </p>
                    <Link to="/vendor/dashboard">
                      <Button className="bg-gradient-to-r from-saffron-500 to-orange-500">
                        Start shopping
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {stats.top.map(([name, amount], i) => (
                      <motion.div
                        key={name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          <Badge className="bg-saffron-500 text-white w-7 h-7 rounded-full p-0 flex items-center justify-center">
                            {i + 1}
                          </Badge>
                          <span className="font-medium">{name}</span>
                        </div>
                        <span className="font-semibold text-saffron-600">
                          ₹{amount.toLocaleString("en-IN")}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
