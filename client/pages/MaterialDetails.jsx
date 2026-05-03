import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus,
  Star,
  MapPin,
  Phone,
  Truck,
  Package,
  Heart,
  Loader2,
  Calendar,
  MessageCircle,
  Check,
  Share2,
} from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { materialsAPI, savedAPI } from "@/lib/api";

export default function MaterialDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, isInCart } = useCart();
  const { toast } = useToast();

  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLoading(true);
    materialsAPI
      .getById(id)
      .then((d) => {
        setMaterial(d.material);
        setQuantity(d.material?.minOrderQuantity || 1);
      })
      .catch((e) =>
        toast({
          title: "Could not load material",
          description: e.message,
          variant: "destructive",
        }),
      )
      .finally(() => setLoading(false));
    savedAPI
      .getAll()
      .then((d) => {
        setSaved((d.items || []).some((i) => (i.material?._id || i.materialId) === id));
      })
      .catch(() => {});
  }, [id, toast]);

  const handleAdd = () => {
    if (!material) return;
    addItem(
      {
        id: material._id,
        materialId: material._id,
        name: material.name,
        price: material.price,
        image: material.image,
        unit: material.unit,
        stock: material.stock,
        supplierId: material.supplierId?._id || material.supplierId,
        supplierName:
          material.supplierId?.businessName ||
          material.supplierId?.name ||
          "Supplier",
      },
      quantity,
    );
  };

  const toggleSave = async () => {
    setSaved((s) => !s);
    try {
      if (saved) await savedAPI.remove(id);
      else await savedAPI.add(id);
    } catch (e) {
      setSaved((s) => !s);
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader />
        <div className="flex justify-center py-32">
          <Loader2 className="w-10 h-10 animate-spin text-saffron-500" />
        </div>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader />
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-bold mb-2">Material not found</h2>
          <Link to="/vendor/dashboard">
            <Button>Back to dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const supplier = material.supplierId || {};
  const inCart = isInCart(material._id);
  const max = material.maxOrderQuantity || material.stock;
  const min = material.minOrderQuantity || 1;

  const openWhatsApp = () => {
    const msg = encodeURIComponent(`Hi, I'm interested in your ${material.name}`);
    window.open(`https://wa.me/${(supplier.phone||"919876543210").replace(/\D/g,"")}?text=${msg}`, "_blank");
  };

  // Mock reviews
  const mockReviews = [
    { name: "Priya Food Corner", verified: true, rating: 5, date: "1/25/2025", text: "Excellent quality rice. My customers love the aroma and taste. Consistent quality every time." },
    { name: "Delhi Biryani House", verified: true, rating: 4, date: "1/16/2025", text: "Good quality rice, perfect for biryani. Delivery was on time." },
    { name: "Sharma Catering", verified: true, rating: 5, date: "1/11/2025", text: "Been ordering for 6 months now. Quality is consistent and price is reasonable." },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/vendor/dashboard" className="text-sm text-gray-600 hover:text-saffron-600">
            ← Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-saffron-500 to-emerald-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">JB</span>
            </div>
            <span className="font-bold text-gray-900">JugaduBazar</span>
          </div>
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <Share2 className="w-4 h-4" /> Share
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="overflow-hidden mb-4">
              <div className="relative aspect-square bg-gradient-to-br from-saffron-100 to-emerald-100">
                {material.image ? (
                  <img
                    src={material.image}
                    alt={material.name}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-32 h-32 text-saffron-300" />
                  </div>
                )}
                <button
                  onClick={toggleSave}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      saved ? "fill-red-500 text-red-500" : "text-gray-600"
                    }`}
                  />
                </button>
              </div>
            </Card>
            {/* Image thumbnails */}
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="flex-1 overflow-hidden cursor-pointer border-2 hover:border-saffron-500 transition-colors">
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-4"
          >
            <div>
              <p className="text-sm text-gray-500 mb-1">{material.category}</p>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {material.name}
              </h1>
              {(material.rating || 0) > 0 && (
                <div className="flex items-center gap-2 text-sm mb-3">
                  <span className="flex items-center gap-1">
                    {[1,2,3,4,5].map(n => (
                      <Star key={n} className={`w-3.5 h-3.5 ${n <= Math.round(material.rating||4) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                    ))}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {material.rating.toFixed(1)}
                  </span>
                  <span className="text-gray-500">
                    ({material.totalRatings || 0} reviews)
                  </span>
                </div>
              )}
              {/* Attribute badges */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {["Premium", "Good Crop", "Aromatic", "Pure", "Long Grain"].map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs bg-gray-50">{tag}</Badge>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-gray-900">₹{material.price}</span>
                <span className="text-lg text-gray-500">/{material.unit}</span>
              </div>
              <div className="flex gap-3 text-sm">
                <Badge className={material.stock > 0 ? "bg-emerald-500" : "bg-red-500"}>
                  {material.stock > 0 ? "Available" : "Out of Stock"}
                </Badge>
                <span className="text-gray-600">Min order: {min} {material.unit}</span>
              </div>
            </div>

            <p className="text-gray-700 mb-4 leading-relaxed">
              {material.description}
            </p>

            {/* Quantity & Action buttons */}
            <div className="mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <Button size="icon" variant="ghost" onClick={() => setQuantity((q) => Math.max(min, q - 1))}>
                    <Minus className="w-4 h-4" />
                  </Button>
                  <input type="number" value={quantity} readOnly className="w-12 text-center border-0 focus:ring-0" />
                  <Button size="icon" variant="ghost" onClick={() => setQuantity((q) => Math.min(max, q + 1))} disabled={quantity >= max}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <span className="text-gray-600 text-sm">{material.unit}</span>
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <Button onClick={handleAdd} disabled={material.stock <= 0} className="flex-1 bg-saffron-500 hover:bg-saffron-600 text-white">
                <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
              </Button>
              <Button onClick={openWhatsApp} variant="outline" className="flex-1 border-green-500 text-green-600 hover:bg-green-50">
                <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
              </Button>
            </div>

            {/* Delivery & Quality assurance */}
            <div className="flex gap-4 text-sm text-gray-600 pb-4 border-b">
              <span className="flex items-center gap-1"><Check className="w-4 h-4 text-emerald-600" /> Delivery 1-2 days</span>
              <span className="flex items-center gap-1"><Check className="w-4 h-4 text-emerald-600" /> Quality Assured</span>
            </div>

            {/* Supplier info */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Supplier Information</h3>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {(supplier.businessName || supplier.name || "S").charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{supplier.businessName || supplier.name}</p>
                  <p className="text-xs text-gray-600">{supplier.businessType || "Supplier"}</p>
                  <p className="text-xs text-gray-500 mt-0.5">📍 {supplier.address || "Location not specified"}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                {supplier.phone && (
                  <Button size="sm" variant="outline" className="text-xs gap-1 flex-1">
                    <Phone className="w-3.5 h-3.5" /> Call
                  </Button>
                )}
                <Button size="sm" variant="outline" className="text-xs gap-1 flex-1" onClick={openWhatsApp}>
                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Specifications */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Specifications</h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Grade</p>
                  <p className="font-semibold text-gray-900">Premium A+</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Origin</p>
                  <p className="font-semibold text-gray-900">Punjab, India</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Grain Length</p>
                  <p className="font-semibold text-gray-900">6.7-7.5mm</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Purity</p>
                  <p className="font-semibold text-gray-900">98.99%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Moisture</p>
                  <p className="font-semibold text-gray-900">12-13%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Shelf Life</p>
                  <p className="font-semibold text-gray-900">12 months</p>
                </div>
                <div className="col-span-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Packaging</p>
                  <p className="font-semibold text-gray-900">PP bags, customizable</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Reviews */}
        {mockReviews.length > 0 && (
          <div className="mt-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
            <p className="text-sm text-gray-500 mb-4">{mockReviews.length} reviews from verified buyers</p>
            <div className="space-y-3">
              {mockReviews.map((review, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{review.name}</span>
                          {review.verified && (
                            <Badge className="bg-emerald-100 text-emerald-700 text-xs">✓ Verified</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="flex gap-0.5">
                            {[1,2,3,4,5].map(n => (
                              <Star key={n} className={`w-3 h-3 ${n <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                            ))}
                          </span>
                          <span className="text-xs text-gray-500">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{review.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
