import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Bell, Package, CheckCircle, AlertCircle,
  Info, Star, Trash2, MailOpen, Loader2, RefreshCw,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { useToast } from "@/hooks/use-toast";

function timeAgo(date) {
  const d = new Date(date);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

const TYPE_ICON = {
  order: <Package className="w-5 h-5 text-saffron-600" />,
  success: <CheckCircle className="w-5 h-5 text-emerald-600" />,
  warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
  rating: <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />,
};

const TYPE_BG = {
  order: "bg-orange-50 border-orange-100",
  success: "bg-emerald-50 border-emerald-100",
  warning: "bg-yellow-50 border-yellow-100",
  info: "bg-blue-50 border-blue-100",
  rating: "bg-yellow-50 border-yellow-100",
};

export default function SupplierNotifications() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    notifications, unreadCount, markAsRead, markAllAsRead,
    removeNotification, clearAll, refresh,
  } = useNotifications();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const filtered = notifications.filter(n => {
    if (filter === "unread") return !n.read;
    if (filter === "order") return n.type === "order";
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-r from-saffron-500 to-emerald-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">JB</span>
              </div>
              <span className="font-bold text-gray-900 hidden sm:block">JugaduBazar</span>
            </div>
            <Badge className="bg-emerald-100 text-emerald-700">Supplier</Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm">
              {(user?.name || "S").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <Button variant="outline" size="sm" onClick={() => { logout(); navigate("/"); }}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/supplier/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-emerald-600">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Bell className="w-6 h-6 text-emerald-600" /> Notifications
            </h1>
            <p className="text-sm text-gray-500">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}` : "All caught up!"}
            </p>
          </div>
        </div>

        {/* Actions bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            {["all", "unread", "order"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
                  filter === f
                    ? "bg-emerald-500 text-white"
                    : "bg-white border text-gray-600 hover:bg-gray-50"
                }`}
              >
                {f}
                {f === "unread" && unreadCount > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5">{unreadCount}</span>
                )}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`w-4 h-4 mr-1 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                <MailOpen className="w-4 h-4 mr-1" /> Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={clearAll}>
                <Trash2 className="w-4 h-4 mr-1" /> Clear all
              </Button>
            )}
          </div>
        </div>

        {/* Notification list */}
        {refreshing ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <Bell className="w-12 h-12 mx-auto mb-3 text-gray-200" />
              <p className="text-gray-500 font-medium">No notifications</p>
              <p className="text-sm text-gray-400 mt-1">
                {filter === "unread" ? "No unread notifications" : "You're all caught up!"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <AnimatePresence>
            <div className="space-y-2">
              {filtered.map((n, i) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: Math.min(i, 8) * 0.04 }}
                >
                  <Card
                    className={`cursor-pointer border transition-all hover:shadow-sm ${
                      !n.read ? TYPE_BG[n.type] || "bg-blue-50 border-blue-100" : "bg-white"
                    }`}
                    onClick={() => !n.read && markAsRead(n.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex-shrink-0">
                          {TYPE_ICON[n.type] || <Bell className="w-5 h-5 text-gray-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className={`text-sm font-semibold ${!n.read ? "text-gray-900" : "text-gray-700"}`}>
                              {n.title}
                            </p>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-xs text-gray-400">{timeAgo(n.timestamp)}</span>
                              {!n.read && <span className="w-2 h-2 bg-emerald-500 rounded-full" />}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{n.message}</p>
                          {n.actionUrl && (
                            <Link
                              to={n.actionUrl}
                              className="text-xs text-emerald-600 hover:underline mt-1 inline-block"
                              onClick={e => e.stopPropagation()}
                            >
                              View details →
                            </Link>
                          )}
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); removeNotification(n.id); }}
                          className="flex-shrink-0 text-gray-300 hover:text-red-400 transition-colors mt-0.5"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
