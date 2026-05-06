import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus, Package, TrendingUp, ShoppingBag, Clock, CheckCircle,
  Loader2, IndianRupee, Eye, Pencil, Trash2, MessageSquare, Bell,
  LogOut, BarChart2, ArrowRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/contexts/NotificationContext";
import { materialsAPI, ordersAPI } from "@/lib/api";

const STATUS_BADGE = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-indigo-100 text-indigo-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
};

function fmtINR(v) { return `₹${Number(v || 0).toLocaleString("en-IN")}`; }
function fmtDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-CA");
}

export default function SupplierDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { unreadCount } = useNotifications();
  const [tab, setTab] = useState(0);
  const [materials, setMaterials] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const [mData, oData] = await Promise.all([
        materialsAPI.getBySupplier(user._id, { limit: 100 }),
        ordersAPI.getAll({ limit: 100 }),
      ]);
      setMaterials(mData.materials || []);
      setOrders(oData.orders || []);
    } catch (e) {
      toast({ title: "Could not load data", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refreshData(); }, [user?._id]);

  const pendingOrders = orders.filter(o => o.status === "pending");
  const completedOrders = orders.filter(o => o.status === "delivered");
  const monthlyRevenue = completedOrders
    .filter(o => new Date(o.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
    .reduce((s, o) => s + (o.totalAmount || 0), 0);

  const topProducts = useMemo(() => {
    const map = {};
    orders.forEach(o => {
      (o.items || []).forEach(item => {
        const key = item.name;
        if (!map[key]) map[key] = { name: item.name, category: item.category || "General", orders: 0, revenue: 0 };
        map[key].orders++;
        map[key].revenue += item.total || 0;
      });
    });
    return Object.values(map).sort((a, b) => b.orders - a.orders).slice(0, 5);
  }, [orders]);

  const handleAccept = async (orderId) => {
    try {
      await ordersAPI.updateStatus(orderId, "confirmed", "Order accepted by supplier");
      toast({ title: "Order accepted" });
      refreshData();
    } catch (e) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    }
  };

  const handleReject = async (orderId) => {
    try {
      await ordersAPI.cancel(orderId, "Rejected by supplier");
      toast({ title: "Order rejected" });
      refreshData();
    } catch (e) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    }
  };

  const handleMarkDelivered = async (orderId) => {
    try {
      await ordersAPI.updateStatus(orderId, "delivered", "Delivered successfully");
      toast({ title: "Marked as delivered" });
      refreshData();
    } catch (e) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    }
  };

  const handleDeleteMaterial = async (id) => {
    try {
      await materialsAPI.delete(id);
      setMaterials(prev => prev.filter(m => m._id !== id));
      toast({ title: "Product removed" });
    } catch (e) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    }
  };

  const openWhatsApp = (phone, vendorName) => {
    const msg = encodeURIComponent(`Hi ${vendorName || ""}, regarding your order`);
    window.open(`https://wa.me/${(phone || "919876543210").replace(/\D/g, "")}?text=${msg}`, "_blank");
  };

  const TABS = ["Overview", "Inventory", "Orders"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-saffron-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">JB</span>
              </div>
              <span className="font-bold text-gray-900 hidden sm:block">JugaduBazar</span>
            </div>
            <Badge className="bg-emerald-100 text-emerald-700">Supplier Dashboard</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/supplier/notifications">
              <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">{unreadCount}</span>
                )}
              </Button>
            </Link>
            <Link to="/supplier/profile">
              <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-emerald-600 transition-colors">
                {(user?.name || "PS").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
              </div>
            </Link>
            <Button variant="outline" size="sm" onClick={() => { logout(); navigate("/"); }}>
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.businessName || user?.name}!</h1>
          <p className="text-sm text-gray-500">Manage your inventory and orders efficiently</p>
        </motion.div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Products", value: materials.length, icon: Package, color: "text-emerald-600", link: "/supplier/inventory" },
            { label: "Pending Orders", value: pendingOrders.length, icon: Clock, color: "text-orange-600", link: "/supplier/pending-orders" },
            { label: "Monthly Revenue", value: fmtINR(monthlyRevenue), icon: TrendingUp, color: "text-blue-600", link: "/supplier/revenue" },
            { label: "Completed Orders", value: completedOrders.length, icon: CheckCircle, color: "text-emerald-600", link: "/supplier/completed-orders" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Link to={s.link} className="block">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow group">
                  <CardContent className="p-4 flex items-center gap-3">
                    <s.icon className={`w-6 h-6 ${s.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">{s.label}</p>
                      <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Analytics Banner */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-6">
          <Link to="/supplier/analytics">
            <Card className="cursor-pointer hover:shadow-lg transition-all group border-0 bg-gradient-to-r from-emerald-500 to-blue-600 text-white overflow-hidden">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <BarChart2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Analytics & Reports</p>
                    <p className="text-white/80 text-sm">View business performance, top products, fulfillment rates & more</p>
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
              </CardContent>
            </Card>
          </Link>
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

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>
        ) : (
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {/* Overview Tab */}
            {tab === 0 && (
              <div className="space-y-5">
                <Card>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-lg mb-3">Recent Orders</h3>
                    <p className="text-xs text-gray-500 mb-3">Latest orders from vendors</p>
                    {orders.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-4">No orders yet</p>
                    ) : (
                      <div className="space-y-2">
                        {orders.slice(0, 5).map(o => {
                          const vendor = o.vendorId || o.vendor || {};
                          const vName = vendor.businessName || vendor.name || "Vendor";
                          const itemSummary = (o.items || []).map(i => `${i.name} (${i.quantity}${i.unit})`).join(", ");
                          return (
                            <div key={o._id} className="flex items-center justify-between py-2 border-b last:border-0">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm">{o.orderNumber}</span>
                                  <Badge className={STATUS_BADGE[o.status] || "bg-gray-100 text-gray-700"}>{o.status}</Badge>
                                </div>
                                <p className="text-xs text-gray-600">{vName}</p>
                                <p className="text-xs text-gray-400 truncate max-w-xs">{itemSummary}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">{fmtINR(o.totalAmount)}</p>
                                <p className="text-xs text-gray-400">{fmtDate(o.createdAt)}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <Button variant="outline" size="sm" className="mt-3" onClick={() => setTab(2)}>View All Orders</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-lg mb-1">Top Selling Products</h3>
                    <p className="text-xs text-gray-500 mb-3">Your best performing items</p>
                    {topProducts.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-4">No data yet</p>
                    ) : (
                      <div className="space-y-3">
                        {topProducts.map((p, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">{p.name}</p>
                              <p className="text-xs text-gray-400">{p.category}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-700">{p.orders} orders</p>
                              <p className="text-xs text-emerald-600">{fmtINR(p.revenue)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Inventory Tab */}
            {tab === 1 && (
              <div>
                <Card className="bg-white">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-lg">Inventory Management</h3>
                      <Link to="/supplier/inventory">
                        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-1">
                          <Plus className="w-4 h-4" /> Add Product
                        </Button>
                      </Link>
                    </div>
                    {materials.length === 0 ? (
                      <div className="text-center py-12">
                        <Package className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                        <p className="text-gray-500 mb-3">No products yet</p>
                        <Link to="/supplier/inventory"><Button>Add your first product</Button></Link>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {materials.map(m => (
                          <div key={m._id} className="flex items-center gap-4 p-3 border rounded-lg hover:shadow-sm transition-shadow">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="font-medium text-gray-900">{m.name}</span>
                                <Badge className={m.stock > 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}>
                                  {m.stock > 0 ? "active" : "out of stock"}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-500">{m.category}</p>
                              <p className="text-xs text-gray-400">
                                Price: {fmtINR(m.price)}/{m.unit} · Stock: {m.stock} {m.unit} · Orders: {m.totalOrders || 0} · Revenue: {fmtINR(m.totalRevenue || 0)}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon" className="w-8 h-8"><Eye className="w-4 h-4 text-gray-500" /></Button>
                              <Link to="/supplier/inventory">
                                <Button variant="ghost" size="icon" className="w-8 h-8"><Pencil className="w-4 h-4 text-blue-500" /></Button>
                              </Link>
                              <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => handleDeleteMaterial(m._id)}>
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Orders Tab */}
            {tab === 2 && (
              <div>
                <h3 className="font-semibold text-lg mb-4">Order Management</h3>
                {orders.length === 0 ? (
                  <Card><CardContent className="text-center py-12">
                    <ShoppingBag className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500">No orders yet</p>
                  </CardContent></Card>
                ) : (
                  <div className="space-y-4">
                    {orders.map(o => {
                      const vendor = o.vendorId || o.vendor || {};
                      const vName = vendor.businessName || vendor.name || "Vendor";
                      const vPhone = vendor.phone || "";
                      const vAddr = vendor.address || "";
                      const itemSummary = (o.items || []).map(i => `${i.name} (${i.quantity}${i.unit})`).join(", ");
                      return (
                        <Card key={o._id} className={o.status === "pending" ? "border-orange-200" : ""}>
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900">{o.orderNumber}</span>
                                <Badge className={STATUS_BADGE[o.status]}>{o.status}</Badge>
                              </div>
                              <div className="flex gap-2 flex-wrap justify-end">
                                {o.status === "pending" && (
                                  <>
                                    <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white gap-1 text-xs" onClick={() => handleAccept(o._id)}>
                                      <CheckCircle className="w-3 h-3" /> Accept
                                    </Button>
                                    <Button size="sm" variant="outline" className="text-red-600 border-red-200 gap-1 text-xs" onClick={() => handleReject(o._id)}>
                                      × Reject
                                    </Button>
                                  </>
                                )}
                                {(o.status === "confirmed" || o.status === "processing" || o.status === "shipped") && (
                                  <Button size="sm" variant="outline" className="text-xs gap-1" onClick={() => handleMarkDelivered(o._id)}>
                                    <CheckCircle className="w-3 h-3" /> Mark Delivered
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 gap-1 text-xs"
                                  onClick={() => openWhatsApp(vPhone, vName)}
                                >
                                  <MessageSquare className="w-3 h-3" /> WhatsApp
                                </Button>
                              </div>
                            </div>
                            <div className="text-sm space-y-2">
                              <div>
                                <p className="font-medium text-gray-700">Vendor Information</p>
                                <p className="text-xs text-gray-600">Name: {vName} &nbsp;&nbsp; Phone: {vPhone}</p>
                                {vAddr && <p className="text-xs text-gray-600">Location: {vAddr}</p>}
                              </div>
                              <div>
                                <p className="font-medium text-gray-700">Order Items</p>
                                <p className="text-xs text-gray-600">{itemSummary}</p>
                              </div>
                              <p className="text-xs text-gray-500">
                                Amount: <span className="font-medium text-gray-700">{fmtINR(o.totalAmount)}</span>
                                &nbsp; Date: {fmtDate(o.createdAt)}
                                &nbsp; Payment: {o.paymentStatus === "paid" ? "✅ Paid" : "⏳ Pending"}
                                &nbsp; Method: {o.paymentMethod === "cash" ? "COD" : o.paymentMethod?.toUpperCase()}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
