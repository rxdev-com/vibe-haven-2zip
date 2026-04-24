import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Package,
  Loader2,
} from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { materialsAPI } from "@/lib/api";

const CATEGORIES = ["Oil", "Spice", "Grain", "Pulse", "Vegetable", "Dairy", "Other"];
const UNITS = ["kg", "litre", "piece", "dozen", "gram"];

const empty = {
  name: "",
  category: "Oil",
  price: "",
  unit: "kg",
  stock: "",
  description: "",
  image: "",
  minOrderQuantity: 1,
  origin: "",
};

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

  const refresh = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const data = await materialsAPI.getBySupplier(user._id, { limit: 100 });
      setItems(data.materials || []);
    } catch (e) {
      toast({ title: "Could not load", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const openAdd = () => {
    setEditing(null);
    setForm(empty);
    setOpen(true);
  };

  const openEdit = (it) => {
    setEditing(it);
    setForm({
      name: it.name || "",
      category: it.category || "Oil",
      price: it.price || "",
      unit: it.unit || "kg",
      stock: it.stock || "",
      description: it.description || "",
      image: it.image || "",
      minOrderQuantity: it.minOrderQuantity || 1,
      origin: it.origin || "",
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || form.stock === "") {
      toast({
        title: "Missing fields",
        description: "Name, price, and stock are required",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name,
      category: form.category,
      price: Number(form.price),
      unit: form.unit,
      stock: Number(form.stock),
      description: form.description,
      image: form.image,
      minOrderQuantity: Number(form.minOrderQuantity) || 1,
      origin: form.origin,
    };
    try {
      if (editing) {
        await materialsAPI.update(editing._id, payload);
        toast({ title: "Product updated" });
      } else {
        await materialsAPI.create(payload);
        toast({ title: "Product added" });
      }
      setOpen(false);
      await refresh();
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
      toast({ title: "Product deleted" });
      setDeleteId(null);
      await refresh();
    } catch (e) {
      toast({ title: "Delete failed", description: e.message, variant: "destructive" });
    }
  };

  const filtered = items.filter((i) =>
    !search || i.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="Inventory" badgeColor="bg-emerald-100 text-emerald-700" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              My Inventory
            </h1>
            <p className="text-gray-600 text-sm">
              {items.length} product(s) listed
            </p>
          </div>
          <Button
            onClick={openAdd}
            className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        </motion.div>

        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 mb-4">
                {search ? "No products match your search" : "You haven't added any products yet"}
              </p>
              {!search && (
                <Button
                  onClick={openAdd}
                  className="bg-gradient-to-r from-emerald-500 to-green-500"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add your first product
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filtered.map((it, i) => (
                <motion.div
                  key={it._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: Math.min(i, 10) * 0.04 }}
                >
                  <Card className="hover:shadow-lg transition-all overflow-hidden h-full flex flex-col">
                    <div className="relative h-40 bg-gradient-to-br from-emerald-100 to-green-100">
                      {it.image ? (
                        <img
                          src={it.image}
                          alt={it.name}
                          className="w-full h-full object-cover"
                          onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-12 h-12 text-emerald-300" />
                        </div>
                      )}
                      <Badge
                        className={`absolute top-2 right-2 ${
                          it.stock <= 0
                            ? "bg-red-500"
                            : it.stock < 10
                            ? "bg-orange-500"
                            : "bg-emerald-500"
                        } text-white`}
                      >
                        {it.stock <= 0
                          ? "Out of Stock"
                          : it.stock < 10
                          ? `${it.stock} left`
                          : "In Stock"}
                      </Badge>
                    </div>
                    <CardContent className="p-4 flex flex-col flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{it.name}</h3>
                      <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                        {it.description}
                      </p>
                      <div className="flex items-center justify-between mb-3 text-sm">
                        <Badge variant="outline">{it.category}</Badge>
                        <span className="text-gray-500">
                          {it.stock} {it.unit}
                        </span>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <p className="text-xl font-bold text-emerald-600">
                          ₹{it.price}
                          <span className="text-xs font-normal text-gray-500">
                            /{it.unit}
                          </span>
                        </p>
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => openEdit(it)}
                            aria-label="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setDeleteId(it._id)}
                            aria-label="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Product" : "Add Product"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update the product details" : "List a new raw material"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Premium Mustard Oil"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm({ ...form, category: v })}
                >
                  <SelectTrigger>
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
              </div>
              <div>
                <Label>Unit</Label>
                <Select
                  value={form.unit}
                  onValueChange={(v) => setForm({ ...form, unit: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITS.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Price (₹) *</Label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="180"
                />
              </div>
              <div>
                <Label>Stock *</Label>
                <Input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="50"
                />
              </div>
              <div>
                <Label>Min Order</Label>
                <Input
                  type="number"
                  value={form.minOrderQuantity}
                  onChange={(e) =>
                    setForm({ ...form, minOrderQuantity: e.target.value })
                  }
                  placeholder="1"
                />
              </div>
            </div>
            <div>
              <Label>Image URL</Label>
              <Input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label>Origin</Label>
              <Input
                value={form.origin}
                onChange={(e) => setForm({ ...form, origin: e.target.value })}
                placeholder="e.g. Rajasthan"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="Describe the product..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-emerald-500 to-green-500"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                </>
              ) : editing ? (
                "Update"
              ) : (
                "Add Product"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this product?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the product from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
