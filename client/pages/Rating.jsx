import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Star, Loader2, CheckCircle } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { useToast } from "@/hooks/use-toast";
import { ordersAPI } from "@/lib/api";

export default function Rating() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    ordersAPI
      .getById(orderId)
      .then((d) => setOrder(d.order))
      .catch((e) =>
        toast({ title: "Could not load", description: e.message, variant: "destructive" }),
      )
      .finally(() => setLoading(false));
  }, [orderId, toast]);

  const handleSubmit = async () => {
    if (score === 0) {
      toast({ title: "Pick a rating", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      await ordersAPI.rate(orderId, { score, comment });
      toast({
        title: "Thank you!",
        description: "Your rating helps other vendors.",
      });
      navigate("/vendor/active-orders");
    } catch (e) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

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

  if (!orderId || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h2 className="text-xl font-semibold mb-4">No order to rate</h2>
          <Link to="/vendor/active-orders">
            <Button>Go to my orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="Rate Order" />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/vendor/active-orders"
          className="inline-flex items-center text-sm text-gray-600 hover:text-saffron-600 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to orders
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle>Rate your experience</CardTitle>
              <p className="text-sm text-gray-600">
                Order {order.orderNumber} from{" "}
                {order.supplierId?.businessName || order.supplierId?.name}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="flex justify-center gap-2 mb-3">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <motion.button
                      key={n}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setScore(n)}
                      onMouseEnter={() => setHover(n)}
                      onMouseLeave={() => setHover(0)}
                      aria-label={`${n} star`}
                    >
                      <Star
                        className={`w-12 h-12 transition-colors ${
                          n <= (hover || score)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </motion.button>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  {score === 0
                    ? "Tap a star to rate"
                    : ["", "Very Poor", "Poor", "Average", "Good", "Excellent"][score]}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tell us more (optional)
                </label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What did you like or what could be better?"
                  rows={4}
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={submitting || score === 0}
                className="w-full bg-gradient-to-r from-saffron-500 to-orange-500"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" /> Submit Rating
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
