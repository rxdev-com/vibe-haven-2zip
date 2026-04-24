import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Clock, Truck, Phone } from "lucide-react";
const mockDeliveries = [
    {
        id: "D001",
        name: "Rajesh's Chaat Corner",
        address: "Connaught Place, New Delhi",
        lat: 28.6315,
        lng: 77.2167,
        distance: 12.5,
        estimatedTime: "25 mins",
        status: "in-transit",
        orderValue: 2500,
        contactPhone: "+91 98765 43210"
    },
    {
        id: "D002",
        name: "Mumbai Street Food",
        address: "Karol Bagh, New Delhi",
        lat: 28.6519,
        lng: 77.1914,
        distance: 8.2,
        estimatedTime: "18 mins",
        status: "pending",
        orderValue: 1800,
        contactPhone: "+91 87654 32109"
    },
    {
        id: "D003",
        name: "Delhi Spice Corner",
        address: "Lajpat Nagar, New Delhi",
        lat: 28.5678,
        lng: 77.2434,
        distance: 15.1,
        estimatedTime: "32 mins",
        status: "delivered",
        orderValue: 3200,
        contactPhone: "+91 76543 21098"
    }
];
export default function DeliveryMap({ deliveries = mockDeliveries }) {
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    // Mock current location (supplier's location)
    const supplierLocation = {
        lat: 28.6139,
        lng: 77.2090,
        name: "Kumar Oil Mills"
    };
    useEffect(()=>{
        // Simulate getting current location
        setCurrentLocation(supplierLocation);
    }, []);
    const getStatusColor = (status)=>{
        switch(status){
            case "delivered":
                return "bg-green-100 text-green-700";
            case "in-transit":
                return "bg-blue-100 text-blue-700";
            case "pending":
                return "bg-yellow-100 text-yellow-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };
    const getStatusIcon = (status)=>{
        switch(status){
            case "delivered":
                return "✅";
            case "in-transit":
                return "🚛";
            case "pending":
                return "⏳";
            default:
                return "📦";
        }
    };
    return /*#__PURE__*/ React.createElement("div", {
        className: "space-y-6"
    }, /* Map Container */ /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between"
    }, /*#__PURE__*/ React.createElement(CardTitle, {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(MapPin, {
        className: "w-5 h-5 mr-2"
    }), "Delivery Map"), /*#__PURE__*/ React.createElement(Badge, {
        className: "bg-blue-100 text-blue-700"
    }, deliveries.length, " Active Deliveries"))), /*#__PURE__*/ React.createElement(CardContent, null, /* Mock Map Interface */ /*#__PURE__*/ React.createElement("div", {
        className: "relative bg-gradient-to-br from-green-50 to-blue-50 rounded-lg h-96 border-2 border-dashed border-gray-300 overflow-hidden"
    }, /* Map Background */ /*#__PURE__*/ React.createElement("div", {
        className: "absolute inset-0 bg-gray-100 opacity-50"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "h-full w-full bg-gradient-to-br from-green-100 via-blue-100 to-gray-100"
    })), /* Supplier Location (Center) */ /*#__PURE__*/ React.createElement("div", {
        className: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "relative"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-white px-2 py-1 rounded-md shadow-md text-xs font-medium"
    }, "📍 Kumar Oil Mills")))), /* Delivery Locations */ deliveries.map((delivery, index)=>{
        const positions = [
            {
                top: "20%",
                left: "70%"
            },
            {
                top: "60%",
                left: "25%"
            },
            {
                top: "75%",
                left: "80%"
            }
        ];
        const position = positions[index % positions.length];
        return /*#__PURE__*/ React.createElement("div", {
            key: delivery.id,
            className: "absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2",
            style: {
                top: position.top,
                left: position.left
            },
            onClick: ()=>setSelectedDelivery(delivery)
        }, /*#__PURE__*/ React.createElement("div", {
            className: "relative"
        }, /*#__PURE__*/ React.createElement("div", {
            className: `w-4 h-4 rounded-full border-2 border-white shadow-lg ${delivery.status === "delivered" ? "bg-green-500" : delivery.status === "in-transit" ? "bg-blue-500 animate-bounce" : "bg-yellow-500"}`
        }), /*#__PURE__*/ React.createElement("div", {
            className: "absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "bg-white px-1 py-0.5 rounded text-xs font-medium shadow-sm"
        }, getStatusIcon(delivery.status)))));
    }), /* Mock Routes */ /*#__PURE__*/ React.createElement("svg", {
        className: "absolute inset-0 w-full h-full pointer-events-none"
    }, /*#__PURE__*/ React.createElement("defs", null, /*#__PURE__*/ React.createElement("pattern", {
        id: "dash",
        patternUnits: "userSpaceOnUse",
        width: "8",
        height: "2"
    }, /*#__PURE__*/ React.createElement("rect", {
        width: "4",
        height: "2",
        fill: "currentColor"
    }))), deliveries.map((_, index)=>{
        const routes = [
            "M 50% 50% Q 60% 30% 70% 20%",
            "M 50% 50% Q 30% 55% 25% 60%",
            "M 50% 50% Q 70% 65% 80% 75%"
        ];
        return /*#__PURE__*/ React.createElement("path", {
            key: index,
            d: routes[index % routes.length],
            stroke: deliveries[index]?.status === "in-transit" ? "#3b82f6" : "#6b7280",
            strokeWidth: "2",
            fill: "none",
            strokeDasharray: deliveries[index]?.status === "pending" ? "5,5" : "none",
            className: "opacity-60"
        });
    })), /* Map Controls */ /*#__PURE__*/ React.createElement("div", {
        className: "absolute top-4 right-4 space-y-2"
    }, /*#__PURE__*/ React.createElement(Button, {
        size: "sm",
        variant: "outline",
        className: "bg-white/90"
    }, /*#__PURE__*/ React.createElement(Navigation, {
        className: "w-4 h-4"
    })), /*#__PURE__*/ React.createElement(Button, {
        size: "sm",
        variant: "outline",
        className: "bg-white/90"
    }, "+"), /*#__PURE__*/ React.createElement(Button, {
        size: "sm",
        variant: "outline",
        className: "bg-white/90"
    }, "-")), /* Legend */ /*#__PURE__*/ React.createElement("div", {
        className: "absolute bottom-4 left-4 bg-white/90 rounded-lg p-3 text-xs space-y-1"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "font-medium mb-2"
    }, "Legend"), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-3 h-3 bg-red-500 rounded-full"
    }), /*#__PURE__*/ React.createElement("span", null, "Supplier")), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-3 h-3 bg-green-500 rounded-full"
    }), /*#__PURE__*/ React.createElement("span", null, "Delivered")), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-3 h-3 bg-blue-500 rounded-full"
    }), /*#__PURE__*/ React.createElement("span", null, "In Transit")), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-3 h-3 bg-yellow-500 rounded-full"
    }), /*#__PURE__*/ React.createElement("span", null, "Pending")))))), /* Delivery Details */ /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 lg:grid-cols-2 gap-6"
    }, /* Delivery List */ /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(Truck, {
        className: "w-5 h-5 mr-2"
    }), "Active Deliveries")), /*#__PURE__*/ React.createElement(CardContent, null, /*#__PURE__*/ React.createElement("div", {
        className: "space-y-4"
    }, deliveries.map((delivery)=>/*#__PURE__*/ React.createElement("div", {
            key: delivery.id,
            className: `p-4 border rounded-lg cursor-pointer transition-colors ${selectedDelivery?.id === delivery.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`,
            onClick: ()=>setSelectedDelivery(delivery)
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center justify-between mb-2"
        }, /*#__PURE__*/ React.createElement("h4", {
            className: "font-medium"
        }, delivery.name), /*#__PURE__*/ React.createElement(Badge, {
            className: getStatusColor(delivery.status)
        }, getStatusIcon(delivery.status), " ", delivery.status)), /*#__PURE__*/ React.createElement("p", {
            className: "text-sm text-gray-600 mb-2"
        }, delivery.address), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center justify-between text-sm text-gray-500"
        }, /*#__PURE__*/ React.createElement("span", null, delivery.distance, " km • ", delivery.estimatedTime), /*#__PURE__*/ React.createElement("span", {
            className: "font-medium text-green-600"
        }, "₹", delivery.orderValue))))))), /* Selected Delivery Details */ /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(MapPin, {
        className: "w-5 h-5 mr-2"
    }), "Delivery Details")), /*#__PURE__*/ React.createElement(CardContent, null, selectedDelivery ? /*#__PURE__*/ React.createElement("div", {
        className: "space-y-4"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h3", {
        className: "font-semibold text-lg"
    }, selectedDelivery.name), /*#__PURE__*/ React.createElement("p", {
        className: "text-gray-600"
    }, selectedDelivery.address)), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-2 gap-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-gray-50 p-3 rounded-lg"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center text-sm text-gray-600 mb-1"
    }, /*#__PURE__*/ React.createElement(MapPin, {
        className: "w-4 h-4 mr-1"
    }), "Distance"), /*#__PURE__*/ React.createElement("div", {
        className: "font-semibold"
    }, selectedDelivery.distance, " km")), /*#__PURE__*/ React.createElement("div", {
        className: "bg-gray-50 p-3 rounded-lg"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center text-sm text-gray-600 mb-1"
    }, /*#__PURE__*/ React.createElement(Clock, {
        className: "w-4 h-4 mr-1"
    }), "ETA"), /*#__PURE__*/ React.createElement("div", {
        className: "font-semibold"
    }, selectedDelivery.estimatedTime))), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between p-3 bg-green-50 rounded-lg"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "font-medium"
    }, "Order Value"), /*#__PURE__*/ React.createElement("span", {
        className: "text-xl font-bold text-green-600"
    }, "₹", selectedDelivery.orderValue)), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "font-medium"
    }, "Contact"), /*#__PURE__*/ React.createElement(Button, {
        variant: "outline",
        size: "sm"
    }, /*#__PURE__*/ React.createElement(Phone, {
        className: "w-4 h-4 mr-2"
    }), selectedDelivery.contactPhone)), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-2"
    }, /*#__PURE__*/ React.createElement(Button, {
        className: "w-full bg-blue-500 hover:bg-blue-600"
    }, /*#__PURE__*/ React.createElement(Navigation, {
        className: "w-4 h-4 mr-2"
    }), "Get Directions"), /*#__PURE__*/ React.createElement(Button, {
        variant: "outline",
        className: "w-full"
    }, /*#__PURE__*/ React.createElement(Phone, {
        className: "w-4 h-4 mr-2"
    }), "Call Customer"))) : /*#__PURE__*/ React.createElement("div", {
        className: "text-center py-8 text-gray-500"
    }, /*#__PURE__*/ React.createElement(MapPin, {
        className: "w-12 h-12 mx-auto mb-2 opacity-50"
    }), /*#__PURE__*/ React.createElement("p", null, "Select a delivery from the list to view details"))))));
}
