import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  ArrowLeft, Package, Truck, CheckCircle, Clock, XCircle,
  Loader2, MapPin, Phone, IndianRupee, Eye, MessageSquare, CreditCard,
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

function fmtINR(v) { return `₹${Number(v || 0).toLocaleString("en-IN")}`; }
function fmtDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleString("en-IN", { year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: true });
}
function initials(name) {
  return (name || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

export default function VendorActiveOrders() {
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("active");
  const [cancelId, setCancelId] = useState(null);
  const [payingId, setPayingId] = useState(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await ordersAPI.getAll({ limit: 100 });
      setOrders(data.orders || []);
    } catch (e) {
      toast({ title: "Could not load orders", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const visible = orders.filter((o) => {
    if (filter === "active") return ["pending", "confirmed", "processing", "shipped"].includes(o.status);
    if (filter === "delivered") return o.status === "delivered";
    if (filter === "cancelled") return o.status === "cancelled";
    return true;
  });

  const activeOrders = orders.filter(o => ["pending","confirmed","processing","shipped"].includes(o.status));
  const processing = orders.filter(o => o.status === "processing");
  const shipped = orders.filter(o => o.status === "shipped");
  const totalValue = activeOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);

  const handleCancel = async () => {
    if (!cancelId) return;
    try {
      await ordersAPI.cancel(cancelId, "Cancelled by vendor");
      toast({ title: "Order cancelled" });
      setCancelId(null);
      refresh();
    } catch (e) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    }
  };

  const handlePayment = () => {
    setPayingId(null);
    toast({ title: "Payment initiated", description: "Redirecting to payment gateway..." });
  };

  const openWhatsApp = (phone, orderNum) => {
    const msg = encodeURIComponent(`Hi, I'm contacting about order ${orderNum}`);
    const num = (phone || "").replace(/\D/g, "");
    window.open(`https://wa.me/${num || "919876543210"}?text=${msg}`, "_blank");
  };

  const getStatusLabel = (status) => {
    const map = { shipped: "Out for delivery", processing: "Being prepared", confirmed: "Ready for pickup", delivered: "Delivered", pending: "Awaiting confirmation", cancelled: "Cancelled" };
    return map[status] || status;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="Active Order" badgeColor="bg-orange-100 text-orange-700" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/vendor/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-saffron-600">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Active Orders</h1>
            <p className="text-sm text-gray-500">Track your current orders and deliveries</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Active", value: activeOrders.length, color: "text-blue-600" },
            { label: "Processing", value: processing.length, color: "text-yellow-600" },
            { label: "Shipped", value: shipped.length, color: "text-purple-600" },
            { label: "Total Value", value: fmtINR(totalValue), color: "text-emerald-600" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filter */}
        <div className="mb-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active Orders</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="all">All Orders</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-saffron-500" /></div>
        ) : visible.length === 0 ? (
          <Card><CardContent className="text-center py-16">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">No orders found</p>
          </CardContent></Card>
        ) : (
          <div className="space-y-4">
            {visible.map((o, i) => {
              const supplier = o.supplierId || o.supplier || {};
              const sName = supplier.businessName || supplier.name || "Supplier";
              const sPhone = supplier.phone || "";
              const sAddr = supplier.address || "";
              const needsPayment = ["processing", "pending"].includes(o.status) && o.paymentStatus !== "paid";
              const lastNote = (o.statusHistory || []).filter(s => s.note && s.note !== "Order placed").slice(-1)[0]?.note || o.deliveryInstructions;

              return (
                <motion.div key={o._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      {/* Header */}
                      <div className="flex flex-wrap items-center justify-between px-5 pt-4 pb-2 gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-gray-900">{o.orderNumber}</span>
                          <Badge className={STATUS_BADGE[o.status]}>{o.status}</Badge>
                          <Badge className="bg-gray-100 text-gray-600">normal</Badge>
                          {o.paymentStatus === "paid" && <Badge className="bg-emerald-100 text-emerald-700">paid</Badge>}
                          {o.paymentStatus === "pending" && <Badge className="bg-yellow-100 text-yellow-700">pending</Badge>}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-xl text-gray-900">{fmtINR(o.totalAmount)}</p>
                          <p className="text-xs text-gray-400">{fmtDate(o.createdAt)}</p>
                        </div>
                      </div>

                      <div className="px-5 pb-5 space-y-3">
                        {/* Supplier */}
                        <div className="border rounded-lg p-3 bg-gray-50">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Supplier Details</p>
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {initials(sName)}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-sm">{sName}</p>
                              <p className="text-xs text-gray-500">Supplier</p>
                            </div>
                            <div className="text-xs text-gray-500 space-y-1">
                              {sAddr && <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{sAddr}</div>}
                              {sPhone && <div className="flex items-center gap-1"><Phone className="w-3 h-3" />{sPhone}</div>}
                            </div>
                          </div>
                        </div>

                        {/* Items */}
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Order Items</p>
                          <div className="space-y-1.5">
                            {(o.items || []).map((item, j) => (
                              <div key={j} className="flex justify-between text-sm">
                                <div>
                                  <span className="font-medium">{item.name}</span>
                                  <span className="text-gray-400 ml-1">{item.quantity} {item.unit}</span>
                                </div>
                                <div className="text-right">
                                  <span className="font-semibold">{fmtINR(item.total)}</span>
                                  <span className="text-xs text-gray-400 ml-1">{fmtINR(item.price)}/{item.unit}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Delivery Status */}
                        <div className="border rounded-lg p-3 bg-gray-50">
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Delivery Status</p>
                            <span className="text-xs text-blue-500">
                              Track ID: TRK{String(o.orderNumber || "").replace(/\D/g,"").slice(-7).padStart(7,"0")}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-xs text-gray-500">Current Location</p>
                              <p className="font-medium">{getStatusLabel(o.status)}</p>
                            </div>
                            {o.estimatedDelivery && (
                              <div>
                                <p className="text-xs text-gray-500">Estimated Delivery</p>
                                <p className="font-medium">{fmtDate(o.estimatedDelivery)}</p>
                              </div>
                            )}
                          </div>
                          {lastNote && (
                            <div className="mt-2 text-xs bg-yellow-50 border border-yellow-200 text-yellow-800 rounded px-2 py-1.5">
                              Note: {lastNote}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          <Link to={`/track-order/${o._id}`}>
                            <Button variant="outline" size="sm" className="text-xs gap-1">
                              <Truck className="w-3.5 h-3.5" /> Track Order Live
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs gap-1 text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                            onClick={() => openWhatsApp(sPhone, o.orderNumber)}
                          >
                            <MessageSquare className="w-3.5 h-3.5" /> Contact Supplier
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs gap-1">
                            <Eye className="w-3.5 h-3.5" /> View Details
                          </Button>
                          {needsPayment && (
                            <Button
                              size="sm"
                              className="text-xs gap-1 bg-saffron-500 hover:bg-saffron-600 text-white"
                              onClick={() => setPayingId(o._id)}
                            >
                              <CreditCard className="w-3.5 h-3.5" /> Make Payment
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancel Dialog */}
      <AlertDialog open={!!cancelId} onOpenChange={open => !open && setCancelId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Order?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone. The supplier will be notified.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Order</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel} className="bg-red-600 hover:bg-red-700">Cancel Order</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Payment Dialog */}
      <AlertDialog open={!!payingId} onOpenChange={open => !open && setPayingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Make Payment</AlertDialogTitle>
            <AlertDialogDescription>Choose a payment method to complete this order.</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid grid-cols-2 gap-2 px-6 py-2">
            {["UPI / GPay", "Net Banking", "Debit / Credit Card", "Cash on Delivery"].map(m => (
              <Button key={m} variant="outline" className="h-12 text-sm" onClick={handlePayment}>{m}</Button>
            ))}
          </div>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
