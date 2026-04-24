import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Bell,
  CheckCheck,
  Trash2,
  Package,
  Gift,
  AlertCircle,
  CheckCircle,
  Info,
  Star,
} from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";

const ICON_MAP = {
  order: Package,
  offer: Gift,
  success: CheckCircle,
  warning: AlertCircle,
  error: AlertCircle,
  rating: Star,
  info: Info,
};

const COLOR_MAP = {
  order: "text-blue-600 bg-blue-50",
  offer: "text-emerald-600 bg-emerald-50",
  success: "text-emerald-600 bg-emerald-50",
  warning: "text-yellow-600 bg-yellow-50",
  error: "text-red-600 bg-red-50",
  rating: "text-orange-600 bg-orange-50",
  info: "text-gray-600 bg-gray-50",
};

const formatTime = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d < 7) return `${d}d ago`;
  return new Date(date).toLocaleDateString("en-IN");
};

export default function NotificationPanel() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative" aria-label="Notifications">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="px-4 pt-4 pb-2 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg">Notifications</SheetTitle>
            <div className="flex gap-1">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  <CheckCheck className="w-4 h-4 mr-1" /> Mark all read
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Clear
                </Button>
              )}
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1">
          {notifications.length === 0 ? (
            <div className="text-center py-16 px-4 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              <AnimatePresence>
                {notifications.map((n) => {
                  const Icon = ICON_MAP[n.type] || Info;
                  const colors = COLOR_MAP[n.type] || COLOR_MAP.info;
                  const inner = (
                    <div className="flex gap-3 p-3 hover:bg-gray-50 transition-colors">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${colors}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={`text-sm ${
                              n.read ? "text-gray-600" : "font-semibold text-gray-900"
                            }`}
                          >
                            {n.title}
                          </p>
                          {!n.read && (
                            <span className="w-2 h-2 bg-saffron-500 rounded-full mt-1.5 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                          {n.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTime(n.timestamp)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 flex-shrink-0"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeNotification(n.id);
                        }}
                        aria-label="Remove"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  );
                  return (
                    <motion.div
                      key={n.id}
                      layout
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      onClick={() => !n.read && markAsRead(n.id)}
                    >
                      {n.actionUrl ? (
                        <Link
                          to={n.actionUrl}
                          onClick={() => setOpen(false)}
                          className="block"
                        >
                          {inner}
                        </Link>
                      ) : (
                        inner
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
