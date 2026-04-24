import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { notificationsAPI } from "@/lib/api";

const NotificationContext = createContext(undefined);

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error("useNotifications must be used within a NotificationProvider");
  return ctx;
}

const ICON_FOR_TYPE = {
  order: "📦",
  offer: "🎉",
  success: "✅",
  warning: "⚠️",
  info: "🔔",
  rating: "⭐",
};

const toUi = (n) => ({
  id: n._id || n.id,
  title: n.title,
  message: n.message,
  type: n.type || "info",
  read: !!n.read,
  timestamp: new Date(n.createdAt || n.timestamp || Date.now()),
  actionUrl: n.actionUrl || null,
  icon: n.icon || ICON_FOR_TYPE[n.type] || "🔔",
});

export function NotificationProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState([]);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      return;
    }
    try {
      const data = await notificationsAPI.getAll();
      setNotifications((data.notifications || []).map(toUi));
    } catch (e) {
      // silent
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refresh();
    if (!isAuthenticated) return;
    // Lightweight polling so new notifications appear within ~20 s
    const t = setInterval(refresh, 20000);
    return () => clearInterval(t);
  }, [refresh, isAuthenticated]);

  const addNotification = useCallback(
    (notification) => {
      // Local-only ephemeral notification (e.g., toast for an in-app event)
      const item = {
        ...notification,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        timestamp: new Date(),
        read: false,
        icon: notification.icon || ICON_FOR_TYPE[notification.type] || "🔔",
      };
      setNotifications((prev) => [item, ...prev]);
      toast({
        title: notification.title,
        description: notification.message,
        duration: 5000,
      });
    },
    [toast],
  );

  const markAsRead = useCallback(async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    try {
      await notificationsAPI.markRead(id);
    } catch (e) {
      // silent
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await notificationsAPI.markAllRead();
    } catch (e) {
      // silent
    }
  }, []);

  const removeNotification = useCallback(async (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    try {
      await notificationsAPI.remove(id);
    } catch (e) {
      // silent
    }
  }, []);

  const clearAll = useCallback(async () => {
    setNotifications([]);
    try {
      await notificationsAPI.clear();
    } catch (e) {
      // silent
    }
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
        refresh,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
