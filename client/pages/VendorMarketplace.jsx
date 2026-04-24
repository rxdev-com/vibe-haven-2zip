import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWhatsApp } from "@/lib/whatsapp";
import NotificationPanel from "@/components/NotificationPanel";
import ProfilePhoto from "@/components/ProfilePhoto";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import { ArrowLeft, Search, Star, MessageSquare, MapPin, Package, Clock, Heart } from "lucide-react";
// Mock vendor marketplace items
const mockVendorItems = [
    {
        id: "V001",
        title: "Commercial Rice Cooker - Barely Used",
        category: "equipment",
        price: 15000,
        originalPrice: 25000,
        condition: "Like New",
        description: "Professional rice cooker, bought 3 months ago but switching to gas cooking. Perfect condition.",
        seller: {
            name: "Sharma Snacks",
            location: "Karol Bagh, Delhi",
            phone: "+91 98765 43210",
            rating: 4.8,
            image: "S"
        },
        images: [
            "rice-cooker.jpg"
        ],
        postedDate: "2024-01-10",
        urgency: "normal",
        tags: [
            "equipment",
            "commercial",
            "rice",
            "cooking"
        ]
    },
    {
        id: "V002",
        title: "Premium Saffron - 100g Sealed Pack",
        category: "spices",
        price: 8000,
        originalPrice: 10000,
        condition: "New",
        description: "Imported saffron, sealed pack. Over-ordered for festival season. Expires in 2025.",
        seller: {
            name: "Delhi Spice Corner",
            location: "Chandni Chowk, Delhi",
            phone: "+91 87654 32109",
            rating: 4.9,
            image: "D"
        },
        images: [
            "saffron.jpg"
        ],
        postedDate: "2024-01-12",
        urgency: "urgent",
        tags: [
            "saffron",
            "spices",
            "premium",
            "sealed"
        ]
    },
    {
        id: "V003",
        title: "Food Grade Plastic Containers - 50 Units",
        category: "packaging",
        price: 2500,
        originalPrice: 4000,
        condition: "Good",
        description: "High-quality food storage containers. Changed packaging design, selling old stock.",
        seller: {
            name: "Mumbai Street Food Co",
            location: "Bandra, Mumbai",
            phone: "+91 76543 21098",
            rating: 4.6,
            image: "M"
        },
        images: [
            "containers.jpg"
        ],
        postedDate: "2024-01-08",
        urgency: "normal",
        tags: [
            "containers",
            "packaging",
            "food-grade",
            "bulk"
        ]
    },
    {
        id: "V004",
        title: "Organic Turmeric Powder - 25kg",
        category: "spices",
        price: 3500,
        originalPrice: 4500,
        condition: "Excellent",
        description: "Premium organic turmeric powder. Bulk quantity available. Best before Dec 2024.",
        seller: {
            name: "Rajesh's Kitchen",
            location: "Connaught Place, Delhi",
            phone: "+91 98765 43211",
            rating: 4.7,
            image: "R"
        },
        images: [
            "turmeric.jpg"
        ],
        postedDate: "2024-01-14",
        urgency: "normal",
        tags: [
            "turmeric",
            "organic",
            "bulk",
            "spices"
        ]
    }
];
export default function VendorMarketplace() {
    const { addNotification } = useNotifications();
    const { user, logout } = useAuth();
    const { chatWithSupplier } = useWhatsApp();
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("recent");
    const [profileImage, setProfileImage] = useState("");
    const [likedItems, setLikedItems] = useState([]);
    useEffect(()=>{
        const savedImage = localStorage.getItem("profileImage");
        if (savedImage) {
            setProfileImage(savedImage);
        }
    }, []);
    const filteredItems = mockVendorItems.filter((item)=>{
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    }).sort((a, b)=>{
        switch(sortBy){
            case "price-low":
                return a.price - b.price;
            case "price-high":
                return b.price - a.price;
            case "condition":
                return a.condition.localeCompare(b.condition);
            case "recent":
            default:
                return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
        }
    });
    const handleContactSeller = (item)=>{
        chatWithSupplier({
            supplierName: item.seller.name,
            supplierPhone: item.seller.phone,
            customMessage: `Hi! I'm interested in your "${item.title}" listed on JugaduBazar vendor marketplace for ₹${item.price}. Is it still available?`,
            vendorName: user?.name || "Vendor"
        });
    };
    const handleLikeItem = (itemId)=>{
        const isLiked = likedItems.includes(itemId);
        if (isLiked) {
            setLikedItems((prev)=>prev.filter((id)=>id !== itemId));
        } else {
            setLikedItems((prev)=>[
                    ...prev,
                    itemId
                ]);
            addNotification({
                title: t("addedToWishlist"),
                message: t("itemSavedToWishlist"),
                type: "success",
                icon: "❤️"
            });
        }
    };
    const getConditionColor = (condition)=>{
        switch(condition.toLowerCase()){
            case "new":
                return "bg-green-100 text-green-700";
            case "like new":
                return "bg-emerald-100 text-emerald-700";
            case "excellent":
                return "bg-blue-100 text-blue-700";
            case "good":
                return "bg-yellow-100 text-yellow-700";
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
        className: "bg-purple-100 text-purple-700"
    }, t('vendorMarketplace'))), /*#__PURE__*/ React.createElement("div", {
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
        size: "sm",
        onClick: logout
    }, "Logout"))))), /*#__PURE__*/ React.createElement("div", {
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    }, /* Header with Back Button */ /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-4 mb-6"
    }, /*#__PURE__*/ React.createElement(Link, {
        to: "/vendor/dashboard"
    }, /*#__PURE__*/ React.createElement(Button, {
        variant: "outline",
        size: "sm"
    }, /*#__PURE__*/ React.createElement(ArrowLeft, {
        className: "w-4 h-4 mr-2"
    }), t('backToDashboard'))), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h1", {
        className: "text-3xl font-bold text-gray-900"
    }, t('vendorMarketplace')), /*#__PURE__*/ React.createElement("p", {
        className: "text-gray-600"
    }, t('vendorMarketplaceSubtitle')))), /* Search and Filters */ /*#__PURE__*/ React.createElement("div", {
        className: "bg-white rounded-lg border p-6 mb-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-col md:flex-row gap-4 mb-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex-1 relative"
    }, /*#__PURE__*/ React.createElement(Search, {
        className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
    }), /*#__PURE__*/ React.createElement(Input, {
        placeholder: t('searchItems'),
        className: "pl-10",
        value: searchTerm,
        onChange: (e)=>setSearchTerm(e.target.value)
    })), /*#__PURE__*/ React.createElement(Select, {
        value: selectedCategory,
        onValueChange: setSelectedCategory
    }, /*#__PURE__*/ React.createElement(SelectTrigger, {
        className: "w-full md:w-48"
    }, /*#__PURE__*/ React.createElement(SelectValue, {
        placeholder: t('category')
    })), /*#__PURE__*/ React.createElement(SelectContent, null, /*#__PURE__*/ React.createElement(SelectItem, {
        value: "all"
    }, t('allCategories')), /*#__PURE__*/ React.createElement(SelectItem, {
        value: "spices"
    }, t('spices')), /*#__PURE__*/ React.createElement(SelectItem, {
        value: "oils"
    }, t('oils')), /*#__PURE__*/ React.createElement(SelectItem, {
        value: "grains"
    }, t('grains')), /*#__PURE__*/ React.createElement(SelectItem, {
        value: "equipment"
    }, t('equipment')), /*#__PURE__*/ React.createElement(SelectItem, {
        value: "packaging"
    }, t('packaging')))), /*#__PURE__*/ React.createElement(Select, {
        value: sortBy,
        onValueChange: setSortBy
    }, /*#__PURE__*/ React.createElement(SelectTrigger, {
        className: "w-full md:w-48"
    }, /*#__PURE__*/ React.createElement(SelectValue, {
        placeholder: t('sortBy')
    })), /*#__PURE__*/ React.createElement(SelectContent, null, /*#__PURE__*/ React.createElement(SelectItem, {
        value: "recent"
    }, t('mostRecent')), /*#__PURE__*/ React.createElement(SelectItem, {
        value: "price-low"
    }, t('priceLowToHigh')), /*#__PURE__*/ React.createElement(SelectItem, {
        value: "price-high"
    }, t('priceHighToLow')), /*#__PURE__*/ React.createElement(SelectItem, {
        value: "condition"
    }, t('byCondition')))))), /* Items Grid */ /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    }, filteredItems.map((item)=>/*#__PURE__*/ React.createElement(Card, {
            key: item.id,
            className: "group hover:shadow-lg transition-shadow"
        }, /*#__PURE__*/ React.createElement(CardHeader, {
            className: "p-0"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "relative"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center"
        }, /*#__PURE__*/ React.createElement(Package, {
            className: "w-16 h-16 text-gray-400"
        })), item.urgency === "urgent" && /*#__PURE__*/ React.createElement(Badge, {
            className: "absolute top-2 left-2 bg-red-500 text-white"
        }, t('urgentSale')), /*#__PURE__*/ React.createElement(Button, {
            variant: "ghost",
            size: "sm",
            className: "absolute top-2 right-2 p-2",
            onClick: ()=>handleLikeItem(item.id)
        }, /*#__PURE__*/ React.createElement(Heart, {
            className: `w-5 h-5 ${likedItems.includes(item.id) ? "fill-red-500 text-red-500" : "text-gray-400"}`
        })))), /*#__PURE__*/ React.createElement(CardContent, {
            className: "p-4"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex justify-between items-start mb-2"
        }, /*#__PURE__*/ React.createElement("h3", {
            className: "font-semibold text-lg text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2"
        }, item.title)), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center space-x-2 mb-3"
        }, /*#__PURE__*/ React.createElement(Badge, {
            className: getConditionColor(item.condition)
        }, item.condition), /*#__PURE__*/ React.createElement(Badge, {
            variant: "outline",
            className: "text-xs"
        }, item.category)), /*#__PURE__*/ React.createElement("p", {
            className: "text-gray-600 text-sm mb-3 line-clamp-2"
        }, item.description), /* Seller Info */ /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center space-x-2 mb-3 p-2 bg-gray-50 rounded-lg"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "text-purple-600 font-semibold text-sm"
        }, item.seller.image)), /*#__PURE__*/ React.createElement("div", {
            className: "flex-1"
        }, /*#__PURE__*/ React.createElement("p", {
            className: "font-medium text-sm"
        }, item.seller.name), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center text-xs text-gray-500"
        }, /*#__PURE__*/ React.createElement(MapPin, {
            className: "w-3 h-3 mr-1"
        }), item.seller.location)), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center"
        }, /*#__PURE__*/ React.createElement(Star, {
            className: "w-3 h-3 fill-yellow-400 text-yellow-400 mr-1"
        }), /*#__PURE__*/ React.createElement("span", {
            className: "text-xs text-gray-600"
        }, item.seller.rating))), /* Price */ /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center justify-between mb-4"
        }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("span", {
            className: "text-2xl font-bold text-gray-900"
        }, "₹", item.price.toLocaleString()), item.originalPrice > item.price && /*#__PURE__*/ React.createElement("span", {
            className: "text-sm text-gray-500 line-through ml-2"
        }, "₹", item.originalPrice.toLocaleString())), /*#__PURE__*/ React.createElement("div", {
            className: "text-right text-xs text-gray-500"
        }, /*#__PURE__*/ React.createElement(Clock, {
            className: "w-3 h-3 inline mr-1"
        }), new Date(item.postedDate).toLocaleDateString())), /* Action Buttons */ /*#__PURE__*/ React.createElement("div", {
            className: "flex gap-2"
        }, /*#__PURE__*/ React.createElement(Button, {
            className: "flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
            onClick: ()=>handleContactSeller(item)
        }, /*#__PURE__*/ React.createElement(MessageSquare, {
            className: "w-4 h-4 mr-2"
        }), t('contactSeller')), /*#__PURE__*/ React.createElement(Button, {
            variant: "outline",
            size: "sm"
        }, t('viewDetails'))))))), filteredItems.length === 0 && /*#__PURE__*/ React.createElement("div", {
        className: "text-center py-12"
    }, /*#__PURE__*/ React.createElement(Package, {
        className: "w-16 h-16 text-gray-300 mx-auto mb-4"
    }), /*#__PURE__*/ React.createElement("h3", {
        className: "text-lg font-medium text-gray-900 mb-2"
    }, t('noItemsFound')), /*#__PURE__*/ React.createElement("p", {
        className: "text-gray-500"
    }, t('tryAdjustingFilters')))));
}
