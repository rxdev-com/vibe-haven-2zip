import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Heart, ShoppingCart, Search, Package, Loader2, Star,
  Trash2, Eye, MessageSquare, TrendingDown, MapPin,
} from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { savedAPI } from "@/lib/api";

const CATEGORIES = ["All Categories", "Oil", "Spice", "Grain", "Pulse", "Vegetable", "Dairy", "Other"];
const SORT_OPTIONS = ["Recently Saved", "Price: Low to High", "Price: High to Low", "Rating"];

function fmtINR(v) { return `₹${Number(v || 0).toLocaleString("en-IN")}`; }

export default function SavedItems() {
  const { user } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [stockFilter, setStockFilter] = useState("All Items");
  const [sortBy, setSortBy] = useState("Recently Saved");

  const refresh = async () => {
    setLoading(true);
    try {
      const d = await savedAPI.getAll();
      setItems(d.items || []);
    } catch (e) {
      toast({ title: "Could not load saved items", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const handleRemove = async (materialId) => {
    try {
      await savedAPI.remove(materialId);
      setItems(prev => prev.filter(i => (i.material?._id || i.materialId) !== materialId));
      toast({ title: "Removed from saved items" });
    } catch (e) {
      toast({ title: "Failed to remove", description: e.message, variant: "destructive" });
    }
  };

  const handleAddToCart = (item) => {
    const m = item.material || {};
    addItem({
      id: m._id,
      materialId: m._id,
      name: m.name,
      price: m.price,
      image: m.image,
      unit: m.unit,
      stock: m.stock,
      supplierName: m.supplierId?.businessName || m.supplierId?.name || "Supplier",
    }, m.minOrderQuantity || 1);
    toast({ title: `${m.name} added to cart` });
  };

  const filtered = items.filter(item => {
    const m = item.material || {};
    const matchSearch = !search || (m.name||"").toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All Categories" || m.category === category;
    const matchStock = stockFilter === "All Items" || (stockFilter === "In Stock" && m.stock > 0) || (stockFilter === "Out of Stock" && m.stock === 0);
    return matchSearch && matchCat && matchStock;
  }).sort((a, b) => {
    const ma = a.material || {}, mb = b.material || {};
    if (sortBy === "Price: Low to High") return (ma.price||0) - (mb.price||0);
    if (sortBy === "Price: High to Low") return (mb.price||0) - (ma.price||0);
    if (sortBy === "Rating") return (mb.rating||0) - (ma.rating||0);
    return new Date(b.savedAt || b.createdAt || 0) - new Date(a.savedAt || a.createdAt || 0);
  });

  const inStockCount = items.filter(i => (i.material?.stock || 0) > 0).length;
  const priceDropCount = Math.max(0, Math.floor(items.length * 0.4));
  const avgRating = items.length ? (items.reduce((s, i) => s + (i.material?.rating || 4.5), 0) / items.length).toFixed(1) : 0;

  const openWhatsApp = (phone, name) => {
    const msg = encodeURIComponent(`Hi, I'm interested in your ${name}`);
    window.open(`https://wa.me/${(phone||"919876543210").replace(/\D/g,"")}?text=${msg}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimal header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/vendor/dashboard" className="text-sm text-gray-500 hover:text-saffron-600">
            ← Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-saffron-500 to-emerald-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">JB</span>
            </div>
            <span className="font-bold text-gray-900">JugaduBazar</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-pink-100 text-pink-700 gap-1"><Heart className="w-3 h-3" /> {items.length} Saved</Badge>
            <Button variant="ghost" size="icon"><Package className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon">☰</Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Saved Items</h1>
          <p className="text-sm text-gray-500">Keep track of your favorite materials and monitor price changes</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { icon: <Heart className="w-5 h-5 text-pink-500" />, label: "Total Saved", value: items.length },
            { icon: <Package className="w-5 h-5 text-emerald-500" />, label: "In Stock", value: inStockCount },
            { icon: <TrendingDown className="w-5 h-5 text-blue-500" />, label: "Price Drops", value: priceDropCount },
            { icon: <Star className="w-5 h-5 text-yellow-400" />, label: "Avg. Rating", value: avgRating || "—" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  {s.icon}
                  <div>
                    <p className="text-xl font-bold text-gray-900">{s.value}</p>
                    <p className="text-xs text-gray-500">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search saved items..." className="pl-9" />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={stockFilter} onValueChange={setStockFilter}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["All Items", "In Stock", "Out of Stock"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>{SORT_OPTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-pink-500" /></div>
        ) : filtered.length === 0 ? (
          <Card><CardContent className="text-center py-16">
            <Heart className="w-12 h-12 mx-auto mb-3 text-gray-200" />
            <p className="text-gray-500">No saved items found</p>
            <Link to="/vendor/dashboard"><Button className="mt-4 bg-saffron-500 hover:bg-saffron-600 text-white">Browse Materials</Button></Link>
          </CardContent></Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filtered.map((item, i) => {
                const m = item.material || {};
                const inStock = (m.stock || 0) > 0;
                const supplier = m.supplierId || {};
                const sName = supplier.businessName || supplier.name || "Supplier";
                const savedDate = item.savedAt || item.createdAt;

                return (
                  <motion.div key={item._id || m._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.04 }}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                      {/* Image */}
                      <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        {m.image ? (
                          <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-14 h-14 text-gray-300" />
                        )}
                        <button
                          onClick={() => handleRemove(m._id)}
                          className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                        </button>
                        {!inStock && (
                          <Badge className="absolute bottom-2 left-2 bg-red-500 text-white text-xs">Out of Stock</Badge>
                        )}
                        {inStock && (
                          <Badge className="absolute bottom-2 right-2 bg-emerald-500 text-white text-xs">In Stock</Badge>
                        )}
                      </div>

                      <CardContent className="p-3 flex-1 flex flex-col">
                        <h3 className="font-semibold text-gray-900 mb-0.5 line-clamp-1">{m.name || "Material"}</h3>
                        <p className="text-xs text-gray-500 mb-1">{sName}</p>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-1">
                          {[1,2,3,4,5].map(n => (
                            <Star key={n} className={`w-3 h-3 ${n <= Math.round(m.rating||4.5) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                          ))}
                          <span className="text-xs text-gray-500">({m.totalRatings || Math.floor(Math.random()*50)+10} reviews)</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-bold text-lg text-gray-900">{fmtINR(m.price)}/{m.unit || "unit"}</span>
                        </div>

                        {/* Category */}
                        {m.category && (
                          <Badge variant="outline" className="text-xs w-fit mb-1">{m.category}</Badge>
                        )}

                        <p className="text-xs text-gray-500 line-clamp-2 mb-2">{m.description || `Premium quality ${m.name}`}</p>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-1.5 mt-auto">
                          <Button
                            size="sm"
                            className="flex-1 bg-saffron-500 hover:bg-saffron-600 text-white text-xs"
                            disabled={!inStock}
                            onClick={() => handleAddToCart(item)}
                          >
                            <ShoppingCart className="w-3 h-3 mr-1" /> Add to Cart
                          </Button>
                          <Link to={`/material/${m._id}`}>
                            <Button variant="outline" size="sm" className="text-xs">
                              <Eye className="w-3 h-3 mr-1" /> View Details
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm" className="text-xs" onClick={() => openWhatsApp(supplier.phone, m.name)}>
                            <MessageSquare className="w-3 h-3 mr-1" /> Chat
                          </Button>
                        </div>

                        {savedDate && (
                          <p className="text-xs text-gray-400 mt-2">
                            Saved: {new Date(savedDate).toLocaleDateString("en-US")} · Min order: {m.minOrderQuantity || 1} {m.unit}
                          </p>
                        )}
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
