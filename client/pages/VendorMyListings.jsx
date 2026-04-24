import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import NotificationPanel from "@/components/NotificationPanel";
import ProfilePhoto from "@/components/ProfilePhoto";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Search, Edit, Trash2, Eye, Package, TrendingUp, AlertCircle, Plus, MoreVertical } from "lucide-react";
// Mock user's listings
const mockUserListings = [
    {
        id: "UL001",
        title: "Commercial Rice Cooker - Barely Used",
        category: "equipment",
        price: 15000,
        originalPrice: 25000,
        condition: "Like New",
        description: "Professional rice cooker, bought 3 months ago but switching to gas cooking.",
        status: "active",
        views: 47,
        inquiries: 8,
        postedDate: "2024-01-10",
        lastUpdated: "2024-01-15",
        images: [
            "rice-cooker.jpg"
        ],
        urgency: "normal",
        tags: [
            "equipment",
            "commercial",
            "rice",
            "cooking"
        ]
    },
    {
        id: "UL002",
        title: "Premium Saffron - 100g Sealed Pack",
        category: "spices",
        price: 8000,
        originalPrice: 10000,
        condition: "New",
        description: "Imported saffron, sealed pack. Over-ordered for festival season.",
        status: "sold",
        views: 89,
        inquiries: 15,
        postedDate: "2024-01-12",
        lastUpdated: "2024-01-18",
        soldDate: "2024-01-18",
        soldPrice: 8000,
        buyer: "Delhi Spice Corner",
        images: [
            "saffron.jpg"
        ],
        urgency: "urgent",
        tags: [
            "saffron",
            "spices",
            "premium",
            "sealed"
        ]
    },
    {
        id: "UL003",
        title: "Food Grade Containers - 50 Units",
        category: "packaging",
        price: 2500,
        originalPrice: 4000,
        condition: "Good",
        description: "High-quality food storage containers. Changed packaging design.",
        status: "paused",
        views: 23,
        inquiries: 3,
        postedDate: "2024-01-08",
        lastUpdated: "2024-01-16",
        images: [
            "containers.jpg"
        ],
        urgency: "normal",
        tags: [
            "containers",
            "packaging",
            "food-grade",
            "bulk"
        ]
    }
];
export default function VendorMyListings() {
    const { addNotification } = useNotifications();
    const { user, logout } = useAuth();
    const { t } = useLanguage();
    const [profileImage, setProfileImage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedListing, setSelectedListing] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(null);
    useEffect(()=>{
        const savedImage = localStorage.getItem("profileImage");
        if (savedImage) {
            setProfileImage(savedImage);
        }
    }, []);
    const filteredListings = mockUserListings.filter((listing)=>{
        const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || listing.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    const getStatusColor = (status)=>{
        switch(status){
            case "active":
                return "bg-green-100 text-green-700";
            case "sold":
                return "bg-blue-100 text-blue-700";
            case "paused":
                return "bg-yellow-100 text-yellow-700";
            case "expired":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };
    const getStatusIcon = (status)=>{
        switch(status){
            case "active":
                return "✅";
            case "sold":
                return "💰";
            case "paused":
                return "⏸️";
            case "expired":
                return "⏰";
            default:
                return "❓";
        }
    };
    const handleDeleteListing = (listingId)=>{
        addNotification({
            title: "Listing Deleted",
            message: "Your listing has been removed from the marketplace",
            type: "success",
            icon: "🗑️"
        });
        setShowDeleteDialog(null);
    };
    const handleToggleStatus = (listingId, currentStatus)=>{
        const newStatus = currentStatus === "active" ? "paused" : "active";
        addNotification({
            title: `Listing ${newStatus === "active" ? "Activated" : "Paused"}`,
            message: `Your listing is now ${newStatus}`,
            type: "info",
            icon: newStatus === "active" ? "▶️" : "⏸️"
        });
    };
    const totalStats = {
        total: mockUserListings.length,
        active: mockUserListings.filter((l)=>l.status === "active").length,
        sold: mockUserListings.filter((l)=>l.status === "sold").length,
        totalViews: mockUserListings.reduce((sum, l)=>sum + l.views, 0),
        totalInquiries: mockUserListings.reduce((sum, l)=>sum + l.inquiries, 0),
        totalEarnings: mockUserListings.filter((l)=>l.status === "sold").reduce((sum, l)=>sum + (l.soldPrice || l.price), 0)
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
        className: "bg-orange-100 text-orange-700"
    }, "My Listings")), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-4"
    }, /*#__PURE__*/ React.createElement(NotificationPanel, null), /*#__PURE__*/ React.createElement(Link, {
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
    }, "Logout"))))), /*#__PURE__*/ React.createElement("div", {
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    }, /* Header with Back Button */ /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between mb-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-4"
    }, /*#__PURE__*/ React.createElement(Link, {
        to: "/vendor/dashboard"
    }, /*#__PURE__*/ React.createElement(Button, {
        variant: "outline",
        size: "sm"
    }, /*#__PURE__*/ React.createElement(ArrowLeft, {
        className: "w-4 h-4 mr-2"
    }), "Back to Dashboard")), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h1", {
        className: "text-3xl font-bold text-gray-900"
    }, "My Listings"), /*#__PURE__*/ React.createElement("p", {
        className: "text-gray-600"
    }, "Manage your marketplace listings and track performance"))), /*#__PURE__*/ React.createElement(Link, {
        to: "/vendor/sell-items"
    }, /*#__PURE__*/ React.createElement(Button, {
        className: "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
    }, /*#__PURE__*/ React.createElement(Plus, {
        className: "w-4 h-4 mr-2"
    }), "Add New Listing"))), /* Stats Cards */ /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-2 md:grid-cols-6 gap-4 mb-8"
    }, /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-4 text-center"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "text-2xl font-bold text-gray-900"
    }, totalStats.total), /*#__PURE__*/ React.createElement("div", {
        className: "text-sm text-gray-600"
    }, "Total Listings"))), /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-4 text-center"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "text-2xl font-bold text-green-600"
    }, totalStats.active), /*#__PURE__*/ React.createElement("div", {
        className: "text-sm text-gray-600"
    }, "Active"))), /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-4 text-center"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "text-2xl font-bold text-blue-600"
    }, totalStats.sold), /*#__PURE__*/ React.createElement("div", {
        className: "text-sm text-gray-600"
    }, "Sold"))), /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-4 text-center"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "text-2xl font-bold text-purple-600"
    }, totalStats.totalViews), /*#__PURE__*/ React.createElement("div", {
        className: "text-sm text-gray-600"
    }, "Total Views"))), /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-4 text-center"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "text-2xl font-bold text-orange-600"
    }, totalStats.totalInquiries), /*#__PURE__*/ React.createElement("div", {
        className: "text-sm text-gray-600"
    }, "Inquiries"))), /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-4 text-center"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "text-2xl font-bold text-emerald-600"
    }, "₹", totalStats.totalEarnings.toLocaleString()), /*#__PURE__*/ React.createElement("div", {
        className: "text-sm text-gray-600"
    }, "Earned")))), /* Filters */ /*#__PURE__*/ React.createElement("div", {
        className: "bg-white rounded-lg border p-6 mb-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-col md:flex-row gap-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex-1 relative"
    }, /*#__PURE__*/ React.createElement(Search, {
        className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
    }), /*#__PURE__*/ React.createElement(Input, {
        placeholder: "Search your listings...",
        className: "pl-10",
        value: searchTerm,
        onChange: (e)=>setSearchTerm(e.target.value)
    })), /*#__PURE__*/ React.createElement(Select, {
        value: statusFilter,
        onValueChange: setStatusFilter
    }, /*#__PURE__*/ React.createElement(SelectTrigger, {
        className: "w-full md:w-48"
    }, /*#__PURE__*/ React.createElement(SelectValue, {
        placeholder: "Filter by status"
    })), /*#__PURE__*/ React.createElement(SelectContent, null, /*#__PURE__*/ React.createElement(SelectItem, {
        value: "all"
    }, "All Status"), /*#__PURE__*/ React.createElement(SelectItem, {
        value: "active"
    }, "Active"), /*#__PURE__*/ React.createElement(SelectItem, {
        value: "sold"
    }, "Sold"), /*#__PURE__*/ React.createElement(SelectItem, {
        value: "paused"
    }, "Paused"), /*#__PURE__*/ React.createElement(SelectItem, {
        value: "expired"
    }, "Expired"))))), /* Listings Grid */ /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    }, filteredListings.map((listing)=>/*#__PURE__*/ React.createElement(Card, {
            key: listing.id,
            className: "group hover:shadow-lg transition-shadow"
        }, /*#__PURE__*/ React.createElement(CardHeader, {
            className: "p-0"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "relative"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center"
        }, /*#__PURE__*/ React.createElement(Package, {
            className: "w-16 h-16 text-gray-400"
        })), /*#__PURE__*/ React.createElement("div", {
            className: "absolute top-2 left-2 flex gap-2"
        }, /*#__PURE__*/ React.createElement(Badge, {
            className: getStatusColor(listing.status)
        }, getStatusIcon(listing.status), " ", listing.status.charAt(0).toUpperCase() + listing.status.slice(1)), listing.urgency === "urgent" && /*#__PURE__*/ React.createElement(Badge, {
            className: "bg-red-500 text-white"
        }, "Urgent")), /*#__PURE__*/ React.createElement("div", {
            className: "absolute top-2 right-2"
        }, /*#__PURE__*/ React.createElement(Select, null, /*#__PURE__*/ React.createElement(SelectTrigger, {
            className: "w-8 h-8 p-0 border-none bg-white/80 backdrop-blur-sm"
        }, /*#__PURE__*/ React.createElement(MoreVertical, {
            className: "w-4 h-4"
        })), /*#__PURE__*/ React.createElement(SelectContent, {
            align: "end"
        }, /*#__PURE__*/ React.createElement(SelectItem, {
            value: "edit"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center"
        }, /*#__PURE__*/ React.createElement(Edit, {
            className: "w-4 h-4 mr-2"
        }), "Edit Listing")), /*#__PURE__*/ React.createElement(SelectItem, {
            value: "toggle"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center"
        }, listing.status === "active" ? /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement(AlertCircle, {
            className: "w-4 h-4 mr-2"
        }), "Pause Listing") : /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement(TrendingUp, {
            className: "w-4 h-4 mr-2"
        }), "Activate Listing"))), /*#__PURE__*/ React.createElement(SelectItem, {
            value: "delete"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center text-red-600"
        }, /*#__PURE__*/ React.createElement(Trash2, {
            className: "w-4 h-4 mr-2"
        }), "Delete Listing"))))))), /*#__PURE__*/ React.createElement(CardContent, {
            className: "p-4"
        }, /*#__PURE__*/ React.createElement("h3", {
            className: "font-semibold text-lg text-gray-900 group-hover:text-orange-600 transition-colors mb-2 line-clamp-2"
        }, listing.title), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center justify-between mb-3"
        }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("span", {
            className: "text-2xl font-bold text-gray-900"
        }, "₹", listing.price.toLocaleString()), listing.originalPrice > listing.price && /*#__PURE__*/ React.createElement("span", {
            className: "text-sm text-gray-500 line-through ml-2"
        }, "₹", listing.originalPrice.toLocaleString())), listing.status === "sold" && /*#__PURE__*/ React.createElement(Badge, {
            className: "bg-green-100 text-green-700"
        }, "Sold ₹", listing.soldPrice?.toLocaleString())), /*#__PURE__*/ React.createElement("div", {
            className: "grid grid-cols-3 gap-3 mb-4 text-center"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "p-2 bg-gray-50 rounded"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "text-lg font-semibold text-gray-900"
        }, listing.views), /*#__PURE__*/ React.createElement("div", {
            className: "text-xs text-gray-600"
        }, "Views")), /*#__PURE__*/ React.createElement("div", {
            className: "p-2 bg-gray-50 rounded"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "text-lg font-semibold text-gray-900"
        }, listing.inquiries), /*#__PURE__*/ React.createElement("div", {
            className: "text-xs text-gray-600"
        }, "Inquiries")), /*#__PURE__*/ React.createElement("div", {
            className: "p-2 bg-gray-50 rounded"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "text-lg font-semibold text-gray-900"
        }, listing.inquiries > 0 ? Math.round(listing.inquiries / listing.views * 100) : 0, "%"), /*#__PURE__*/ React.createElement("div", {
            className: "text-xs text-gray-600"
        }, "Rate"))), /*#__PURE__*/ React.createElement("div", {
            className: "text-sm text-gray-500 mb-4"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center justify-between"
        }, /*#__PURE__*/ React.createElement("span", null, "Posted: ", new Date(listing.postedDate).toLocaleDateString()), /*#__PURE__*/ React.createElement("span", null, "Updated: ", new Date(listing.lastUpdated).toLocaleDateString())), listing.status === "sold" && listing.soldDate && /*#__PURE__*/ React.createElement("div", {
            className: "text-green-600 font-medium mt-1"
        }, "Sold: ", new Date(listing.soldDate).toLocaleDateString(), listing.buyer && ` to ${listing.buyer}`)), /*#__PURE__*/ React.createElement("div", {
            className: "flex gap-2"
        }, /*#__PURE__*/ React.createElement(Button, {
            variant: "outline",
            className: "flex-1",
            size: "sm"
        }, /*#__PURE__*/ React.createElement(Eye, {
            className: "w-4 h-4 mr-2"
        }), "View"), /*#__PURE__*/ React.createElement(Button, {
            variant: "outline",
            size: "sm"
        }, /*#__PURE__*/ React.createElement(Edit, {
            className: "w-4 h-4 mr-2"
        }), "Edit"), /*#__PURE__*/ React.createElement(Button, {
            variant: "outline",
            size: "sm",
            onClick: ()=>handleToggleStatus(listing.id, listing.status),
            disabled: listing.status === "sold"
        }, listing.status === "active" ? /*#__PURE__*/ React.createElement(AlertCircle, {
            className: "w-4 h-4"
        }) : /*#__PURE__*/ React.createElement(TrendingUp, {
            className: "w-4 h-4"
        }))))))), filteredListings.length === 0 && /*#__PURE__*/ React.createElement("div", {
        className: "text-center py-12"
    }, /*#__PURE__*/ React.createElement(Package, {
        className: "w-16 h-16 text-gray-300 mx-auto mb-4"
    }), /*#__PURE__*/ React.createElement("h3", {
        className: "text-lg font-medium text-gray-900 mb-2"
    }, "No listings found"), /*#__PURE__*/ React.createElement("p", {
        className: "text-gray-500 mb-4"
    }, searchTerm || statusFilter !== "all" ? "Try adjusting your search or filters" : "You haven't listed any items yet"), !searchTerm && statusFilter === "all" && /*#__PURE__*/ React.createElement(Link, {
        to: "/vendor/sell-items"
    }, /*#__PURE__*/ React.createElement(Button, {
        className: "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
    }, /*#__PURE__*/ React.createElement(Plus, {
        className: "w-4 h-4 mr-2"
    }), "Create Your First Listing"))), /* Delete Confirmation Dialog */ /*#__PURE__*/ React.createElement(Dialog, {
        open: showDeleteDialog !== null,
        onOpenChange: ()=>setShowDeleteDialog(null)
    }, /*#__PURE__*/ React.createElement(DialogContent, null, /*#__PURE__*/ React.createElement(DialogHeader, null, /*#__PURE__*/ React.createElement(DialogTitle, null, "Delete Listing"), /*#__PURE__*/ React.createElement(DialogDescription, null, "Are you sure you want to delete this listing? This action cannot be undone.")), /*#__PURE__*/ React.createElement(DialogFooter, null, /*#__PURE__*/ React.createElement(Button, {
        variant: "outline",
        onClick: ()=>setShowDeleteDialog(null)
    }, "Cancel"), /*#__PURE__*/ React.createElement(Button, {
        variant: "destructive",
        onClick: ()=>showDeleteDialog && handleDeleteListing(showDeleteDialog)
    }, "Delete"))))));
}
