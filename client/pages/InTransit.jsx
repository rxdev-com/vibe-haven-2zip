import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Package, Truck, MapPin, Clock, Phone, Navigation, CheckCircle, Circle, RefreshCw } from "lucide-react";
const mockInTransitOrders = [
    {
        id: "1",
        orderId: "ORD-2025-004",
        supplier: "Organic Vegetables",
        items: [
            {
                name: "Fresh Onions",
                quantity: 5,
                unit: "kg"
            },
            {
                name: "Tomatoes",
                quantity: 3,
                unit: "kg"
            }
        ],
        totalAmount: 580,
        trackingNumber: "TRK123456",
        estimatedDelivery: "2025-01-27 14:30",
        currentLocation: "Near Sector 18, Noida",
        progress: 75,
        driverName: "Ramesh Kumar",
        driverPhone: "+91 98765 43210",
        vehicleNumber: "UP14 AB 1234",
        timeline: [
            {
                status: "Order Confirmed",
                location: "Supplier Warehouse - Faridabad",
                timestamp: "2025-01-25 09:00",
                completed: true
            },
            {
                status: "Package Prepared",
                location: "Faridabad",
                timestamp: "2025-01-25 11:30",
                completed: true
            },
            {
                status: "Out for Delivery",
                location: "Left Faridabad Hub",
                timestamp: "2025-01-27 08:00",
                completed: true
            },
            {
                status: "In Transit",
                location: "Near Sector 18, Noida",
                timestamp: "2025-01-27 12:45",
                completed: true
            },
            {
                status: "Delivered",
                location: "Your Location",
                timestamp: "Expected: 14:30",
                completed: false
            }
        ]
    },
    {
        id: "2",
        orderId: "ORD-2025-006",
        supplier: "Spice Kingdom",
        items: [
            {
                name: "Turmeric Powder",
                quantity: 1,
                unit: "kg"
            },
            {
                name: "Coriander Seeds",
                quantity: 500,
                unit: "g"
            }
        ],
        totalAmount: 450,
        trackingNumber: "TRK789012",
        estimatedDelivery: "2025-01-27 16:00",
        currentLocation: "Delhi - Ghaziabad Highway",
        progress: 60,
        driverName: "Suresh Singh",
        driverPhone: "+91 87654 32109",
        vehicleNumber: "DL10 CD 5678",
        timeline: [
            {
                status: "Order Confirmed",
                location: "Supplier Warehouse - Old Delhi",
                timestamp: "2025-01-26 10:00",
                completed: true
            },
            {
                status: "Package Prepared",
                location: "Old Delhi",
                timestamp: "2025-01-26 14:00",
                completed: true
            },
            {
                status: "Out for Delivery",
                location: "Left Delhi Hub",
                timestamp: "2025-01-27 09:30",
                completed: true
            },
            {
                status: "In Transit",
                location: "Delhi - Ghaziabad Highway",
                timestamp: "2025-01-27 13:15",
                completed: true
            },
            {
                status: "Delivered",
                location: "Your Location",
                timestamp: "Expected: 16:00",
                completed: false
            }
        ]
    }
];
export default function InTransit() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [orders] = useState(mockInTransitOrders);
    const [refreshing, setRefreshing] = useState(false);
    const handleRefreshTracking = async ()=>{
        setRefreshing(true);
        // Simulate API call
        setTimeout(()=>{
            setRefreshing(false);
            toast({
                title: "Tracking Updated",
                description: "Latest delivery information has been fetched"
            });
        }, 1500);
    };
    const handleCallDriver = (driverName, phone)=>{
        toast({
            title: "Calling Driver",
            description: `Connecting you with ${driverName} at ${phone}`
        });
    };
    const handleTrackOnMap = (trackingNumber)=>{
        toast({
            title: "Track on Map",
            description: `Opening live location for ${trackingNumber}`
        });
    };
    return /*#__PURE__*/ React.createElement("div", {
        className: "min-h-screen bg-gray-50"
    }, /* Header */ /*#__PURE__*/ React.createElement("header", {
        className: "bg-white border-b sticky top-0 z-40"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between h-16"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-4"
    }, /*#__PURE__*/ React.createElement(Link, {
        to: "/vendor/dashboard",
        className: "flex items-center text-gray-600 hover:text-saffron-600 transition-colors"
    }, /*#__PURE__*/ React.createElement(ArrowLeft, {
        className: "w-4 h-4 mr-2"
    }), "Back to Dashboard"), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-8 h-8 bg-gradient-to-r from-saffron-500 to-emerald-500 rounded-lg flex items-center justify-center"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-white font-bold text-sm"
    }, "JB")), /*#__PURE__*/ React.createElement("span", {
        className: "text-xl font-bold bg-gradient-to-r from-saffron-600 to-emerald-600 bg-clip-text text-transparent"
    }, "JugaduBazar"))), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-2"
    }, /*#__PURE__*/ React.createElement(Badge, {
        className: "bg-purple-100 text-purple-700"
    }, "In Transit"), /*#__PURE__*/ React.createElement(Button, {
        variant: "outline",
        size: "sm",
        onClick: handleRefreshTracking,
        disabled: refreshing
    }, /*#__PURE__*/ React.createElement(RefreshCw, {
        className: `w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`
    }), refreshing ? "Updating..." : "Refresh"))))), /*#__PURE__*/ React.createElement("div", {
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    }, /* Page Header */ /*#__PURE__*/ React.createElement("div", {
        className: "mb-8"
    }, /*#__PURE__*/ React.createElement("h1", {
        className: "text-3xl font-bold text-gray-900 mb-2"
    }, "Orders In Transit"), /*#__PURE__*/ React.createElement("p", {
        className: "text-gray-600"
    }, "Real-time tracking of your deliveries currently on the way")), /* Live Stats */ /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
    }, /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(Truck, {
        className: "w-8 h-8 text-purple-500 mr-3"
    }), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-600"
    }, "In Transit"), /*#__PURE__*/ React.createElement("p", {
        className: "text-2xl font-bold text-gray-900"
    }, orders.length))))), /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(Clock, {
        className: "w-8 h-8 text-blue-500 mr-3"
    }), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-600"
    }, "Avg. ETA"), /*#__PURE__*/ React.createElement("p", {
        className: "text-2xl font-bold text-gray-900"
    }, "2.5 hrs"))))), /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(Package, {
        className: "w-8 h-8 text-green-500 mr-3"
    }), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-600"
    }, "Total Value"), /*#__PURE__*/ React.createElement("p", {
        className: "text-2xl font-bold text-gray-900"
    }, "₹", orders.reduce((sum, order)=>sum + order.totalAmount, 0))))))), /* Transit Orders */ /*#__PURE__*/ React.createElement("div", {
        className: "space-y-6"
    }, orders.length === 0 ? /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-12 text-center"
    }, /*#__PURE__*/ React.createElement(Truck, {
        className: "w-12 h-12 text-gray-300 mx-auto mb-4"
    }), /*#__PURE__*/ React.createElement("h3", {
        className: "text-lg font-medium text-gray-900 mb-2"
    }, "No orders in transit"), /*#__PURE__*/ React.createElement("p", {
        className: "text-gray-500"
    }, "All your orders are either pending or have been delivered"))) : orders.map((order)=>/*#__PURE__*/ React.createElement(Card, {
            key: order.id,
            className: "overflow-hidden"
        }, /*#__PURE__*/ React.createElement(CardHeader, {
            className: "bg-gradient-to-r from-purple-50 to-blue-50 border-b"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center justify-between"
        }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement(CardTitle, {
            className: "text-lg"
        }, order.orderId), /*#__PURE__*/ React.createElement(CardDescription, null, "From ", order.supplier, " • Tracking: ", order.trackingNumber)), /*#__PURE__*/ React.createElement(Badge, {
            className: "bg-purple-100 text-purple-700"
        }, /*#__PURE__*/ React.createElement(Truck, {
            className: "w-4 h-4 mr-1"
        }), "In Transit"))), /*#__PURE__*/ React.createElement(CardContent, {
            className: "p-6"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "grid grid-cols-1 lg:grid-cols-2 gap-6"
        }, /* Delivery Progress */ /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center justify-between mb-4"
        }, /*#__PURE__*/ React.createElement("h4", {
            className: "font-semibold text-gray-900"
        }, "Delivery Progress"), /*#__PURE__*/ React.createElement("span", {
            className: "text-sm font-medium text-purple-600"
        }, order.progress, "%")), /*#__PURE__*/ React.createElement(Progress, {
            value: order.progress,
            className: "mb-4"
        }), /*#__PURE__*/ React.createElement("div", {
            className: "space-y-3"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center text-sm"
        }, /*#__PURE__*/ React.createElement(MapPin, {
            className: "w-4 h-4 text-red-500 mr-2"
        }), /*#__PURE__*/ React.createElement("span", {
            className: "font-medium"
        }, "Current Location:"), /*#__PURE__*/ React.createElement("span", {
            className: "ml-2 text-gray-600"
        }, order.currentLocation)), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center text-sm"
        }, /*#__PURE__*/ React.createElement(Clock, {
            className: "w-4 h-4 text-blue-500 mr-2"
        }), /*#__PURE__*/ React.createElement("span", {
            className: "font-medium"
        }, "Expected Delivery:"), /*#__PURE__*/ React.createElement("span", {
            className: "ml-2 text-gray-600"
        }, new Date(order.estimatedDelivery).toLocaleString()))), /* Driver Info */ /*#__PURE__*/ React.createElement("div", {
            className: "mt-4 p-3 bg-gray-50 rounded-lg"
        }, /*#__PURE__*/ React.createElement("h5", {
            className: "font-medium text-gray-900 mb-2"
        }, "Driver Details"), /*#__PURE__*/ React.createElement("div", {
            className: "space-y-1 text-sm"
        }, /*#__PURE__*/ React.createElement("p", null, /*#__PURE__*/ React.createElement("strong", null, "Name:"), " ", order.driverName), /*#__PURE__*/ React.createElement("p", null, /*#__PURE__*/ React.createElement("strong", null, "Vehicle:"), " ", order.vehicleNumber))), /* Action Buttons */ /*#__PURE__*/ React.createElement("div", {
            className: "flex gap-2 mt-4"
        }, /*#__PURE__*/ React.createElement(Button, {
            variant: "outline",
            size: "sm",
            onClick: ()=>handleCallDriver(order.driverName, order.driverPhone),
            className: "flex-1"
        }, /*#__PURE__*/ React.createElement(Phone, {
            className: "w-4 h-4 mr-2"
        }), "Call Driver"), /*#__PURE__*/ React.createElement(Button, {
            variant: "outline",
            size: "sm",
            onClick: ()=>handleTrackOnMap(order.trackingNumber),
            className: "flex-1"
        }, /*#__PURE__*/ React.createElement(Navigation, {
            className: "w-4 h-4 mr-2"
        }), "Track on Map"))), /* Timeline */ /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h4", {
            className: "font-semibold text-gray-900 mb-4"
        }, "Tracking Timeline"), /*#__PURE__*/ React.createElement("div", {
            className: "space-y-4"
        }, order.timeline.map((event, index)=>/*#__PURE__*/ React.createElement("div", {
                key: index,
                className: "flex items-start"
            }, /*#__PURE__*/ React.createElement("div", {
                className: "flex-shrink-0 mt-0.5"
            }, event.completed ? /*#__PURE__*/ React.createElement(CheckCircle, {
                className: "w-5 h-5 text-green-500"
            }) : /*#__PURE__*/ React.createElement(Circle, {
                className: "w-5 h-5 text-gray-300"
            })), /*#__PURE__*/ React.createElement("div", {
                className: "ml-3 flex-1"
            }, /*#__PURE__*/ React.createElement("p", {
                className: `text-sm font-medium ${event.completed ? "text-gray-900" : "text-gray-500"}`
            }, event.status), /*#__PURE__*/ React.createElement("p", {
                className: "text-xs text-gray-500"
            }, event.location), /*#__PURE__*/ React.createElement("p", {
                className: "text-xs text-gray-400"
            }, event.timestamp))))), /* Order Items */ /*#__PURE__*/ React.createElement("div", {
            className: "mt-6 p-3 bg-gray-50 rounded-lg"
        }, /*#__PURE__*/ React.createElement("h5", {
            className: "font-medium text-gray-900 mb-2"
        }, "Order Items"), /*#__PURE__*/ React.createElement("div", {
            className: "space-y-1"
        }, order.items.map((item, idx)=>/*#__PURE__*/ React.createElement("div", {
                key: idx,
                className: "text-sm text-gray-600 flex justify-between"
            }, /*#__PURE__*/ React.createElement("span", null, item.name), /*#__PURE__*/ React.createElement("span", null, item.quantity, " ", item.unit)))), /*#__PURE__*/ React.createElement("div", {
            className: "mt-2 pt-2 border-t border-gray-200"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex justify-between text-sm font-medium"
        }, /*#__PURE__*/ React.createElement("span", null, "Total Amount:"), /*#__PURE__*/ React.createElement("span", {
            className: "text-green-600"
        }, "₹", order.totalAmount))))))))))));
}
