import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import NotificationPanel from "@/components/NotificationPanel";
import ProfilePhoto from "@/components/ProfilePhoto";
import LanguageSelector, { useTranslation } from "@/components/LanguageSelector";
import { ArrowLeft, Package, Clock, MapPin, Phone, MessageSquare, Truck, Eye, CheckCircle } from "lucide-react";
// Real-time order data for the logged-in user
const getActiveOrdersForUser = (userId)=>[
        {
            id: "ORD001",
            supplierName: "Kumar Oil Mills",
            supplierPhone: "+91 87654 32109",
            supplierLocation: "Industrial Area, Noida",
            items: [
                {
                    name: "Premium Mustard Oil",
                    quantity: 2,
                    unit: "liter",
                    price: 180
                },
                {
                    name: "Garam Masala Powder",
                    quantity: 1,
                    unit: "kg",
                    price: 320
                }
            ],
            totalAmount: 680,
            status: "confirmed",
            orderDate: "2024-01-15T10:30:00Z",
            estimatedDelivery: "2024-01-16T14:00:00Z",
            currentLocation: "Out for delivery",
            trackingId: "TRK001234",
            paymentStatus: "paid",
            notes: "Please deliver before 2 PM",
            priority: "normal"
        },
        {
            id: "ORD002",
            supplierName: "Delhi Spice Corner",
            supplierPhone: "+91 76543 21098",
            supplierLocation: "Chandni Chowk, Delhi",
            items: [
                {
                    name: "Premium Saffron",
                    quantity: 100,
                    unit: "gram",
                    price: 800
                },
                {
                    name: "Red Chili Powder",
                    quantity: 2,
                    unit: "kg",
                    price: 280
                }
            ],
            totalAmount: 1360,
            status: "processing",
            orderDate: "2024-01-15T14:20:00Z",
            estimatedDelivery: "2024-01-17T16:00:00Z",
            currentLocation: "Being prepared",
            trackingId: "TRK001235",
            paymentStatus: "pending",
            notes: "High-quality saffron required",
            priority: "high"
        },
        {
            id: "ORD003",
            supplierName: "Fresh Vegetables Co",
            supplierPhone: "+91 98765 43210",
            supplierLocation: "Azadpur Mandi, Delhi",
            items: [
                {
                    name: "Fresh Onions",
                    quantity: 10,
                    unit: "kg",
                    price: 40
                },
                {
                    name: "Tomatoes",
                    quantity: 5,
                    unit: "kg",
                    price: 60
                },
                {
                    name: "Green Chilies",
                    quantity: 2,
                    unit: "kg",
                    price: 80
                }
            ],
            totalAmount: 740,
            status: "shipped",
            orderDate: "2024-01-14T09:15:00Z",
            estimatedDelivery: "2024-01-15T18:00:00Z",
            currentLocation: "In transit - 5 km away",
            trackingId: "TRK001233",
            paymentStatus: "paid",
            notes: "Handle with care - perishable items",
            priority: "urgent"
        }
    ];
export default function VendorActiveOrders() {
    const { addNotification } = useNotifications();
    const { user, logout } = useAuth();
    const [language, setLanguage] = useState('en');
    const { t } = useTranslation(language);
    const [profileImage, setProfileImage] = useState("");
    const [orders, setOrders] = useState(getActiveOrdersForUser(user?.id || ""));
    const [selectedOrder, setSelectedOrder] = useState(null);
    useEffect(()=>{
        const savedImage = localStorage.getItem("profileImage");
        if (savedImage) setProfileImage(savedImage);
        const savedLang = localStorage.getItem("preferred_language");
        if (savedLang) setLanguage(savedLang);
        // Simulate real-time updates
        const interval = setInterval(()=>{
            setOrders((prev)=>prev.map((order)=>{
                    if (order.status === "shipped" && Math.random() > 0.7) {
                        return {
                            ...order,
                            currentLocation: "Delivered ✅"
                        };
                    }
                    return order;
                }));
        }, 30000);
        return ()=>clearInterval(interval);
    }, []);
    const getStatusColor = (status)=>{
        switch(status){
            case "confirmed":
                return "bg-blue-100 text-blue-700";
            case "processing":
                return "bg-yellow-100 text-yellow-700";
            case "shipped":
                return "bg-green-100 text-green-700";
            case "delivered":
                return "bg-emerald-100 text-emerald-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };
    const getPriorityColor = (priority)=>{
        switch(priority){
            case "urgent":
                return "bg-red-100 text-red-700";
            case "high":
                return "bg-orange-100 text-orange-700";
            case "normal":
                return "bg-blue-100 text-blue-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };
    const getPaymentStatusColor = (status)=>{
        switch(status){
            case "paid":
                return "bg-green-100 text-green-700";
            case "pending":
                return "bg-yellow-100 text-yellow-700";
            case "failed":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };
    const formatDateTime = (dateString)=>{
        return new Date(dateString).toLocaleString();
    };
    const handleContactSupplier = (order)=>{
        addNotification({
            title: "Opening WhatsApp",
            message: `Contacting ${order.supplierName} about order ${order.id}`,
            type: "info",
            icon: "📱"
        });
    };
    const handleTrackOrder = (orderId)=>{
        // Navigate to live tracking page
        window.location.href = `/track-order/${orderId}`;
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
        className: "bg-saffron-100 text-saffron-700"
    }, t('activeOrders'))), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-4"
    }, /*#__PURE__*/ React.createElement(LanguageSelector, {
        currentLanguage: language,
        onLanguageChange: setLanguage
    }), /*#__PURE__*/ React.createElement(NotificationPanel, null), /*#__PURE__*/ React.createElement(Link, {
        to: "/vendor/profile",
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(ProfilePhoto, {
        currentImage: profileImage,
        userName: user?.name || "User",
        size: "sm",
        onImageChange: (url)=>setProfileImage(url)
    })), /*#__PURE__*/ React.createElement(Button, {
        variant: "outline",
        size: "sm",
        onClick: logout
    }, t('logout')))))), /*#__PURE__*/ React.createElement("div", {
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    }, /* Header */ /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-4 mb-6"
    }, /*#__PURE__*/ React.createElement(Link, {
        to: "/vendor/dashboard"
    }, /*#__PURE__*/ React.createElement(Button, {
        variant: "outline",
        size: "sm"
    }, /*#__PURE__*/ React.createElement(ArrowLeft, {
        className: "w-4 h-4 mr-2"
    }), t('back'), " to ", t('dashboard'))), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h1", {
        className: "text-3xl font-bold text-gray-900"
    }, t('activeOrders')), /*#__PURE__*/ React.createElement("p", {
        className: "text-gray-600"
    }, "Track your current orders and deliveries"))), /* Summary Stats */ /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
    }, /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(Package, {
        className: "w-8 h-8 text-blue-500 mr-3"
    }), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-600"
    }, "Total Active"), /*#__PURE__*/ React.createElement("p", {
        className: "text-2xl font-bold text-gray-900"
    }, orders.length))))), /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(Clock, {
        className: "w-8 h-8 text-yellow-500 mr-3"
    }), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-600"
    }, "Processing"), /*#__PURE__*/ React.createElement("p", {
        className: "text-2xl font-bold text-gray-900"
    }, orders.filter((o)=>o.status === "processing").length))))), /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(Truck, {
        className: "w-8 h-8 text-green-500 mr-3"
    }), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-600"
    }, "Shipped"), /*#__PURE__*/ React.createElement("p", {
        className: "text-2xl font-bold text-gray-900"
    }, orders.filter((o)=>o.status === "shipped").length))))), /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(CheckCircle, {
        className: "w-8 h-8 text-emerald-500 mr-3"
    }), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-600"
    }, "Total Value"), /*#__PURE__*/ React.createElement("p", {
        className: "text-2xl font-bold text-gray-900"
    }, "₹", orders.reduce((sum, order)=>sum + order.totalAmount, 0).toLocaleString())))))), /* Orders List */ /*#__PURE__*/ React.createElement("div", {
        className: "space-y-6"
    }, orders.map((order)=>/*#__PURE__*/ React.createElement(Card, {
            key: order.id,
            className: "overflow-hidden"
        }, /*#__PURE__*/ React.createElement(CardHeader, {
            className: "pb-4"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center justify-between"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center space-x-3"
        }, /*#__PURE__*/ React.createElement("h3", {
            className: "text-lg font-semibold"
        }, order.id), /*#__PURE__*/ React.createElement(Badge, {
            className: getStatusColor(order.status)
        }, order.status), /*#__PURE__*/ React.createElement(Badge, {
            className: getPriorityColor(order.priority)
        }, order.priority), /*#__PURE__*/ React.createElement(Badge, {
            className: getPaymentStatusColor(order.paymentStatus)
        }, order.paymentStatus)), /*#__PURE__*/ React.createElement("div", {
            className: "text-right"
        }, /*#__PURE__*/ React.createElement("p", {
            className: "text-2xl font-bold text-green-600"
        }, "₹", order.totalAmount), /*#__PURE__*/ React.createElement("p", {
            className: "text-sm text-gray-500"
        }, formatDateTime(order.orderDate))))), /*#__PURE__*/ React.createElement(CardContent, {
            className: "space-y-6"
        }, /* Supplier Information */ /*#__PURE__*/ React.createElement("div", {
            className: "bg-gray-50 rounded-lg p-4"
        }, /*#__PURE__*/ React.createElement("h4", {
            className: "font-medium text-gray-900 mb-3"
        }, "Supplier Details"), /*#__PURE__*/ React.createElement("div", {
            className: "grid grid-cols-1 md:grid-cols-3 gap-4"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "text-blue-600 font-semibold"
        }, order.supplierName.charAt(0))), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
            className: "font-medium"
        }, order.supplierName), /*#__PURE__*/ React.createElement("p", {
            className: "text-sm text-gray-500"
        }, "Supplier"))), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center"
        }, /*#__PURE__*/ React.createElement(MapPin, {
            className: "w-4 h-4 text-gray-400 mr-2"
        }), /*#__PURE__*/ React.createElement("span", {
            className: "text-sm"
        }, order.supplierLocation)), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center"
        }, /*#__PURE__*/ React.createElement(Phone, {
            className: "w-4 h-4 text-gray-400 mr-2"
        }), /*#__PURE__*/ React.createElement("span", {
            className: "text-sm"
        }, order.supplierPhone)))), /* Order Items */ /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h4", {
            className: "font-medium text-gray-900 mb-3"
        }, "Order Items"), /*#__PURE__*/ React.createElement("div", {
            className: "space-y-2"
        }, order.items.map((item, index)=>/*#__PURE__*/ React.createElement("div", {
                key: index,
                className: "flex items-center justify-between p-3 bg-white border rounded-lg"
            }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
                className: "font-medium"
            }, item.name), /*#__PURE__*/ React.createElement("p", {
                className: "text-sm text-gray-500"
            }, item.quantity, " ", item.unit)), /*#__PURE__*/ React.createElement("div", {
                className: "text-right"
            }, /*#__PURE__*/ React.createElement("p", {
                className: "font-medium"
            }, "₹", item.price * item.quantity), /*#__PURE__*/ React.createElement("p", {
                className: "text-sm text-gray-500"
            }, "₹", item.price, "/", item.unit)))))), /* Delivery Status */ /*#__PURE__*/ React.createElement("div", {
            className: "bg-blue-50 rounded-lg p-4"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center justify-between mb-3"
        }, /*#__PURE__*/ React.createElement("h4", {
            className: "font-medium text-gray-900"
        }, "Delivery Status"), /*#__PURE__*/ React.createElement("span", {
            className: "text-sm text-blue-600 font-medium"
        }, "Track ID: ", order.trackingId)), /*#__PURE__*/ React.createElement("div", {
            className: "grid grid-cols-1 md:grid-cols-2 gap-4"
        }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
            className: "text-sm text-gray-600"
        }, "Current Location"), /*#__PURE__*/ React.createElement("p", {
            className: "font-medium"
        }, order.currentLocation)), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
            className: "text-sm text-gray-600"
        }, "Estimated Delivery"), /*#__PURE__*/ React.createElement("p", {
            className: "font-medium"
        }, formatDateTime(order.estimatedDelivery)))), order.notes && /*#__PURE__*/ React.createElement("div", {
            className: "mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded"
        }, /*#__PURE__*/ React.createElement("p", {
            className: "text-sm text-yellow-800"
        }, /*#__PURE__*/ React.createElement("strong", null, "Note:"), " ", order.notes))), /* Action Buttons */ /*#__PURE__*/ React.createElement("div", {
            className: "flex flex-wrap gap-3 pt-4 border-t"
        }, /*#__PURE__*/ React.createElement(Button, {
            variant: "outline",
            onClick: ()=>handleTrackOrder(order.id)
        }, /*#__PURE__*/ React.createElement(Truck, {
            className: "w-4 h-4 mr-2"
        }), "Track Order Live"), /*#__PURE__*/ React.createElement(Button, {
            variant: "outline",
            onClick: ()=>handleContactSupplier(order),
            className: "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
        }, /*#__PURE__*/ React.createElement(MessageSquare, {
            className: "w-4 h-4 mr-2"
        }), "Contact Supplier"), /*#__PURE__*/ React.createElement(Button, {
            variant: "outline"
        }, /*#__PURE__*/ React.createElement(Eye, {
            className: "w-4 h-4 mr-2"
        }), "View Details"), order.paymentStatus === "pending" && /*#__PURE__*/ React.createElement(Button, {
            className: "bg-blue-500 hover:bg-blue-600"
        }, /*#__PURE__*/ React.createElement(CheckCircle, {
            className: "w-4 h-4 mr-2"
        }), "Make Payment")))))), orders.length === 0 && /*#__PURE__*/ React.createElement("div", {
        className: "text-center py-12"
    }, /*#__PURE__*/ React.createElement(Package, {
        className: "w-16 h-16 text-gray-300 mx-auto mb-4"
    }), /*#__PURE__*/ React.createElement("h3", {
        className: "text-lg font-medium text-gray-900 mb-2"
    }, "No active orders"), /*#__PURE__*/ React.createElement("p", {
        className: "text-gray-500"
    }, "Your completed and current orders will appear here"))));
}
