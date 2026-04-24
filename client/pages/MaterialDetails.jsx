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

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/vendor/dashboard"
          className="inline-flex items-center text-sm text-gray-600 hover:text-saffron-600 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to marketplace
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="overflow-hidden">
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div>
              <Badge className="mb-2">{material.category}</Badge>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {material.name}
              </h1>
              {(material.rating || 0) > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">
                      {material.rating.toFixed(1)}
                    </span>
                  </span>
                  <span className="text-gray-500">
                    ({material.totalRatings || 0} reviews)
                  </span>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-saffron-50 to-orange-50 p-4 rounded-lg">
              <p className="text-4xl font-bold text-saffron-600">
                ₹{material.price}
                <span className="text-base font-normal text-gray-600">
                  /{material.unit}
                </span>
              </p>
              <div className="flex items-center gap-3 mt-2 text-sm">
                <Badge
                  className={
                    material.stock <= 0
                      ? "bg-red-500"
                      : material.stock < 10
                      ? "bg-orange-500"
                      : "bg-emerald-500"
                  }
                >
                  {material.stock <= 0
                    ? "Out of Stock"
                    : `${material.stock} ${material.unit} available`}
                </Badge>
                <span className="text-gray-500">
                  Min order: {min} {material.unit}
                </span>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed">
              {material.description}
            </p>

            <div className="grid grid-cols-2 gap-3 text-sm">
              {material.origin && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-saffron-500" />
                  Origin: {material.origin}
                </div>
              )}
              {material.shelfLife && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4 text-saffron-500" />
                  Shelf life: {material.shelfLife}
                </div>
              )}
            </div>

            <Card className="bg-emerald-50 border-emerald-200">
              <CardContent className="p-4">
                <p className="text-xs text-emerald-700 uppercase tracking-wide mb-2">
                  Sold by
                </p>
                <p className="font-semibold">
                  {supplier.businessName || supplier.name}
                </p>
                {supplier.phone && (
                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <Phone className="w-3 h-3" /> {supplier.phone}
                  </p>
                )}
                {supplier.address && (
                  <p className="text-sm text-gray-600 flex items-start gap-1 mt-1">
                    <MapPin className="w-3 h-3 mt-1 flex-shrink-0" />{" "}
                    {supplier.address}
                  </p>
                )}
                {supplier.rating > 0 && (
                  <p className="text-sm flex items-center gap-1 mt-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {supplier.rating.toFixed(1)} supplier rating
                  </p>
                )}
              </CardContent>
            </Card>

            <div className="flex items-center gap-3">
              <div className="flex items-center border rounded-lg">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setQuantity((q) => Math.max(min, q - 1))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setQuantity((q) => Math.min(max, q + 1))}
                  disabled={quantity >= max}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <Button
                onClick={handleAdd}
                disabled={material.stock <= 0}
                className="flex-1 bg-gradient-to-r from-saffron-500 to-orange-500 hover:from-saffron-600 hover:to-orange-600"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {inCart ? "Add more" : "Add to Cart"} · ₹{material.price * quantity}
              </Button>
              <Button
                onClick={() => {
                  handleAdd();
                  setTimeout(() => navigate("/cart"), 200);
                }}
                disabled={material.stock <= 0}
                variant="outline"
              >
                <Truck className="w-4 h-4 mr-2" />
                Buy Now
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
