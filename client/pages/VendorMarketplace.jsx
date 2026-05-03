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

const CATEGORIES = ["All Categories", "Oil", "Spice", "Grain", "Pulse", "Vegetable", "Dairy", "Other"];
const SORT_OPTIONS = ["Most Recent", "Price: Low to High", "Price: High to Low", "Rating", "Most Popular"];

export default function VendorMarketplace() {
  const { toast } = useToast();
  const { addItem, isInCart } = useCart();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("Most Recent");

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
    () => {
      let list = materials.filter((m) => {
        const ms = !search || m.name.toLowerCase().includes(search.toLowerCase());
        const mc = category === "All Categories" || m.category === category;
        return ms && mc;
      });
      
      // Sort
      if (sortBy === "Price: Low to High") list.sort((a, b) => (a.price || 0) - (b.price || 0));
      else if (sortBy === "Price: High to Low") list.sort((a, b) => (b.price || 0) - (a.price || 0));
      else if (sortBy === "Rating") list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      else if (sortBy === "Most Popular") list.sort((a, b) => (b.totalRatings || 0) - (a.totalRatings || 0));
      
      return list;
    },
    [materials, search, category, sortBy],
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="Vendor Marketplace" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link
              to="/vendor/dashboard"
              className="inline-flex items-center text-sm text-gray-600 hover:text-saffron-600 mb-3"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Vendor Marketplace</h1>
            <p className="text-sm text-gray-600 mt-1">Buy and sell unused items with other vendors</p>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search for items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="sm:w-40">
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
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
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
                        <h3 className="font-semibold hover:text-saffron-600 line-clamp-1 mb-1">
                          {m.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-500 mb-2">
                        {m.supplierId?.businessName || m.supplierId?.name || "Supplier"}
                      </p>
                      {(m.rating || 0) > 0 && (
                        <p className="text-xs flex items-center gap-1 text-gray-500 mb-2">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {m.rating.toFixed(1)} · ({m.totalRatings || 0} reviews)
                        </p>
                      )}
                      <div className="mt-auto">
                        <p className="text-xl font-bold text-gray-900 mb-3">
                          ₹{m.price}
                          <span className="text-sm font-normal text-gray-500">
                            /{m.unit}
                          </span>
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-saffron-500 hover:bg-saffron-600 text-white text-xs"
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
                          >
                            Contact Seller
                          </Button>
                          <Link to={`/material/${m._id}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full text-xs">
                              View Details
                            </Button>
                          </Link>
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
