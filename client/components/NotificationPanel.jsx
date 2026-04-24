import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useNotifications } from "@/contexts/NotificationContext";
import { Bell, X, CheckCheck, Trash2, Package, Gift, AlertCircle, CheckCircle, Info } from "lucide-react";
export default function NotificationPanel() {
    const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const getNotificationIcon = (type)=>{
        switch(type){
            case "order":
                return /*#__PURE__*/ React.createElement(Package, {
                    className: "w-4 h-4"
                });
            case "offer":
                return /*#__PURE__*/ React.createElement(Gift, {
                    className: "w-4 h-4"
                });
            case "success":
                return /*#__PURE__*/ React.createElement(CheckCircle, {
                    className: "w-4 h-4"
                });
            case "warning":
                return /*#__PURE__*/ React.createElement(AlertCircle, {
                    className: "w-4 h-4"
                });
            case "error":
                return /*#__PURE__*/ React.createElement(AlertCircle, {
                    className: "w-4 h-4"
                });
            default:
                return /*#__PURE__*/ React.createElement(Info, {
                    className: "w-4 h-4"
                });
        }
    };
    const getNotificationColor = (type)=>{
        switch(type){
            case "order":
                return "text-blue-600 bg-blue-50";
            case "offer":
                return "text-green-600 bg-green-50";
            case "success":
                return "text-green-600 bg-green-50";
            case "warning":
                return "text-yellow-600 bg-yellow-50";
            case "error":
                return "text-red-600 bg-red-50";
            default:
                return "text-gray-600 bg-gray-50";
        }
    };
    const formatTime = (date)=>{
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };
    return /*#__PURE__*/ React.createElement(Sheet, {
        open: isOpen,
        onOpenChange: setIsOpen
    }, /*#__PURE__*/ React.createElement(SheetTrigger, {
        asChild: true
    }, /*#__PURE__*/ React.createElement(Button, {
        variant: "ghost",
        size: "sm",
        className: "relative"
    }, /*#__PURE__*/ React.createElement(Bell, {
        className: "w-5 h-5"
    }), unreadCount > 0 && /*#__PURE__*/ React.createElement("span", {
        className: "absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
    }, unreadCount > 9 ? "9+" : unreadCount))), /*#__PURE__*/ React.createElement(SheetContent, {
        className: "w-full sm:w-96"
    }, /*#__PURE__*/ React.createElement(SheetHeader, null, /*#__PURE__*/ React.createElement(SheetTitle, {
        className: "flex items-center justify-between"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(Bell, {
        className: "w-5 h-5 mr-2"
    }), "Notifications"), unreadCount > 0 && /*#__PURE__*/ React.createElement(Badge, {
        variant: "secondary",
        className: "bg-red-100 text-red-700"
    }, unreadCount, " new")), /*#__PURE__*/ React.createElement(SheetDescription, null, "Stay updated with your orders and offers")), notifications.length > 0 && /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between mt-4 mb-2"
    }, /*#__PURE__*/ React.createElement(Button, {
        variant: "ghost",
        size: "sm",
        onClick: markAllAsRead,
        disabled: unreadCount === 0
    }, /*#__PURE__*/ React.createElement(CheckCheck, {
        className: "w-4 h-4 mr-2"
    }), "Mark all read"), /*#__PURE__*/ React.createElement(Button, {
        variant: "ghost",
        size: "sm",
        onClick: clearAll,
        className: "text-red-600 hover:text-red-700"
    }, /*#__PURE__*/ React.createElement(Trash2, {
        className: "w-4 h-4 mr-2"
    }), "Clear all")), /*#__PURE__*/ React.createElement(ScrollArea, {
        className: "h-[calc(100vh-200px)] mt-4"
    }, notifications.length === 0 ? /*#__PURE__*/ React.createElement("div", {
        className: "text-center py-12"
    }, /*#__PURE__*/ React.createElement(Bell, {
        className: "w-12 h-12 text-gray-300 mx-auto mb-4"
    }), /*#__PURE__*/ React.createElement("p", {
        className: "text-gray-500"
    }, "No notifications yet"), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-400 mt-1"
    }, "We'll notify you when something important happens")) : /*#__PURE__*/ React.createElement("div", {
        className: "space-y-3"
    }, notifications.map((notification, index)=>/*#__PURE__*/ React.createElement(React.Fragment, {
            key: notification.id
        }, /*#__PURE__*/ React.createElement(Card, {
            className: `transition-all duration-200 hover:shadow-md cursor-pointer ${!notification.read ? "border-l-4 border-l-saffron-500 bg-saffron-50/30" : ""}`,
            onClick: ()=>{
                markAsRead(notification.id);
                if (notification.actionUrl) {
                    setIsOpen(false);
                    // Navigate to action URL
                    window.location.href = notification.actionUrl;
                }
            }
        }, /*#__PURE__*/ React.createElement(CardContent, {
            className: "p-4"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-start justify-between"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-start space-x-3 flex-1"
        }, /*#__PURE__*/ React.createElement("div", {
            className: `p-2 rounded-full ${getNotificationColor(notification.type)}`
        }, getNotificationIcon(notification.type)), /*#__PURE__*/ React.createElement("div", {
            className: "flex-1 min-w-0"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center justify-between"
        }, /*#__PURE__*/ React.createElement("h4", {
            className: "font-medium text-gray-900 truncate"
        }, notification.title, notification.icon && /*#__PURE__*/ React.createElement("span", {
            className: "ml-2"
        }, notification.icon)), /*#__PURE__*/ React.createElement(Button, {
            variant: "ghost",
            size: "sm",
            className: "p-1 h-auto text-gray-400 hover:text-gray-600",
            onClick: (e)=>{
                e.stopPropagation();
                removeNotification(notification.id);
            }
        }, /*#__PURE__*/ React.createElement(X, {
            className: "w-3 h-3"
        }))), /*#__PURE__*/ React.createElement("p", {
            className: "text-sm text-gray-600 mt-1"
        }, notification.message), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center justify-between mt-2"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "text-xs text-gray-400"
        }, formatTime(notification.timestamp)), !notification.read && /*#__PURE__*/ React.createElement("div", {
            className: "w-2 h-2 bg-saffron-500 rounded-full"
        }))))))), index < notifications.length - 1 && /*#__PURE__*/ React.createElement(Separator, {
            className: "my-2"
        })))))));
}
