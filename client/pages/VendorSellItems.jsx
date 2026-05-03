import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNotifications } from "@/contexts/NotificationContext";
import AppHeader from "@/components/AppHeader";
import {
  ArrowLeft,
  Plus,
  Camera,
  Package,
  IndianRupee,
  AlertCircle,
} from "lucide-react";

const categories = [
  { value: "spices", label: "Spices & Seasonings" },
  { value: "oils", label: "Oils & Fats" },
  { value: "grains", label: "Grains & Cereals" },
  { value: "equipment", label: "Kitchen Equipment" },
  { value: "packaging", label: "Packaging Materials" },
  { value: "utensils", label: "Utensils & Tools" },
  { value: "other", label: "Other Items" },
];

const conditions = [
  { value: "new", label: "Brand New", color: "bg-green-100 text-green-700" },
  { value: "like-new", label: "Like New", color: "bg-emerald-100 text-emerald-700" },
  { value: "excellent", label: "Excellent", color: "bg-blue-100 text-blue-700" },
  { value: "good", label: "Good", color: "bg-yellow-100 text-yellow-700" },
  { value: "fair", label: "Fair", color: "bg-orange-100 text-orange-700" },
];

const STORAGE_KEY = "vendor_resale_listings";

export default function VendorSellItems() {
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    originalPrice: "",
    condition: "",
    description: "",
    urgency: "normal",
    tags: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event) => {
    const files = event.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImages((prev) => [...prev, e.target.result].slice(0, 5));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const calculateSavings = () => {
    if (formData.price && formData.originalPrice) {
      const price = parseFloat(formData.price);
      const original = parseFloat(formData.originalPrice);
      if (original > price) {
        const savings = (((original - price) / original) * 100).toFixed(0);
        return `${savings}% off`;
      }
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.price || !formData.condition) {
      addNotification({
        title: "Missing Information",
        message: "Please fill in all required fields (title, category, price, condition)",
        type: "error",
        icon: "warning",
      });
      return;
    }

    setSubmitting(true);
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const newListing = {
        id: `UL${Date.now()}`,
        title: formData.title,
        category: formData.category,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        condition: formData.condition,
        description: formData.description,
        urgency: formData.urgency,
        tags: formData.tags
          ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
        images,
        status: "active",
        views: 0,
        inquiries: 0,
        postedDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify([newListing, ...existing]));

      addNotification({
        title: "Item Listed Successfully",
        message: `"${formData.title}" has been posted to the vendor marketplace`,
        type: "success",
        icon: "success",
      });

      setFormData({
        title: "",
        category: "",
        price: "",
        originalPrice: "",
        condition: "",
        description: "",
        urgency: "normal",
        tags: "",
      });
      setImages([]);

      setTimeout(() => navigate("/vendor/my-listings"), 600);
    } catch (err) {
      addNotification({
        title: "Failed to save listing",
        message: err.message || "Could not save your listing locally",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="List Items" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/vendor/dashboard">
            <Button variant="outline" size="sm" className="mb-3">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">List Your Items</h1>
          <p className="text-gray-600 text-sm mt-1">Sell unused items to other vendors in our marketplace</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main form */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Package className="w-5 h-5 mr-2" /> Basic Information
                    </CardTitle>
                    <CardDescription>Provide the essential details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Item Title *
                      </label>
                      <Input
                        placeholder="e.g. Commercial Rice Cooker - Like New"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category *
                        </label>
                        <Select
                          value={formData.category}
                          onValueChange={(v) => handleInputChange("category", v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((c) => (
                              <SelectItem key={c.value} value={c.value}>
                                {c.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Condition *
                        </label>
                        <Select
                          value={formData.condition}
                          onValueChange={(v) => handleInputChange("condition", v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                          <SelectContent>
                            {conditions.map((c) => (
                              <SelectItem key={c.value} value={c.value}>
                                {c.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <Textarea
                        placeholder="Describe your item, its history, why you're selling it..."
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <IndianRupee className="w-5 h-5 mr-2" /> Pricing
                    </CardTitle>
                    <CardDescription>Set a competitive price</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Selling Price (₹) *
                        </label>
                        <Input
                          type="number"
                          placeholder="5000"
                          value={formData.price}
                          onChange={(e) => handleInputChange("price", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Original Price (₹)
                        </label>
                        <Input
                          type="number"
                          placeholder="8000"
                          value={formData.originalPrice}
                          onChange={(e) => handleInputChange("originalPrice", e.target.value)}
                        />
                      </div>
                    </div>
                    {calculateSavings() && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-800 text-sm font-medium">
                          Great deal — {calculateSavings()}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Camera className="w-5 h-5 mr-2" /> Photos
                    </CardTitle>
                    <CardDescription>Up to 5 photos showcasing your item</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                            onClick={() => removeImage(index)}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                      {images.length < 5 && (
                        <label className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-saffron-400 transition-colors">
                          <div className="text-center">
                            <Camera className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                            <span className="text-xs text-gray-500">Add Photo</span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            multiple
                          />
                        </label>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Live Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {images.length > 0 ? (
                          <img
                            src={images[0]}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-12 h-12 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {formData.title || "Item title"}
                        </h3>
                        <div className="flex items-center flex-wrap gap-2 mt-1">
                          {formData.condition && (
                            <Badge
                              className={
                                conditions.find((c) => c.value === formData.condition)?.color
                              }
                            >
                              {conditions.find((c) => c.value === formData.condition)?.label}
                            </Badge>
                          )}
                          {formData.category && (
                            <Badge variant="outline" className="text-xs">
                              {categories.find((c) => c.value === formData.category)?.label}
                            </Badge>
                          )}
                        </div>
                      </div>
                      {formData.price && (
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-gray-900">
                            ₹{parseInt(formData.price || 0).toLocaleString()}
                          </span>
                          {calculateSavings() && (
                            <Badge className="bg-green-100 text-green-700">
                              {calculateSavings()}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Additional Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Urgency
                      </label>
                      <Select
                        value={formData.urgency}
                        onValueChange={(v) => handleInputChange("urgency", v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal Sale</SelectItem>
                          <SelectItem value="urgent">Urgent Sale</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags (comma separated)
                      </label>
                      <Input
                        placeholder="e.g. commercial, rice, cooker"
                        value={formData.tags}
                        onChange={(e) => handleInputChange("tags", e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {submitting ? "Posting..." : "List Item for Sale"}
                    </Button>
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start">
                        <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                        <div className="text-sm text-blue-800">
                          <p className="font-medium">Listing guidelines:</p>
                          <ul className="mt-1 text-xs space-y-1">
                            <li>• Be honest about condition</li>
                            <li>• Include clear photos</li>
                            <li>• Respond promptly to inquiries</li>
                            <li>• Price competitively</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
