import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Package, Clock, CheckCircle, XCircle,
  Loader2, Phone, MapPin, MessageSquare, Eye, IndianRupee,
} from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { useToast } from "@/hooks/use-toast";
import { ordersAPI } from "@/lib/api";

function fmtINR(v) { return `₹${Number(v||0).toLocaleString("en-IN")}`; }
function fmtDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-CA");
}

export default function SupplierPendingOrders() {
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const d = await ordersAPI.getAll({ limit: 100 });
      setOrders((d.orders || []).filter(o => o.status === "pending"));
    } catch (e) {
      toast({ title: "Could not load", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const handleAccept = async (orderId) => {
    setActionId(orderId);
    try {
      await ordersAPI.updateStatus(orderId, "confirmed", "Order accepted by supplier");
      toast({ title: "Order accepted successfully" });
      refresh();
    } catch (e) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (orderId) => {
    setActionId(orderId);
    try {
      await ordersAPI.cancel(orderId, "Rejected by supplier");
      toast({ title: "Order rejected" });
      refresh();
    } catch (e) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    } finally {
      setActionId(null);
    }
  };

  const openWhatsApp = (phone, vendorName, orderNum) => {
    const msg = encodeURIComponent(`Hi ${vendorName || ""}, I'm responding to order ${orderNum}`);
    window.open(`https://wa.me/${(phone||"919876543210").replace(/\D/g,"")}?text=${msg}`, "_blank");
  };

  const urgentOrders = orders.filter(o => o.urgency === "urgent" || o.priority === "urgent");
  const totalValue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="Supplier Dashboard" badgeColor="bg-emerald-100 text-emerald-700" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/supplier/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-emerald-600">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pending Orders</h1>
            <p className="text-sm text-gray-500">Review and manage pending order requests</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Pending", value: orders.length, icon: Clock, color: "text-orange-600" },
            { label: "Urgent Orders", value: urgentOrders.length, icon: XCircle, color: "text-red-600" },
            { label: "Total Value", value: fmtINR(totalValue), icon: IndianRupee, color: "text-emerald-600" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                      <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    </div>
                    <s.icon className={`w-6 h-6 ${s.color} opacity-20 flex-shrink-0`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>
        ) : orders.length === 0 ? (
          <Card><CardContent className="text-center py-16">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">No pending orders at the moment</p>
          </CardContent></Card>
        ) : (
          <AnimatePresence>
            <div className="space-y-4">
              {orders.map((o, i) => {
                const vendor = o.vendorId || o.vendor || {};
                const vName = vendor.businessName || vendor.name || "Vendor";
                const vPhone = vendor.phone || "";
                const vAddr = vendor.address || "";
                const isUrgent = o.urgency === "urgent" || o.priority === "urgent";
                const itemSummary = (o.items || []).map(it => `${it.name} (${it.quantity}${it.unit})`).join(", ");
                const specialNote = o.deliveryInstructions || o.specialInstructions;

                return (
                  <motion.div key={o._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                    <Card className={`border ${isUrgent ? "border-orange-300" : ""}`}>
                      <CardContent className="p-5">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-gray-900">{o.orderNumber}</span>
                            <Badge className="bg-yellow-100 text-yellow-700 text-xs">pending</Badge>
                            {isUrgent && <Badge className="bg-orange-100 text-orange-700 text-xs">urgent</Badge>}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              className="bg-emerald-500 hover:bg-emerald-600 text-white gap-1 text-xs h-8"
                              onClick={() => handleAccept(o._id)}
                              disabled={actionId === o._id}
                            >
                              {actionId === o._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              className="text-red-600 border border-red-200 hover:bg-red-50 gap-1 text-xs h-8"
                              variant="outline"
                              onClick={() => handleReject(o._id)}
                              disabled={actionId === o._id}
                            >
                              <XCircle className="w-3 h-3" /> Reject
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 flex-shrink-0">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Vendor Info */}
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-gray-600 mb-2">Vendor Information</p>
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-saffron-100 text-saffron-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {vName[0] || "V"}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-sm text-gray-900">{vName}</p>
                              <p className="text-xs text-gray-500">Vendor</p>
                            </div>
                            {vPhone && <div className="text-xs text-gray-600 flex items-center gap-1"><Phone className="w-3 h-3" /> {vPhone}</div>}
                          </div>
                          {vAddr && <p className="text-xs text-gray-600 ml-11 flex items-center gap-1"><MapPin className="w-3 h-3 flex-shrink-0" /> {vAddr}</p>}
                        </div>

                        {/* Order Items */}
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-gray-600 mb-1">Order Items</p>
                          <p className="text-sm text-gray-700">{itemSummary}</p>
                        </div>

                        {/* Special Notes */}
                        {specialNote && (
                          <div className="mb-3 text-xs bg-blue-50 border border-blue-200 text-blue-800 rounded px-3 py-2">
                            <span className="font-semibold">Special Notes: </span>{specialNote}
                          </div>
                        )}

                        {/* Order Details */}
                        <div className="flex gap-4 text-xs text-gray-600">
                          <span>Amount: <span className="font-semibold text-gray-900">{fmtINR(o.totalAmount)}</span></span>
                          <span>Date: {fmtDate(o.createdAt)}</span>
                          <span>Payment: {o.paymentMethod === "cash" ? "On Delivery" : o.paymentStatus === "paid" ? "Paid" : "Pending"}</span>
                        </div>

                        {/* Chat Button */}
                        <div className="mt-3">
                          <Button
                            size="sm"
                            className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 gap-1 text-xs w-full h-8"
                            onClick={() => openWhatsApp(vPhone, vName, o.orderNumber)}
                          >
                            <MessageSquare className="w-3 h-3" /> Chat on WhatsApp
                          </Button>
                        </div>
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
