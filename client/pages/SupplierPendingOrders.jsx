import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Package,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  Loader2,
  Clock,
} from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { useToast } from "@/hooks/use-toast";
import { ordersAPI } from "@/lib/api";

const STATUS_FLOW = ["pending", "confirmed", "processing", "shipped", "delivered"];
const STATUS_BADGE = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-indigo-100 text-indigo-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function SupplierPendingOrders() {
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("active");
  const [updating, setUpdating] = useState(null);
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusOrder, setStatusOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [notes, setNotes] = useState("");

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

  const visibleOrders = orders.filter((o) => {
    if (filter === "active")
      return ["pending", "confirmed", "processing", "shipped"].includes(o.status);
    if (filter === "completed") return o.status === "delivered";
    if (filter === "cancelled") return o.status === "cancelled";
    return true;
  });

  const openStatusDialog = (order, defaultStatus) => {
    setStatusOrder(order);
    setNewStatus(defaultStatus || nextStatus(order.status));
    setNotes("");
    setStatusOpen(true);
  };

  const nextStatus = (current) => {
    const idx = STATUS_FLOW.indexOf(current);
    if (idx === -1 || idx === STATUS_FLOW.length - 1) return current;
    return STATUS_FLOW[idx + 1];
  };

  const handleQuickAccept = async (order) => {
    setUpdating(order._id);
    try {
      await ordersAPI.updateStatus(order._id, "confirmed", "Order accepted");
      toast({ title: "Order accepted" });
      await refresh();
    } catch (e) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    } finally {
      setUpdating(null);
    }
  };

  const handleReject = async (order) => {
    setUpdating(order._id);
    try {
      await ordersAPI.cancel(order._id, "Supplier could not fulfill");
      toast({ title: "Order rejected" });
      await refresh();
    } catch (e) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    } finally {
      setUpdating(null);
    }
  };

  const handleSubmitStatus = async () => {
    if (!statusOrder || !newStatus) return;
    setUpdating(statusOrder._id);
    try {
      await ordersAPI.updateStatus(statusOrder._id, newStatus, notes);
      toast({ title: "Status updated", description: `Marked as ${newStatus}` });
      setStatusOpen(false);
      await refresh();
    } catch (e) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="Orders" badgeColor="bg-emerald-100 text-emerald-700" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
        >
          <div>
            <Link
              to="/supplier/dashboard"
              className="inline-flex items-center text-sm text-gray-600 hover:text-emerald-600 mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Manage Orders
            </h1>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        ) : visibleOrders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No orders here</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {visibleOrders.map((o, i) => (
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
                          <CardTitle className="text-base">
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
                            Customer
                          </p>
                          <p className="font-medium">
                            {o.vendorId?.businessName || o.vendorId?.name || "Vendor"}
                          </p>
                          {o.vendorId?.phone && (
                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                              <Phone className="w-3 h-3" /> {o.vendorId.phone}
                            </p>
                          )}
                          <p className="text-sm text-gray-500 flex items-start gap-1 mt-1">
                            <MapPin className="w-3 h-3 mt-1 flex-shrink-0" />
                            <span className="line-clamp-2">
                              {o.deliveryAddress}
                            </span>
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
                            <span className="text-emerald-600">₹{o.totalAmount}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2 border-t">
                        {o.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleQuickAccept(o)}
                              disabled={updating === o._id}
                              className="bg-emerald-500 hover:bg-emerald-600"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" /> Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(o)}
                              disabled={updating === o._id}
                            >
                              <XCircle className="w-4 h-4 mr-1" /> Reject
                            </Button>
                          </>
                        )}
                        {["confirmed", "processing", "shipped"].includes(o.status) && (
                          <Button
                            size="sm"
                            onClick={() => openStatusDialog(o)}
                            disabled={updating === o._id}
                            className="bg-emerald-500 hover:bg-emerald-600"
                          >
                            <Clock className="w-4 h-4 mr-1" /> Mark as{" "}
                            {nextStatus(o.status)}
                          </Button>
                        )}
                        {!["delivered", "cancelled"].includes(o.status) && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openStatusDialog(o)}
                            disabled={updating === o._id}
                          >
                            Update status
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <Dialog open={statusOpen} onOpenChange={setStatusOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              {statusOrder?.orderNumber} for{" "}
              {statusOrder?.vendorId?.businessName || statusOrder?.vendorId?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Choose status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Add a note for the vendor (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitStatus}
              disabled={updating === statusOrder?._id}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              {updating === statusOrder?._id ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...
                </>
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
