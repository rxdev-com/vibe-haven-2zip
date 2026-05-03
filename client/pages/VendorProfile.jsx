import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Package, Star, TrendingUp, Clock, Edit, MapPin, Mail, Phone, Building, Camera, Loader2, Save } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ordersAPI } from "@/lib/api";

const TABS = ["Profile Details", "Business Info", "Images", "Order History"];

const MOCK_IMAGES = [
  { title: "Rajesh's Chaat Corner", desc: "Our vibrant food stall serving authentic North Indian delicacies", isMain: true },
  { title: "Fresh Cooking Station", desc: "Clean and hygienic cooking area with modern equipment" },
  { title: "Famous Chole Bhature", desc: "Our signature dish loved by customers across Delhi" },
  { title: "Food License", desc: "Valid food safety license and health certificates", isDoc: true },
];

export default function VendorProfile() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", businessName: "", description: "", specialties: [] });
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [specialtyInput, setSpecialtyInput] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        businessName: user.businessName || "",
        description: user.description || "",
        specialties: user.specialties || [],
      });
    }
  }, [user]);

  useEffect(() => {
    if (tab === 3) {
      setOrdersLoading(true);
      ordersAPI.getAll({ limit: 20, status: "delivered" })
        .then(d => setOrders(d.orders || []))
        .catch(() => {})
        .finally(() => setOrdersLoading(false));
    }
  }, [tab]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ name: form.name, phone: form.phone, address: form.address, businessName: form.businessName, description: form.description, specialties: form.specialties });
      toast({ title: "Profile updated successfully" });
      setEditMode(false);
    } catch (e) {
      toast({ title: "Save failed", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const addSpecialty = () => {
    const s = specialtyInput.trim();
    if (s && !form.specialties.includes(s)) {
      setForm(f => ({ ...f, specialties: [...f.specialties, s] }));
    }
    setSpecialtyInput("");
  };

  const removeSpecialty = (s) => setForm(f => ({ ...f, specialties: f.specialties.filter(x => x !== s) }));

  const initials = (n) => (n || "RK").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const memberYear = user?.createdAt ? new Date(user.createdAt).getFullYear() : 2023;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimal header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/vendor/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-saffron-600">
            ← Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-r from-saffron-500 to-emerald-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">JB</span>
            </div>
            <span className="font-bold text-gray-900">JugaduBazar</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="mb-5 overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-saffron-500 to-orange-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {initials(user?.name)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{user?.name || "Rajesh Kumar"}</h2>
                    <p className="text-sm text-gray-600">{user?.businessName || "Rajesh's Chaat Corner"}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <MapPin className="w-3 h-3" /> {user?.address || "Sector 15, Noida, Uttar Pradesh"}
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={() => setEditMode(true)}>
                  <Edit className="w-3.5 h-3.5" /> Edit Profile
                </Button>
              </div>

              {/* Business cover photo */}
              <div className="relative w-full h-28 bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg overflow-hidden mb-4">
                <div className="absolute inset-0 flex items-end p-3">
                  <span className="text-white font-semibold text-sm drop-shadow">{user?.businessName || "Rajesh's Chaat Corner"}</span>
                </div>
                <button className="absolute top-2 right-2 bg-saffron-500 text-white text-xs px-2 py-1 rounded">Main Photo</button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { icon: Package, label: "Total Orders", value: "156", color: "text-blue-600" },
                  { icon: Star, label: "Avg Rating", value: (user?.rating || 4.8).toFixed(1), color: "text-yellow-500" },
                  { icon: TrendingUp, label: "Monthly Spend", value: "₹28,450", color: "text-emerald-600" },
                  { icon: Clock, label: "Member Since", value: String(memberYear), color: "text-purple-600" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <s.icon className={`w-5 h-5 mx-auto mb-1 ${s.color}`} />
                    <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-gray-500">{s.label}</p>
                  </div>
                ))}
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
              className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${tab === i ? "border-saffron-500 text-saffron-600 bg-white" : "border-transparent text-gray-500 hover:text-gray-700 bg-gray-50"}`}
            >
              {i === 2 && <Camera className="w-3.5 h-3.5 inline mr-1" />}{t}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {/* Profile Details */}
          {tab === 0 && (
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-lg mb-1">Personal Information</h3>
                <p className="text-sm text-gray-500 mb-4">Manage your personal details and contact information</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <div className="relative">
                      <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} readOnly={!editMode} className={!editMode ? "bg-gray-50" : ""} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input value={form.email} readOnly className="pl-9 bg-gray-50" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} readOnly={!editMode} className={`pl-9 ${!editMode ? "bg-gray-50" : ""}`} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Since</label>
                    <Input value="2015" readOnly className="bg-gray-50" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Textarea value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} readOnly={!editMode} className={`pl-9 ${!editMode ? "bg-gray-50" : ""}`} rows={2} />
                    </div>
                  </div>
                </div>
                {editMode && (
                  <div className="flex gap-2 mt-4">
                    <Button onClick={handleSave} disabled={saving} className="bg-saffron-500 hover:bg-saffron-600">
                      {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                    </Button>
                    <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Business Info */}
          {tab === 1 && (
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-lg mb-1">Business Information</h3>
                <p className="text-sm text-gray-500 mb-4">Details about your street food business</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                    <Input value={form.businessName} onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))} readOnly={!editMode} className={!editMode ? "bg-gray-50" : ""} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Description</label>
                    <Textarea value={form.description || "Serving delicious North Indian street food since 2015"} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} readOnly={!editMode} className={!editMode ? "bg-gray-50" : ""} rows={3} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialties</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(form.specialties.length ? form.specialties : ["Chaat", "Chole Bhature", "Samosa", "Lassi"]).map(s => (
                        <Badge key={s} className="bg-saffron-100 text-saffron-700 cursor-pointer" onClick={() => editMode && removeSpecialty(s)}>
                          {s} {editMode && "×"}
                        </Badge>
                      ))}
                    </div>
                    {editMode && (
                      <div className="flex gap-2">
                        <Input value={specialtyInput} onChange={e => setSpecialtyInput(e.target.value)} placeholder="Add specialty..." className="flex-1" onKeyDown={e => e.key === "Enter" && addSpecialty()} />
                        <Button variant="outline" size="sm" onClick={addSpecialty}>Add</Button>
                      </div>
                    )}
                  </div>
                </div>
                {!editMode && (
                  <Button variant="outline" className="mt-4 gap-1" onClick={() => setEditMode(true)}>
                    <Edit className="w-4 h-4" /> Edit Business Info
                  </Button>
                )}
                {editMode && (
                  <div className="flex gap-2 mt-4">
                    <Button onClick={handleSave} disabled={saving} className="bg-saffron-500 hover:bg-saffron-600">
                      {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                    </Button>
                    <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Images */}
          {tab === 2 && (
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-1">
                  <Camera className="w-5 h-5 text-saffron-500" />
                  <h3 className="font-semibold text-lg">Business Gallery</h3>
                </div>
                <p className="text-sm text-gray-500 mb-4">Share photos of your food stall, specialties, and cooking area to attract customers</p>
                <p className="text-sm font-medium text-gray-700 mb-3">Business Gallery ({MOCK_IMAGES.length} images)</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {MOCK_IMAGES.map((img, i) => (
                    <div key={i} className="relative rounded-lg overflow-hidden border group cursor-pointer hover:shadow-md transition-shadow">
                      <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        {img.isDoc ? (
                          <div className="text-center">
                            <div className="w-10 h-10 bg-gray-400 rounded mx-auto mb-1 flex items-center justify-center">📄</div>
                          </div>
                        ) : (
                          <div className="text-4xl">{i === 0 ? "🏪" : i === 1 ? "🍳" : i === 2 ? "🍲" : "📄"}</div>
                        )}
                      </div>
                      {img.isMain && <span className="absolute top-2 left-2 bg-saffron-500 text-white text-xs px-2 py-0.5 rounded">Main Photo</span>}
                      <div className="p-2">
                        <p className="text-xs font-medium text-gray-900 truncate">{img.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-2">{img.desc}</p>
                      </div>
                    </div>
                  ))}
                  <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-saffron-400 transition-colors">
                    <Camera className="w-8 h-8 text-gray-300 mb-2" />
                    <p className="text-xs text-gray-400">Add Photo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order History */}
          {tab === 3 && (
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-lg mb-1">Order History</h3>
                <p className="text-sm text-gray-500 mb-4">Your recent orders and purchases</p>
                {ordersLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-saffron-500" /></div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Package className="w-10 h-10 mx-auto mb-2" />
                    <p className="text-sm">No order history yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {orders.map(o => {
                      const supplier = o.supplierId || o.supplier || {};
                      const sName = supplier.businessName || supplier.name || "Supplier";
                      const itemDesc = (o.items || []).map(i => `${i.name} (${i.quantity}${i.unit})`).join(", ");
                      return (
                        <div key={o._id} className="flex items-center justify-between border rounded-lg px-4 py-3">
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleDateString("en-CA")}</span>
                              <Badge className="bg-emerald-100 text-emerald-700 text-xs">Delivered</Badge>
                            </div>
                            <p className="text-sm font-medium text-gray-900">{sName}</p>
                            <p className="text-xs text-gray-500 truncate max-w-xs">{itemDesc}</p>
                          </div>
                          <span className="font-semibold text-gray-900">₹{Number(o.totalAmount||0).toLocaleString("en-IN")}</span>
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
