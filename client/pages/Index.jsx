import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Store, CheckCircle, MapPin, Clock, Shield } from "lucide-react";
export default function Index() {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    // Redirect authenticated users to their dashboard
    useEffect(()=>{
        if (isAuthenticated && user) {
            const dashboardPath = user.role === "vendor" ? "/vendor/dashboard" : "/supplier/dashboard";
            navigate(dashboardPath);
        }
    }, [
        isAuthenticated,
        user,
        navigate
    ]);
    return /*#__PURE__*/ React.createElement("div", {
        className: "min-h-screen bg-gradient-to-br from-orange-50 via-white to-emerald-50"
    }, /* Navigation */ /*#__PURE__*/ React.createElement("nav", {
        className: "bg-white/80 backdrop-blur-md border-b sticky top-0 z-50"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-center h-16"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-8 h-8 bg-gradient-to-r from-saffron-500 to-emerald-500 rounded-lg flex items-center justify-center"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-white font-bold text-sm"
    }, "JB")), /*#__PURE__*/ React.createElement("span", {
        className: "text-xl font-bold bg-gradient-to-r from-saffron-600 to-emerald-600 bg-clip-text text-transparent"
    }, "JugaduBazar")), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-4"
    }, /*#__PURE__*/ React.createElement(Link, {
        to: "/login"
    }, /*#__PURE__*/ React.createElement(Button, {
        variant: "ghost",
        className: "text-gray-600 hover:text-saffron-600"
    }, "Login")), /*#__PURE__*/ React.createElement(Link, {
        to: "/register"
    }, /*#__PURE__*/ React.createElement(Button, {
        className: "bg-gradient-to-r from-saffron-500 to-saffron-600 hover:from-saffron-600 hover:to-saffron-700"
    }, "Get Started")))))), /* Hero Section */ /*#__PURE__*/ React.createElement("section", {
        className: "relative py-20 lg:py-32"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "text-center animate-fade-in"
    }, /*#__PURE__*/ React.createElement(Badge, {
        className: "mb-6 bg-gradient-to-r from-saffron-100 to-emerald-100 text-saffron-700 border-saffron-200"
    }, "🚀 Revolutionizing Street Food Supply Chain"), /*#__PURE__*/ React.createElement("h1", {
        className: "text-4xl md:text-6xl font-bold text-gray-900 mb-6"
    }, "Connect", " ", /*#__PURE__*/ React.createElement("span", {
        className: "bg-gradient-to-r from-saffron-600 to-emerald-600 bg-clip-text text-transparent"
    }, "Street Food Vendors"), " ", "with Local Suppliers"), /*#__PURE__*/ React.createElement("p", {
        className: "text-xl text-gray-600 max-w-3xl mx-auto mb-12"
    }, "JugaduBazar solves the raw material sourcing problem for Indian street food vendors. Get fresh ingredients, competitive prices, and reliable delivery - all in one platform."), /* CTA Cards */ /*#__PURE__*/ React.createElement("div", {
        className: "grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
    }, /*#__PURE__*/ React.createElement(Card, {
        className: "relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 hover:border-saffron-200"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "absolute inset-0 bg-gradient-to-br from-saffron-50 to-orange-50 opacity-50"
    }), /*#__PURE__*/ React.createElement(CardHeader, {
        className: "relative"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-12 h-12 bg-gradient-to-r from-saffron-500 to-orange-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
    }, /*#__PURE__*/ React.createElement(ShoppingCart, {
        className: "w-6 h-6 text-white"
    })), /*#__PURE__*/ React.createElement(CardTitle, {
        className: "text-2xl text-left"
    }, "I'm a Vendor"), /*#__PURE__*/ React.createElement(CardDescription, {
        className: "text-left text-gray-600"
    }, "Source raw materials from trusted local suppliers with competitive prices and fast delivery")), /*#__PURE__*/ React.createElement(CardContent, {
        className: "relative"
    }, /*#__PURE__*/ React.createElement("ul", {
        className: "space-y-2 text-left mb-6"
    }, /*#__PURE__*/ React.createElement("li", {
        className: "flex items-center text-sm text-gray-600"
    }, /*#__PURE__*/ React.createElement(CheckCircle, {
        className: "w-4 h-4 text-emerald-500 mr-2"
    }), "Browse materials by category"), /*#__PURE__*/ React.createElement("li", {
        className: "flex items-center text-sm text-gray-600"
    }, /*#__PURE__*/ React.createElement(CheckCircle, {
        className: "w-4 h-4 text-emerald-500 mr-2"
    }), "Compare prices & ratings"), /*#__PURE__*/ React.createElement("li", {
        className: "flex items-center text-sm text-gray-600"
    }, /*#__PURE__*/ React.createElement(CheckCircle, {
        className: "w-4 h-4 text-emerald-500 mr-2"
    }), "Track order status in real-time")), /*#__PURE__*/ React.createElement(Link, {
        to: "/register?role=vendor",
        className: "w-full"
    }, /*#__PURE__*/ React.createElement(Button, {
        className: "w-full bg-gradient-to-r from-saffron-500 to-orange-500 hover:from-saffron-600 hover:to-orange-600"
    }, "Start as Vendor")))), /*#__PURE__*/ React.createElement(Card, {
        className: "relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 hover:border-emerald-200"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-50 opacity-50"
    }), /*#__PURE__*/ React.createElement(CardHeader, {
        className: "relative"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
    }, /*#__PURE__*/ React.createElement(Store, {
        className: "w-6 h-6 text-white"
    })), /*#__PURE__*/ React.createElement(CardTitle, {
        className: "text-2xl text-left"
    }, "I'm a Supplier"), /*#__PURE__*/ React.createElement(CardDescription, {
        className: "text-left text-gray-600"
    }, "Sell your raw materials to local street food vendors and grow your business")), /*#__PURE__*/ React.createElement(CardContent, {
        className: "relative"
    }, /*#__PURE__*/ React.createElement("ul", {
        className: "space-y-2 text-left mb-6"
    }, /*#__PURE__*/ React.createElement("li", {
        className: "flex items-center text-sm text-gray-600"
    }, /*#__PURE__*/ React.createElement(CheckCircle, {
        className: "w-4 h-4 text-emerald-500 mr-2"
    }), "List your products easily"), /*#__PURE__*/ React.createElement("li", {
        className: "flex items-center text-sm text-gray-600"
    }, /*#__PURE__*/ React.createElement(CheckCircle, {
        className: "w-4 h-4 text-emerald-500 mr-2"
    }), "Manage orders efficiently"), /*#__PURE__*/ React.createElement("li", {
        className: "flex items-center text-sm text-gray-600"
    }, /*#__PURE__*/ React.createElement(CheckCircle, {
        className: "w-4 h-4 text-emerald-500 mr-2"
    }), "Build trusted reputation")), /*#__PURE__*/ React.createElement(Link, {
        to: "/register?role=supplier",
        className: "w-full"
    }, /*#__PURE__*/ React.createElement(Button, {
        className: "w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
    }, "Start as Supplier")))))))), /* Features Section */ /*#__PURE__*/ React.createElement("section", {
        className: "py-20 bg-white"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "text-center mb-16"
    }, /*#__PURE__*/ React.createElement("h2", {
        className: "text-3xl md:text-4xl font-bold text-gray-900 mb-4"
    }, "Why Choose JugaduBazar?"), /*#__PURE__*/ React.createElement("p", {
        className: "text-xl text-gray-600 max-w-2xl mx-auto"
    }, "We understand the unique challenges of street food vendors and provide solutions that work.")), /*#__PURE__*/ React.createElement("div", {
        className: "grid md:grid-cols-3 gap-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "text-center group"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-16 h-16 bg-gradient-to-r from-saffron-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform"
    }, /*#__PURE__*/ React.createElement(MapPin, {
        className: "w-8 h-8 text-white"
    })), /*#__PURE__*/ React.createElement("h3", {
        className: "text-xl font-semibold text-gray-900 mb-3"
    }, "Local Network"), /*#__PURE__*/ React.createElement("p", {
        className: "text-gray-600"
    }, "Connect with suppliers in your area for faster delivery and better relationships.")), /*#__PURE__*/ React.createElement("div", {
        className: "text-center group"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform"
    }, /*#__PURE__*/ React.createElement(Clock, {
        className: "w-8 h-8 text-white"
    })), /*#__PURE__*/ React.createElement("h3", {
        className: "text-xl font-semibold text-gray-900 mb-3"
    }, "Real-time Tracking"), /*#__PURE__*/ React.createElement("p", {
        className: "text-gray-600"
    }, "Track your orders from confirmation to delivery with live status updates.")), /*#__PURE__*/ React.createElement("div", {
        className: "text-center group"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform"
    }, /*#__PURE__*/ React.createElement(Shield, {
        className: "w-8 h-8 text-white"
    })), /*#__PURE__*/ React.createElement("h3", {
        className: "text-xl font-semibold text-gray-900 mb-3"
    }, "Trusted Quality"), /*#__PURE__*/ React.createElement("p", {
        className: "text-gray-600"
    }, "Verified suppliers with ratings and reviews ensure you get quality materials."))))), /* Stats Section */ /*#__PURE__*/ React.createElement("section", {
        className: "py-20 bg-gradient-to-r from-saffron-50 to-emerald-50"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "grid md:grid-cols-4 gap-8 text-center"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
        className: "text-3xl md:text-4xl font-bold text-saffron-600 mb-2"
    }, "500+"), /*#__PURE__*/ React.createElement("div", {
        className: "text-gray-600"
    }, "Active Vendors")), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
        className: "text-3xl md:text-4xl font-bold text-emerald-600 mb-2"
    }, "200+"), /*#__PURE__*/ React.createElement("div", {
        className: "text-gray-600"
    }, "Trusted Suppliers")), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
        className: "text-3xl md:text-4xl font-bold text-saffron-600 mb-2"
    }, "10K+"), /*#__PURE__*/ React.createElement("div", {
        className: "text-gray-600"
    }, "Orders Completed")), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
        className: "text-3xl md:text-4xl font-bold text-emerald-600 mb-2"
    }, "���2L+"), /*#__PURE__*/ React.createElement("div", {
        className: "text-gray-600"
    }, "Money Saved"))))), /* Footer */ /*#__PURE__*/ React.createElement("footer", {
        className: "bg-gray-900 text-white py-12"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-col md:flex-row justify-between items-center"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-2 mb-4 md:mb-0"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-8 h-8 bg-gradient-to-r from-saffron-500 to-emerald-500 rounded-lg flex items-center justify-center"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-white font-bold text-sm"
    }, "JB")), /*#__PURE__*/ React.createElement("span", {
        className: "text-xl font-bold"
    }, "JugaduBazar")), /*#__PURE__*/ React.createElement("div", {
        className: "text-gray-400 text-sm"
    }, "© 2024 JugaduBazar. Empowering street food vendors across India.")))));
}
