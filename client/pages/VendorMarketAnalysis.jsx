import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import ProfilePhoto from "@/components/ProfilePhoto";
import LanguageSelector from "@/components/LanguageSelector";
import NotificationPanel from "@/components/NotificationPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from "recharts";
import { AlertTriangle, Search, Bell, ShoppingCart, BarChart3, Activity, Package, Target, Eye, Star, Clock } from "lucide-react";
// Mock real-time price data
const generatePriceData = (days = 30, basePrice = 100)=>{
    const data = [];
    let price = basePrice;
    for(let i = 0; i < days; i++){
        const change = (Math.random() - 0.5) * 10;
        price = Math.max(price + change, basePrice * 0.7);
        data.push({
            date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            price: Math.round(price * 100) / 100,
            volume: Math.floor(Math.random() * 1000) + 100,
            suppliers: Math.floor(Math.random() * 10) + 3
        });
    }
    return data;
};
const marketItems = [
    {
        id: 1,
        name: "Premium Mustard Oil",
        category: "Oils & Fats",
        currentPrice: 185,
        previousPrice: 180,
        changePercent: 2.8,
        trend: "up",
        volume: 2450,
        suppliers: 12,
        data: generatePriceData(30, 180),
        volatility: "low",
        prediction: "stable"
    },
    {
        id: 2,
        name: "Garam Masala Powder",
        category: "Spices",
        currentPrice: 315,
        previousPrice: 325,
        changePercent: -3.1,
        trend: "down",
        volume: 1890,
        suppliers: 8,
        data: generatePriceData(30, 320),
        volatility: "medium",
        prediction: "rising"
    },
    {
        id: 3,
        name: "Basmati Rice Premium",
        category: "Grains",
        currentPrice: 125,
        previousPrice: 122,
        changePercent: 2.5,
        trend: "up",
        volume: 3200,
        suppliers: 15,
        data: generatePriceData(30, 120),
        volatility: "high",
        prediction: "volatile"
    },
    {
        id: 4,
        name: "Red Chili Powder",
        category: "Spices",
        currentPrice: 275,
        previousPrice: 285,
        changePercent: -3.5,
        trend: "down",
        volume: 1650,
        suppliers: 10,
        data: generatePriceData(30, 280),
        volatility: "medium",
        prediction: "falling"
    },
    {
        id: 5,
        name: "Turmeric Powder",
        category: "Spices",
        currentPrice: 255,
        previousPrice: 250,
        changePercent: 2.0,
        trend: "up",
        volume: 2100,
        suppliers: 14,
        data: generatePriceData(30, 250),
        volatility: "low",
        prediction: "stable"
    }
];
const marketAlerts = [
    {
        id: 1,
        type: "price_drop",
        item: "Garam Masala Powder",
        message: "Price dropped by 3.1% in last 24h - Good buying opportunity!",
        severity: "info",
        time: "2 hours ago"
    },
    {
        id: 2,
        type: "high_volatility",
        item: "Basmati Rice Premium",
        message: "High price volatility detected - Monitor closely",
        severity: "warning",
        time: "4 hours ago"
    },
    {
        id: 3,
        type: "supply_increase",
        item: "Turmeric Powder",
        message: "New suppliers joined - Increased competition may lower prices",
        severity: "info",
        time: "6 hours ago"
    }
];
const categoryData = [
    {
        name: "Oils & Fats",
        value: 35,
        color: "#FF6B35"
    },
    {
        name: "Spices",
        value: 28,
        color: "#F7931E"
    },
    {
        name: "Grains",
        value: 22,
        color: "#2ECC71"
    },
    {
        name: "Vegetables",
        value: 15,
        color: "#3498DB"
    }
];
export default function VendorMarketAnalysis() {
    const { user, logout } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [profileImage, setProfileImage] = useState("");
    const [selectedItem, setSelectedItem] = useState(marketItems[0]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedTimeRange, setSelectedTimeRange] = useState("30d");
    const [isLiveMode, setIsLiveMode] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    useEffect(()=>{
        const savedImage = localStorage.getItem("profileImage");
        if (savedImage) setProfileImage(savedImage);
    }, []);
    // Simulate real-time updates
    useEffect(()=>{
        if (!isLiveMode) return;
        const interval = setInterval(()=>{
            setLastUpdate(new Date());
        }, // In real app, this would fetch fresh data
        30000);
        // Update every 30 seconds
        return ()=>clearInterval(interval);
    }, [
        isLiveMode
    ]);
    const filteredItems = marketItems.filter((item)=>{
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });
    const getVolatilityColor = (volatility)=>{
        switch(volatility){
            case "low":
                return "text-green-600 bg-green-100";
            case "medium":
                return "text-yellow-600 bg-yellow-100";
            case "high":
                return "text-red-600 bg-red-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };
    const getPredictionColor = (prediction)=>{
        switch(prediction){
            case "rising":
                return "text-green-600";
            case "falling":
                return "text-red-600";
            case "stable":
                return "text-blue-600";
            case "volatile":
                return "text-orange-600";
            default:
                return "text-gray-600";
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
    }, /*#__PURE__*/ React.createElement("a", {
        className: "flex items-center space-x-2",
        href: "/"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-8 h-8 bg-gradient-to-r from-saffron-500 to-emerald-500 rounded-lg flex items-center justify-center"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-white font-bold text-sm"
    }, "JB")), /*#__PURE__*/ React.createElement("span", {
        className: "text-xl font-bold bg-gradient-to-r from-saffron-600 to-emerald-600 bg-clip-text text-transparent"
    }, "JugaduBazar")), /*#__PURE__*/ React.createElement(Badge, {
        className: "bg-purple-100 text-purple-700"
    }, "Market Analysis")), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-4"
    }, /*#__PURE__*/ React.createElement(LanguageSelector, null), /*#__PURE__*/ React.createElement(NotificationPanel, null), /*#__PURE__*/ React.createElement("a", {
        href: "/cart"
    }, /*#__PURE__*/ React.createElement(Button, {
        variant: "outline",
        size: "sm"
    }, /*#__PURE__*/ React.createElement(ShoppingCart, {
        className: "w-5 h-5"
    }))), /*#__PURE__*/ React.createElement("a", {
        className: "flex items-center",
        href: "/vendor/profile"
    }, /*#__PURE__*/ React.createElement(ProfilePhoto, {
        currentImage: profileImage,
        userName: user?.name || "User",
        size: "sm",
        onImageChange: (url)=>setProfileImage(url)
    })), /*#__PURE__*/ React.createElement(Button, {
        variant: "outline",
        onClick: logout
    }, "Logout"))))), /*#__PURE__*/ React.createElement("div", {
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    }, /* Page Header */ /*#__PURE__*/ React.createElement("div", {
        className: "mb-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h1", {
        className: "text-3xl font-bold text-gray-900 mb-2"
    }, "Market Analysis"), /*#__PURE__*/ React.createElement("p", {
        className: "text-gray-600"
    }, "Real-time price tracking and market insights for raw materials")), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-3"
    }, /*#__PURE__*/ React.createElement(Button, {
        variant: isLiveMode ? "default" : "outline",
        onClick: ()=>setIsLiveMode(!isLiveMode),
        className: "flex items-center space-x-2"
    }, /*#__PURE__*/ React.createElement(Activity, {
        className: `w-4 h-4 ${isLiveMode ? 'animate-pulse' : ''}`
    }), /*#__PURE__*/ React.createElement("span", null, isLiveMode ? 'Live' : 'Paused')), /*#__PURE__*/ React.createElement(Badge, {
        variant: "outline",
        className: "text-xs"
    }, /*#__PURE__*/ React.createElement(Clock, {
        className: "w-3 h-3 mr-1"
    }), "Updated ", lastUpdate.toLocaleTimeString())))), /* Market Overview Cards */ /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
    }, /*#__PURE__*/ React.createElement(Card, {
        className: "hover:shadow-lg transition-shadow"
    }, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
    }, /*#__PURE__*/ React.createElement(BarChart3, {
        className: "w-6 h-6 text-blue-600"
    })), /*#__PURE__*/ React.createElement("div", {
        className: "ml-4"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-600"
    }, "Average Price Change"), /*#__PURE__*/ React.createElement("p", {
        className: "text-2xl font-bold text-green-600"
    }, "+1.2%"))))), /*#__PURE__*/ React.createElement(Card, {
        className: "hover:shadow-lg transition-shadow"
    }, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"
    }, /*#__PURE__*/ React.createElement(Package, {
        className: "w-6 h-6 text-green-600"
    })), /*#__PURE__*/ React.createElement("div", {
        className: "ml-4"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-600"
    }, "Total Items Tracked"), /*#__PURE__*/ React.createElement("p", {
        className: "text-2xl font-bold text-gray-900"
    }, "247"))))), /*#__PURE__*/ React.createElement(Card, {
        className: "hover:shadow-lg transition-shadow"
    }, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center"
    }, /*#__PURE__*/ React.createElement(Target, {
        className: "w-6 h-6 text-orange-600"
    })), /*#__PURE__*/ React.createElement("div", {
        className: "ml-4"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-600"
    }, "Best Deals"), /*#__PURE__*/ React.createElement("p", {
        className: "text-2xl font-bold text-orange-600"
    }, "18"))))), /*#__PURE__*/ React.createElement(Card, {
        className: "hover:shadow-lg transition-shadow"
    }, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center"
    }, /*#__PURE__*/ React.createElement(AlertTriangle, {
        className: "w-6 h-6 text-red-600"
    })), /*#__PURE__*/ React.createElement("div", {
        className: "ml-4"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-600"
    }, "Price Alerts"), /*#__PURE__*/ React.createElement("p", {
        className: "text-2xl font-bold text-red-600"
    }, "3")))))), /* Search and Filters */ /*#__PURE__*/ React.createElement(Card, {
        className: "mb-8"
    }, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-col md:flex-row gap-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex-1 relative"
    }, /*#__PURE__*/ React.createElement(Search, {
        className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
    }), /*#__PURE__*/ React.createElement(Input, {
        placeholder: "Search for materials...",
        value: searchTerm,
        onChange: (e)=>setSearchTerm(e.target.value),
        className: "pl-10"
    })), /*#__PURE__*/ React.createElement(Select, {
        value: selectedCategory,
        onValueChange: setSelectedCategory
    }, /*#__PURE__*/ React.createElement(SelectTrigger, {
        className: "w-full md:w-48"
    }, /*#__PURE__*/ React.createElement(SelectValue, {
        placeholder: "Category"
    })), /*#__PURE__*/ React.createElement(SelectContent, null, /*#__PURE__*/ React.createElement(SelectItem, {
        value: "all"
    }, "All Categories"), /*#__PURE__*/ React.createElement(SelectItem, {
        value: "Oils & Fats"
    }, "Oils & Fats"), /*#__PURE__*/ React.createElement(SelectItem, {
        value: "Spices"
    }, "Spices"), /*#__PURE__*/ React.createElement(SelectItem, {
        value: "Grains"
    }, "Grains"), /*#__PURE__*/ React.createElement(SelectItem, {
        value: "Vegetables"
    }, "Vegetables"))), /*#__PURE__*/ React.createElement(Select, {
        value: selectedTimeRange,
        onValueChange: setSelectedTimeRange
    }, /*#__PURE__*/ React.createElement(SelectTrigger, {
        className: "w-full md:w-32"
    }, /*#__PURE__*/ React.createElement(SelectValue, {
        placeholder: "Time Range"
    })), /*#__PURE__*/ React.createElement(SelectContent, null, /*#__PURE__*/ React.createElement(SelectItem, {
        value: "7d"
    }, "7 Days"), /*#__PURE__*/ React.createElement(SelectItem, {
        value: "30d"
    }, "30 Days"), /*#__PURE__*/ React.createElement(SelectItem, {
        value: "90d"
    }, "90 Days")))))), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 lg:grid-cols-3 gap-8"
    }, /* Main Chart */ /*#__PURE__*/ React.createElement("div", {
        className: "lg:col-span-2"
    }, /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, {
        className: "flex flex-row items-center justify-between"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement(CardTitle, {
        className: "text-xl"
    }, selectedItem.name, " - Price Trend"), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-600"
    }, "Current: ₹", selectedItem.currentPrice, "/", selectedItem.category === "Oils & Fats" ? "L" : "Kg", /*#__PURE__*/ React.createElement("span", {
        className: `ml-2 ${selectedItem.trend === 'up' ? 'text-green-600' : 'text-red-600'}`
    }, selectedItem.trend === 'up' ? '↗' : '↘', " ", Math.abs(selectedItem.changePercent), "%"))), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-2"
    }, /*#__PURE__*/ React.createElement(Badge, {
        className: getPredictionColor(selectedItem.prediction)
    }, selectedItem.prediction), /*#__PURE__*/ React.createElement(Badge, {
        className: getVolatilityColor(selectedItem.volatility)
    }, selectedItem.volatility, " volatility"))), /*#__PURE__*/ React.createElement(CardContent, null, /*#__PURE__*/ React.createElement("div", {
        className: "h-80"
    }, /*#__PURE__*/ React.createElement(ResponsiveContainer, {
        width: "100%",
        height: "100%"
    }, /*#__PURE__*/ React.createElement(AreaChart, {
        data: selectedItem.data
    }, /*#__PURE__*/ React.createElement(CartesianGrid, {
        strokeDasharray: "3 3"
    }), /*#__PURE__*/ React.createElement(XAxis, {
        dataKey: "date",
        tickFormatter: (value)=>new Date(value).toLocaleDateString()
    }), /*#__PURE__*/ React.createElement(YAxis, null), /*#__PURE__*/ React.createElement(Tooltip, {
        labelFormatter: (value)=>new Date(value).toLocaleDateString(),
        formatter: (value, name)=>[
                `₹${value}`,
                'Price'
            ]
    }), /*#__PURE__*/ React.createElement(Area, {
        type: "monotone",
        dataKey: "price",
        stroke: "#3498DB",
        fill: "#3498DB",
        fillOpacity: 0.1
    })))))), /* Market Alerts */ /*#__PURE__*/ React.createElement(Card, {
        className: "mt-6"
    }, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(Bell, {
        className: "w-5 h-5 mr-2"
    }), "Market Alerts")), /*#__PURE__*/ React.createElement(CardContent, null, /*#__PURE__*/ React.createElement("div", {
        className: "space-y-4"
    }, marketAlerts.map((alert)=>/*#__PURE__*/ React.createElement(Alert, {
            key: alert.id,
            className: alert.severity === 'warning' ? 'border-yellow-200 bg-yellow-50' : 'border-blue-200 bg-blue-50'
        }, /*#__PURE__*/ React.createElement(AlertTriangle, {
            className: `h-4 w-4 ${alert.severity === 'warning' ? 'text-yellow-600' : 'text-blue-600'}`
        }), /*#__PURE__*/ React.createElement(AlertDescription, null, /*#__PURE__*/ React.createElement("div", {
            className: "flex justify-between items-start"
        }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
            className: "font-medium"
        }, alert.item), /*#__PURE__*/ React.createElement("p", {
            className: "text-sm"
        }, alert.message)), /*#__PURE__*/ React.createElement("span", {
            className: "text-xs text-gray-500"
        }, alert.time))))))))), /* Sidebar */ /*#__PURE__*/ React.createElement("div", {
        className: "space-y-6"
    }, /* Market Items List */ /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, null, "Market Items")), /*#__PURE__*/ React.createElement(CardContent, null, /*#__PURE__*/ React.createElement("div", {
        className: "space-y-3"
    }, filteredItems.map((item)=>/*#__PURE__*/ React.createElement("div", {
            key: item.id,
            className: `p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${selectedItem.id === item.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`,
            onClick: ()=>setSelectedItem(item)
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex justify-between items-start mb-2"
        }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h4", {
            className: "font-medium text-sm"
        }, item.name), /*#__PURE__*/ React.createElement("p", {
            className: "text-xs text-gray-600"
        }, item.category)), /*#__PURE__*/ React.createElement("div", {
            className: "text-right"
        }, /*#__PURE__*/ React.createElement("p", {
            className: "font-bold text-sm"
        }, "₹", item.currentPrice), /*#__PURE__*/ React.createElement("p", {
            className: `text-xs ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`
        }, item.trend === 'up' ? '+' : '', item.changePercent, "%"))), /*#__PURE__*/ React.createElement("div", {
            className: "flex justify-between text-xs text-gray-500"
        }, /*#__PURE__*/ React.createElement("span", null, "Vol: ", item.volume), /*#__PURE__*/ React.createElement("span", null, item.suppliers, " suppliers"))))))), /* Category Distribution */ /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, null, "Category Distribution")), /*#__PURE__*/ React.createElement(CardContent, null, /*#__PURE__*/ React.createElement("div", {
        className: "h-48"
    }, /*#__PURE__*/ React.createElement(ResponsiveContainer, {
        width: "100%",
        height: "100%"
    }, /*#__PURE__*/ React.createElement(PieChart, null, /*#__PURE__*/ React.createElement(Pie, {
        data: categoryData,
        cx: "50%",
        cy: "50%",
        innerRadius: 40,
        outerRadius: 70,
        paddingAngle: 5,
        dataKey: "value"
    }, categoryData.map((entry, index)=>/*#__PURE__*/ React.createElement(Cell, {
            key: `cell-${index}`,
            fill: entry.color
        }))), /*#__PURE__*/ React.createElement(Tooltip, {
        formatter: (value)=>`${value}%`
    })))), /*#__PURE__*/ React.createElement("div", {
        className: "mt-4 space-y-2"
    }, categoryData.map((category, index)=>/*#__PURE__*/ React.createElement("div", {
            key: index,
            className: "flex items-center justify-between text-sm"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-3 h-3 rounded-full mr-2",
            style: {
                backgroundColor: category.color
            }
        }), /*#__PURE__*/ React.createElement("span", null, category.name)), /*#__PURE__*/ React.createElement("span", {
            className: "font-medium"
        }, category.value, "%")))))), /* Quick Actions */ /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, null, "Quick Actions")), /*#__PURE__*/ React.createElement(CardContent, null, /*#__PURE__*/ React.createElement("div", {
        className: "space-y-3"
    }, /*#__PURE__*/ React.createElement(Button, {
        className: "w-full justify-start",
        variant: "outline"
    }, /*#__PURE__*/ React.createElement(Target, {
        className: "w-4 h-4 mr-2"
    }), "Set Price Alert"), /*#__PURE__*/ React.createElement(Button, {
        className: "w-full justify-start",
        variant: "outline"
    }, /*#__PURE__*/ React.createElement(Eye, {
        className: "w-4 h-4 mr-2"
    }), "Add to Watchlist"), /*#__PURE__*/ React.createElement(Button, {
        className: "w-full justify-start",
        variant: "outline"
    }, /*#__PURE__*/ React.createElement(ShoppingCart, {
        className: "w-4 h-4 mr-2"
    }), "Order Now"), /*#__PURE__*/ React.createElement(Button, {
        className: "w-full justify-start",
        variant: "outline"
    }, /*#__PURE__*/ React.createElement(Star, {
        className: "w-4 h-4 mr-2"
    }), "Compare Suppliers"))))))));
}
