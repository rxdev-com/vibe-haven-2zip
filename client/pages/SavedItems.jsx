import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Package,
  Loader2,
  Star,
} from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { savedAPI } from "@/lib/api";

export default function SavedItems() {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await savedAPI.getAll();
      setItems((data.items || []).filter((i) => i.material));
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

  const handleRemove = async (mid) => {
    setItems((prev) => prev.filter((i) => i.material._id !== mid));
    try {
      await savedAPI.remove(mid);
      toast({ title: "Removed from saved" });
    } catch (e) {
      await refresh();
    }
  };

  const handleAdd = (m) => {
    addItem(
      {
        id: m._id,
        materialId: m._id,
        name: m.name,
        price: m.price,
        image: m.image,
        unit: m.unit,
        stock: m.stock,
        supplierName: m.supplierId?.businessName || m.supplierId?.name,
      },
      m.minOrderQuantity || 1,
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="Saved Items" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/vendor/dashboard"
          className="inline-flex items-center text-sm text-gray-600 hover:text-saffron-600 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to dashboard
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6"
        >
          Saved Items{" "}
          <span className="text-base font-normal text-gray-500">
            ({items.length})
          </span>
        </motion.h1>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-saffron-500" />
          </div>
        ) : items.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 mb-4">No saved items yet</p>
              <Link to="/vendor/dashboard">
                <Button className="bg-gradient-to-r from-saffron-500 to-orange-500">
                  Browse materials
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {items.map((it, i) => {
                const m = it.material;
                return (
                  <motion.div
                    key={m._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: Math.min(i, 8) * 0.04 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all h-full flex flex-col">
                      <Link to={`/material/${m._id}`}>
                        <div className="relative h-40 bg-gradient-to-br from-saffron-100 to-emerald-100 overflow-hidden">
                          {m.image ? (
                            <img
                              src={m.image}
                              alt={m.name}
                              className="w-full h-full object-cover transition-transform hover:scale-110"
                              onError={(e) => (e.currentTarget.style.display = "none")}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-12 h-12 text-saffron-300" />
                            </div>
                          )}
                        </div>
                      </Link>
                      <CardContent className="p-4 flex flex-col flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <Link to={`/material/${m._id}`}>
                            <h3 className="font-semibold hover:text-saffron-600 line-clamp-1">
                              {m.name}
                            </h3>
                          </Link>
                          <Badge variant="outline" className="ml-2 flex-shrink-0">
                            {m.category}
                          </Badge>
                        </div>
                        {(m.rating || 0) > 0 && (
                          <p className="text-xs flex items-center gap-1 text-gray-500 mb-2">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {m.rating.toFixed(1)}
                          </p>
                        )}
                        <p className="text-xl font-bold text-saffron-600 mt-auto">
                          ₹{m.price}
                          <span className="text-xs font-normal text-gray-500">
                            /{m.unit}
                          </span>
                        </p>
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            onClick={() => handleAdd(m)}
                            disabled={m.stock <= 0}
                            className="flex-1 bg-gradient-to-r from-saffron-500 to-orange-500"
                          >
                            <ShoppingCart className="w-4 h-4 mr-1" /> Add
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleRemove(m._id)}
                            aria-label="Remove from saved"
                          >
                            <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
