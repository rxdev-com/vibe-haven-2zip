import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  Star,
  XCircle,
  Loader2,
  MapPin,
  IndianRupee,
} from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { useToast } from "@/hooks/use-toast";
import { ordersAPI } from "@/lib/api";

const STATUS_BADGE = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-indigo-100 text-indigo-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
};

const STATUS_ICON = {
  pending: Clock,
  confirmed: CheckCircle,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
};

export default function VendorActiveOrders() {
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("active");
  const [cancelId, setCancelId] = useState(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await ordersAPI.getAll({ limit: 100 });
      setOrders(data.orders || []);
    } catch (e) {
      toast({ title: "Could not load", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visible = orders.filter((o) => {
    if (filter === "active")
      return ["pending", "confirmed", "processing", "shipped"].includes(o.status);
    if (filter === "delivered") return o.status === "delivered";
    if (filter === "cancelled") return o.status === "cancelled";
    return true;
  });

  const handleCancel = async () => {
    if (!cancelId) return;
    try {
      await ordersAPI.cancel(cancelId, "Cancelled by vendor");
      toast({ title: "Order cancelled" });
      setCancelId(null);
      await refresh();
    } catch (e) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="My Orders" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
        >
          <div>
            <Link
              to="/vendor/dashboard"
              className="inline-flex items-center text-sm text-gray-600 hover:text-saffron-600 mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              My Orders
            </h1>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-saffron-500" />
          </div>
        ) : visible.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 mb-4">No orders found</p>
              <Link to="/vendor/dashboard">
                <Button className="bg-gradient-to-r from-saffron-500 to-orange-500">
                  Browse materials
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {visible.map((o, i) => {
                const Icon = STATUS_ICON[o.status] || Clock;
                return (
                  <motion.div
                    key={o._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ delay: Math.min(i, 10) * 0.04 }}
                  >
                    <Card className="hover:shadow-lg transition-all">
                      <CardHeader className="pb-3">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <CardTitle className="text-base flex items-center gap-2">
                              <Icon className="w-5 h-5 text-saffron-500" />
                              {o.orderNumber}
                            </CardTitle>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(o.createdAt).toLocaleString("en-IN")}
                            </p>
                          </div>
                          <Badge className={STATUS_BADGE[o.status]}>{o.status}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid sm:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                              From Supplier
                            </p>
                            <p className="font-medium">
                              {o.supplierId?.businessName ||
                                o.supplierId?.name ||
                                "Supplier"}
                            </p>
                            <p className="text-sm text-gray-500 flex items-start gap-1 mt-1">
                              <MapPin className="w-3 h-3 mt-1 flex-shrink-0" />
                              <span className="line-clamp-2">{o.deliveryAddress}</span>
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                              Items
                            </p>
                            <ul className="text-sm space-y-1">
                              {(o.items || []).map((it, idx) => (
                                <li key={idx} className="flex justify-between gap-2">
                                  <span className="truncate">
                                    {it.name} × {it.quantity}
                                  </span>
                                  <span className="text-gray-500 flex-shrink-0">
                                    ₹{it.subtotal || it.price * it.quantity}
                                  </span>
                                </li>
                              ))}
                            </ul>
                            <div className="mt-2 pt-2 border-t flex justify-between font-semibold">
                              <span>Total</span>
                              <span className="text-saffron-600 flex items-center">
                                <IndianRupee className="w-4 h-4" />
                                {o.totalAmount}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2 border-t">
                          <Link to={`/track-order/${o._id}`}>
                            <Button size="sm" variant="outline">
                              <Truck className="w-4 h-4 mr-1" /> Track Order
                            </Button>
                          </Link>
                          {o.status === "delivered" && !o.rating?.score && (
                            <Link to={`/vendor/rating/${o._id}`}>
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-yellow-500 to-orange-500"
                              >
                                <Star className="w-4 h-4 mr-1" /> Rate Order
                              </Button>
                            </Link>
                          )}
                          {o.status === "delivered" && o.rating?.score && (
                            <Badge variant="outline" className="self-center">
                              <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />{" "}
                              You rated {o.rating.score}/5
                            </Badge>
                          )}
                          {["pending", "confirmed"].includes(o.status) && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setCancelId(o._id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="w-4 h-4 mr-1" /> Cancel
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AlertDialog open={!!cancelId} onOpenChange={(o) => !o && setCancelId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
            <AlertDialogDescription>
              The supplier will be notified and stock will be returned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep order</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              className="bg-red-500 hover:bg-red-600"
            >
              Cancel order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
