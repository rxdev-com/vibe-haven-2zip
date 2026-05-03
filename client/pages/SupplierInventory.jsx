import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus, Edit, Trash2, Search, Package, Loader2, Eye, ArrowLeft,
} from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { materialsAPI } from "@/lib/api";

const CATEGORIES = ["Oil", "Spice", "Grain", "Pulse", "Vegetable", "Dairy", "Other"];
const UNITS = ["kg", "litre", "piece", "dozen", "gram", "quintal"];

const empty = {
  name: "", category: "Oil", price: "", unit: "kg",
  stock: "", description: "", image: "", minOrderQuantity: 1, origin: "",
};

function fmtINR(v) { return `₹${Number(v || 0).toLocaleString("en-IN")}`; }

export default function SupplierInventory() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  const refresh = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const data = await materialsAPI.getBySupplier(user._id, { limit: 100 });
      setItems(data.materials || []);
    } catch (e) {
      toast({ title: "Could not load inventory", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, [user?._id]);

  const openAdd = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (item) => {
    setEditing(item._id);
    setForm({
      name: item.name || "", category: item.category || "Oil", price: String(item.price || ""),
      unit: item.unit || "kg", stock: String(item.stock || ""), description: item.description || "",
      image: item.image || "", minOrderQuantity: item.minOrderQuantity || 1, origin: item.origin || "",
    });
    setOpen(true);
  };

  const handleSave = async () => {
    const { name, price, stock } = form;
    if (!name.trim()) { toast({ title: "Name is required", variant: "destructive" }); return; }
    if (!price || isNaN(price)) { toast({ title: "Valid price is required", variant: "destructive" }); return; }
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock), minOrderQuantity: Number(form.minOrderQuantity) };
      if (editing) {
        await materialsAPI.update(editing, payload);
        toast({ title: "Product updated" });
      } else {
        await materialsAPI.create(payload);
        toast({ title: "Product added" });
      }
      setOpen(false);
      refresh();
    } catch (e) {
      toast({ title: "Save failed", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await materialsAPI.delete(deleteId);
      toast({ title: "Product removed" });
      setDeleteId(null);
      refresh();
    } catch (e) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    }
  };

  const filtered = items.filter(m =>
    !search || (m.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (m.category || "").toLowerCase().includes(search.toLowerCase())
  );

  const inStock = items.filter(m => m.stock > 0).length;
  const outOfStock = items.filter(m => m.stock === 0).length;
  const lowStock = items.filter(m => m.stock > 0 && m.stock < 5).length;

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target?.value ?? e }));

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="Supplier Dashboard" badgeColor="bg-emerald-100 text-emerald-700" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/supplier/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-emerald-600">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-sm text-gray-500">Manage your products and stock levels</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            { label: "Total Products", value: items.length, color: "text-emerald-600", icon: <Package className="w-5 h-5 text-emerald-500" /> },
            { label: "In Stock", value: inStock, color: "text-blue-600", icon: <Package className="w-5 h-5 text-blue-500" /> },
            { label: "Out of Stock", value: outOfStock, color: "text-red-600", icon: <Package className="w-5 h-5 text-red-500" /> },
            { label: "Low Stock", value: lowStock, color: "text-orange-600", icon: <Package className="w-5 h-5 text-orange-500" /> },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  {s.icon}
                  <div>
                    <p className="text-xs text-gray-500">{s.label}</p>
                    <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="pl-9" />
          </div>
          <Button onClick={openAdd} className="bg-emerald-500 hover:bg-emerald-600 text-white gap-1">
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>
        ) : filtered.length === 0 ? (
          <Card><CardContent className="text-center py-16">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500 mb-3">No products found</p>
            <Button onClick={openAdd} className="bg-emerald-500 hover:bg-emerald-600 text-white">Add First Product</Button>
          </CardContent></Card>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {filtered.map((m, i) => (
                <motion.div key={m._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ delay: i * 0.03 }}>
                  <Card className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-semibold text-gray-900">{m.name}</span>
                          <Badge className={m.stock > 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}>
                            {m.stock > 0 ? "active" : "out of stock"}
                          </Badge>
                        </div>
                        {m.description && <p className="text-xs text-gray-500 mb-0.5">{m.description}</p>}
                        <p className="text-xs text-gray-400">{m.category}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Price: <span className="font-medium text-gray-700">{fmtINR(m.price)}/{m.unit}</span>
                          &nbsp;· Stock: <span className={m.stock > 0 ? "text-emerald-600 font-medium" : "text-red-600 font-medium"}>{m.stock} {m.unit}</span>
                          &nbsp;· Orders: <span className="text-gray-700">{m.totalOrders || 0}</span>
                          &nbsp;· Revenue: <span className="text-emerald-600">{fmtINR(m.totalRevenue || 0)}</span>
                        </p>
                      </div>
                      <div className="flex gap-1.5">
                        <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => setViewItem(m)}>
                          <Eye className="w-4 h-4 text-gray-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => openEdit(m)}>
                          <Edit className="w-4 h-4 text-blue-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => setDeleteId(m._id)}>
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Product" : "Add New Product"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label>Product Name *</Label>
                <Input value={form.name} onChange={set("name")} placeholder="e.g., Premium Mustard Oil" />
              </div>
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Unit</Label>
                <Select value={form.unit} onValueChange={v => setForm(f => ({ ...f, unit: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{UNITS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Price (₹) per {form.unit} *</Label>
                <Input type="number" value={form.price} onChange={set("price")} placeholder="180" />
              </div>
              <div>
                <Label>Stock ({form.unit})</Label>
                <Input type="number" value={form.stock} onChange={set("stock")} placeholder="50" />
              </div>
              <div>
                <Label>Min. Order Qty</Label>
                <Input type="number" value={form.minOrderQuantity} onChange={set("minOrderQuantity")} placeholder="1" />
              </div>
              <div>
                <Label>Origin / Region</Label>
                <Input value={form.origin} onChange={set("origin")} placeholder="e.g., Punjab" />
              </div>
              <div className="col-span-2">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={set("description")} placeholder="Describe your product..." rows={3} />
              </div>
              <div className="col-span-2">
                <Label>Image URL (optional)</Label>
                <Input value={form.image} onChange={set("image")} placeholder="https://..." />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-emerald-500 hover:bg-emerald-600 text-white">
              {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : (editing ? "Update Product" : "Add Product")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      {viewItem && (
        <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>{viewItem.name}</DialogTitle></DialogHeader>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">Category:</span> {viewItem.category}</p>
              <p><span className="text-gray-500">Price:</span> {fmtINR(viewItem.price)}/{viewItem.unit}</p>
              <p><span className="text-gray-500">Stock:</span> {viewItem.stock} {viewItem.unit}</p>
              <p><span className="text-gray-500">Min Order:</span> {viewItem.minOrderQuantity} {viewItem.unit}</p>
              {viewItem.description && <p><span className="text-gray-500">Description:</span> {viewItem.description}</p>}
              {viewItem.origin && <p><span className="text-gray-500">Origin:</span> {viewItem.origin}</p>}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewItem(null)}>Close</Button>
              <Button className="bg-emerald-500 text-white" onClick={() => { setViewItem(null); openEdit(viewItem); }}>Edit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone. Vendors will no longer see this item.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
