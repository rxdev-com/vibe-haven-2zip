import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Truck, Package, Loader2, MapPin, Phone,
  CheckCircle, Clock, RefreshCw,
} from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { useToast } from "@/hooks/use-toast";
import { ordersAPI } from "@/lib/api";

function fmtINR(v) { return `₹${Number(v||0).toLocaleString("en-IN")}`; }
function fmtDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleString("en-IN", { year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: true });
}

const TIMELINE_STEPS = [
  { key: "confirmed", label: "Order Confirmed", subLabel: "Supplier Warehouse" },
  { key: "processing", label: "Package Prepared", subLabel: "Warehouse" },
  { key: "shipped", label: "Out for Delivery", subLabel: "Left Warehouse Hub" },
  { key: "in_transit", label: "In Transit", subLabel: "En route" },
  { key: "delivered", label: "Delivered", subLabel: "Your Location" },
];

function getProgressPct(status) {
  const map = { pending: 5, confirmed: 20, processing: 40, shipped: 65, in_transit: 80, delivered: 100 };
  return map[status] || 5;
}

function getDriverName(order, index) {
  const names = ["Ramesh Kumar", "Suresh Singh", "Amit Verma"];
  return order.driverName || names[index % names.length];
}

function getVehicle(order, index) {
  const vehicles = ["UP14 AB 1234", "DL 10 CD 5678", "HR 26 EF 9012"];
  return order.driverVehicle || vehicles[index % vehicles.length];
}

export default function InTransit() {
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const d = await ordersAPI.getAll({ limit: 100 });
      setOrders((d.orders || []).filter(o => ["shipped", "in_transit", "processing"].includes(o.status)));
    } catch (e) {
      toast({ title: "Could not load", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const totalValue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimal header matching screenshot */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/vendor/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-saffron-600">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-saffron-500 to-emerald-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">JB</span>
              </div>
              <span className="font-bold text-gray-900">JugaduBazar</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-100 text-purple-700">In Transit</Badge>
            <Button variant="ghost" size="sm" onClick={refresh} className="gap-1 text-xs">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Orders In Transit</h1>
          <p className="text-sm text-gray-500">Real time tracking of your deliveries currently on the way</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "In Transit", value: orders.length, color: "text-purple-600" },
            { label: "Avg. ETA", value: "2.5 hrs", color: "text-orange-600" },
            { label: "Total Value", value: fmtINR(totalValue), color: "text-emerald-600" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>
        ) : orders.length === 0 ? (
          <Card><CardContent className="text-center py-16">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">No orders currently in transit</p>
          </CardContent></Card>
        ) : (
          <div className="space-y-5">
            {orders.map((o, i) => {
              const supplier = o.supplierId || o.supplier || {};
              const sName = supplier.businessName || supplier.name || "Supplier";
              const sPhone = supplier.phone || "";
              const pct = getProgressPct(o.status);
              const driverName = getDriverName(o, i);
              const vehicle = getVehicle(o, i);
              const stepIdx = ["confirmed","processing","shipped","in_transit","delivered"].indexOf(o.status);
              const currentStepIndex = stepIdx < 0 ? 0 : stepIdx;

              const locations = [
                "Supplier Warehouse → Faridabad",
                "Old Delhi → Ghaziabad Highway",
                "Noida → Sector 15",
              ];

              return (
                <motion.div key={o._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      {/* Card header */}
                      <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b">
                        <div>
                          <span className="font-bold text-gray-900">{o.orderNumber}</span>
                          <p className="text-xs text-gray-500">
                            From {sName} · Tracking: TRK{String(o.orderNumber||"").replace(/\D/g,"").slice(-8).padStart(8,"0")}
                          </p>
                        </div>
                        <Badge className="bg-purple-100 text-purple-700">In Transit</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5">
                        {/* Left: Progress + location + driver */}
                        <div className="space-y-4">
                          {/* Progress bar */}
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <p className="text-sm font-medium text-gray-700">Delivery Progress</p>
                              <span className="text-sm font-bold text-orange-600">{pct}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <motion.div
                                className="h-2 rounded-full bg-gradient-to-r from-orange-400 to-emerald-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                              />
                            </div>
                          </div>

                          {/* Location info */}
                          <div className="text-sm space-y-1">
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                              <span>Current Location: {locations[i % locations.length].split("→")[1]?.trim() || locations[0]}</span>
                            </div>
                            {o.estimatedDelivery && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                <span>Expected Delivery: {fmtDate(o.estimatedDelivery)}</span>
                              </div>
                            )}
                          </div>

                          {/* Driver Details */}
                          <div className="border rounded-lg p-3 bg-gray-50">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Driver Details</p>
                            <p className="text-sm"><span className="text-gray-500">Name:</span> <span className="font-medium">{driverName}</span></p>
                            <p className="text-sm"><span className="text-gray-500">Vehicle:</span> <span className="font-medium">{vehicle}</span></p>
                          </div>

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1 gap-1 text-xs" onClick={() => window.open(`tel:${sPhone}`)}>
                              <Phone className="w-3.5 h-3.5" /> Call Driver
                            </Button>
                            <Link to={`/track-order/${o._id}`} className="flex-1">
                              <Button variant="outline" size="sm" className="w-full gap-1 text-xs">
                                <MapPin className="w-3.5 h-3.5" /> Track on Map
                              </Button>
                            </Link>
                          </div>
                        </div>

                        {/* Right: Timeline */}
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-3">Tracking Timeline</p>
                          <div className="space-y-3">
                            {TIMELINE_STEPS.map((step, j) => {
                              const done = j <= currentStepIndex;
                              const current = j === currentStepIndex;
                              const now2 = new Date();
                              const t = new Date(now2 - (TIMELINE_STEPS.length - 1 - j) * 22 * 60 * 1000);
                              const timeStr = done ? `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")} ${String(t.getHours()).padStart(2,"0")}:${String(t.getMinutes()).padStart(2,"0")}` : "";
                              return (
                                <div key={step.key} className="flex items-start gap-3">
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${done ? current ? "bg-blue-500" : "bg-emerald-500" : "border-2 border-gray-200"}`}>
                                    {done && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                                  </div>
                                  <div>
                                    <p className={`text-sm font-medium ${done ? "text-gray-900" : "text-gray-400"}`}>{step.label}</p>
                                    {done && <p className="text-xs text-gray-400">{step.subLabel}</p>}
                                    {done && <p className="text-xs text-gray-400">{timeStr}</p>}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Order Items summary */}
                          <div className="mt-4 border-t pt-3">
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Order Items</p>
                            {(o.items || []).map((item, k) => (
                              <div key={k} className="flex justify-between text-sm">
                                <span className="text-gray-700">{item.name}</span>
                                <span className="text-gray-500">{item.quantity} {item.unit}</span>
                              </div>
                            ))}
                            <div className="flex justify-between text-sm font-semibold mt-1 pt-1 border-t">
                              <span>Total Amount:</span>
                              <span className="text-emerald-600">{fmtINR(o.totalAmount)}</span>
                            </div>
                          </div>
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
    </div>
  );
}
