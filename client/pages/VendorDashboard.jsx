import React, { useState, useEffect, useMemo } from "react";
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
  Search,
  Star,
  ShoppingCart,
  Plus,
  Minus,
  Package,
  Heart,
  Loader2,
  Tag,
  Truck,
  TrendingUp,
  Bookmark,
} from "lucide-react";

import AppHeader from "@/components/AppHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { materialsAPI, ordersAPI, savedAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = [
  "All",
  "Oil",
  "Spice",
  "Grain",
  "Pulse",
  "Vegetable",
  "Dairy",
  "Other",
];

export default function VendorDashboard() {
  const { user } = useAuth();
  const { addItem, isInCart, totalItems } = useCart();
  const { t } = useLanguage();
  const { toast } = useToast();

  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("rating");
  const [activeOrdersCount, setActiveOrdersCount] = useState(0);
  const [savedIds, setSavedIds] = useState(new Set());

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    materialsAPI
      .getAll({ limit: 50, isActive: true })
      .then((data) => {
        if (!cancelled) setMaterials(data.materials || []);
      })
      .catch((e) =>
        toast({
          title: "Could not load materials",
          description: e.message,
          variant: "destructive",
        }),
      )
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [toast]);

  useEffect(() => {
    ordersAPI
      .getAll({ status: "confirmed,processing,shipped" })
      .then((d) => setActiveOrdersCount((d.orders || []).length))
      .catch(() => {});
    savedAPI
      .getAll()
      .then((d) =>
        setSavedIds(new Set((d.items || []).map((i) => i.material?._id || i.materialId))),
      )
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    let list = materials.filter((m) => {
      const matchSearch =
        !search ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        (m.description || "").toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || m.category === category;
      return matchSearch && matchCat;
    });
    list.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
    return list;
  }, [materials, search, category, sortBy]);

  const handleAddToCart = (m) => {
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
          m.supplier?.businessName || m.supplier?.name || "Supplier",
      },
      m.minOrderQuantity || 1,
    );
  };

  const toggleSave = async (materialId) => {
    const isSaved = savedIds.has(materialId);
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (isSaved) next.delete(materialId);
      else next.add(materialId);
      return next;
    });
    try {
      if (isSaved) {
        await savedAPI.remove(materialId);
        toast({ title: "Removed from saved" });
      } else {
        await savedAPI.add(materialId);
        toast({ title: "Saved for later", description: "View in Saved Items." });
      }
    } catch (e) {
      toast({
        title: "Action failed",
        description: e.message,
        variant: "destructive",
      });
    }
  };

  const stats = [
    {
      label: "Active Orders",
      value: activeOrdersCount,
      icon: Package,
      color: "text-saffron-500",
      to: "/vendor/active-orders",
    },
    {
      label: "Items in Cart",
      value: totalItems,
      icon: ShoppingCart,
      color: "text-emerald-500",
      to: "/cart",
    },
    {
      label: "Saved Items",
      value: savedIds.size,
      icon: Bookmark,
      color: "text-blue-500",
      to: "/vendor/saved-items",
    },
    {
      label: "Available Materials",
      value: materials.length,
      icon: TrendingUp,
      color: "text-purple-500",
      to: "/vendor/dashboard",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="Vendor Dashboard" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name?.split(" ")[0] || "Vendor"}!
          </h1>
          <p className="text-sm text-gray-600">
            Find Suppliers - Find the best raw materials for your street-food business
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={s.to}>
                <Card className="hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer h-full">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <s.icon className={`w-6 h-6 ${s.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm text-gray-500">{s.label}</p>
                        <p className="text-lg sm:text-2xl font-bold text-gray-900">
                          {s.value}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Vendor Marketplace Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-3">Vendor Marketplace</h2>
          <p className="text-sm text-gray-600 mb-5">Buy and sell unused items with other vendors</p>
          
          <div className="grid sm:grid-cols-3 gap-4">
            {/* Browse Items */}
            <Link to="/vendor/marketplace">
              <Card className="hover:shadow-lg transition-all cursor-pointer h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <span className="text-lg">🛍️</span>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700">Browse</Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Browse Items</h3>
                  <p className="text-sm text-gray-600 mb-4">Find unused items from other vendors at great prices</p>
                  <Button variant="outline" size="sm" className="w-full justify-center">
                    View All
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Sell Your Items */}
            <Link to="/vendor/sell-items">
              <Card className="hover:shadow-lg transition-all cursor-pointer h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <span className="text-lg">💚</span>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Sell</Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Sell Your Items</h3>
                  <p className="text-sm text-gray-600 mb-4">List unused inventory to other vendors quickly</p>
                  <Button variant="outline" size="sm" className="w-full justify-center">
                    List Items
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* My Listings */}
            <Link to="/vendor/my-listings">
              <Card className="hover:shadow-lg transition-all cursor-pointer h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                      <span className="text-lg">📋</span>
                    </div>
                    <Badge className="bg-orange-100 text-orange-700">Manage</Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">My Listings</h3>
                  <p className="text-sm text-gray-600 mb-4">Manage your listed items and view enquiries</p>
                  <Button variant="outline" size="sm" className="w-full justify-center">
                    Manage
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </motion.div>

        {/* Database Status */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              📊 Database Status
            </h3>
            <Button variant="ghost" size="sm" className="text-xs">Refresh</Button>
          </div>

          {/* Status Alerts */}
          <div className="space-y-3 mb-4">
            {/* Alert 1 */}
            <Card className="border-l-4 border-l-green-500 bg-green-50">
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div className="text-lg mt-0.5">✅</div>
                  <div className="flex-1">
                    <p className="font-semibold text-green-900 text-sm">JugaduBazar API is running in development mode</p>
                    <p className="text-xs text-green-700 mt-0.5">Last checked: 6/25/2025, 5:30 AM</p>
                    <div className="flex gap-2 mt-2">
                      <Badge className="bg-green-600">Database Connected</Badge>
                      <Badge className="bg-emerald-600">WebSocket Active</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alert 2 */}
            <Card className="border-l-4 border-l-yellow-500 bg-yellow-50">
              <CardContent className="p-3">
                <p className="text-xs text-yellow-700 flex items-center gap-2">
                  ⚠️ Location access denied. Please enable location services. Measuring all suppliers with approximate distances.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search for raw materials..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="md:w-48">
                    <SelectValue placeholder="All Categories" />
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
                  <SelectTrigger className="md:w-48">
                    <SelectValue placeholder="Filtered" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Top Rated</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-saffron-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No materials found. Try changing your filters.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((m, i) => {
              const inCart = isInCart(m._id);
              const isSaved = savedIds.has(m._id);
              return (
                <motion.div
                  key={m._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i, 10) * 0.04 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all h-full flex flex-col">
                    <Link to={`/material/${m._id}`} className="block">
                      <div className="relative h-48 bg-gradient-to-br from-saffron-100 to-emerald-100 overflow-hidden">
                        {m.image ? (
                          <img
                            src={m.image}
                            alt={m.name}
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-16 h-16 text-saffron-300" />
                          </div>
                        )}
                        {m.stock <= 0 && (
                          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                            Out of Stock
                          </Badge>
                        )}
                        {m.stock > 0 && m.stock < 10 && (
                          <Badge className="absolute top-2 left-2 bg-orange-500 text-white">
                            Low Stock
                          </Badge>
                        )}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleSave(m._id);
                          }}
                          className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                          aria-label="Save item"
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              isSaved
                                ? "fill-red-500 text-red-500"
                                : "text-gray-600"
                            }`}
                          />
                        </button>
                      </div>
                    </Link>

                    <CardContent className="p-4 flex flex-col flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <Link to={`/material/${m._id}`}>
                          <h3 className="font-semibold text-gray-900 hover:text-saffron-600 transition-colors line-clamp-1">
                            {m.name}
                          </h3>
                        </Link>
                        <Badge variant="outline" className="ml-2 flex-shrink-0">
                          {m.category}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                        {m.description}
                      </p>

                      <div className="text-xs text-gray-500 mb-3 flex items-center gap-2 flex-wrap">
                        <Truck className="w-3 h-3" />
                        <span className="truncate">
                          {m.supplier?.businessName ||
                            m.supplier?.name ||
                            "Verified Supplier"}
                        </span>
                        {(m.rating || 0) > 0 && (
                          <span className="flex items-center gap-0.5 ml-auto">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {(m.rating || 0).toFixed(1)}
                          </span>
                        )}
                      </div>

                      <div className="mt-auto flex items-end justify-between">
                        <div>
                          <p className="text-2xl font-bold text-saffron-600">
                            ₹{m.price}
                            <span className="text-sm font-normal text-gray-500">
                              /{m.unit}
                            </span>
                          </p>
                          <p className="text-xs text-gray-400">
                            Min order: {m.minOrderQuantity || 1} {m.unit}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          disabled={m.stock <= 0}
                          onClick={() => handleAddToCart(m)}
                          className={
                            inCart
                              ? "bg-emerald-600 hover:bg-emerald-700"
                              : "bg-gradient-to-r from-saffron-500 to-orange-500 hover:from-saffron-600 hover:to-orange-600"
                          }
                        >
                          {inCart ? (
                            <>
                              <Plus className="w-4 h-4 mr-1" /> Add more
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4 mr-1" /> Add
                            </>
                          )}
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
