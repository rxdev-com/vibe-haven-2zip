import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Package, CheckCircle, Clock, Truck, XCircle,
  Loader2, Phone, MessageSquare, AlertTriangle, RefreshCw, ShoppingCart,
} from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { useToast } from "@/hooks/use-toast";
import { ordersAPI } from "@/lib/api";

const STEPS = [
  { key: "confirmed", label: "Order confirmed by supplier" },
  { key: "processing", label: "Items being prepared for dispatch" },
  { key: "shipped", label: "Order picked up by driver" },
  { key: "in_transit", label: "Out for delivery" },
  { key: "delivered", label: "Order delivered successfully" },
];

const STATUS_ORDER = ["pending","confirmed","processing","shipped","in_transit","delivered"];

function getStepIndex(status) {
  const map = { pending: 0, confirmed: 0, processing: 1, shipped: 2, in_transit: 3, delivered: 4 };
  return map[status] ?? 0;
}

function fmtINR(v) { return `₹${Number(v||0).toLocaleString("en-IN")}`; }

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
    const t = setInterval(refresh, 5000);
    return () => clearInterval(t);
  }, [orderId]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="Live Tracking" badgeColor="bg-blue-100 text-blue-700" />
      <div className="flex justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-saffron-500" /></div>
    </div>
  );

  if (!order) return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="Live Tracking" />
      <div className="max-w-2xl mx-auto py-16 text-center">
        <h2 className="text-xl font-semibold mb-4">Order not found</h2>
        <Link to="/vendor/active-orders"><Button>My orders</Button></Link>
      </div>
    </div>
  );

  const isCancelled = order.status === "cancelled";
  const currentStep = getStepIndex(order.status);
  const supplier = order.supplierId || order.supplier || {};
  const driverName = order.driverName || "Suresh Kumar";
  const driverPhone = order.driverPhone || supplier.phone || "+91 98765 43210";
  const driverVehicle = order.driverVehicle || "Tempo · HR 26 DL 1234";
  const driverRating = 4.8;
  const driverDeliveries = 1247;
  const statusBadgeLabel = order.status === "shipped" ? "Out for Delivery" : order.status;

  const now = new Date();
  const stepTimes = STEPS.map((_, i) => {
    const t = new Date(now - (STEPS.length - 1 - i) * 18 * 60 * 1000);
    return `${String(t.getHours()).padStart(2,"0")}:${String(t.getMinutes()).padStart(2,"0")} PM`;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="Live Tracking" badgeColor="bg-blue-100 text-blue-700" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-5">
          <Link to="/vendor/active-orders" className="inline-flex items-center text-sm text-gray-500 hover:text-saffron-600">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Orders
          </Link>
          <Badge className={isCancelled ? "bg-red-100 text-red-700" : order.status === "delivered" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}>
            {statusBadgeLabel}
          </Badge>
        </div>

        <div className="mb-4">
          <h1 className="text-2xl font-bold">Tracking Order #{order.orderNumber}</h1>
          <p className="text-sm text-gray-500">Live location updates every 5 seconds</p>
        </div>

        {isCancelled ? (
          <Card><CardContent className="text-center py-16">
            <XCircle className="w-12 h-12 mx-auto mb-3 text-red-400" />
            <p className="font-semibold text-red-700">Order Cancelled</p>
            {order.cancellationReason && <p className="text-sm text-gray-500 mt-1">{order.cancellationReason}</p>}
          </CardContent></Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Left: Map + Driver */}
            <div className="lg:col-span-3 space-y-4">
              {/* Live Map */}
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative h-52 bg-gradient-to-br from-green-100 via-emerald-50 to-green-200 overflow-hidden">
                    {/* ETA bar */}
                    <div className="absolute top-3 left-3 right-3 bg-white rounded-lg shadow px-4 py-2 flex justify-between items-center z-10">
                      <div>
                        <p className="font-bold text-gray-900">44 min</p>
                        <p className="text-xs text-gray-500">Estimated arrival</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">2.1 km away</p>
                        <div className="w-20 h-1.5 bg-gray-200 rounded mt-1">
                          <div className="h-full bg-blue-500 rounded" style={{ width: "65%" }} />
                        </div>
                      </div>
                    </div>
                    {/* Map grid */}
                    <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 200">
                      {[0,40,80,120,160,200].map(y => <line key={`h${y}`} x1="0" y1={y} x2="400" y2={y} stroke="#059669" strokeWidth="1" />)}
                      {[0,50,100,150,200,250,300,350,400].map(x => <line key={`v${x}`} x1={x} y1="0" x2={x} y2="200" stroke="#059669" strokeWidth="1" />)}
                    </svg>
                    {/* Route line */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200">
                      <path d="M 80 150 Q 180 80 300 80" stroke="#3B82F6" strokeWidth="3" fill="none" strokeDasharray="8,4" />
                    </svg>
                    {/* Destination pin */}
                    <div className="absolute" style={{ left: "72%", top: "34%" }}>
                      <div className="w-8 h-8 bg-red-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    </div>
                    {/* Driver pin */}
                    <div className="absolute" style={{ left: "38%", top: "60%" }}>
                      <div className="w-10 h-10 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                        <Truck className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    {/* Label */}
                    <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur rounded px-3 py-1 text-xs text-gray-600">
                      <p className="font-semibold">Live Map View</p>
                      <p>Driver Location: 28.6139, 77.2100</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Driver Info */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs">👤</span>
                    Your Driver
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      SK
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{driverName}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span>⭐ {driverRating}</span>
                        <span>·</span>
                        <span>{driverDeliveries.toLocaleString()} deliveries</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{driverVehicle}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs text-green-600">Online</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => window.open(`tel:${driverPhone}`)}>
                        <Phone className="w-3.5 h-3.5" /> Call
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => window.open(`https://wa.me/${driverPhone.replace(/\D/g,"")}`)}>
                        <MessageSquare className="w-3.5 h-3.5" /> Message
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Order details + Progress + Quick Actions */}
            <div className="lg:col-span-2 space-y-4">
              {/* Order Details */}
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base">Order Details</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {(order.items || []).map((item, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Package className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex-1 text-sm">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.quantity} {item.unit}</p>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-semibold text-sm">
                    <span>Total</span>
                    <span>{fmtINR(order.totalAmount)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Progress */}
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Clock className="w-4 h-4" /> Delivery Progress</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {STEPS.map((step, i) => {
                      const done = i <= currentStep;
                      const current = i === currentStep;
                      return (
                        <motion.div key={step.key} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }} className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${done ? "bg-emerald-500" : "border-2 border-gray-200"}`}>
                            {done && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm ${current ? "font-semibold text-gray-900" : done ? "text-gray-700" : "text-gray-400"}`}>
                              {step.label}
                            </p>
                            {done && <p className="text-xs text-gray-400">{stepTimes[i]}</p>}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base">Quick Actions</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start gap-2 text-sm" onClick={() => window.open(`tel:${driverPhone}`)}>
                    <Phone className="w-4 h-4" /> Call Driver
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 text-sm" onClick={() => {}}>
                    <ShoppingCart className="w-4 h-4" /> Reorder Items
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 text-sm text-red-600 border-red-200 hover:bg-red-50">
                    <AlertTriangle className="w-4 h-4" /> Report Issue
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
