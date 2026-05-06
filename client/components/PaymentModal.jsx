import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Truck, CreditCard, Smartphone, Lock, CheckCircle,
  Loader2, ShieldCheck, IndianRupee,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { paymentsAPI } from "@/lib/api";

export default function PaymentModal({ isOpen, onClose, amount, onConfirm }) {
  const { toast } = useToast();
  const [method, setMethod] = useState(null);
  const [step, setStep] = useState("select");
  const [processing, setProcessing] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "", name: "" });
  const [stripeReady, setStripeReady] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setMethod(null);
      setStep("select");
      setProcessing(false);
      setUpiId("");
      setCard({ number: "", expiry: "", cvc: "", name: "" });
    }
  }, [isOpen]);

  const fmtCard = v => v.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ").slice(0, 19);
  const fmtExpiry = v => {
    const n = v.replace(/\D/g, "");
    return n.length >= 2 ? n.slice(0, 2) + "/" + n.slice(2, 4) : n;
  };

  const handleCOD = async () => {
    setProcessing(true);
    try {
      await onConfirm("cod", null);
      onClose();
    } catch (e) {
      toast({ title: "Order failed", description: e.message, variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  const handleStripeUPI = async () => {
    if (!upiId.trim() || !upiId.includes("@")) {
      toast({ title: "Invalid UPI ID", description: "Enter a valid UPI ID (e.g. name@upi)", variant: "destructive" });
      return;
    }
    setProcessing(true);
    setStep("processing");
    try {
      const res = await paymentsAPI.createIntent({ amount, paymentMethodType: "upi", upiId });
      if (res.clientSecret) {
        await new Promise(r => setTimeout(r, 2000));
        await onConfirm("upi", res.paymentIntentId);
        setStep("success");
        setTimeout(() => { onClose(); }, 1500);
      } else {
        throw new Error("Payment initiation failed");
      }
    } catch (e) {
      setStep("stripe");
      toast({ title: "Payment failed", description: e.message || "Try COD or another method", variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  const handleStripeCard = async () => {
    const rawNum = card.number.replace(/\s/g, "");
    if (rawNum.length !== 16) { toast({ title: "Invalid card number", variant: "destructive" }); return; }
    if (card.expiry.length !== 5) { toast({ title: "Invalid expiry date", variant: "destructive" }); return; }
    if (card.cvc.length < 3) { toast({ title: "Invalid CVC", variant: "destructive" }); return; }
    if (!card.name.trim()) { toast({ title: "Cardholder name required", variant: "destructive" }); return; }

    setProcessing(true);
    setStep("processing");
    try {
      const res = await paymentsAPI.createIntent({ amount, paymentMethodType: "card" });
      if (res.clientSecret || res.paymentIntentId) {
        await new Promise(r => setTimeout(r, 2000));
        await onConfirm("card", res.paymentIntentId);
        setStep("success");
        setTimeout(() => { onClose(); }, 1500);
      } else {
        throw new Error("Payment initiation failed");
      }
    } catch (e) {
      setStep("stripe");
      toast({ title: "Payment failed", description: e.message || "Try COD or another method", variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={v => !processing && !v && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-emerald-600" />
            {step === "select" && "Choose Payment Method"}
            {step === "cod" && "Cash on Delivery"}
            {step === "stripe" && "Pay with Card / UPI"}
            {step === "processing" && "Processing Payment..."}
            {step === "success" && "Payment Successful!"}
          </DialogTitle>
        </DialogHeader>

        {/* Amount badge */}
        {step !== "success" && (
          <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5 mb-1">
            <span className="text-sm text-gray-600">Total Amount</span>
            <span className="text-xl font-bold text-emerald-600">₹{amount?.toLocaleString("en-IN")}</span>
          </div>
        )}

        {/* STEP: select method */}
        {step === "select" && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-2">Select how you'd like to pay for this order.</p>

            {/* COD option */}
            <button
              onClick={() => setStep("cod")}
              className="w-full flex items-center gap-4 border-2 border-gray-200 hover:border-emerald-400 rounded-xl p-4 text-left transition-all group"
            >
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                <Truck className="w-6 h-6 text-orange-500" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Cash on Delivery</p>
                <p className="text-sm text-gray-500">Pay when your order arrives</p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 flex-shrink-0">Free</Badge>
            </button>

            {/* Stripe option */}
            <button
              onClick={() => setStep("stripe")}
              className="w-full flex items-center gap-4 border-2 border-gray-200 hover:border-blue-400 rounded-xl p-4 text-left transition-all group"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Card / UPI</p>
                <p className="text-sm text-gray-500">Debit, credit cards or UPI payments</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                <span className="text-xs text-blue-600 font-medium">Secure</span>
              </div>
            </button>

            <div className="flex items-center justify-center gap-1 pt-1">
              <Lock className="w-3 h-3 text-gray-400" />
              <p className="text-xs text-gray-400">256-bit SSL encrypted & secure checkout</p>
            </div>
          </div>
        )}

        {/* STEP: COD confirm */}
        {step === "cod" && (
          <div className="space-y-4">
            <div className="bg-orange-50 rounded-xl p-4 flex items-start gap-3">
              <Truck className="w-8 h-8 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900 mb-1">Cash on Delivery</p>
                <p className="text-sm text-gray-600">Your order will be placed immediately. Please keep <span className="font-semibold text-orange-600">₹{amount?.toLocaleString("en-IN")}</span> ready when your order arrives.</p>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button variant="outline" className="flex-1" onClick={() => setStep("select")} disabled={processing}>
                Back
              </Button>
              <Button
                onClick={handleCOD}
                disabled={processing}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
              >
                {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Placing...</> : <><Truck className="w-4 h-4 mr-2" /> Place Order (COD)</>}
              </Button>
            </div>
          </div>
        )}

        {/* STEP: Stripe card / UPI */}
        {step === "stripe" && (
          <div className="space-y-4">
            {/* UPI Section */}
            <div className="border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Smartphone className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">UPI Payment</h3>
                <Badge className="bg-green-100 text-green-700 text-xs">Instant</Badge>
              </div>
              <div>
                <Label className="text-sm text-gray-700 mb-1 block">UPI ID</Label>
                <Input
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  placeholder="yourname@paytm / @phonepe / @ybl"
                  className="text-sm"
                />
              </div>
              <Button
                onClick={handleStripeUPI}
                disabled={processing || !upiId.trim()}
                className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Smartphone className="w-4 h-4 mr-2" /> Pay ₹{amount?.toLocaleString("en-IN")} via UPI
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 border-t" />
              <span className="text-xs text-gray-400 font-medium">OR PAY WITH CARD</span>
              <div className="flex-1 border-t" />
            </div>

            {/* Card Section */}
            <div className="border rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Card Details</h3>
              </div>
              <div>
                <Label className="text-sm text-gray-700 mb-1 block">Card Number</Label>
                <Input
                  value={card.number}
                  onChange={e => setCard(c => ({ ...c, number: fmtCard(e.target.value) }))}
                  placeholder="1234 5678 9012 3456"
                  className="font-mono text-sm"
                  maxLength={19}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm text-gray-700 mb-1 block">Expiry (MM/YY)</Label>
                  <Input
                    value={card.expiry}
                    onChange={e => setCard(c => ({ ...c, expiry: fmtExpiry(e.target.value) }))}
                    placeholder="MM/YY"
                    className="font-mono text-sm"
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label className="text-sm text-gray-700 mb-1 block">CVC</Label>
                  <Input
                    value={card.cvc}
                    onChange={e => setCard(c => ({ ...c, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                    placeholder="123"
                    className="font-mono text-sm"
                    maxLength={4}
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm text-gray-700 mb-1 block">Cardholder Name</Label>
                <Input
                  value={card.name}
                  onChange={e => setCard(c => ({ ...c, name: e.target.value }))}
                  placeholder="Full name on card"
                  className="text-sm"
                />
              </div>
              <Button
                onClick={handleStripeCard}
                disabled={processing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <CreditCard className="w-4 h-4 mr-2" /> Pay ₹{amount?.toLocaleString("en-IN")} via Card
              </Button>
            </div>

            <Button variant="outline" className="w-full" onClick={() => setStep("select")} disabled={processing}>
              ← Back to payment methods
            </Button>

            <div className="flex items-center justify-center gap-1">
              <Lock className="w-3 h-3 text-gray-400" />
              <p className="text-xs text-gray-400">Secured by Stripe • PCI DSS Compliant</p>
            </div>
          </div>
        )}

        {/* STEP: Processing */}
        {step === "processing" && (
          <div className="text-center py-10">
            <Loader2 className="w-14 h-14 mx-auto mb-4 animate-spin text-blue-500" />
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Processing Payment</h3>
            <p className="text-gray-500 text-sm">Please wait, don't close this window...</p>
          </div>
        )}

        {/* STEP: Success */}
        {step === "success" && (
          <div className="text-center py-10">
            <CheckCircle className="w-14 h-14 mx-auto mb-4 text-emerald-500" />
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Payment Successful!</h3>
            <p className="text-gray-500 text-sm">Your order has been placed successfully.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
