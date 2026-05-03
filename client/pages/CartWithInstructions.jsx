import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Plus, Minus, Trash2, ShoppingCart, Package, Loader2, CreditCard, Lock,
} from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ordersAPI } from "@/lib/api";

const DELIVERY_PREFS = [
  { value: "standard_same_day", label: "Standard Delivery - Same day" },
  { value: "express_2hr", label: "Express Delivery - 2 hours" },
  { value: "scheduled", label: "Scheduled Delivery" },
  { value: "next_day", label: "Next Day Delivery" },
];

const URGENCY_OPTIONS = [
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

export default function CartWithInstructions() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, totalAmount, totalItems, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const [address, setAddress] = useState(user?.address || "");
  const [phone, setPhone] = useState(user?.phone || "+91 98765 43210");
  const [placing, setPlacing] = useState(false);

  // Per-group state (keyed by supplierId)
  const [groupPrefs, setGroupPrefs] = useState({});
  const [groupUrgency, setGroupUrgency] = useState({});
  const [groupNotes, setGroupNotes] = useState({});

  // Group cart items by supplier
  const groups = items.reduce((acc, it) => {
    const sid = it.supplierId || it.id || "unknown";
    if (!acc[sid]) acc[sid] = { name: it.supplierName || "Supplier", items: [], subtotal: 0 };
    acc[sid].items.push(it);
    acc[sid].subtotal += it.price * it.quantity;
    return acc;
  }, {});

  const supplierIds = Object.keys(groups);
  const DELIVERY_FEE = 50;
  const totalDeliveryFee = supplierIds.reduce((sum, sid) => {
    return sum + (groups[sid].subtotal >= 500 ? 0 : DELIVERY_FEE);
  }, 0);
  const grandTotal = totalAmount + totalDeliveryFee;

  const getGroupPref = (sid) => groupPrefs[sid] || "standard_same_day";
  const getGroupUrgency = (sid) => groupUrgency[sid] || "normal";
  const getGroupNotes = (sid) => groupNotes[sid] || "";

  const setGroupPref = (sid, v) => setGroupPrefs(p => ({ ...p, [sid]: v }));
  const setGroupUrg = (sid, v) => setGroupUrgency(p => ({ ...p, [sid]: v }));
  const setGroupNote = (sid, v) => setGroupNotes(p => ({ ...p, [sid]: v }));

  const handlePlaceOrder = async () => {
    if (!items.length) return;
    if (!address.trim()) {
      toast({ title: "Delivery address required", description: "Enter where to deliver your order.", variant: "destructive" });
      return;
    }
    if (!phone.trim()) {
      toast({ title: "Phone number required", variant: "destructive" });
      return;
    }
    setPlacing(true);
    try {
      const placedOrders = [];
      for (const sid of supplierIds) {
        const group = groups[sid];
        const orderItems = group.items.map(it => ({
          materialId: it.materialId || it.id,
          quantity: it.quantity,
        }));
        const res = await ordersAPI.create({
          items: orderItems,
          deliveryAddress: address,
          deliveryInstructions: getGroupNotes(sid),
          paymentMethod: "cash",
          urgency: getGroupUrgency(sid),
          deliveryPreference: getGroupPref(sid),
          phone,
        });
        placedOrders.push(res.order);
      }
      await clearCart();
      toast({
        title: `${placedOrders.length} order(s) placed!`,
        description: "Track them in your Active Orders page.",
      });
      navigate("/vendor/active-orders");
    } catch (e) {
      toast({ title: "Could not place order", description: e.message, variant: "destructive" });
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="Shopping Cart" badgeColor="bg-saffron-100 text-saffron-700" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-3 mb-5">
          <Link to="/vendor/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-saffron-600">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-sm text-gray-500">Review your items and proceed to checkout</p>
          </div>
        </div>

        {items.length === 0 ? (
          <Card>
            <CardContent className="text-center py-20">
              <ShoppingCart className="w-14 h-14 mx-auto mb-4 text-gray-200" />
              <h3 className="font-semibold text-lg mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-5">Browse our marketplace and add some materials!</p>
              <Link to="/vendor/dashboard">
                <Button className="bg-saffron-500 hover:bg-saffron-600 text-white">Browse Materials</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Left: Cart groups */}
            <div className="lg:col-span-3 space-y-4">
              <AnimatePresence>
                {supplierIds.map((sid) => {
                  const group = groups[sid];
                  const deliveryFee = group.subtotal >= 500 ? 0 : DELIVERY_FEE;
                  const groupTotal = group.subtotal + deliveryFee;
                  const pref = getGroupPref(sid);
                  const urgency = getGroupUrgency(sid);
                  const notes = getGroupNotes(sid);
                  const prefLabel = DELIVERY_PREFS.find(p => p.value === pref)?.label || "";

                  return (
                    <motion.div key={sid} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                      <Card>
                        <CardContent className="p-5">
                          {/* Supplier header */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Package className="w-5 h-5 text-saffron-500" />
                              <span className="font-semibold text-gray-900">{group.name}</span>
                            </div>
                            <Badge variant="outline">{group.items.length} item{group.items.length > 1 ? "s" : ""}</Badge>
                          </div>

                          {/* Items */}
                          <div className="space-y-3 mb-4">
                            {group.items.map((it) => (
                              <div key={it.id} className="flex items-center gap-3 border rounded-lg p-3">
                                <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                                  {it.image ? (
                                    <img src={it.image} alt={it.name} className="w-10 h-10 object-cover rounded" onError={e => e.currentTarget.style.display = "none"} />
                                  ) : (
                                    <Package className="w-5 h-5 text-gray-400" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm truncate">{it.name}</p>
                                  <p className="text-xs text-saffron-600">₹{it.price}/{it.unit}</p>
                                </div>
                                <div className="flex items-center border rounded-lg">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7"
                                    onClick={() => updateQuantity(it.id, it.quantity - 1)}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                  <span className="w-7 text-center text-sm font-medium">{it.quantity}</span>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7"
                                    onClick={() => updateQuantity(it.id, it.quantity + 1)}
                                    disabled={it.stock && it.quantity >= it.stock}
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                                <span className="font-semibold text-sm w-14 text-right">₹{it.price * it.quantity}</span>
                                <Button size="icon" variant="ghost" className="h-7 w-7 flex-shrink-0" onClick={() => removeItem(it.id)}>
                                  <Trash2 className="w-4 h-4 text-red-400" />
                                </Button>
                              </div>
                            ))}
                          </div>

                          {/* Delivery Preference + Urgency */}
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                              <Label className="text-xs text-gray-600 mb-1 block">Delivery Preference</Label>
                              <Select value={pref} onValueChange={v => setGroupPref(sid, v)}>
                                <SelectTrigger className="h-9 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {DELIVERY_PREFS.map(p => (
                                    <SelectItem key={p.value} value={p.value} className="text-xs">{p.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <p className="text-xs text-gray-400 mt-1">Delivery fee: ₹{deliveryFee}</p>
                            </div>
                            <div>
                              <Label className="text-xs text-gray-600 mb-1 block">Urgency</Label>
                              <Select value={urgency} onValueChange={v => setGroupUrg(sid, v)}>
                                <SelectTrigger className="h-9 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {URGENCY_OPTIONS.map(u => (
                                    <SelectItem key={u.value} value={u.value} className="text-xs">{u.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* Special Instructions */}
                          <div className="mb-3">
                            <Label className="text-xs text-gray-600 mb-1 block">Special Instructions</Label>
                            <div className="relative">
                              <Textarea
                                value={notes}
                                onChange={e => setGroupNote(sid, e.target.value)}
                                placeholder="Any special instructions for the supplier..."
                                rows={3}
                                className="text-sm resize-none"
                              />
                            </div>
                          </div>

                          {/* Subtotal */}
                          <div className="flex justify-between items-center pt-2 border-t">
                            <span className="font-semibold text-sm text-gray-700">Subtotal:</span>
                            <span className="font-bold text-gray-900">₹{groupTotal}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Right: Delivery Info + Order Summary */}
            <div className="lg:col-span-2 space-y-4">
              {/* Delivery Information */}
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-base text-gray-900 mb-4">Delivery Information</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-1 block">
                        Delivery Address <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        placeholder="Enter your complete delivery address..."
                        rows={3}
                        className="text-sm resize-none"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-1 block">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="text-sm"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card className="sticky top-20">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-base text-gray-900 mb-4">Order Summary</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">₹{totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery Fees:</span>
                      <span className="font-medium">
                        {totalDeliveryFee === 0
                          ? <span className="text-emerald-600 font-semibold">FREE</span>
                          : `₹${totalDeliveryFee}`}
                      </span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-bold text-gray-900">Total:</span>
                      <span className="font-bold text-lg text-gray-900">₹{grandTotal}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handlePlaceOrder}
                    disabled={placing || items.length === 0}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3"
                  >
                    {placing ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Placing order...</>
                    ) : (
                      <><CreditCard className="w-4 h-4 mr-2" /> Proceed to Payment</>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Lock className="w-3 h-3 text-gray-400" />
                    <p className="text-xs text-gray-400">Secure checkout powered by SSL encryption</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
