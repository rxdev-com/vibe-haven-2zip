import React, { useEffect, useState, useMemo, useCallback } from "react";
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
  ArrowLeft,
  Search,
  ShoppingBag,
  Loader2,
  Package,
  Star,
  MapPin,
  Navigation,
  XCircle,
  LocateFixed,
  Filter,
  X,
} from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { materialsAPI } from "@/lib/api";

const CATEGORIES = [
  "All Categories",
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

const SORT_OPTIONS = [
  "Nearby First",
  "Most Recent",
  "Price: Low to High",
  "Price: High to Low",
  "Rating",
  "Most Popular",
];

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

const NEARBY_RADIUS_KM = 25;

export default function VendorMarketplace() {
  const { toast } = useToast();
  const { addItem, isInCart } = useCart();

  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("Most Recent");
  const [nearbyOnly, setNearbyOnly] = useState(false);

  // Geolocation state
  const [userLocation, setUserLocation] = useState(null); // { lat, lng }
  const [locationStatus, setLocationStatus] = useState("idle"); // idle | asking | granted | denied

  const fetchMaterials = useCallback(
    (coords) => {
      setLoading(true);
      const params = { limit: 100, isActive: true };
      if (coords) {
        params.lat = coords.lat;
        params.lng = coords.lng;
        params.radius = 200; // fetch wide, sort/filter client-side
      }
      materialsAPI
        .getAll(params)
        .then((d) => setMaterials(d.materials || []))
        .catch((e) =>
          toast({
            title: "Could not load materials",
            description: e.message,
            variant: "destructive",
          }),
        )
        .finally(() => setLoading(false));
    },
    [toast],
  );

  useEffect(() => {
    fetchMaterials(null);
  }, [fetchMaterials]);

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
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUserLocation(coords);
        setLocationStatus("granted");
        setSortBy("Nearby First");
        fetchMaterials(coords);
        toast({
          title: "📍 Location enabled",
          description: "Showing suppliers nearest to you first.",
        });
      },
      (err) => {
        setLocationStatus("denied");
        let msg =
          err.code === 1
            ? "Location permission was denied. You can allow it from browser settings."
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
    if (sortBy === "Nearby First") setSortBy("Most Recent");
    fetchMaterials(null);
  }, [fetchMaterials, sortBy]);

  const filtered = useMemo(() => {
    let list = materials.map((m) => {
      let distKm = null;
      if (
        userLocation &&
        m.supplier?.location?.coordinates?.length === 2
      ) {
        const [sLng, sLat] = m.supplier.location.coordinates;
        if (sLng !== 0 || sLat !== 0) {
          distKm = haversineKm(
            userLocation.lat,
            userLocation.lng,
            sLat,
            sLng,
          );
        }
      }
      return { ...m, _distKm: distKm };
    });

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          (m.description || "").toLowerCase().includes(q) ||
          (m.tags || []).some((t) => t.toLowerCase().includes(q)) ||
          (m.supplier?.businessName || "").toLowerCase().includes(q) ||
          (m.category || "").toLowerCase().includes(q),
      );
    }

    // Category filter
    if (category !== "All Categories") {
      list = list.filter((m) => m.category === category);
    }

    // Nearby only toggle
    if (nearbyOnly && userLocation) {
      list = list.filter(
        (m) => m._distKm !== null && m._distKm <= NEARBY_RADIUS_KM,
      );
    }

    // Sort
    if (sortBy === "Nearby First") {
      list.sort((a, b) => {
        if (a._distKm === null && b._distKm === null) return 0;
        if (a._distKm === null) return 1;
        if (b._distKm === null) return -1;
        return a._distKm - b._distKm;
      });
    } else if (sortBy === "Price: Low to High") {
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "Price: High to Low") {
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === "Rating") {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "Most Popular") {
      list.sort((a, b) => (b.totalRatings || 0) - (a.totalRatings || 0));
    }

    return list;
  }, [materials, search, category, sortBy, nearbyOnly, userLocation]);

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
            <p className="text-sm text-gray-600 mt-1">
              {filtered.length} item{filtered.length !== 1 ? "s" : ""} available
              {userLocation && " · sorted by distance"}
            </p>
          </div>
        </div>

        {/* Location Banner */}
        <AnimatePresence>
          {locationStatus === "idle" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4"
            >
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-3 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
                  <p className="text-sm text-blue-800 flex-1">
                    Allow location access to see nearby suppliers first and discover what's
                    closest to you.
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
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
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
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
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
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4"
            >
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-3 flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <p className="text-sm text-red-700 flex-1">
                    Location access was denied. Enable it in your browser settings to see
                    nearby suppliers.
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

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4 space-y-3">
            {/* Row 1: Search + Category + Sort */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search items, suppliers, tags…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="sm:w-44">
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
                <SelectTrigger className="sm:w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s} disabled={s === "Nearby First" && !userLocation}>
                      {s === "Nearby First" && (
                        <MapPin className="w-3.5 h-3.5 inline mr-1 -mt-0.5 text-blue-500" />
                      )}
                      {s}
                      {s === "Nearby First" && !userLocation && " (enable location)"}
                    </SelectItem>
                  ))}
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
                  <Filter className="w-3 h-3" />"{search}"
                  <X className="w-3 h-3" />
                </button>
              )}
              {category !== "All Categories" && (
                <button
                  onClick={() => setCategory("All Categories")}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-saffron-100 text-saffron-700 border border-saffron-200 hover:bg-saffron-200 transition-colors"
                >
                  {category}
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-saffron-500" />
            <p className="text-sm text-gray-500">Loading materials…</p>
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium text-gray-700 mb-1">No items found</p>
              <p className="text-sm">
                {nearbyOnly
                  ? `No suppliers found within ${NEARBY_RADIUS_KM} km. Try turning off the nearby filter.`
                  : "Try adjusting your search or filters."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((m, i) => {
              const inCart = isInCart(m._id);
              const dist = m._distKm;
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
                        <Badge className="absolute top-2 left-2 text-xs">{m.category}</Badge>
                        {dist !== null && dist !== undefined && (
                          <span className="absolute top-2 right-2 inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full shadow">
                            <MapPin className="w-3 h-3" />
                            {fmtDist(dist)}
                          </span>
                        )}
                      </div>
                    </Link>
                    <CardContent className="p-4 flex flex-col flex-1">
                      <Link to={`/material/${m._id}`}>
                        <h3 className="font-semibold hover:text-saffron-600 line-clamp-1 mb-1">
                          {m.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-500 mb-1">
                        {m.supplier?.businessName || m.supplier?.name || "Supplier"}
                      </p>
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
                      {(m.rating || 0) > 0 && (
                        <p className="text-xs flex items-center gap-1 text-gray-500 mb-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {m.rating.toFixed(1)} · ({m.totalRatings || 0} reviews)
                        </p>
                      )}
                      <div className="mt-auto pt-2">
                        <p className="text-xl font-bold text-gray-900 mb-3">
                          ₹{m.price}
                          <span className="text-sm font-normal text-gray-500">/{m.unit}</span>
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
                                    m.supplier?.businessName || m.supplier?.name,
                                },
                                m.minOrderQuantity || 1,
                              )
                            }
                          >
                            <ShoppingBag className="w-3.5 h-3.5 mr-1" />
                            {m.stock <= 0 ? "Out of Stock" : "Add to Cart"}
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
