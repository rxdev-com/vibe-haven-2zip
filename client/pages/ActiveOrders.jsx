import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Package, Clock, MapPin, Phone, Truck, CheckCircle, AlertCircle, Search, Eye } from "lucide-react";
const mockOrders = [
    {
        id: "1",
        orderId: "ORD-2025-001",
        supplier: "Kumar Oil Mills",
        items: [
            {
                name: "Pure Ghee",
                quantity: 5,
                unit: "kg",
                price: 450
            },
            {
                name: "Mustard Oil",
                quantity: 2,
                unit: "L",
                price: 180
            }
        ],
        totalAmount: 2610,
        status: "preparing",
        orderDate: "2025-01-26",
        expectedDelivery: "2025-01-28",
        supplierLocation: "Sector 15, Noida",
        supplierPhone: "+91 98765 43210"
    },
    {
        id: "2",
        orderId: "ORD-2025-002",
        supplier: "Fresh Spice Co.",
        items: [
            {
                name: "Garam Masala",
                quantity: 1,
                unit: "kg",
                price: 650
            },
            {
                name: "Red Chili Powder",
                quantity: 500,
                unit: "g",
                price: 120
            }
        ],
        totalAmount: 770,
        status: "confirmed",
        orderDate: "2025-01-26",
        expectedDelivery: "2025-01-29",
        supplierLocation: "Old Delhi",
        supplierPhone: "+91 87654 32109"
    },
    {
        id: "3",
        orderId: "ORD-2025-003",
        supplier: "Grain Merchants",
        items: [
            {
                name: "Basmati Rice",
                quantity: 10,
                unit: "kg",
                price: 120
            }
        ],
        totalAmount: 1200,
        status: "ready",
        orderDate: "2025-01-25",
        expectedDelivery: "2025-01-27",
        supplierLocation: "Ghaziabad",
        supplierPhone: "+91 76543 21098"
    },
    {
        id: "4",
        orderId: "ORD-2025-004",
        supplier: "Organic Vegetables",
        items: [
            {
                name: "Fresh Onions",
                quantity: 5,
                unit: "kg",
                price: 80
            },
            {
                name: "Tomatoes",
                quantity: 3,
                unit: "kg",
                price: 60
            }
        ],
        totalAmount: 580,
        status: "dispatched",
        orderDate: "2025-01-25",
        expectedDelivery: "2025-01-27",
        supplierLocation: "Faridabad",
        supplierPhone: "+91 65432 10987",
        trackingNumber: "TRK123456"
    },
    {
        id: "5",
        orderId: "ORD-2025-005",
        supplier: "Dairy Fresh",
        items: [
            {
                name: "Paneer",
                quantity: 2,
                unit: "kg",
                price: 350
            }
        ],
        totalAmount: 700,
        status: "confirmed",
        orderDate: "2025-01-26",
        expectedDelivery: "2025-01-28",
        supplierLocation: "Gurgaon",
        supplierPhone: "+91 54321 09876"
    }
];
export default function ActiveOrders() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [orders] = useState(mockOrders);
    const getStatusColor = (status)=>{
        switch(status){
            case "confirmed":
                return "bg-blue-100 text-blue-700";
            case "preparing":
                return "bg-yellow-100 text-yellow-700";
            case "ready":
                return "bg-green-100 text-green-700";
            case "dispatched":
                return "bg-purple-100 text-purple-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };
    const getStatusIcon = (status)=>{
        switch(status){
            case "confirmed":
                return /*#__PURE__*/ React.createElement(CheckCircle, {
                    className: "w-4 h-4"
                });
            case "preparing":
                return /*#__PURE__*/ React.createElement(Clock, {
                    className: "w-4 h-4"
                });
            case "ready":
                return /*#__PURE__*/ React.createElement(Package, {
                    className: "w-4 h-4"
                });
            case "dispatched":
                return /*#__PURE__*/ React.createElement(Truck, {
                    className: "w-4 h-4"
                });
            default:
                return /*#__PURE__*/ React.createElement(AlertCircle, {
                    className: "w-4 h-4"
                });
        }
    };
    const filteredOrders = orders.filter((order)=>{
        const matchesSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) || order.supplier.toLowerCase().includes(searchTerm.toLowerCase()) || order.items.some((item)=>item.name.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === "all" || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    const handleContactSupplier = (supplier, phone)=>{
        toast({
            title: "Contact Supplier",
            description: `Calling ${supplier} at ${phone}`
        });
    };
    const handleTrackOrder = (orderId)=>{
        toast({
            title: "Track Order",
            description: `Opening tracking details for ${orderId}`
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
    }, "JugaduBazar"))), /*#__PURE__*/ React.createElement(Badge, {
        className: "bg-saffron-100 text-saffron-700"
    }, "Active Orders")))), /*#__PURE__*/ React.createElement("div", {
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    }, /* Page Header */ /*#__PURE__*/ React.createElement("div", {
        className: "mb-8"
    }, /*#__PURE__*/ React.createElement("h1", {
        className: "text-3xl font-bold text-gray-900 mb-2"
    }, "Active Orders"), /*#__PURE__*/ React.createElement("p", {
        className: "text-gray-600"
    }, "Track and manage your current orders from suppliers")), /* Stats Overview */ /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
    }, /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(CheckCircle, {
        className: "w-8 h-8 text-blue-500 mr-3"
    }), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-600"
    }, "Confirmed"), /*#__PURE__*/ React.createElement("p", {
        className: "text-2xl font-bold text-gray-900"
    }, orders.filter((o)=>o.status === "confirmed").length))))), /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(Clock, {
        className: "w-8 h-8 text-yellow-500 mr-3"
    }), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-600"
    }, "Preparing"), /*#__PURE__*/ React.createElement("p", {
        className: "text-2xl font-bold text-gray-900"
    }, orders.filter((o)=>o.status === "preparing").length))))), /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(Package, {
        className: "w-8 h-8 text-green-500 mr-3"
    }), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-600"
    }, "Ready"), /*#__PURE__*/ React.createElement("p", {
        className: "text-2xl font-bold text-gray-900"
    }, orders.filter((o)=>o.status === "ready").length))))), /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(Truck, {
        className: "w-8 h-8 text-purple-500 mr-3"
    }), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-600"
    }, "Dispatched"), /*#__PURE__*/ React.createElement("p", {
        className: "text-2xl font-bold text-gray-900"
    }, orders.filter((o)=>o.status === "dispatched").length)))))), /* Filters */ /*#__PURE__*/ React.createElement(Card, {
        className: "mb-6"
    }, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-col md:flex-row gap-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex-1 relative"
    }, /*#__PURE__*/ React.createElement(Search, {
        className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
    }), /*#__PURE__*/ React.createElement(Input, {
        placeholder: "Search orders, suppliers, or items...",
        value: searchTerm,
        onChange: (e)=>setSearchTerm(e.target.value),
        className: "pl-10"
    })), /*#__PURE__*/ React.createElement(Select, {
        value: statusFilter,
        onValueChange: setStatusFilter
    }, /*#__PURE__*/ React.createElement(SelectTrigger, {
        className: "w-full md:w-48"
    }, /*#__PURE__*/ React.createElement(SelectValue, {
        placeholder: "Filter by status"
    })), /*#__PURE__*/ React.createElement(SelectContent, null, /*#__PURE__*/ React.createElement(SelectItem, {
        value: "all"
    }, "All Orders"), /*#__PURE__*/ React.createElement(SelectItem, {
        value: "confirmed"
    }, "Confirmed"), /*#__PURE__*/ React.createElement(SelectItem, {
        value: "preparing"
    }, "Preparing"), /*#__PURE__*/ React.createElement(SelectItem, {
        value: "ready"
    }, "Ready"), /*#__PURE__*/ React.createElement(SelectItem, {
        value: "dispatched"
    }, "Dispatched")))))), /* Orders List */ /*#__PURE__*/ React.createElement("div", {
        className: "space-y-4"
    }, filteredOrders.length === 0 ? /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-12 text-center"
    }, /*#__PURE__*/ React.createElement(Package, {
        className: "w-12 h-12 text-gray-300 mx-auto mb-4"
    }), /*#__PURE__*/ React.createElement("h3", {
        className: "text-lg font-medium text-gray-900 mb-2"
    }, "No orders found"), /*#__PURE__*/ React.createElement("p", {
        className: "text-gray-500"
    }, searchTerm || statusFilter !== "all" ? "Try adjusting your search or filter criteria" : "You don't have any active orders yet"))) : filteredOrders.map((order)=>/*#__PURE__*/ React.createElement(Card, {
            key: order.id,
            className: "hover:shadow-lg transition-shadow"
        }, /*#__PURE__*/ React.createElement(CardContent, {
            className: "p-6"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex flex-col lg:flex-row lg:items-center justify-between gap-4"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex-1"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center justify-between mb-2"
        }, /*#__PURE__*/ React.createElement("h3", {
            className: "text-lg font-semibold text-gray-900"
        }, order.orderId), /*#__PURE__*/ React.createElement(Badge, {
            className: getStatusColor(order.status)
        }, getStatusIcon(order.status), /*#__PURE__*/ React.createElement("span", {
            className: "ml-1 capitalize"
        }, order.status))), /*#__PURE__*/ React.createElement("p", {
            className: "text-gray-600 mb-2"
        }, /*#__PURE__*/ React.createElement("strong", null, "Supplier:"), " ", order.supplier), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center text-sm text-gray-500 mb-2"
        }, /*#__PURE__*/ React.createElement(MapPin, {
            className: "w-4 h-4 mr-1"
        }), order.supplierLocation), /*#__PURE__*/ React.createElement("div", {
            className: "mb-3"
        }, /*#__PURE__*/ React.createElement("p", {
            className: "text-sm font-medium text-gray-700 mb-1"
        }, "Items:"), /*#__PURE__*/ React.createElement("div", {
            className: "space-y-1"
        }, order.items.map((item, idx)=>/*#__PURE__*/ React.createElement("div", {
                key: idx,
                className: "text-sm text-gray-600"
            }, item.name, " - ", item.quantity, " ", item.unit, " @ ₹", item.price)))), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-4 text-sm"
        }, /*#__PURE__*/ React.createElement("span", null, /*#__PURE__*/ React.createElement("strong", null, "Order Date:"), " ", new Date(order.orderDate).toLocaleDateString()), /*#__PURE__*/ React.createElement("span", null, /*#__PURE__*/ React.createElement("strong", null, "Expected:"), " ", new Date(order.expectedDelivery).toLocaleDateString()), /*#__PURE__*/ React.createElement("span", {
            className: "text-lg font-bold text-green-600"
        }, "₹", order.totalAmount))), /*#__PURE__*/ React.createElement("div", {
            className: "flex flex-col gap-2 lg:w-48"
        }, /*#__PURE__*/ React.createElement(Button, {
            variant: "outline",
            size: "sm",
            onClick: ()=>handleTrackOrder(order.orderId),
            className: "w-full"
        }, /*#__PURE__*/ React.createElement(Eye, {
            className: "w-4 h-4 mr-2"
        }), "Track Order"), /*#__PURE__*/ React.createElement(Button, {
            variant: "outline",
            size: "sm",
            onClick: ()=>handleContactSupplier(order.supplier, order.supplierPhone),
            className: "w-full"
        }, /*#__PURE__*/ React.createElement(Phone, {
            className: "w-4 h-4 mr-2"
        }), "Contact Supplier"), order.trackingNumber && /*#__PURE__*/ React.createElement("div", {
            className: "text-xs text-center text-gray-500 mt-1"
        }, "Tracking: ", order.trackingNumber)))))))));
}
