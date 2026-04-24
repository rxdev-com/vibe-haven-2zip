import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Truck, Package, Loader2, MapPin } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { useToast } from "@/hooks/use-toast";
import { ordersAPI } from "@/lib/api";

export default function InTransit() {
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersAPI
      .getAll({ status: "shipped" })
      .then((d) => setOrders((d.orders || []).filter((o) => o.status === "shipped")))
      .catch((e) =>
        toast({ title: "Could not load", description: e.message, variant: "destructive" }),
      )
      .finally(() => setLoading(false));
  }, [toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="In Transit" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/vendor/dashboard"
          className="inline-flex items-center text-sm text-gray-600 hover:text-saffron-600 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to dashboard
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2"
        >
          <Truck className="w-7 h-7 text-purple-500" /> In Transit
        </motion.h1>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No orders in transit right now</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((o, i) => (
              <motion.div
                key={o._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-all">
                  <CardContent className="p-5">
                    <div className="flex flex-wrap justify-between gap-3 mb-3">
                      <div>
                        <p className="font-semibold">{o.orderNumber}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(o.createdAt).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800">
                        Shipped
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1 mb-3">
                      <p>
                        <strong>From:</strong>{" "}
                        {o.supplierId?.businessName || o.supplierId?.name}
                      </p>
                      <p className="flex items-start gap-1">
                        <MapPin className="w-3 h-3 mt-1 flex-shrink-0" />{" "}
                        {o.deliveryAddress}
                      </p>
                    </div>
                    <Link to={`/track-order/${o._id}`}>
                      <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
                        <Truck className="w-4 h-4 mr-1" /> Track Live
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
