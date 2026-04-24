import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Package,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  Loader2,
  MapPin,
  Phone,
} from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { useToast } from "@/hooks/use-toast";
import { ordersAPI } from "@/lib/api";

const STEPS = [
  { key: "pending", label: "Order Placed", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle },
  { key: "processing", label: "Processing", icon: Package },
  { key: "shipped", label: "Out for Delivery", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
];

export default function OrderTrackingLive() {
  const { orderId } = useParams();
  const { toast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const d = await ordersAPI.getById(orderId);
      setOrder(d.order);
    } catch (e) {
      toast({ title: "Could not load order", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // Poll for updates every 15 s
    const t = setInterval(refresh, 15000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader />
        <div className="flex justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-saffron-500" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader />
        <div className="max-w-2xl mx-auto py-16 text-center">
          <h2 className="text-xl font-semibold mb-4">Order not found</h2>
          <Link to="/vendor/active-orders">
            <Button>My orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isCancelled = order.status === "cancelled";
  const currentIdx = STEPS.findIndex((s) => s.key === order.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="Tracking" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/vendor/active-orders"
          className="inline-flex items-center text-sm text-gray-600 hover:text-saffron-600 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to orders
        </Link>

        <Card className="mb-4">
          <CardHeader>
            <div className="flex flex-wrap justify-between gap-2">
              <div>
                <CardTitle>{order.orderNumber}</CardTitle>
                <p className="text-sm text-gray-500">
                  Placed {new Date(order.createdAt).toLocaleString("en-IN")}
                </p>
              </div>
              <Badge
                className={
                  isCancelled
                    ? "bg-red-100 text-red-800"
                    : order.status === "delivered"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-blue-100 text-blue-800"
                }
              >
                {order.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {isCancelled ? (
              <div className="text-center py-8 text-red-600">
                <XCircle className="w-12 h-12 mx-auto mb-2" />
                <p className="font-semibold">Order Cancelled</p>
                {order.cancellationReason && (
                  <p className="text-sm text-gray-600 mt-1">
                    Reason: {order.cancellationReason}
                  </p>
                )}
              </div>
            ) : (
              <div className="relative">
                <div className="space-y-6">
                  {STEPS.map((s, i) => {
                    const reached = i <= currentIdx;
                    const isCurrent = i === currentIdx;
                    const Icon = s.icon;
                    return (
                      <motion.div
                        key={s.key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-start gap-4"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                            reached
                              ? "bg-emerald-500 text-white"
                              : "bg-gray-200 text-gray-400"
                          } ${isCurrent ? "ring-4 ring-emerald-200 animate-pulse" : ""}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 pt-1">
                          <p
                            className={`font-medium ${
                              reached ? "text-gray-900" : "text-gray-400"
                            }`}
                          >
                            {s.label}
                          </p>
                          {isCurrent && order.statusHistory?.length > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(
                                order.statusHistory[order.statusHistory.length - 1].timestamp,
                              ).toLocaleString("en-IN")}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Supplier</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p className="font-medium">
                {order.supplierId?.businessName || order.supplierId?.name}
              </p>
              {order.supplierId?.phone && (
                <p className="flex items-center gap-1 text-gray-500">
                  <Phone className="w-3 h-3" /> {order.supplierId.phone}
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Delivery</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p className="flex items-start gap-1 text-gray-700">
                <MapPin className="w-3 h-3 mt-1 flex-shrink-0" />
                {order.deliveryAddress}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-sm">Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {(order.items || []).map((it, i) => (
                <li key={i} className="flex justify-between gap-2">
                  <span>
                    {it.name} × {it.quantity}
                  </span>
                  <span className="font-medium">
                    ₹{it.subtotal || it.price * it.quantity}
                  </span>
                </li>
              ))}
            </ul>
            <div className="border-t mt-3 pt-3 flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-saffron-600">₹{order.totalAmount}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
