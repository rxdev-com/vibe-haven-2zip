import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Search,
  Plus,
  ShoppingBag,
  Loader2,
  Package,
  Star,
} from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { materialsAPI } from "@/lib/api";

const CATEGORIES = ["All", "Oil", "Spice", "Grain", "Pulse", "Vegetable", "Dairy", "Other"];

export default function VendorMarketplace() {
  const { toast } = useToast();
  const { addItem, isInCart } = useCart();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    materialsAPI
      .getAll({ limit: 100, isActive: true })
      .then((d) => setMaterials(d.materials || []))
      .catch((e) =>
        toast({ title: "Could not load", description: e.message, variant: "destructive" }),
      )
      .finally(() => setLoading(false));
  }, [toast]);

  const filtered = useMemo(
    () =>
      materials.filter((m) => {
        const ms = !search || m.name.toLowerCase().includes(search.toLowerCase());
        const mc = category === "All" || m.category === category;
        return ms && mc;
      }),
    [materials, search, category],
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="Marketplace" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/vendor/dashboard"
          className="inline-flex items-center text-sm text-gray-600 hover:text-saffron-600 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <ShoppingBag className="w-7 h-7 text-saffron-500" /> Marketplace
            </h1>
            <p className="text-sm text-gray-600">
              Discover all available raw materials from local suppliers
            </p>
          </div>
          <Link to="/vendor/sell-items">
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" /> List Item for Resale
            </Button>
          </Link>
        </motion.div>

        <Card className="mb-4">
          <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-saffron-500" />
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              No items match your search
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((m, i) => {
              const inCart = isInCart(m._id);
              return (
                <motion.div
                  key={m._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i, 8) * 0.04 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="hover:shadow-lg transition-all overflow-hidden h-full flex flex-col">
                    <Link to={`/material/${m._id}`}>
                      <div className="relative h-40 bg-gradient-to-br from-saffron-100 to-emerald-100">
                        {m.image ? (
                          <img
                            src={m.image}
                            alt={m.name}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                            onError={(e) => (e.currentTarget.style.display = "none")}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-12 h-12 text-saffron-300" />
                          </div>
                        )}
                        <Badge className="absolute top-2 left-2">{m.category}</Badge>
                      </div>
                    </Link>
                    <CardContent className="p-4 flex flex-col flex-1">
                      <Link to={`/material/${m._id}`}>
                        <h3 className="font-semibold hover:text-saffron-600 line-clamp-1">
                          {m.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                        {m.description}
                      </p>
                      {(m.rating || 0) > 0 && (
                        <p className="text-xs flex items-center gap-1 text-gray-500 mb-2">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {m.rating.toFixed(1)} · {m.totalRatings || 0} reviews
                        </p>
                      )}
                      <div className="mt-auto flex items-center justify-between">
                        <p className="text-lg font-bold text-saffron-600">
                          ₹{m.price}
                          <span className="text-xs font-normal text-gray-500">
                            /{m.unit}
                          </span>
                        </p>
                        <Button
                          size="sm"
                          disabled={m.stock <= 0}
                          onClick={() =>
                            addItem(
                              {
                                id: m._id,
                                materialId: m._id,
                                name: m.name,
                                price: m.price,
                                image: m.image,
                                unit: m.unit,
                                stock: m.stock,
                                supplierName:
                                  m.supplierId?.businessName ||
                                  m.supplierId?.name,
                              },
                              m.minOrderQuantity || 1,
                            )
                          }
                          className={
                            inCart
                              ? "bg-emerald-600 hover:bg-emerald-700"
                              : "bg-gradient-to-r from-saffron-500 to-orange-500"
                          }
                        >
                          {inCart ? "Added" : "Add"}
                        </Button>
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
