import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import NotificationPanel from "@/components/NotificationPanel";
import ProfilePhoto from "@/components/ProfilePhoto";
import { ArrowLeft, MapPin, Phone, MessageSquare, Truck, Clock, User, Package, Star, CheckCircle, Circle, RotateCcw, AlertCircle } from "lucide-react";
// Mock order tracking data
const getOrderTrackingData = (orderId)=>({
        id: orderId,
        status: "in_transit",
        orderNumber: `#${orderId?.toUpperCase().slice(0, 8) || 'ORD12345'}`,
        estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000),
        // 45 minutes from now
        supplier: {
            name: "Kumar Oil Mills",
            phone: "+91 87654 32109",
            location: "Industrial Area, Noida",
            coordinates: {
                lat: 28.6139,
                lng: 77.2090
            }
        },
        vendor: {
            name: "Rajesh's Chaat Corner",
            phone: "+91 98765 43210",
            address: "Connaught Place, New Delhi",
            coordinates: {
                lat: 28.6315,
                lng: 77.2167
            }
        },
        driver: {
            name: "Suresh Kumar",
            phone: "+91 99999 12345",
            vehicle: "HR 26 DL 1234",
            vehicleType: "Tempo",
            rating: 4.8,
            photo: "👨‍💼",
            currentLocation: {
                lat: 28.6200,
                lng: 77.2100
            },
            isOnline: true,
            totalDeliveries: 1247
        },
        items: [
            {
                name: "Premium Mustard Oil",
                quantity: 2,
                unit: "liter",
                image: "🛢️"
            },
            {
                name: "Garam Masala Powder",
                quantity: 1,
                unit: "kg",
                image: "🌶️"
            },
            {
                name: "Basmati Rice",
                quantity: 5,
                unit: "kg",
                image: "🌾"
            }
        ],
        total: 1250,
        timeline: [
            {
                status: "confirmed",
                time: new Date(Date.now() - 25 * 60 * 1000),
                description: "Order confirmed by supplier",
                completed: true
            },
            {
                status: "preparing",
                time: new Date(Date.now() - 20 * 60 * 1000),
                description: "Items being prepared for dispatch",
                completed: true
            },
            {
                status: "picked_up",
                time: new Date(Date.now() - 15 * 60 * 1000),
                description: "Order picked up by driver",
                completed: true
            },
            {
                status: "in_transit",
                time: new Date(Date.now() - 10 * 60 * 1000),
                description: "Out for delivery",
                completed: false,
                current: true
            },
            {
                status: "delivered",
                time: null,
                description: "Order delivered successfully",
                completed: false
            }
        ],
        distance: {
            remaining: "2.1 km",
            total: "12.5 km",
            progress: 83
        }
    });
export default function OrderTrackingLive() {
    const { orderId } = useParams();
    const { addNotification } = useNotifications();
    const { user } = useAuth();
    const { t } = useLanguage();
    const [orderData, setOrderData] = useState(getOrderTrackingData(orderId || ''));
    const [driverLocation, setDriverLocation] = useState(orderData.driver.currentLocation);
    const [profileImage, setProfileImage] = useState("");
    const [timeRemaining, setTimeRemaining] = useState("");
    const [showMap, setShowMap] = useState(true);
    const mapRef = useRef(null);
    useEffect(()=>{
        const savedImage = localStorage.getItem("profileImage");
        if (savedImage) setProfileImage(savedImage);
    }, []);
    // Simulate real-time driver location updates
    useEffect(()=>{
        const interval = setInterval(()=>{
            setDriverLocation((prev)=>({
                    lat: prev.lat + (Math.random() - 0.5) * 0.001,
                    lng: prev.lng + (Math.random() - 0.5) * 0.001
                }));
        }, 5000);
        // Update every 5 seconds
        return ()=>clearInterval(interval);
    }, []);
    // Update time remaining
    useEffect(()=>{
        const updateTime = ()=>{
            const now = new Date();
            const delivery = orderData.estimatedDelivery;
            const diff = delivery.getTime() - now.getTime();
            if (diff > 0) {
                const minutes = Math.floor(diff / (1000 * 60));
                setTimeRemaining(`${minutes} min`);
            } else {
                setTimeRemaining("Arriving now");
            }
        };
        updateTime();
        const interval = setInterval(updateTime, 60000);
        // Update every minute
        return ()=>clearInterval(interval);
    }, [
        orderData.estimatedDelivery
    ]);
    const handleCallDriver = ()=>{
        window.open(`tel:${orderData.driver.phone}`, '_self');
        addNotification({
            title: t("callingDriver"),
            message: `${t("calling")} ${orderData.driver.name}`,
            type: "info",
            icon: "📞"
        });
    };
    const handleMessageDriver = ()=>{
        const message = encodeURIComponent(`Hi ${orderData.driver.name}, I'm tracking my order ${orderData.orderNumber}. Is everything on schedule?`);
        window.open(`https://wa.me/${orderData.driver.phone.replace(/\D/g, '')}?text=${message}`, '_blank');
    };
    const getStatusIcon = (status, completed, current)=>{
        if (completed) return /*#__PURE__*/ React.createElement(CheckCircle, {
            className: "w-5 h-5 text-green-500"
        });
        if (current) return /*#__PURE__*/ React.createElement(Circle, {
            className: "w-5 h-5 text-blue-500 animate-pulse"
        });
        return /*#__PURE__*/ React.createElement(Circle, {
            className: "w-5 h-5 text-gray-300"
        });
    };
    const getStatusColor = (status)=>{
        switch(status){
            case "in_transit":
                return "bg-blue-100 text-blue-700";
            case "preparing":
                return "bg-yellow-100 text-yellow-700";
            case "delivered":
                return "bg-green-100 text-green-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
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
        className: "bg-blue-100 text-blue-700"
    }, t('liveTracking'))), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-4"
    }, /*#__PURE__*/ React.createElement(LanguageSelector, null), /*#__PURE__*/ React.createElement(NotificationPanel, null), /*#__PURE__*/ React.createElement(Link, {
        to: "/vendor/profile",
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(ProfilePhoto, {
        currentImage: profileImage,
        userName: user?.name || "User",
        size: "sm",
        onImageChange: (url)=>setProfileImage(url)
    })), /*#__PURE__*/ React.createElement(Button, {
        variant: "outline",
        size: "sm"
    }, t('logout')))))), /*#__PURE__*/ React.createElement("div", {
        className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
    }, /* Header with Back Button */ /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between mb-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-4"
    }, /*#__PURE__*/ React.createElement(Link, {
        to: "/vendor/active-orders"
    }, /*#__PURE__*/ React.createElement(Button, {
        variant: "outline",
        size: "sm"
    }, /*#__PURE__*/ React.createElement(ArrowLeft, {
        className: "w-4 h-4 mr-2"
    }), t('backToOrders'))), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h1", {
        className: "text-2xl font-bold text-gray-900"
    }, t('trackingOrder'), " ", orderData.orderNumber), /*#__PURE__*/ React.createElement("p", {
        className: "text-gray-600"
    }, t('liveLocationUpdates')))), /*#__PURE__*/ React.createElement(Badge, {
        className: `${getStatusColor(orderData.status)} px-3 py-1`
    }, /*#__PURE__*/ React.createElement(Truck, {
        className: "w-4 h-4 mr-1"
    }), t('outForDelivery'))), /* Main Content Grid */ /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 lg:grid-cols-3 gap-6"
    }, /* Map and Driver Info */ /*#__PURE__*/ React.createElement("div", {
        className: "lg:col-span-2 space-y-6"
    }, /* Live Map */ /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-0"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "relative h-80 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg overflow-hidden"
    }, /* Simulated Map View */ /*#__PURE__*/ React.createElement("div", {
        className: "absolute inset-0 flex items-center justify-center"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "text-center"
    }, /*#__PURE__*/ React.createElement(MapPin, {
        className: "w-16 h-16 text-blue-500 mx-auto mb-4 animate-bounce"
    }), /*#__PURE__*/ React.createElement("p", {
        className: "text-lg font-semibold text-gray-700"
    }, t('liveMap')), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-500"
    }, t('driverLocation'), ": ", driverLocation.lat.toFixed(4), ", ", driverLocation.lng.toFixed(4)))), /* Floating ETA Card */ /*#__PURE__*/ React.createElement("div", {
        className: "absolute top-4 left-4 right-4"
    }, /*#__PURE__*/ React.createElement(Card, {
        className: "bg-white/95 backdrop-blur-sm"
    }, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-3"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-3 h-3 bg-green-500 rounded-full animate-pulse"
    }), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
        className: "font-semibold text-gray-900"
    }, timeRemaining), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-500"
    }, t('estimatedArrival')))), /*#__PURE__*/ React.createElement("div", {
        className: "text-right"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-sm font-medium"
    }, orderData.distance.remaining, " ", t('away')), /*#__PURE__*/ React.createElement("div", {
        className: "w-20 h-2 bg-gray-200 rounded-full mt-1"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "h-full bg-blue-500 rounded-full",
        style: {
            width: `${orderData.distance.progress}%`
        }
    }))))))), /* Driver Location Marker */ /*#__PURE__*/ React.createElement("div", {
        className: "absolute bottom-20 left-1/2 transform -translate-x-1/2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-blue-500 text-white p-2 rounded-full shadow-lg animate-pulse"
    }, /*#__PURE__*/ React.createElement(Truck, {
        className: "w-6 h-6"
    }))), /* Destination Marker */ /*#__PURE__*/ React.createElement("div", {
        className: "absolute top-1/3 right-1/4 transform -translate-x-1/2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-red-500 text-white p-2 rounded-full shadow-lg"
    }, /*#__PURE__*/ React.createElement(MapPin, {
        className: "w-6 h-6"
    })))))), /* Driver Information */ /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(User, {
        className: "w-5 h-5 mr-2"
    }), t('yourDriver'))), /*#__PURE__*/ React.createElement(CardContent, null, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "relative"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-2xl"
    }, orderData.driver.photo), orderData.driver.isOnline && /*#__PURE__*/ React.createElement("div", {
        className: "absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"
    })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h3", {
        className: "font-semibold text-lg"
    }, orderData.driver.name), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-2 text-sm text-gray-600"
    }, /*#__PURE__*/ React.createElement(Star, {
        className: "w-4 h-4 fill-yellow-400 text-yellow-400"
    }), /*#__PURE__*/ React.createElement("span", null, orderData.driver.rating), /*#__PURE__*/ React.createElement("span", null, "•"), /*#__PURE__*/ React.createElement("span", null, orderData.driver.totalDeliveries, " ", t('deliveries'))), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-500"
    }, orderData.driver.vehicleType, " • ", orderData.driver.vehicle))), /*#__PURE__*/ React.createElement("div", {
        className: "flex space-x-2"
    }, /*#__PURE__*/ React.createElement(Button, {
        variant: "outline",
        size: "sm",
        onClick: handleCallDriver,
        className: "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
    }, /*#__PURE__*/ React.createElement(Phone, {
        className: "w-4 h-4 mr-2"
    }), t('call')), /*#__PURE__*/ React.createElement(Button, {
        variant: "outline",
        size: "sm",
        onClick: handleMessageDriver,
        className: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
    }, /*#__PURE__*/ React.createElement(MessageSquare, {
        className: "w-4 h-4 mr-2"
    }), t('message'))))))), /* Order Details and Timeline */ /*#__PURE__*/ React.createElement("div", {
        className: "space-y-6"
    }, /* Order Summary */ /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(Package, {
        className: "w-5 h-5 mr-2"
    }), t('orderDetails'))), /*#__PURE__*/ React.createElement(CardContent, {
        className: "space-y-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "space-y-3"
    }, orderData.items.map((item, index)=>/*#__PURE__*/ React.createElement("div", {
            key: index,
            className: "flex items-center justify-between"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center space-x-3"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "text-2xl"
        }, item.image), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
            className: "font-medium text-sm"
        }, item.name), /*#__PURE__*/ React.createElement("p", {
            className: "text-xs text-gray-500"
        }, item.quantity, " ", item.unit)))))), /*#__PURE__*/ React.createElement("hr", null), /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-center font-semibold"
    }, /*#__PURE__*/ React.createElement("span", null, t('total')), /*#__PURE__*/ React.createElement("span", null, "₹", orderData.total.toLocaleString())))), /* Delivery Timeline */ /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(Clock, {
        className: "w-5 h-5 mr-2"
    }), t('deliveryProgress'))), /*#__PURE__*/ React.createElement(CardContent, null, /*#__PURE__*/ React.createElement("div", {
        className: "space-y-4"
    }, orderData.timeline.map((step, index)=>/*#__PURE__*/ React.createElement("div", {
            key: index,
            className: "flex items-start space-x-3"
        }, getStatusIcon(step.status, step.completed, step.current), /*#__PURE__*/ React.createElement("div", {
            className: "flex-1"
        }, /*#__PURE__*/ React.createElement("p", {
            className: `font-medium ${step.completed ? 'text-gray-900' : step.current ? 'text-blue-600' : 'text-gray-400'}`
        }, step.description), step.time && /*#__PURE__*/ React.createElement("p", {
            className: "text-xs text-gray-500"
        }, step.time.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })))))))), /* Quick Actions */ /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, null, t('quickActions'))), /*#__PURE__*/ React.createElement(CardContent, {
        className: "space-y-3"
    }, /*#__PURE__*/ React.createElement(Button, {
        variant: "outline",
        className: "w-full justify-start",
        onClick: handleCallDriver
    }, /*#__PURE__*/ React.createElement(Phone, {
        className: "w-4 h-4 mr-2"
    }), t('callDriver')), /*#__PURE__*/ React.createElement(Button, {
        variant: "outline",
        className: "w-full justify-start"
    }, /*#__PURE__*/ React.createElement(RotateCcw, {
        className: "w-4 h-4 mr-2"
    }), t('reorderItems')), /*#__PURE__*/ React.createElement(Button, {
        variant: "outline",
        className: "w-full justify-start"
    }, /*#__PURE__*/ React.createElement(AlertCircle, {
        className: "w-4 h-4 mr-2"
    }), t('reportIssue'))))))));
}
