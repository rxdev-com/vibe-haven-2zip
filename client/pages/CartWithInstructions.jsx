import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Package,
  Loader2,
  CreditCard,
  CheckCircle,
} from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ordersAPI } from "@/lib/api";

const PAYMENT_METHODS = [
  { value: "cod", label: "Cash on Delivery" },
  { value: "upi", label: "UPI" },
  { value: "card", label: "Credit / Debit Card" },
  { value: "bank_transfer", label: "Bank Transfer" },
];

export default function CartWithInstructions() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, totalAmount, totalItems, clearCart } =
    useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const [address, setAddress] = useState(user?.address || "");
  const [notes, setNotes] = useState("");
  const [payment, setPayment] = useState("cod");
  const [placing, setPlacing] = useState(false);

  // Group cart items by supplier (orders are per-supplier on backend)
  const groups = items.reduce((acc, it) => {
    const sid = it.supplierId || "unknown";
    if (!acc[sid]) acc[sid] = { name: it.supplierName || "Supplier", items: [] };
    acc[sid].items.push(it);
    return acc;
  }, {});
  const supplierIds = Object.keys(groups);
  const deliveryFee = totalAmount > 500 ? 0 : 50;
  const grandTotal = totalAmount + deliveryFee * supplierIds.length;

  const handlePlaceOrder = async () => {
    if (!items.length) return;
    if (!address.trim()) {
      toast({
        title: "Delivery address required",
        description: "Enter where to deliver your order.",
        variant: "destructive",
      });
      return;
    }
    setPlacing(true);
    try {
      const placedOrders = [];
      for (const sid of supplierIds) {
        const group = groups[sid];
        const orderItems = group.items.map((it) => ({
          materialId: it.materialId || it.id,
          quantity: it.quantity,
        }));
        const res = await ordersAPI.create({
          items: orderItems,
          deliveryAddress: address,
          paymentMethod: payment,
          notes,
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
      toast({
        title: "Could not place order",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="Cart" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/vendor/dashboard"
          className="inline-flex items-center text-sm text-gray-600 hover:text-saffron-600 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Continue shopping
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6"
        >
          Your Cart{" "}
          {totalItems > 0 && (
            <span className="text-base font-normal text-gray-500">
              ({totalItems} items)
            </span>
          )}
        </motion.h1>

        {items.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="font-semibold text-lg mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-4">
                Browse our marketplace and add some materials!
              </p>
              <Link to="/vendor/dashboard">
                <Button className="bg-gradient-to-r from-saffron-500 to-orange-500">
                  Browse materials
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {supplierIds.map((sid) => (
                <Card key={sid}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Package className="w-4 h-4 text-emerald-500" />
                      {groups[sid].name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AnimatePresence>
                      {groups[sid].items.map((it) => (
                        <motion.div
                          key={it.id}
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex items-center gap-3 py-3 border-b last:border-0"
                        >
                          <div className="w-16 h-16 rounded bg-gradient-to-br from-saffron-100 to-emerald-100 flex-shrink-0 overflow-hidden">
                            {it.image ? (
                              <img
                                src={it.image}
                                alt={it.name}
                                className="w-full h-full object-cover"
                                onError={(e) =>
                                  (e.currentTarget.style.display = "none")
                                }
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-saffron-300" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{it.name}</p>
                            <p className="text-sm text-saffron-600">
                              ₹{it.price}/{it.unit}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 border rounded-lg">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(it.id, it.quantity - 1)
                              }
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center text-sm">
                              {it.quantity}
                            </span>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(it.id, it.quantity + 1)
                              }
                              disabled={it.stock && it.quantity >= it.stock}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="text-right w-20">
                            <p className="font-semibold">
                              ₹{it.price * it.quantity}
                            </p>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeItem(it.id)}
                            aria-label="Remove"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              ))}

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Delivery Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cart-addr">Delivery Address *</Label>
                    <Textarea
                      id="cart-addr"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={2}
                      placeholder="Building, street, city, pincode"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cart-notes">Special Instructions</Label>
                    <Textarea
                      id="cart-notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                      placeholder="e.g. Please call before delivery, keep cool, etc."
                    />
                  </div>
                  <div>
                    <Label>Payment Method</Label>
                    <Select value={payment} onValueChange={setPayment}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PAYMENT_METHODS.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle className="text-base">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Subtotal ({totalItems} items)
                    </span>
                    <span className="font-medium">₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Delivery ({supplierIds.length} supplier
                      {supplierIds.length > 1 ? "s" : ""})
                    </span>
                    <span className="font-medium">
                      {deliveryFee === 0 ? (
                        <Badge className="bg-emerald-100 text-emerald-700">
                          FREE
                        </Badge>
                      ) : (
                        `₹${deliveryFee * supplierIds.length}`
                      )}
                    </span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-2xl font-bold text-saffron-600">
                      ₹{grandTotal}
                    </span>
                  </div>
                  {totalAmount < 500 && deliveryFee > 0 && (
                    <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                      Add ₹{500 - totalAmount} more per supplier for free delivery
                    </p>
                  )}
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={placing}
                    className="w-full bg-gradient-to-r from-saffron-500 to-orange-500 hover:from-saffron-600 hover:to-orange-600 transition-all"
                  >
                    {placing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Placing order...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" /> Place Order
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    By placing this order you agree to our terms.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
