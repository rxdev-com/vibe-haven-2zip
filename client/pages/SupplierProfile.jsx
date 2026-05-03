import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Edit, MapPin, Star, Package, Clock, Camera, Loader2, Save,
  Phone, Bell, LogOut, CheckCircle, Trash2, Plus, TrendingUp, Users, Upload,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ordersAPI } from "@/lib/api";

const TABS = ["Business Info", "Images", "Delivery Settings", "Sales History"];

const BIZ_TYPES = ["Wholesale Distributor", "Direct Manufacturer", "Retailer", "Farmer", "Cooperative"];
const DELIVERY_TIMES = ["1-2 hours", "2-4 hours", "4-6 hours", "Same Day", "Next Day"];

const MOCK_IMAGES = [
  { id: 1, title: "Main Factory Building", desc: "Our modern oil processing facility with state of the art equipment", tag: "facility", isMain: true },
  { id: 2, title: "Production Line", desc: "Automated oil extraction and bottling machinery", tag: "equipment" },
  { id: 3, title: "Quality Control Lab", desc: "In-house testing facility ensuring product quality", tag: "facility" },
  { id: 4, title: "FSSAI Certificate", desc: "Food safety certification and compliance documents", tag: "certificates" },
  { id: 5, title: "Our Team", desc: "Dedicated team of professionals ensuring quality service", tag: "team" },
];

const MONTHLY_DATA = [
  { month: "Jan 2024", orders: 45, revenue: 125000, growth: 12 },
  { month: "Feb 2024", orders: 52, revenue: 140000, growth: 15 },
  { month: "Mar 2024", orders: 48, revenue: 135000, growth: -3 },
  { month: "Apr 2024", orders: 61, revenue: 158000, growth: 17 },
  { month: "May 2024", orders: 66, revenue: 162000, growth: 2 },
  { month: "Jun 2024", orders: 58, revenue: 151000, growth: -7 },
];

function fmtINR(v) { return `₹${Number(v || 0).toLocaleString("en-IN")}`; }

export default function SupplierProfile() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tab, setTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [acceptingOrders, setAcceptingOrders] = useState(user?.acceptingOrders !== false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [newArea, setNewArea] = useState("");
  const [salesStats, setSalesStats] = useState({ totalRevenue: 720000, totalOrders: 271, activeCustomers: 89 });

  const [form, setForm] = useState({
    businessName: "", name: "", email: "", phone: "",
    businessType: "Wholesale Distributor", address: "", description: "",
    gstNumber: "09AABCU9603R1ZX", panNumber: "AABCU9603R",
    fssaiLicense: "FSSAI-12345678901234", establishedYear: "1998",
    deliveryFee: 50, freeDeliveryAbove: 1000, minOrderAmount: 500,
    maxDeliveryDistance: 25, estimatedDeliveryTime: "2-4 hours",
    deliveryAreas: ["Delhi", "Noida", "Gurgaon", "Faridabad", "Greater Noida"],
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
        gstNumber: user.gstNumber || f.gstNumber,
        panNumber: user.panNumber || f.panNumber,
        fssaiLicense: user.fssaiLicense || f.fssaiLicense,
        establishedYear: user.establishedYear || f.establishedYear,
        deliveryFee: user.deliveryFee ?? f.deliveryFee,
        freeDeliveryAbove: user.freeDeliveryAbove ?? f.freeDeliveryAbove,
        minOrderAmount: user.minOrderAmount ?? f.minOrderAmount,
        maxDeliveryDistance: user.maxDeliveryDistance ?? f.maxDeliveryDistance,
        estimatedDeliveryTime: user.estimatedDeliveryTime || f.estimatedDeliveryTime,
        deliveryAreas: user.deliveryAreas?.length ? user.deliveryAreas : f.deliveryAreas,
      }));
      setAcceptingOrders(user.acceptingOrders !== false);
    }
  }, [user]);

  useEffect(() => {
    if (tab === 3) {
      setOrdersLoading(true);
      ordersAPI.getAll({ status: "delivered", limit: 20 })
        .then(d => setOrders(d.orders || []))
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

  const removeDeliveryArea = (a) => setForm(f => ({ ...f, deliveryAreas: f.deliveryAreas.filter(x => x !== a) }));

  const initials = (n) => (n || "PS").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const memberYear = form.establishedYear || (user?.createdAt ? new Date(user.createdAt).getFullYear() : 1998);

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
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
            </Button>
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
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <Link to="/supplier/dashboard" className="text-sm text-gray-500 hover:text-emerald-600">
              ← Back to Dashboard
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Supplier Profile</h1>
              <p className="text-sm text-gray-500">Manage your business information and settings</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Accepting Orders</span>
              <button
                onClick={handleToggleAccepting}
                className={`relative w-12 h-6 rounded-full transition-colors ${acceptingOrders ? "bg-saffron-500" : "bg-gray-300"}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${acceptingOrders ? "translate-x-7" : "translate-x-1"}`} />
              </button>
            </div>
            <Button variant="outline" size="sm" className="gap-1" onClick={() => setEditMode(true)}>
              <Edit className="w-3.5 h-3.5" /> Edit Profile
            </Button>
          </div>
        </div>

        {/* Business Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="mb-5">
            <CardContent className="p-5 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-2xl flex-shrink-0">
                  {initials(user?.name)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{user?.businessName || "Priya Raw Materials Supply"}</h2>
                  <p className="text-sm text-gray-500">{form.businessType}</p>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {user?.address || "Industrial Area"}</span>
                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" /> {(user?.rating || 4.8).toFixed(1)} Rating</span>
                    <span className="flex items-center gap-1"><Package className="w-3.5 h-3.5" /> {user?.totalOrders || 186} Orders</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Since {memberYear}</span>
                  </div>
                </div>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 gap-1 flex-shrink-0">
                <CheckCircle className="w-3.5 h-3.5" /> Active
              </Badge>
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

          {/* ─── BUSINESS INFO ─── */}
          {tab === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-lg mb-1">Basic Information</h3>
                  <p className="text-sm text-gray-500 mb-4">Update your business details</p>
                  <div className="space-y-3">
                    {[
                      { label: "Business Name", key: "businessName", placeholder: "Priya Raw Materials Supply" },
                      { label: "Owner Name", key: "name", placeholder: "Priya Supplies" },
                      { label: "Email", key: "email", readonly: true },
                      { label: "Phone", key: "phone", placeholder: "+91 87654 32109" },
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
                      { label: "GST Number", key: "gstNumber" },
                      { label: "PAN Number", key: "panNumber" },
                      { label: "FSSAI License", key: "fssaiLicense" },
                      { label: "Established Year", key: "establishedYear" },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                        <Input
                          value={form[f.key]}
                          onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                          readOnly={!editMode}
                          className={!editMode ? "bg-gray-50" : ""}
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
                      <Textarea value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} readOnly={!editMode} className={!editMode ? "bg-gray-50" : ""} rows={2} placeholder="Industrial Area, Sector 62, Noida, Uttar Pradesh" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Business Description</label>
                      <Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} readOnly={!editMode} className={!editMode ? "bg-gray-50" : ""} rows={3} placeholder="Leading supplier of premium quality oils and fats..." />
                    </div>
                  </div>
                  {!editMode ? (
                    <Button variant="outline" className="mt-4 gap-1" onClick={() => setEditMode(true)}>
                      <Edit className="w-4 h-4" /> Edit Business Info
                    </Button>
                  ) : (
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

          {/* ─── IMAGES ─── */}
          {tab === 1 && (
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">Business Images</h3>
                    <p className="text-sm text-gray-500">Upload photos of your facility, products, and certificates</p>
                  </div>
                  <Button className="bg-saffron-500 hover:bg-saffron-600 text-white gap-1">
                    <Upload className="w-4 h-4" /> Upload Images
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {MOCK_IMAGES.map((img, i) => (
                    <div key={img.id} className="relative rounded-lg overflow-hidden border bg-white hover:shadow-md transition-shadow cursor-pointer group">
                      <div className="aspect-video bg-gray-100 flex items-center justify-center">
                        <Camera className="w-10 h-10 text-gray-300" />
                      </div>
                      {img.isMain && <span className="absolute top-2 left-2 bg-saffron-500 text-white text-xs px-2 py-0.5 rounded">Main</span>}
                      <div className="p-3">
                        <p className="text-sm font-medium text-gray-900">{img.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{img.desc}</p>
                        <Badge variant="outline" className="text-xs mt-1">{img.tag}</Badge>
                      </div>
                    </div>
                  ))}
                  <div className="aspect-video rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 transition-colors">
                    <Camera className="w-8 h-8 text-gray-300 mb-2" />
                    <p className="text-xs text-gray-400">Add Photo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ─── DELIVERY SETTINGS ─── */}
          {tab === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Delivery Configuration */}
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

                {/* Delivery Areas */}
                <Card>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-lg mb-1">Delivery Areas</h3>
                    <p className="text-sm text-gray-500 mb-4">Manage your service areas</p>
                    <div className="space-y-2 mb-3">
                      {form.deliveryAreas.map(area => (
                        <div key={area} className="flex items-center justify-between border rounded-lg px-3 py-2">
                          <span className="text-sm text-gray-700">{area}</span>
                          <button onClick={() => removeDeliveryArea(area)} className="text-red-400 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
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
                        <Plus className="w-4 h-4" /> Add Area
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Delivery Map (mock) */}
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">📍 Delivery Map</h3>
                    <Badge className="bg-blue-100 text-blue-700">
                      {orders.filter(o => o.status === "shipped").length} Active Deliveries
                    </Badge>
                  </div>
                  {/* Mock map */}
                  <div className="relative h-52 bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 rounded-lg border overflow-hidden mb-4">
                    <svg className="absolute inset-0 w-full h-full opacity-20">
                      {[0,40,80,120,160,200].map(y => <line key={`h${y}`} x1="0" y1={y} x2="600" y2={y} stroke="#059669" strokeWidth="0.8" />)}
                      {[0,60,120,180,240,300,360,420,480,540,600].map(x => <line key={`v${x}`} x1={x} y1="0" x2={x} y2="200" stroke="#059669" strokeWidth="0.8" />)}
                    </svg>
                    {/* Supplier pin */}
                    <div className="absolute" style={{ left: "35%", top: "45%" }}>
                      <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow" title="Supplier" />
                    </div>
                    {/* Delivery pins */}
                    {[{l:"55%",t:"25%",c:"bg-yellow-500"},{l:"65%",t:"55%",c:"bg-emerald-500"},{l:"20%",t:"65%",c:"bg-yellow-400"}].map((p,i) => (
                      <div key={i} className="absolute" style={{ left: p.l, top: p.t }}>
                        <div className={`w-3 h-3 rounded-full ${p.c} border-2 border-white shadow`} />
                      </div>
                    ))}
                    {/* Legend */}
                    <div className="absolute bottom-2 left-2 bg-white/80 backdrop-blur rounded px-2 py-1 text-xs">
                      <p className="font-semibold mb-1">Legend</p>
                      <div className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Supplier</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Delivered</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" /> In Transit</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Pending</span>
                      </div>
                    </div>
                  </div>

                  {/* Active deliveries + Details side by side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">📦 Active Deliveries</h4>
                      {orders.slice(0, 3).length === 0 ? (
                        [
                          { name: "Rajesh's Chaat Corner", addr: "Connaught Place, New Delhi", dist: "12.5 km · 25 min", amount: 2500, status: "shipped" },
                          { name: "Mumbai Street Food", addr: "Karol Bagh, New Delhi", dist: "8.2 km · 18 min", amount: 1600, status: "pending" },
                          { name: "Delhi Spice Corner", addr: "Lajpat Nagar, New Delhi", dist: "15.1 km · 32 min", amount: 3200, status: "delivered" },
                        ].map((d, i) => (
                          <div key={i} className="flex items-center justify-between border rounded-lg px-3 py-2 mb-2 cursor-pointer hover:bg-gray-50">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{d.name}</p>
                              <p className="text-xs text-gray-500">{d.addr}</p>
                              <p className="text-xs text-gray-400">{d.dist}</p>
                            </div>
                            <div className="text-right">
                              <Badge className={d.status === "delivered" ? "bg-emerald-100 text-emerald-700" : d.status === "shipped" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}>
                                {d.status === "shipped" ? "In Transit" : d.status}
                              </Badge>
                              <p className="text-xs font-semibold mt-1">₹{d.amount.toLocaleString("en-IN")}</p>
                            </div>
                          </div>
                        ))
                      ) : orders.slice(0, 3).map(o => {
                        const vendor = o.vendorId || o.vendor || {};
                        return (
                          <div key={o._id} className="flex items-center justify-between border rounded-lg px-3 py-2 mb-2">
                            <div>
                              <p className="text-sm font-medium">{vendor.businessName || vendor.name}</p>
                              <p className="text-xs text-gray-500">{vendor.address}</p>
                            </div>
                            <div className="text-right">
                              <Badge className="bg-blue-100 text-blue-700 text-xs">{o.status}</Badge>
                              <p className="text-xs font-semibold mt-1">₹{o.totalAmount}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">📍 Delivery Details</h4>
                      <div className="border rounded-lg h-40 flex flex-col items-center justify-center text-gray-400">
                        <MapPin className="w-8 h-8 mb-2 text-gray-300" />
                        <p className="text-sm">Select a delivery from the list to view details</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ─── SALES HISTORY ─── */}
          {tab === 3 && (
            <div className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: <TrendingUp className="w-6 h-6 text-emerald-600" />, label: "Total Revenue", value: fmtINR(salesStats.totalRevenue), color: "text-emerald-600" },
                  { icon: <Package className="w-6 h-6 text-blue-600" />, label: "Total Orders", value: salesStats.totalOrders, color: "text-blue-600" },
                  { icon: <Users className="w-6 h-6 text-purple-600" />, label: "Active Customers", value: salesStats.activeCustomers, color: "text-purple-600" },
                ].map((s) => (
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

              {/* Monthly Performance */}
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-lg mb-1">Monthly Performance</h3>
                  <p className="text-sm text-gray-500 mb-4">Revenue and order trends over time</p>
                  <div className="space-y-2">
                    {MONTHLY_DATA.map((m) => (
                      <div key={m.month} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{m.month}</p>
                          <p className="text-xs text-gray-500">{m.orders} orders</p>
                        </div>
                        <div className="text-right flex items-center gap-3">
                          <span className="text-sm font-bold text-gray-900">{fmtINR(m.revenue)}</span>
                          <span className={`text-xs font-medium flex items-center gap-0.5 ${m.growth >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                            {m.growth >= 0 ? "↑" : "↓"} {Math.abs(m.growth)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent orders */}
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-base mb-3">Recent Delivered Orders</h3>
                  {ordersLoading ? (
                    <div className="flex justify-center py-6"><Loader2 className="w-6 h-6 animate-spin text-emerald-500" /></div>
                  ) : orders.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm py-6">No delivered orders yet</p>
                  ) : (
                    <div className="space-y-2">
                      {orders.map(o => {
                        const vendor = o.vendorId || o.vendor || {};
                        const vName = vendor.businessName || vendor.name || "Vendor";
                        const itemSummary = (o.items || []).map(i => `${i.name} (${i.quantity}${i.unit})`).join(", ");
                        return (
                          <div key={o._id} className="flex items-center justify-between border rounded-lg px-4 py-3">
                            <div>
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleDateString("en-CA")}</span>
                                <Badge className="bg-emerald-100 text-emerald-700 text-xs">Delivered</Badge>
                              </div>
                              <p className="text-sm font-medium">{vName}</p>
                              <p className="text-xs text-gray-400 truncate max-w-sm">{itemSummary}</p>
                            </div>
                            <span className="font-semibold text-gray-900">{fmtINR(o.totalAmount)}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
