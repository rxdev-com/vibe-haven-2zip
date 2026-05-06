import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  Package,
  Heart,
  Loader2,
  Tag,
  Truck,
  TrendingUp,
  Bookmark,
  MapPin,
  Navigation,
  LocateFixed,
  XCircle,
  X,
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
  "Spices",
  "Grains",
  "Pulses",
  "Dairy",
  "Vegetables",
  "Condiments",
  "Sweeteners",
  "Dry Fruits",
  "Ready Mix",
  "Other",
];

const NEARBY_RADIUS_KM = 25;

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function fmtDist(km) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

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
  const [nearbyOnly, setNearbyOnly] = useState(false);
  const [activeOrdersCount, setActiveOrdersCount] = useState(0);
  const [inTransitCount, setInTransitCount] = useState(0);
  const [savedIds, setSavedIds] = useState(new Set());

  // Geolocation state
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("idle"); // idle | asking | granted | denied

  const fetchMaterials = useCallback(
    (coords) => {
      let cancelled = false;
      setLoading(true);
      const params = { limit: 100, isActive: true };
      if (coords) {
        params.lat = coords.lat;
        params.lng = coords.lng;
        params.radius = 200;
      }
      materialsAPI
        .getAll(params)
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
      return () => { cancelled = true; };
    },
    [toast],
  );

  useEffect(() => {
    const cancel = fetchMaterials(null);
    return cancel;
  }, [fetchMaterials]);

  useEffect(() => {
    ordersAPI
      .getAll({ status: "confirmed,processing,shipped" })
      .then((d) => setActiveOrdersCount((d.orders || []).length))
      .catch(() => {});
    ordersAPI
      .getAll({ limit: 100 })
      .then((d) => {
        const inTransit = (d.orders || []).filter((o) =>
          ["shipped", "in_transit", "processing"].includes(o.status),
        );
        setInTransitCount(inTransit.length);
      })
      .catch(() => {});
    savedAPI
      .getAll()
      .then((d) =>
        setSavedIds(
          new Set((d.items || []).map((i) => i.material?._id || i.materialId)),
        ),
      )
      .catch(() => {});
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Your browser does not support geolocation.",
        variant: "destructive",
      });
      return;
    }
    setLocationStatus("asking");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        setLocationStatus("granted");
        setSortBy("nearby");
        fetchMaterials(coords);
        toast({
          title: "📍 Location enabled",
          description: "Showing suppliers nearest to you first.",
        });
      },
      (err) => {
        setLocationStatus("denied");
        const msg =
          err.code === 1
            ? "Location permission was denied. Allow it in browser settings."
            : "Could not get your location. Please try again.";
        toast({ title: "Location unavailable", description: msg, variant: "destructive" });
      },
      { timeout: 10000, maximumAge: 60000 },
    );
  }, [fetchMaterials, toast]);

  const clearLocation = useCallback(() => {
    setUserLocation(null);
    setLocationStatus("idle");
    setNearbyOnly(false);
    if (sortBy === "nearby") setSortBy("rating");
    fetchMaterials(null);
  }, [fetchMaterials, sortBy]);

  const filtered = useMemo(() => {
    let list = materials.map((m) => {
      let distKm = null;
      if (userLocation && m.supplier?.location?.coordinates?.length === 2) {
        const [sLng, sLat] = m.supplier.location.coordinates;
        if (sLng !== 0 || sLat !== 0) {
          distKm = haversineKm(userLocation.lat, userLocation.lng, sLat, sLng);
        }
      }
      return { ...m, _distKm: distKm };
    });

    // Search — name, description, tags, supplier, category
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          (m.description || "").toLowerCase().includes(q) ||
          (m.tags || []).some((tag) => tag.toLowerCase().includes(q)) ||
          (m.supplier?.businessName || "").toLowerCase().includes(q) ||
          (m.category || "").toLowerCase().includes(q),
      );
    }

    // Category
    if (category !== "All") {
      list = list.filter((m) => m.category === category);
    }

    // Nearby only
    if (nearbyOnly && userLocation) {
      list = list.filter((m) => m._distKm !== null && m._distKm <= NEARBY_RADIUS_KM);
    }

    // Sort
    switch (sortBy) {
      case "nearby":
        list.sort((a, b) => {
          if (a._distKm === null && b._distKm === null) return 0;
          if (a._distKm === null) return 1;
          if (b._distKm === null) return -1;
          return a._distKm - b._distKm;
        });
        break;
      case "price-low":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        list.sort((a, b) => b.price - a.price);
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return list;
  }, [materials, search, category, sortBy, nearbyOnly, userLocation]);

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
        supplierName: m.supplier?.businessName || m.supplier?.name || "Supplier",
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
      toast({ title: "Action failed", description: e.message, variant: "destructive" });
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
      label: "In Transit",
      value: inTransitCount,
      icon: Truck,
      color: "text-purple-500",
      to: "/vendor/in-transit",
    },
    {
      label: "Saved Items",
      value: savedIds.size,
      icon: Bookmark,
      color: "text-blue-500",
      to: "/vendor/saved-items",
    },
    {
      label: "Avg Rating",
      value: (user?.rating || 0).toFixed(1),
      icon: Star,
      color: "text-yellow-500",
      to: "/vendor/store-reviews",
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
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name?.split(" ")[0] || "Vendor"}!
          </h1>
          <p className="text-sm text-gray-600">
            Find the best raw materials for your street-food business
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
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
          <p className="text-sm text-gray-600 mb-5">
            Buy and sell unused items with other vendors
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
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
                  <p className="text-sm text-gray-600 mb-4">
                    Find unused items from other vendors at great prices
                  </p>
                  <Button variant="outline" size="sm" className="w-full justify-center">
                    View All
                  </Button>
                </CardContent>
              </Card>
            </Link>
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
                  <p className="text-sm text-gray-600 mb-4">
                    List unused inventory to other vendors quickly
                  </p>
                  <Button variant="outline" size="sm" className="w-full justify-center">
                    List Items
                  </Button>
                </CardContent>
              </Card>
            </Link>
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
                  <p className="text-sm text-gray-600 mb-4">
                    Manage your listed items and view enquiries
                  </p>
                  <Button variant="outline" size="sm" className="w-full justify-center">
                    Manage
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </motion.div>

        {/* Raw Materials Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Raw Materials</h3>
              <p className="text-sm text-gray-500 mt-0.5">
                {filtered.length} item{filtered.length !== 1 ? "s" : ""} available
                {userLocation && " · sorted by distance"}
              </p>
            </div>
          </div>

          {/* Location Banner */}
          <AnimatePresence>
            {locationStatus === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-4"
              >
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-3 flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
                    <p className="text-sm text-blue-800 flex-1">
                      Allow location to see nearby suppliers first and filter by distance.
                    </p>
                    <Button
                      size="sm"
                      onClick={requestLocation}
                      className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
                    >
                      <Navigation className="w-3.5 h-3.5 mr-1.5" />
                      Enable Location
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {locationStatus === "asking" && (
              <motion.div
                key="asking"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-4"
              >
                <Card className="border-amber-200 bg-amber-50">
                  <CardContent className="p-3 flex items-center gap-3">
                    <Loader2 className="w-5 h-5 text-amber-600 animate-spin shrink-0" />
                    <p className="text-sm text-amber-800">
                      Waiting for location permission… Please allow access in your browser.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {locationStatus === "granted" && userLocation && (
              <motion.div
                key="granted"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-4"
              >
                <Card className="border-emerald-200 bg-emerald-50">
                  <CardContent className="p-3 flex items-center gap-3">
                    <LocateFixed className="w-5 h-5 text-emerald-600 shrink-0" />
                    <p className="text-sm text-emerald-800 flex-1">
                      <span className="font-medium">Location active</span> — showing suppliers
                      nearest to you first.
                    </p>
                    <button
                      onClick={clearLocation}
                      className="text-emerald-700 hover:text-emerald-900 text-xs underline underline-offset-2 shrink-0"
                    >
                      Turn off
                    </button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {locationStatus === "denied" && (
              <motion.div
                key="denied"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-4"
              >
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-3 flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                    <p className="text-sm text-red-700 flex-1">
                      Location access was denied. Enable it in browser settings to see nearby
                      suppliers.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={requestLocation}
                      className="border-red-300 text-red-700 hover:bg-red-100 shrink-0"
                    >
                      Retry
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search + Filters */}
          <Card className="mb-6">
            <CardContent className="p-4 space-y-3">
              {/* Row 1: Search + Category + Sort */}
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search materials, suppliers, tags…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="md:w-44">
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
                  <SelectTrigger className="md:w-44">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nearby" disabled={!userLocation}>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-500" />
                        Nearby First{!userLocation && " (enable location)"}
                      </span>
                    </SelectItem>
                    <SelectItem value="rating">Top Rated</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name A–Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Row 2: Active filter chips */}
              <div className="flex flex-wrap gap-2 items-center">
                {userLocation && (
                  <button
                    onClick={() => setNearbyOnly((v) => !v)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      nearbyOnly
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-blue-700 border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    <MapPin className="w-3 h-3" />
                    Within {NEARBY_RADIUS_KM} km only
                    {nearbyOnly && <X className="w-3 h-3 ml-0.5" />}
                  </button>
                )}
                {!userLocation && locationStatus !== "asking" && (
                  <button
                    onClick={requestLocation}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-blue-300 bg-white text-blue-700 hover:bg-blue-50 transition-colors"
                  >
                    <Navigation className="w-3 h-3" />
                    Enable nearby filter
                  </button>
                )}
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 transition-colors"
                  >
                    "{search}" <X className="w-3 h-3" />
                  </button>
                )}
                {category !== "All" && (
                  <button
                    onClick={() => setCategory("All")}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-saffron-100 text-saffron-700 border border-saffron-200 hover:bg-saffron-200 transition-colors"
                  >
                    {category} <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Materials Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-saffron-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="font-medium text-gray-700 mb-1">No materials found</p>
              <p className="text-sm">
                {nearbyOnly
                  ? `No suppliers within ${NEARBY_RADIUS_KM} km. Try turning off the nearby filter.`
                  : "Try adjusting your search or filters."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((m, i) => {
              const inCart = isInCart(m._id);
              const isSaved = savedIds.has(m._id);
              const dist = m._distKm;
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
                        {/* Stock badge */}
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
                        {/* Distance badge */}
                        {dist !== null && dist !== undefined && (
                          <span className="absolute top-2 right-10 inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full shadow">
                            <MapPin className="w-3 h-3" />
                            {fmtDist(dist)}
                          </span>
                        )}
                        {/* Save button */}
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
                              isSaved ? "fill-red-500 text-red-500" : "text-gray-600"
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
                        <Badge variant="outline" className="ml-2 flex-shrink-0 text-xs">
                          {m.category}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                        {m.description}
                      </p>

                      <div className="text-xs text-gray-500 mb-1 flex items-center gap-2 flex-wrap">
                        <Truck className="w-3 h-3 shrink-0" />
                        <span className="truncate">
                          {m.supplier?.businessName || m.supplier?.name || "Verified Supplier"}
                        </span>
                        {(m.rating || 0) > 0 && (
                          <span className="flex items-center gap-0.5 ml-auto">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {(m.rating || 0).toFixed(1)}
                          </span>
                        )}
                      </div>

                      {dist !== null && dist !== undefined && (
                        <p className="text-xs text-blue-600 flex items-center gap-1 mb-1">
                          <MapPin className="w-3 h-3" />
                          {fmtDist(dist)} away
                          {m.supplier?.estimatedDeliveryTime && (
                            <span className="text-gray-400">
                              · {m.supplier.estimatedDeliveryTime}
                            </span>
                          )}
                        </p>
                      )}

                      <div className="mt-auto flex items-end justify-between pt-2">
                        <div>
                          <p className="text-2xl font-bold text-saffron-600">
                            ₹{m.price}
                            <span className="text-sm font-normal text-gray-500">
                              /{m.unit}
                            </span>
                          </p>
                          <p className="text-xs text-gray-400">
                            Min: {m.minOrderQuantity || 1} {m.unit}
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
