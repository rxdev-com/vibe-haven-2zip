import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Edit, MapPin, Star, Package, Clock, Camera, Loader2, Save,
  Phone, Bell, LogOut, CheckCircle, Trash2, Plus, TrendingUp,
  Users, Upload, ArrowLeft, X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ordersAPI } from "@/lib/api";

const TABS = ["Business Info", "Images", "Delivery Settings", "Sales History"];
const BIZ_TYPES = ["Wholesale Distributor", "Direct Manufacturer", "Retailer", "Farmer", "Cooperative"];
const DELIVERY_TIMES = ["1-2 hours", "2-4 hours", "4-6 hours", "Same Day", "Next Day"];

function fmtINR(v) { return `₹${Number(v || 0).toLocaleString("en-IN")}`; }
function fmtDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function groupByMonth(orders) {
  const map = {};
  orders.forEach(o => {
    const d = new Date(o.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleString("en-IN", { month: "long", year: "numeric" });
    if (!map[key]) map[key] = { key, label, revenue: 0, orders: 0 };
    map[key].revenue += o.totalAmount || 0;
    map[key].orders++;
  });
  return Object.values(map).sort((a, b) => b.key.localeCompare(a.key)).slice(0, 6);
}

export default function SupplierProfile() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef(null);

  const [tab, setTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [acceptingOrders, setAcceptingOrders] = useState(true);
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [newArea, setNewArea] = useState("");
  const [businessImages, setBusinessImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [form, setForm] = useState({
    businessName: "", name: "", email: "", phone: "",
    businessType: "Wholesale Distributor", address: "", description: "",
    gstNumber: "", panNumber: "", fssaiLicense: "", establishedYear: "",
    deliveryFee: 50, freeDeliveryAbove: 1000, minOrderAmount: 500,
    maxDeliveryDistance: 25, estimatedDeliveryTime: "2-4 hours",
    deliveryAreas: [],
  });

  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        businessName: user.businessName || "",
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        businessType: user.businessType || "Wholesale Distributor",
        address: user.address || "",
        description: user.description || "",
        gstNumber: user.gstNumber || "",
        panNumber: user.panNumber || "",
        fssaiLicense: user.fssaiLicense || "",
        establishedYear: user.establishedYear || "",
        deliveryFee: user.deliveryFee ?? 50,
        freeDeliveryAbove: user.freeDeliveryAbove ?? 1000,
        minOrderAmount: user.minOrderAmount ?? 500,
        maxDeliveryDistance: user.maxDeliveryDistance ?? 25,
        estimatedDeliveryTime: user.estimatedDeliveryTime || "2-4 hours",
        deliveryAreas: user.deliveryAreas?.length ? user.deliveryAreas : [],
      }));
      setAcceptingOrders(user.acceptingOrders !== false);
      setBusinessImages(user.businessImages || []);
    }
  }, [user]);

  useEffect(() => {
    if (tab === 3) {
      setOrdersLoading(true);
      ordersAPI.getAll({ limit: 100 })
        .then(d => {
          const all = d.orders || [];
          setAllOrders(all);
          setOrders(all.filter(o => o.status === "delivered"));
        })
        .catch(() => {})
        .finally(() => setOrdersLoading(false));
    }
  }, [tab]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        name: form.name, phone: form.phone,
        businessName: form.businessName, address: form.address,
        description: form.description, businessType: form.businessType,
        gstNumber: form.gstNumber, panNumber: form.panNumber,
        fssaiLicense: form.fssaiLicense, establishedYear: form.establishedYear,
        categories: user?.categories || [],
        deliveryAreas: form.deliveryAreas,
      });
      toast({ title: "Profile updated successfully" });
      setEditMode(false);
    } catch (e) {
      toast({ title: "Save failed", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDelivery = async () => {
    setSaving(true);
    try {
      await updateProfile({
        deliveryFee: Number(form.deliveryFee),
        freeDeliveryAbove: Number(form.freeDeliveryAbove),
        minOrderAmount: Number(form.minOrderAmount),
        maxDeliveryDistance: Number(form.maxDeliveryDistance),
        estimatedDeliveryTime: form.estimatedDeliveryTime,
        deliveryAreas: form.deliveryAreas,
        acceptingOrders,
      });
      toast({ title: "Delivery settings saved" });
    } catch (e) {
      toast({ title: "Save failed", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAccepting = async () => {
    const next = !acceptingOrders;
    setAcceptingOrders(next);
    try {
      await updateProfile({ acceptingOrders: next });
      toast({ title: next ? "Now accepting orders" : "Orders paused" });
    } catch (e) {
      setAcceptingOrders(!next);
      toast({ title: "Update failed", variant: "destructive" });
    }
  };

  const addDeliveryArea = () => {
    const area = newArea.trim();
    if (area && !form.deliveryAreas.includes(area)) {
      setForm(f => ({ ...f, deliveryAreas: [...f.deliveryAreas, area] }));
    }
    setNewArea("");
  };

  const removeDeliveryArea = a => setForm(f => ({ ...f, deliveryAreas: f.deliveryAreas.filter(x => x !== a) }));

  const handleImageUpload = (files) => {
    if (!files) return;
    Array.from(files).forEach(file => {
      if (!file.type.startsWith("image/")) return;
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File too large", description: "Max 5MB per image", variant: "destructive" });
        return;
      }
      setUploadingImage(true);
      const reader = new FileReader();
      reader.onload = async e => {
        const newImg = {
          id: `img_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          url: e.target.result,
          title: file.name.replace(/\.[^/.]+$/, ""),
          description: "",
          tag: "facility",
          isMain: businessImages.length === 0,
        };
        const updated = [...businessImages, newImg];
        setBusinessImages(updated);
        try {
          await updateProfile({ businessImages: updated });
          toast({ title: "Image uploaded successfully" });
        } catch (err) {
          toast({ title: "Could not save image", description: err.message, variant: "destructive" });
        } finally {
          setUploadingImage(false);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = async (id) => {
    const updated = businessImages.filter(img => img.id !== id);
    setBusinessImages(updated);
    try {
      await updateProfile({ businessImages: updated });
      toast({ title: "Image removed" });
    } catch (e) {
      toast({ title: "Could not remove image", variant: "destructive" });
    }
  };

  const setMainImage = async (id) => {
    const updated = businessImages.map(img => ({ ...img, isMain: img.id === id }));
    setBusinessImages(updated);
    try {
      await updateProfile({ businessImages: updated });
      toast({ title: "Main image updated" });
    } catch (e) {
      toast({ title: "Could not update", variant: "destructive" });
    }
  };

  const initials = n => (n || "PS").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const totalRevenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const uniqueVendors = new Set(orders.map(o => (o.vendor || o.vendorId || {})._id || "").filter(Boolean)).size;
  const monthlyData = groupByMonth(allOrders);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-r from-saffron-500 to-emerald-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">JB</span>
              </div>
              <span className="font-bold text-gray-900 hidden sm:block">JugaduBazar</span>
              <Badge className="bg-emerald-100 text-emerald-700">Supplier Profile</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/supplier/notifications">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
              </Button>
            </Link>
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm">
              {initials(user?.name)}
            </div>
            <Button variant="outline" size="sm" onClick={() => { logout(); navigate("/"); }}>
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Page title row */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <Link to="/supplier/dashboard" className="text-sm text-gray-500 hover:text-emerald-600 flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Supplier Profile</h1>
              <p className="text-sm text-gray-500">Manage your business information and settings</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" className="gap-1" onClick={() => setEditMode(e => !e)}>
              <Edit className="w-3.5 h-3.5" /> {editMode ? "Cancel Edit" : "Edit Profile"}
            </Button>
          </div>
        </div>

        {/* Business Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="mb-5">
            <CardContent className="p-5">
              <div className="flex flex-wrap items-start gap-4 justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-2xl flex-shrink-0">
                    {initials(user?.name)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{user?.businessName || form.businessName || "Your Business"}</h2>
                    <p className="text-sm text-gray-500">{form.businessType}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                      {(user?.address || form.address) && (
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {user?.address || form.address}</span>
                      )}
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        {(user?.rating || 0).toFixed(1)} Rating
                        {user?.totalRatings > 0 && <span className="text-gray-400">({user.totalRatings})</span>}
                      </span>
                      <span className="flex items-center gap-1"><Package className="w-3.5 h-3.5" /> {user?.totalOrders || 0} Orders</span>
                      {form.establishedYear && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Since {form.establishedYear}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 font-medium">Accepting Orders</span>
                  <button
                    type="button"
                    onClick={handleToggleAccepting}
                    className={`relative inline-flex h-6 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${acceptingOrders ? "bg-emerald-500" : "bg-gray-300"}`}
                    role="switch"
                    aria-checked={acceptingOrders}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform duration-200 ${acceptingOrders ? "translate-x-6" : "translate-x-0"}`}
                    />
                  </button>
                  <Badge className={acceptingOrders ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}>
                    {acceptingOrders ? "Open" : "Paused"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <div className="flex border-b mb-5 bg-white rounded-t-lg overflow-hidden">
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)}
              className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${tab === i ? "border-emerald-500 text-emerald-600 bg-white" : "border-transparent text-gray-500 hover:text-gray-700 bg-gray-50"}`}
            >{t}</button>
          ))}
        </div>

        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>

          {/* ── BUSINESS INFO ── */}
          {tab === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-lg mb-1">Basic Information</h3>
                  <p className="text-sm text-gray-500 mb-4">Update your business details</p>
                  <div className="space-y-3">
                    {[
                      { label: "Business Name", key: "businessName", placeholder: "Your business name" },
                      { label: "Owner Name", key: "name", placeholder: "Your full name" },
                      { label: "Email", key: "email", readonly: true },
                      { label: "Phone", key: "phone", placeholder: "+91 98765 43210" },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                        <Input
                          value={form[f.key]}
                          onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                          readOnly={f.readonly || !editMode}
                          className={f.readonly || !editMode ? "bg-gray-50" : ""}
                          placeholder={f.placeholder}
                        />
                      </div>
                    ))}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                      {editMode ? (
                        <select value={form.businessType} onChange={e => setForm(p => ({ ...p, businessType: e.target.value }))}
                          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
                        >
                          {BIZ_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      ) : (
                        <Input value={form.businessType} readOnly className="bg-gray-50" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-lg mb-1">Legal Information</h3>
                  <p className="text-sm text-gray-500 mb-4">Business licenses and certifications</p>
                  <div className="space-y-3">
                    {[
                      { label: "GST Number", key: "gstNumber", placeholder: "09AABCU9603R1ZX" },
                      { label: "PAN Number", key: "panNumber", placeholder: "AABCU9603R" },
                      { label: "FSSAI License", key: "fssaiLicense", placeholder: "FSSAI-12345678901234" },
                      { label: "Established Year", key: "establishedYear", placeholder: "e.g. 1998" },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                        <Input
                          value={form[f.key]}
                          onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                          readOnly={!editMode}
                          className={!editMode ? "bg-gray-50" : ""}
                          placeholder={f.placeholder}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-lg mb-3">Address & Description</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Complete Address</label>
                      <Textarea value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} readOnly={!editMode} className={!editMode ? "bg-gray-50" : ""} rows={2} placeholder="Industrial Area, Sector 62, Noida..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Business Description</label>
                      <Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} readOnly={!editMode} className={!editMode ? "bg-gray-50" : ""} rows={3} placeholder="Tell vendors about your business..." />
                    </div>
                  </div>
                  {editMode && (
                    <div className="flex gap-2 mt-4">
                      <Button onClick={handleSave} disabled={saving} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                        {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                      </Button>
                      <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* ── IMAGES ── */}
          {tab === 1 && (
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">Business Images</h3>
                    <p className="text-sm text-gray-500">Upload photos of your facility, products, and certificates</p>
                  </div>
                  <Button
                    className="bg-saffron-500 hover:bg-saffron-600 text-white gap-1"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                  >
                    {uploadingImage ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : <><Upload className="w-4 h-4" /> Upload Images</>}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={e => handleImageUpload(e.target.files)}
                  />
                </div>

                {businessImages.length === 0 ? (
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-emerald-400 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500 font-medium">No images yet</p>
                    <p className="text-sm text-gray-400 mt-1">Click or drag to upload photos of your business</p>
                    <Button className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white" onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                      <Upload className="w-4 h-4 mr-2" /> Choose Images
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {businessImages.map(img => (
                      <div key={img.id} className="relative rounded-lg overflow-hidden border bg-white hover:shadow-md transition-shadow group">
                        <div className="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                          {img.url ? (
                            <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                          ) : (
                            <Camera className="w-10 h-10 text-gray-300" />
                          )}
                        </div>
                        {img.isMain && (
                          <span className="absolute top-2 left-2 bg-saffron-500 text-white text-xs px-2 py-0.5 rounded font-medium">Main</span>
                        )}
                        {/* Overlay actions */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {!img.isMain && (
                            <Button size="sm" variant="secondary" onClick={() => setMainImage(img.id)} className="text-xs">
                              Set Main
                            </Button>
                          )}
                          <Button size="sm" variant="destructive" onClick={() => removeImage(img.id)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-medium text-gray-900 truncate">{img.title || "Untitled"}</p>
                          {img.tag && <Badge variant="outline" className="text-xs mt-1">{img.tag}</Badge>}
                        </div>
                      </div>
                    ))}
                    {/* Add more */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-video rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 transition-colors"
                    >
                      <Camera className="w-8 h-8 text-gray-300 mb-2" />
                      <p className="text-xs text-gray-400">Add Photo</p>
                    </div>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-3">Supported: JPG, PNG, GIF · Max 5MB per image</p>
              </CardContent>
            </Card>
          )}

          {/* ── DELIVERY SETTINGS ── */}
          {tab === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-lg mb-1">Delivery Configuration</h3>
                    <p className="text-sm text-gray-500 mb-4">Set your delivery zones and pricing</p>
                    <div className="space-y-3">
                      {[
                        { label: "Minimum Order Amount (₹)", key: "minOrderAmount", type: "number", placeholder: "500" },
                        { label: "Delivery Fee (₹)", key: "deliveryFee", type: "number", placeholder: "50" },
                        { label: "Free Delivery Above (₹)", key: "freeDeliveryAbove", type: "number", placeholder: "1000" },
                        { label: "Max Delivery Distance (km)", key: "maxDeliveryDistance", type: "number", placeholder: "25" },
                      ].map(f => (
                        <div key={f.key}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                          <Input
                            type={f.type}
                            value={form[f.key]}
                            onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                            placeholder={f.placeholder}
                          />
                        </div>
                      ))}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Delivery Time</label>
                        <select
                          value={form.estimatedDeliveryTime}
                          onChange={e => setForm(p => ({ ...p, estimatedDeliveryTime: e.target.value }))}
                          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
                        >
                          {DELIVERY_TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                    <Button onClick={handleSaveDelivery} disabled={saving} className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white w-full gap-1">
                      {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Settings</>}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-lg mb-1">Delivery Areas</h3>
                    <p className="text-sm text-gray-500 mb-4">Manage your service areas</p>
                    <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
                      {form.deliveryAreas.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-4">No delivery areas added yet</p>
                      ) : (
                        form.deliveryAreas.map(area => (
                          <div key={area} className="flex items-center justify-between border rounded-lg px-3 py-2">
                            <span className="text-sm text-gray-700">{area}</span>
                            <button onClick={() => removeDeliveryArea(area)} className="text-red-400 hover:text-red-600 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newArea}
                        onChange={e => setNewArea(e.target.value)}
                        placeholder="Add new area..."
                        className="flex-1 text-sm"
                        onKeyDown={e => e.key === "Enter" && addDeliveryArea()}
                      />
                      <Button variant="outline" size="sm" onClick={addDeliveryArea} className="gap-1">
                        <Plus className="w-4 h-4" /> Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Status Toggle */}
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">Order Acceptance</h3>
                      <p className="text-sm text-gray-500">Control whether you are accepting new orders</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700">
                        {acceptingOrders ? "Currently Accepting" : "Currently Paused"}
                      </span>
                      <button
                        type="button"
                        onClick={handleToggleAccepting}
                        className={`relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${acceptingOrders ? "bg-emerald-500" : "bg-gray-300"}`}
                        role="switch"
                        aria-checked={acceptingOrders}
                      >
                        <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition-transform duration-200 ${acceptingOrders ? "translate-x-7" : "translate-x-0"}`} />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ── SALES HISTORY ── */}
          {tab === 3 && (
            <div className="space-y-4">
              {ordersLoading ? (
                <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>
              ) : (
                <>
                  {/* Real stats */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { icon: <TrendingUp className="w-6 h-6 text-emerald-600" />, label: "Total Revenue", value: fmtINR(totalRevenue), color: "text-emerald-600" },
                      { icon: <Package className="w-6 h-6 text-blue-600" />, label: "Completed Orders", value: orders.length, color: "text-blue-600" },
                      { icon: <Users className="w-6 h-6 text-purple-600" />, label: "Unique Vendors", value: uniqueVendors || user?.totalRatings || 0, color: "text-purple-600" },
                    ].map(s => (
                      <Card key={s.label}>
                        <CardContent className="p-5 flex items-center gap-3">
                          {s.icon}
                          <div>
                            <p className="text-xs text-gray-500">{s.label}</p>
                            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Monthly breakdown */}
                  <Card>
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-lg mb-1">Monthly Performance</h3>
                      <p className="text-sm text-gray-500 mb-4">Revenue and order trends over time</p>
                      {monthlyData.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-8">No completed orders yet</p>
                      ) : (
                        <div className="space-y-3">
                          {monthlyData.map((m) => {
                            const maxRev = Math.max(...monthlyData.map(x => x.revenue), 1);
                            const pct = Math.round((m.revenue / maxRev) * 100);
                            return (
                              <div key={m.key}>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium text-gray-700">{m.label}</span>
                                  <div className="text-right">
                                    <span className="text-sm font-bold text-emerald-600">{fmtINR(m.revenue)}</span>
                                    <span className="text-xs text-gray-400 ml-2">{m.orders} orders</span>
                                  </div>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                  <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Completed orders list */}
                  <Card>
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-lg mb-3">Completed Orders</h3>
                      {orders.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-8">No completed orders yet</p>
                      ) : (
                        <div className="space-y-2">
                          {orders.slice(0, 10).map(o => {
                            const vendor = o.vendor || o.vendorId || {};
                            const vName = vendor.businessName || vendor.name || "Vendor";
                            return (
                              <div key={o._id} className="flex items-center justify-between py-2 border-b last:border-0">
                                <div>
                                  <p className="font-medium text-sm text-gray-900">{o.orderNumber}</p>
                                  <p className="text-xs text-gray-500">{vName}</p>
                                  <p className="text-xs text-gray-400">{fmtDate(o.deliveredAt || o.createdAt)}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-emerald-600">{fmtINR(o.totalAmount)}</p>
                                  <Badge className="bg-emerald-100 text-emerald-700 text-xs">Delivered</Badge>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
