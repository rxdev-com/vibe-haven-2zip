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
  Phone, Mail, Building, Bell, LogOut, CheckCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ordersAPI } from "@/lib/api";

const TABS = ["Business Info", "Images", "Delivery Settings", "Sales History"];

const SUPPLIER_IMAGES = [
  { title: "Main Warehouse", desc: "Our primary storage and distribution center", isMain: true },
  { title: "Quality Testing Lab", desc: "Ensuring product quality and freshness" },
  { title: "Packaging Unit", desc: "Modern packaging facility for all products" },
  { title: "Delivery Fleet", desc: "Our reliable delivery vehicles" },
];

const BIZ_TYPES = ["Wholesale Distributor", "Direct Manufacturer", "Retailer", "Farmer", "Cooperative"];

export default function SupplierProfile() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tab, setTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [acceptingOrders, setAcceptingOrders] = useState(true);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [form, setForm] = useState({
    businessName: "",
    name: "",
    email: "",
    phone: "",
    businessType: "",
    address: "",
    description: "",
    gstNumber: "",
    panNumber: "",
    fssaiLicense: "",
    establishedYear: "",
    categories: [],
    deliveryAreas: [],
    deliveryRadius: "25",
    minOrderAmount: "500",
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
        categories: user.categories || [],
        deliveryAreas: user.deliveryAreas || [],
      }));
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
        name: form.name,
        phone: form.phone,
        businessName: form.businessName,
        address: form.address,
        description: form.description,
        businessType: form.businessType,
        categories: form.categories,
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

  const initials = (n) => (n || "PS").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const memberYear = user?.createdAt ? new Date(user.createdAt).getFullYear() : 1998;
  const totalOrders = 186;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/supplier/dashboard" className="text-sm text-gray-500 hover:text-emerald-600">
              ← Back to Dashboard
            </Link>
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
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Supplier Profile</h1>
            <p className="text-sm text-gray-500">Manage your business information and settings</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Accepting Orders</span>
              <button
                onClick={() => setAcceptingOrders(v => !v)}
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

        {/* Business Profile Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="mb-5">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
                  {initials(user?.name)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{user?.businessName || "Priya Raw Materials Supply"}</h2>
                      <p className="text-sm text-gray-500">{form.businessType || "Wholesale Distributor"}</p>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {user?.address || "Industrial Area"}</span>
                        <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> {(user?.rating || 4.8).toFixed(1)} Rating</span>
                        <span className="flex items-center gap-1"><Package className="w-4 h-4" /> {totalOrders} Orders</span>
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Since {memberYear}</span>
                      </div>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Active
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <div className="flex border-b mb-5 bg-white rounded-t-lg overflow-hidden">
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${tab === i ? "border-emerald-500 text-emerald-600 bg-white" : "border-transparent text-gray-500 hover:text-gray-700 bg-gray-50"}`}
            >
              {t}
            </button>
          ))}
        </div>

        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {/* Business Info Tab */}
          {tab === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-lg mb-1">Basic Information</h3>
                  <p className="text-sm text-gray-500 mb-4">Update your business details</p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                      <Input value={form.businessName} onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))} readOnly={!editMode} className={!editMode ? "bg-gray-50" : ""} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                      <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} readOnly={!editMode} className={!editMode ? "bg-gray-50" : ""} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <Input value={form.email} readOnly className="bg-gray-50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} readOnly={!editMode} className={!editMode ? "bg-gray-50" : ""} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                      {editMode ? (
                        <select
                          value={form.businessType}
                          onChange={e => setForm(f => ({ ...f, businessType: e.target.value }))}
                          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
                        >
                          {BIZ_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      ) : (
                        <Input value={form.businessType || "Wholesale Distributor"} readOnly className="bg-gray-50" />
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                      <Input value={form.gstNumber || "09AABCU9603R1ZX"} onChange={e => setForm(f => ({ ...f, gstNumber: e.target.value }))} readOnly={!editMode} className={!editMode ? "bg-gray-50" : ""} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                      <Input value={form.panNumber || "AABCU9603R"} onChange={e => setForm(f => ({ ...f, panNumber: e.target.value }))} readOnly={!editMode} className={!editMode ? "bg-gray-50" : ""} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">FSSAI License</label>
                      <Input value={form.fssaiLicense || "FSSAI-12345678901234"} onChange={e => setForm(f => ({ ...f, fssaiLicense: e.target.value }))} readOnly={!editMode} className={!editMode ? "bg-gray-50" : ""} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
                      <Input value={form.establishedYear || String(memberYear)} onChange={e => setForm(f => ({ ...f, establishedYear: e.target.value }))} readOnly={!editMode} className={!editMode ? "bg-gray-50" : ""} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-lg mb-1">Address & Description</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Complete Address</label>
                      <Textarea value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} readOnly={!editMode} className={!editMode ? "bg-gray-50" : ""} rows={2} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Business Description</label>
                      <Textarea value={form.description || "Leading supplier of premium quality oils and fats for the food industry."} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} readOnly={!editMode} className={!editMode ? "bg-gray-50" : ""} rows={3} />
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

          {/* Images Tab */}
          {tab === 1 && (
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-1">
                  <Camera className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-semibold text-lg">Business Gallery</h3>
                </div>
                <p className="text-sm text-gray-500 mb-4">Share photos of your warehouse, products, and facilities</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {SUPPLIER_IMAGES.map((img, i) => (
                    <div key={i} className="relative rounded-lg overflow-hidden border cursor-pointer hover:shadow-md transition-shadow">
                      <div className="aspect-square bg-gradient-to-br from-emerald-100 to-green-200 flex items-center justify-center">
                        <div className="text-4xl">{i === 0 ? "🏭" : i === 1 ? "🔬" : i === 2 ? "📦" : "🚚"}</div>
                      </div>
                      {img.isMain && <span className="absolute top-2 left-2 bg-saffron-500 text-white text-xs px-2 py-0.5 rounded">Main Photo</span>}
                      <div className="p-2">
                        <p className="text-xs font-medium">{img.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-2">{img.desc}</p>
                      </div>
                    </div>
                  ))}
                  <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400">
                    <Camera className="w-8 h-8 text-gray-300 mb-2" />
                    <p className="text-xs text-gray-400">Add Photo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Delivery Settings Tab */}
          {tab === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-lg mb-1">Delivery Configuration</h3>
                  <p className="text-sm text-gray-500 mb-4">Set your delivery preferences and coverage</p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Radius (km)</label>
                      <Input
                        type="number"
                        value={form.deliveryRadius}
                        onChange={e => setForm(f => ({ ...f, deliveryRadius: e.target.value }))}
                        placeholder="25"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Amount (₹)</label>
                      <Input
                        type="number"
                        value={form.minOrderAmount}
                        onChange={e => setForm(f => ({ ...f, minOrderAmount: e.target.value }))}
                        placeholder="500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Areas</label>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {(form.deliveryAreas.length ? form.deliveryAreas : ["Delhi NCR", "Noida", "Gurgaon", "Faridabad"]).map(a => (
                          <Badge key={a} variant="outline" className="text-xs">{a}</Badge>
                        ))}
                      </div>
                    </div>
                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-white w-full mt-2">
                      <Save className="w-4 h-4 mr-2" /> Save Delivery Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-lg mb-1">Order Preferences</h3>
                  <div className="space-y-3 mt-4">
                    {[
                      { label: "Auto-accept orders", desc: "Automatically accept all incoming orders" },
                      { label: "Weekend deliveries", desc: "Accept and deliver on weekends" },
                      { label: "Bulk order discount", desc: "Offer discount for large orders" },
                    ].map((pref) => (
                      <div key={pref.label} className="flex items-start justify-between py-2 border-b last:border-0">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{pref.label}</p>
                          <p className="text-xs text-gray-500">{pref.desc}</p>
                        </div>
                        <button className="relative w-10 h-5 rounded-full bg-emerald-500 flex-shrink-0 ml-3">
                          <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-white rounded-full shadow" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Sales History Tab */}
          {tab === 3 && (
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-lg mb-1">Sales History</h3>
                <p className="text-sm text-gray-500 mb-4">Your recent completed orders and revenue</p>
                {ordersLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-emerald-500" /></div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Package className="w-10 h-10 mx-auto mb-2" />
                    <p className="text-sm">No sales history yet</p>
                  </div>
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
                              <span className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleDateString("en-CA")}</span>
                              <Badge className="bg-emerald-100 text-emerald-700 text-xs">Delivered</Badge>
                            </div>
                            <p className="text-sm font-medium">{vName}</p>
                            <p className="text-xs text-gray-500 truncate max-w-xs">{itemSummary}</p>
                          </div>
                          <span className="font-semibold">₹{Number(o.totalAmount||0).toLocaleString("en-IN")}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
