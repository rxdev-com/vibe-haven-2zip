import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import NotificationPanel from "@/components/NotificationPanel";
import ProfilePhoto from "@/components/ProfilePhoto";
import { useWhatsApp } from "@/lib/whatsapp";
import { Plus, Package, TrendingUp, ShoppingBag, Edit, Trash2, Eye, CheckCircle, XCircle, Clock, MessageSquare } from "lucide-react";
// Mock vendor data for WhatsApp integration
const mockVendors = [
    {
        id: "V001",
        name: "Rajesh's Chaat Corner",
        phone: "+91 98765 43210",
        location: "CP, Delhi"
    },
    {
        id: "V002",
        name: "Sharma Snacks",
        phone: "+91 87654 32109",
        location: "Karol Bagh, Delhi"
    },
    {
        id: "V003",
        name: "Mumbai Street Food",
        phone: "+91 76543 21098",
        location: "Bandra, Mumbai"
    }
];
// Mock data
const inventory = [
    {
        id: 1,
        name: "Premium Mustard Oil",
        category: "Oils & Fats",
        price: 180,
        stock: 50,
        unit: "liter",
        status: "active",
        orders: 24,
        revenue: 4320
    },
    {
        id: 2,
        name: "Garam Masala Powder",
        category: "Spices",
        price: 320,
        stock: 25,
        unit: "kg",
        status: "active",
        orders: 18,
        revenue: 5760
    },
    {
        id: 3,
        name: "Basmati Rice",
        category: "Grains",
        price: 120,
        stock: 0,
        unit: "kg",
        status: "out-of-stock",
        orders: 12,
        revenue: 1440
    }
];
const recentOrders = [
    {
        id: "ORD001",
        vendor: "Rajesh's Chaat Corner",
        vendorPhone: "+91 98765 43210",
        vendorLocation: "CP, Delhi",
        items: "Mustard Oil (2L), Garam Masala (1kg)",
        amount: 680,
        status: "pending",
        date: "2024-01-15"
    },
    {
        id: "ORD002",
        vendor: "Sharma Snacks",
        vendorPhone: "+91 87654 32109",
        vendorLocation: "Karol Bagh, Delhi",
        items: "Basmati Rice (5kg)",
        amount: 600,
        status: "confirmed",
        date: "2024-01-15"
    },
    {
        id: "ORD003",
        vendor: "Mumbai Street Food",
        vendorPhone: "+91 76543 21098",
        vendorLocation: "Bandra, Mumbai",
        items: "Garam Masala (2kg), Mustard Oil (1L)",
        amount: 820,
        status: "delivered",
        date: "2024-01-14"
    }
];
export default function SupplierDashboard() {
    const { addNotification } = useNotifications();
    const { user, logout } = useAuth();
    const { chatWithSupplier } = useWhatsApp();
    const [profileImage, setProfileImage] = useState("");
    // Load saved profile image from localStorage
    useEffect(()=>{
        const savedImage = localStorage.getItem("profileImage");
        if (savedImage) {
            setProfileImage(savedImage);
        }
    }, []);
    const [activeTab, setActiveTab] = useState("overview");
    const getStatusColor = (status)=>{
        switch(status){
            case "pending":
                return "bg-yellow-100 text-yellow-700";
            case "confirmed":
                return "bg-blue-100 text-blue-700";
            case "delivered":
                return "bg-green-100 text-green-700";
            case "active":
                return "bg-green-100 text-green-700";
            case "out-of-stock":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };
    const handleOrderAction = (orderId, action)=>{
        console.log(`${action} order ${orderId}`);
        if (action === "accept") {
            addNotification({
                title: "Order Accepted",
                message: `Order ${orderId} has been accepted and vendor will be notified`,
                type: "success",
                icon: "✅"
            });
        } else {
            addNotification({
                title: "Order Rejected",
                message: `Order ${orderId} has been rejected`,
                type: "warning",
                icon: "❌"
            });
        }
    };
    const handleInventoryAction = (itemId, action)=>{
        const item = inventory.find((i)=>i.id === itemId);
        if (!item) return;
        switch(action){
            case "view":
                addNotification({
                    title: "Viewing Product",
                    message: `Opening details for ${item.name}`,
                    type: "info",
                    icon: "👁️"
                });
                break;
            case "edit":
                addNotification({
                    title: "Edit Product",
                    message: `Opening edit form for ${item.name}`,
                    type: "info",
                    icon: "✏️"
                });
                break;
            case "delete":
                addNotification({
                    title: "Delete Product",
                    message: `${item.name} will be removed from inventory`,
                    type: "warning",
                    icon: "🗑️"
                });
                break;
        }
    };
    const handleAddProduct = ()=>{
        addNotification({
            title: "Add New Product",
            message: "Opening product creation form",
            type: "info",
            icon: "➕"
        });
    };
    const chatWithVendor = (vendorName, vendorPhone, orderId)=>{
        chatWithSupplier({
            supplierName: vendorName,
            supplierPhone: vendorPhone,
            customMessage: orderId ? `Hi ${vendorName}! This is Kumar Oil Mills regarding your order ${orderId}. Please let me know if you have any questions about your order status or delivery details.` : `Hi ${vendorName}! This is Kumar Oil Mills. Thank you for your interest in our products. How can I help you today?`,
            vendorName: "Kumar Oil Mills"
        });
    };
    return /*#__PURE__*/ React.createElement("div", {
        className: "min-h-screen bg-gray-50"
    }, /* Header */ /*#__PURE__*/ React.createElement("header", {
        className: "bg-white border-b sticky top-0 z-40"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-center h-16"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-4"
    }, /*#__PURE__*/ React.createElement(Link, {
        to: "/",
        className: "flex items-center space-x-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-8 h-8 bg-gradient-to-r from-saffron-500 to-emerald-500 rounded-lg flex items-center justify-center"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-white font-bold text-sm"
    }, "JB")), /*#__PURE__*/ React.createElement("span", {
        className: "text-xl font-bold bg-gradient-to-r from-saffron-600 to-emerald-600 bg-clip-text text-transparent"
    }, "JugaduBazar")), /*#__PURE__*/ React.createElement(Badge, {
        className: "bg-emerald-100 text-emerald-700"
    }, "Supplier Dashboard")), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-4"
    }, /*#__PURE__*/ React.createElement(NotificationPanel, null), /*#__PURE__*/ React.createElement(Link, {
        to: "/supplier/profile",
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(ProfilePhoto, {
        currentImage: profileImage,
        userName: user?.name || "User",
        size: "sm",
        onImageChange: (url)=>{
            setProfileImage(url);
        }
    })), /*#__PURE__*/ React.createElement(Button, {
        variant: "outline",
        size: "sm",
        onClick: logout
    }, "Logout"))))), /*#__PURE__*/ React.createElement("div", {
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    }, /* Welcome Section */ /*#__PURE__*/ React.createElement("div", {
        className: "mb-8"
    }, /*#__PURE__*/ React.createElement("h1", {
        className: "text-3xl font-bold text-gray-900 mb-2"
    }, "Welcome back, Kumar Oil Mills!"), /*#__PURE__*/ React.createElement("p", {
        className: "text-gray-600"
    }, "Manage your inventory and orders efficiently")), /* Quick Stats */ /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
    }, /*#__PURE__*/ React.createElement(Link, {
        to: "/supplier/inventory"
    }, /*#__PURE__*/ React.createElement(Card, {
        className: "hover:shadow-lg transition-shadow cursor-pointer"
    }, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(Package, {
        className: "w-8 h-8 text-emerald-500 mr-3"
    }), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-600"
    }, "Total Products"), /*#__PURE__*/ React.createElement("p", {
        className: "text-2xl font-bold text-gray-900"
    }, inventory.length)))))), /*#__PURE__*/ React.createElement(Link, {
        to: "/supplier/pending-orders"
    }, /*#__PURE__*/ React.createElement(Card, {
        className: "hover:shadow-lg transition-shadow cursor-pointer"
    }, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(ShoppingBag, {
        className: "w-8 h-8 text-saffron-500 mr-3"
    }), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-600"
    }, "Pending Orders"), /*#__PURE__*/ React.createElement("p", {
        className: "text-2xl font-bold text-gray-900"
    }, recentOrders.filter((o)=>o.status === "pending").length)))))), /*#__PURE__*/ React.createElement(Link, {
        to: "/supplier/revenue"
    }, /*#__PURE__*/ React.createElement(Card, {
        className: "hover:shadow-lg transition-shadow cursor-pointer"
    }, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(TrendingUp, {
        className: "w-8 h-8 text-blue-500 mr-3"
    }), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-600"
    }, "Monthly Revenue"), /*#__PURE__*/ React.createElement("p", {
        className: "text-2xl font-bold text-gray-900"
    }, "₹32,450")))))), /*#__PURE__*/ React.createElement(Link, {
        to: "/supplier/completed-orders"
    }, /*#__PURE__*/ React.createElement(Card, {
        className: "hover:shadow-lg transition-shadow cursor-pointer"
    }, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(CheckCircle, {
        className: "w-8 h-8 text-green-500 mr-3"
    }), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-600"
    }, "Completed Orders"), /*#__PURE__*/ React.createElement("p", {
        className: "text-2xl font-bold text-gray-900"
    }, "187"))))))), /* Main Content Tabs */ /*#__PURE__*/ React.createElement(Tabs, {
        value: activeTab,
        onValueChange: setActiveTab,
        className: "space-y-6"
    }, /*#__PURE__*/ React.createElement(TabsList, {
        className: "grid w-full grid-cols-3"
    }, /*#__PURE__*/ React.createElement(TabsTrigger, {
        value: "overview"
    }, "Overview"), /*#__PURE__*/ React.createElement(TabsTrigger, {
        value: "inventory"
    }, "Inventory"), /*#__PURE__*/ React.createElement(TabsTrigger, {
        value: "orders"
    }, "Orders")), /*#__PURE__*/ React.createElement(TabsContent, {
        value: "overview",
        className: "space-y-6"
    }, /* Recent Orders Summary */ /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, null, "Recent Orders"), /*#__PURE__*/ React.createElement(CardDescription, null, "Latest orders from vendors")), /*#__PURE__*/ React.createElement(CardContent, null, /*#__PURE__*/ React.createElement("div", {
        className: "space-y-4"
    }, recentOrders.slice(0, 3).map((order)=>/*#__PURE__*/ React.createElement("div", {
            key: order.id,
            className: "flex items-center justify-between p-4 border rounded-lg"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex-1"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center space-x-3"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "font-medium"
        }, order.id), /*#__PURE__*/ React.createElement(Badge, {
            className: getStatusColor(order.status)
        }, order.status)), /*#__PURE__*/ React.createElement("p", {
            className: "text-sm text-gray-600 mt-1"
        }, order.vendor), /*#__PURE__*/ React.createElement("p", {
            className: "text-sm text-gray-500"
        }, order.items)), /*#__PURE__*/ React.createElement("div", {
            className: "text-right"
        }, /*#__PURE__*/ React.createElement("p", {
            className: "font-semibold"
        }, "₹", order.amount), /*#__PURE__*/ React.createElement("p", {
            className: "text-sm text-gray-500"
        }, order.date))))))), /* Top Selling Products */ /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, null, "Top Selling Products"), /*#__PURE__*/ React.createElement(CardDescription, null, "Your best performing items")), /*#__PURE__*/ React.createElement(CardContent, null, /*#__PURE__*/ React.createElement("div", {
        className: "space-y-4"
    }, inventory.sort((a, b)=>b.orders - a.orders).slice(0, 3).map((item)=>/*#__PURE__*/ React.createElement("div", {
            key: item.id,
            className: "flex items-center justify-between"
        }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
            className: "font-medium"
        }, item.name), /*#__PURE__*/ React.createElement("p", {
            className: "text-sm text-gray-500"
        }, item.category)), /*#__PURE__*/ React.createElement("div", {
            className: "text-right"
        }, /*#__PURE__*/ React.createElement("p", {
            className: "font-semibold"
        }, item.orders, " orders"), /*#__PURE__*/ React.createElement("p", {
            className: "text-sm text-green-600"
        }, "₹", item.revenue)))))))), /*#__PURE__*/ React.createElement(TabsContent, {
        value: "inventory",
        className: "space-y-6"
    }, /* Add Product Button */ /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-center"
    }, /*#__PURE__*/ React.createElement("h2", {
        className: "text-2xl font-bold text-gray-900"
    }, "Inventory Management"), /*#__PURE__*/ React.createElement(Button, {
        className: "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600",
        onClick: handleAddProduct
    }, /*#__PURE__*/ React.createElement(Plus, {
        className: "w-4 h-4 mr-2"
    }), "Add Product")), /* Inventory Grid */ /*#__PURE__*/ React.createElement("div", {
        className: "grid gap-6"
    }, inventory.map((item)=>/*#__PURE__*/ React.createElement(Card, {
            key: item.id
        }, /*#__PURE__*/ React.createElement(CardContent, {
            className: "p-6"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center justify-between"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex-1"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center space-x-3 mb-2"
        }, /*#__PURE__*/ React.createElement("h3", {
            className: "text-lg font-semibold"
        }, item.name), /*#__PURE__*/ React.createElement(Badge, {
            className: getStatusColor(item.status)
        }, item.status)), /*#__PURE__*/ React.createElement("p", {
            className: "text-gray-600 mb-1"
        }, item.category), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center space-x-6 text-sm text-gray-500"
        }, /*#__PURE__*/ React.createElement("span", null, "Price: ₹", item.price, "/", item.unit), /*#__PURE__*/ React.createElement("span", null, "Stock: ", item.stock, " ", item.unit), /*#__PURE__*/ React.createElement("span", null, "Orders: ", item.orders), /*#__PURE__*/ React.createElement("span", null, "Revenue: ₹", item.revenue))), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center space-x-2"
        }, /*#__PURE__*/ React.createElement(Button, {
            variant: "outline",
            size: "sm",
            onClick: ()=>handleInventoryAction(item.id, "view"),
            title: "View Details"
        }, /*#__PURE__*/ React.createElement(Eye, {
            className: "w-4 h-4"
        })), /*#__PURE__*/ React.createElement(Button, {
            variant: "outline",
            size: "sm",
            onClick: ()=>handleInventoryAction(item.id, "edit"),
            title: "Edit Product"
        }, /*#__PURE__*/ React.createElement(Edit, {
            className: "w-4 h-4"
        })), /*#__PURE__*/ React.createElement(Button, {
            variant: "outline",
            size: "sm",
            className: "text-red-600 hover:text-red-700",
            onClick: ()=>handleInventoryAction(item.id, "delete"),
            title: "Delete Product"
        }, /*#__PURE__*/ React.createElement(Trash2, {
            className: "w-4 h-4"
        }))))))))), /*#__PURE__*/ React.createElement(TabsContent, {
        value: "orders",
        className: "space-y-6"
    }, /*#__PURE__*/ React.createElement("h2", {
        className: "text-2xl font-bold text-gray-900"
    }, "Order Management"), /* Orders List */ /*#__PURE__*/ React.createElement("div", {
        className: "space-y-4"
    }, recentOrders.map((order)=>/*#__PURE__*/ React.createElement(Card, {
            key: order.id
        }, /*#__PURE__*/ React.createElement(CardContent, {
            className: "p-6"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-start justify-between"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex-1"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center space-x-3 mb-3"
        }, /*#__PURE__*/ React.createElement("h3", {
            className: "text-lg font-semibold"
        }, order.id), /*#__PURE__*/ React.createElement(Badge, {
            className: getStatusColor(order.status)
        }, order.status)), /* Vendor Details */ /*#__PURE__*/ React.createElement("div", {
            className: "bg-gray-50 rounded-lg p-4 mb-3"
        }, /*#__PURE__*/ React.createElement("h4", {
            className: "font-medium text-gray-900 mb-2"
        }, "Vendor Information"), /*#__PURE__*/ React.createElement("div", {
            className: "grid grid-cols-1 md:grid-cols-2 gap-2 text-sm"
        }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("span", {
            className: "text-gray-600"
        }, "Name:"), /*#__PURE__*/ React.createElement("span", {
            className: "ml-2 font-medium"
        }, order.vendor)), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("span", {
            className: "text-gray-600"
        }, "Phone:"), /*#__PURE__*/ React.createElement("span", {
            className: "ml-2 font-medium"
        }, order.vendorPhone)), /*#__PURE__*/ React.createElement("div", {
            className: "md:col-span-2"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "text-gray-600"
        }, "Location:"), /*#__PURE__*/ React.createElement("span", {
            className: "ml-2 font-medium"
        }, order.vendorLocation)))), /* Order Details */ /*#__PURE__*/ React.createElement("div", {
            className: "mb-3"
        }, /*#__PURE__*/ React.createElement("h4", {
            className: "font-medium text-gray-900 mb-1"
        }, "Order Items"), /*#__PURE__*/ React.createElement("p", {
            className: "text-sm text-gray-600 mb-2"
        }, order.items)), /* Payment & Date Info */ /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center space-x-6 text-sm text-gray-500"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "text-gray-600"
        }, "Amount:"), /*#__PURE__*/ React.createElement("span", {
            className: "ml-1 font-semibold text-green-600"
        }, "₹", order.amount)), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "text-gray-600"
        }, "Date:"), /*#__PURE__*/ React.createElement("span", {
            className: "ml-1"
        }, order.date)), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "text-gray-600"
        }, "Payment:"), /*#__PURE__*/ React.createElement("span", {
            className: "ml-1"
        }, order.status === "delivered" ? "Completed" : "Pending")))), /* Action Buttons */ /*#__PURE__*/ React.createElement("div", {
            className: "flex flex-col items-end space-y-2 ml-4"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center space-x-2"
        }, order.status === "pending" && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement(Button, {
            size: "sm",
            className: "bg-green-500 hover:bg-green-600",
            onClick: ()=>handleOrderAction(order.id, "accept")
        }, /*#__PURE__*/ React.createElement(CheckCircle, {
            className: "w-4 h-4 mr-1"
        }), "Accept"), /*#__PURE__*/ React.createElement(Button, {
            variant: "outline",
            size: "sm",
            className: "text-red-600 hover:text-red-700",
            onClick: ()=>handleOrderAction(order.id, "reject")
        }, /*#__PURE__*/ React.createElement(XCircle, {
            className: "w-4 h-4 mr-1"
        }), "Reject")), order.status === "confirmed" && /*#__PURE__*/ React.createElement(Button, {
            size: "sm",
            variant: "outline",
            onClick: ()=>{
                addNotification({
                    title: "Order Marked as Delivered",
                    message: `Order ${order.id} has been marked as delivered`,
                    type: "success",
                    icon: "✅"
                });
            }
        }, /*#__PURE__*/ React.createElement(Clock, {
            className: "w-4 h-4 mr-1"
        }), "Mark Delivered"), /*#__PURE__*/ React.createElement(Button, {
            variant: "outline",
            size: "sm",
            onClick: ()=>{
                addNotification({
                    title: "Viewing Order Details",
                    message: `Opening detailed view for order ${order.id}`,
                    type: "info",
                    icon: "👁️"
                });
            },
            title: "View Details"
        }, /*#__PURE__*/ React.createElement(Eye, {
            className: "w-4 h-4"
        }))), /* WhatsApp Chat Button */ /*#__PURE__*/ React.createElement(Button, {
            variant: "outline",
            size: "sm",
            onClick: ()=>chatWithVendor(order.vendor, order.vendorPhone, order.id),
            className: "bg-green-50 border-green-200 text-green-700 hover:bg-green-100 w-full"
        }, /*#__PURE__*/ React.createElement(MessageSquare, {
            className: "w-4 h-4 mr-2"
        }), "Chat on WhatsApp")))))))))));
}
