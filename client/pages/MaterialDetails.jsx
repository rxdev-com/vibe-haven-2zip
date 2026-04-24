import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Star, MapPin, Phone, Package, ShoppingCart, Heart, Share2, Truck, Shield, CheckCircle, Clock, MessageSquare } from "lucide-react";
// Mock data for material details
const getMaterialDetails = (id)=>({
        id,
        name: "Premium Basmati Rice",
        category: "Grains & Cereals",
        price: 120,
        unit: "kg",
        description: "Premium quality long-grain basmati rice with excellent aroma and taste. Sourced directly from the finest farms in Punjab. Perfect for biryanis, pulavs, and daily cooking. Aged for optimal texture and fragrance.",
        supplier: {
            id: "supplier-1",
            name: "Rajesh Grain Merchants",
            businessName: "Grain Merchants",
            location: "Ghaziabad, Uttar Pradesh",
            phone: "+91 98765 43210",
            email: "contact@grainmerchants.com",
            rating: 4.8,
            totalReviews: 156,
            verified: true,
            responseTime: "Within 2 hours",
            avatar: "GM"
        },
        images: [
            "/api/placeholder/400/400",
            "/api/placeholder/400/400",
            "/api/placeholder/400/400"
        ],
        inStock: true,
        stockQuantity: 500,
        minimumOrder: 5,
        deliveryTime: "1-2 days",
        specifications: {
            Grade: "Premium A+",
            Origin: "Punjab, India",
            "Grain Length": "6.5-7.5mm",
            Moisture: "12-13%",
            Purity: "98-99%",
            Packaging: "PP bags, customizable",
            "Shelf Life": "12 months"
        },
        tags: [
            "Premium",
            "Long Grain",
            "Aromatic",
            "Fresh",
            "Farm Direct"
        ],
        reviews: [
            {
                id: "1",
                userName: "Priya Food Corner",
                rating: 5,
                comment: "Excellent quality rice! My customers love the aroma and taste. Consistent quality every time.",
                date: "2025-01-20",
                verified: true
            },
            {
                id: "2",
                userName: "Delhi Biryani House",
                rating: 4,
                comment: "Good quality rice, perfect for biryanis. Delivery was on time.",
                date: "2025-01-18",
                verified: true
            },
            {
                id: "3",
                userName: "Sharma Catering",
                rating: 5,
                comment: "Been ordering for 6 months now. Quality is consistent and price is reasonable.",
                date: "2025-01-15",
                verified: true
            }
        ],
        relatedProducts: [
            {
                id: "2",
                name: "Organic Brown Rice",
                price: 95,
                unit: "kg",
                image: "/api/placeholder/150/150"
            },
            {
                id: "3",
                name: "Jasmine Rice",
                price: 110,
                unit: "kg",
                image: "/api/placeholder/150/150"
            },
            {
                id: "4",
                name: "Sona Masoori Rice",
                price: 85,
                unit: "kg",
                image: "/api/placeholder/150/150"
            }
        ]
    });
export default function MaterialDetails() {
    const { id } = useParams();
    const { user } = useAuth();
    const { addItem, isInCart } = useCart();
    const { toast } = useToast();
    const [material, setMaterial] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(5);
    const [isSaved, setIsSaved] = useState(false);
    useEffect(()=>{
        if (id) {
            // Simulate API call
            const materialData = getMaterialDetails(id);
            setMaterial(materialData);
            setQuantity(materialData.minimumOrder);
        }
    }, [
        id
    ]);
    const handleAddToCart = ()=>{
        if (!material) return;
        const cartItem = {
            id: material.id,
            name: material.name,
            price: material.price,
            unit: material.unit,
            supplier: material.supplier.businessName,
            supplierLocation: material.supplier.location,
            category: material.category,
            inStock: material.inStock,
            minimumOrder: material.minimumOrder
        };
        addItem(cartItem, quantity);
        toast({
            title: "Added to Cart",
            description: `${quantity} ${material.unit} of ${material.name} added to cart`
        });
    };
    const handleSaveItem = ()=>{
        setIsSaved(!isSaved);
        toast({
            title: isSaved ? "Removed from Saved" : "Saved Successfully",
            description: isSaved ? `${material?.name} removed from saved items` : `${material?.name} added to saved items`
        });
    };
    const handleWhatsAppChat = ()=>{
        if (!material) return;
        const message = `Hi! I'm interested in your ${material.name} (₹${material.price}/${material.unit}). Can you provide more details?`;
        const phoneNumber = material.supplier.phone.replace(/\D/g, "");
        // Remove non-digits
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
        toast({
            title: "Opening WhatsApp",
            description: `Starting chat with ${material.supplier.businessName}`
        });
    };
    const handleCall = ()=>{
        if (!material) return;
        window.location.href = `tel:${material.supplier.phone}`;
    };
    const handleShare = ()=>{
        if (navigator.share) {
            navigator.share({
                title: material?.name,
                text: `Check out this ${material?.name} on JugaduBazar`,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast({
                title: "Link Copied",
                description: "Product link copied to clipboard"
            });
        }
    };
    const renderStars = (rating)=>{
        return Array.from({
            length: 5
        }, (_, i)=>/*#__PURE__*/ React.createElement(Star, {
                key: i,
                className: `w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`
            }));
    };
    if (!material) {
        return /*#__PURE__*/ React.createElement("div", {
            className: "min-h-screen bg-gray-50 flex items-center justify-center"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "text-center"
        }, /*#__PURE__*/ React.createElement(Package, {
            className: "w-12 h-12 text-gray-300 mx-auto mb-4"
        }), /*#__PURE__*/ React.createElement("h2", {
            className: "text-xl font-semibold text-gray-900 mb-2"
        }, "Loading..."), /*#__PURE__*/ React.createElement("p", {
            className: "text-gray-600"
        }, "Fetching material details")));
    }
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
    }, "JugaduBazar"))), /*#__PURE__*/ React.createElement(Button, {
        variant: "outline",
        size: "sm",
        onClick: handleShare
    }, /*#__PURE__*/ React.createElement(Share2, {
        className: "w-4 h-4 mr-2"
    }), "Share")))), /*#__PURE__*/ React.createElement("div", {
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 lg:grid-cols-2 gap-8"
    }, /* Product Images */ /*#__PURE__*/ React.createElement("div", {
        className: "space-y-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "aspect-square bg-gray-100 rounded-lg overflow-hidden"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-full h-full flex items-center justify-center text-gray-400"
    }, /*#__PURE__*/ React.createElement(Package, {
        className: "w-24 h-24"
    }))), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-3 gap-2"
    }, material.images.map((_, index)=>/*#__PURE__*/ React.createElement("button", {
            key: index,
            onClick: ()=>setSelectedImage(index),
            className: `aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${selectedImage === index ? "border-saffron-500" : "border-transparent"}`
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-full h-full flex items-center justify-center text-gray-400"
        }, /*#__PURE__*/ React.createElement(Package, {
            className: "w-8 h-8"
        })))))), /* Product Info */ /*#__PURE__*/ React.createElement("div", {
        className: "space-y-6"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between mb-2"
    }, /*#__PURE__*/ React.createElement(Badge, {
        variant: "outline"
    }, material.category), /*#__PURE__*/ React.createElement(Button, {
        variant: "ghost",
        size: "sm",
        onClick: handleSaveItem,
        className: isSaved ? "text-red-500" : "text-gray-500"
    }, /*#__PURE__*/ React.createElement(Heart, {
        className: `w-5 h-5 ${isSaved ? "fill-current" : ""}`
    }))), /*#__PURE__*/ React.createElement("h1", {
        className: "text-3xl font-bold text-gray-900 mb-2"
    }, material.name), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-4 mb-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-1"
    }, renderStars(Math.round(material.supplier.rating)), /*#__PURE__*/ React.createElement("span", {
        className: "text-sm text-gray-600 ml-1"
    }, material.supplier.rating, " (", material.supplier.totalReviews, " ", "reviews)")), /*#__PURE__*/ React.createElement(Badge, {
        className: material.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
    }, material.inStock ? "In Stock" : "Out of Stock")), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-2 mb-4"
    }, material.tags.map((tag, index)=>/*#__PURE__*/ React.createElement(Badge, {
            key: index,
            variant: "secondary",
            className: "text-xs"
        }, tag))), /*#__PURE__*/ React.createElement("p", {
        className: "text-gray-700 leading-relaxed"
    }, material.description)), /* Price and Quantity */ /*#__PURE__*/ React.createElement("div", {
        className: "bg-white border border-gray-200 rounded-lg p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between mb-4"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("span", {
        className: "text-3xl font-bold text-gray-900"
    }, "₹", material.price), /*#__PURE__*/ React.createElement("span", {
        className: "text-lg text-gray-600"
    }, "/", material.unit)), /*#__PURE__*/ React.createElement("div", {
        className: "text-right"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-600"
    }, "Available: ", material.stockQuantity, " ", material.unit), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-600"
    }, "Min. order: ", material.minimumOrder, " ", material.unit))), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-4 mb-4"
    }, /*#__PURE__*/ React.createElement("label", {
        className: "text-sm font-medium text-gray-700"
    }, "Quantity:"), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-2"
    }, /*#__PURE__*/ React.createElement(Button, {
        variant: "outline",
        size: "sm",
        onClick: ()=>setQuantity(Math.max(material.minimumOrder, quantity - 1)),
        disabled: quantity <= material.minimumOrder
    }, "-"), /*#__PURE__*/ React.createElement("span", {
        className: "w-16 text-center py-2 border border-gray-300 rounded"
    }, quantity), /*#__PURE__*/ React.createElement(Button, {
        variant: "outline",
        size: "sm",
        onClick: ()=>setQuantity(Math.min(material.stockQuantity, quantity + 1)),
        disabled: quantity >= material.stockQuantity
    }, "+"), /*#__PURE__*/ React.createElement("span", {
        className: "text-sm text-gray-600"
    }, material.unit))), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-2 gap-3"
    }, /*#__PURE__*/ React.createElement(Button, {
        onClick: handleAddToCart,
        disabled: !material.inStock || isInCart(material.id),
        className: "bg-gradient-to-r from-saffron-500 to-orange-500 hover:from-saffron-600 hover:to-orange-600"
    }, /*#__PURE__*/ React.createElement(ShoppingCart, {
        className: "w-4 h-4 mr-2"
    }), isInCart(material.id) ? "In Cart" : "Add to Cart"), /*#__PURE__*/ React.createElement(Button, {
        variant: "outline",
        onClick: handleWhatsAppChat,
        className: "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
    }, /*#__PURE__*/ React.createElement(MessageSquare, {
        className: "w-4 h-4 mr-2"
    }), "WhatsApp")), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-center space-x-4 mt-4 pt-4 border-t border-gray-200"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center text-sm text-gray-600"
    }, /*#__PURE__*/ React.createElement(Truck, {
        className: "w-4 h-4 mr-1"
    }), "Delivery: ", material.deliveryTime), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center text-sm text-gray-600"
    }, /*#__PURE__*/ React.createElement(Shield, {
        className: "w-4 h-4 mr-1"
    }), "Quality Assured"))))), /* Supplier Information */ /*#__PURE__*/ React.createElement(Card, {
        className: "mt-8"
    }, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, null, "Supplier Information")), /*#__PURE__*/ React.createElement(CardContent, null, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-start justify-between"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-4"
    }, /*#__PURE__*/ React.createElement(Avatar, {
        className: "w-16 h-16"
    }, /*#__PURE__*/ React.createElement(AvatarFallback, {
        className: "bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg font-bold"
    }, material.supplier.avatar)), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-2 mb-1"
    }, /*#__PURE__*/ React.createElement("h3", {
        className: "text-lg font-semibold text-gray-900"
    }, material.supplier.businessName), material.supplier.verified && /*#__PURE__*/ React.createElement(CheckCircle, {
        className: "w-5 h-5 text-green-500"
    })), /*#__PURE__*/ React.createElement("p", {
        className: "text-gray-600"
    }, material.supplier.name), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-4 mt-2 text-sm text-gray-500"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(MapPin, {
        className: "w-4 h-4 mr-1"
    }), material.supplier.location), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(Clock, {
        className: "w-4 h-4 mr-1"
    }), "Responds ", material.supplier.responseTime)))), /*#__PURE__*/ React.createElement("div", {
        className: "flex space-x-2"
    }, /*#__PURE__*/ React.createElement(Button, {
        variant: "outline",
        size: "sm",
        onClick: handleCall
    }, /*#__PURE__*/ React.createElement(Phone, {
        className: "w-4 h-4 mr-2"
    }), "Call"), /*#__PURE__*/ React.createElement(Button, {
        variant: "outline",
        size: "sm",
        onClick: handleWhatsAppChat
    }, /*#__PURE__*/ React.createElement(MessageSquare, {
        className: "w-4 h-4 mr-2"
    }), "WhatsApp"))))), /* Specifications */ /*#__PURE__*/ React.createElement(Card, {
        className: "mt-8"
    }, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, null, "Specifications")), /*#__PURE__*/ React.createElement(CardContent, null, /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-4"
    }, Object.entries(material.specifications).map(([key, value])=>/*#__PURE__*/ React.createElement("div", {
            key: key,
            className: "flex justify-between py-2 border-b border-gray-100"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "font-medium text-gray-700"
        }, key, ":"), /*#__PURE__*/ React.createElement("span", {
            className: "text-gray-600"
        }, value)))))), /* Reviews */ /*#__PURE__*/ React.createElement(Card, {
        className: "mt-8"
    }, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, null, "Customer Reviews"), /*#__PURE__*/ React.createElement(CardDescription, null, material.reviews.length, " reviews from verified buyers")), /*#__PURE__*/ React.createElement(CardContent, null, /*#__PURE__*/ React.createElement("div", {
        className: "space-y-4"
    }, material.reviews.map((review)=>/*#__PURE__*/ React.createElement("div", {
            key: review.id,
            className: "border-b border-gray-100 pb-4 last:border-b-0"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center justify-between mb-2"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center space-x-2"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "font-medium text-gray-900"
        }, review.userName), review.verified && /*#__PURE__*/ React.createElement(Badge, {
            variant: "secondary",
            className: "text-xs"
        }, "Verified")), /*#__PURE__*/ React.createElement("span", {
            className: "text-sm text-gray-500"
        }, new Date(review.date).toLocaleDateString())), /*#__PURE__*/ React.createElement("div", {
            className: "flex space-x-1 mb-2"
        }, renderStars(review.rating)), /*#__PURE__*/ React.createElement("p", {
            className: "text-gray-700"
        }, review.comment)))))), /* Related Products */ /*#__PURE__*/ React.createElement(Card, {
        className: "mt-8"
    }, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, null, "Related Products")), /*#__PURE__*/ React.createElement(CardContent, null, /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-2 md:grid-cols-4 gap-4"
    }, material.relatedProducts.map((product)=>/*#__PURE__*/ React.createElement(Link, {
            key: product.id,
            to: `/material/${product.id}`
        }, /*#__PURE__*/ React.createElement(Card, {
            className: "hover:shadow-lg transition-shadow cursor-pointer"
        }, /*#__PURE__*/ React.createElement(CardContent, {
            className: "p-4"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "aspect-square bg-gray-100 rounded-lg mb-3"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-full h-full flex items-center justify-center text-gray-400"
        }, /*#__PURE__*/ React.createElement(Package, {
            className: "w-8 h-8"
        }))), /*#__PURE__*/ React.createElement("h4", {
            className: "font-medium text-gray-900 text-sm mb-1 line-clamp-2"
        }, product.name), /*#__PURE__*/ React.createElement("p", {
            className: "text-saffron-600 font-semibold"
        }, "₹", product.price, "/", product.unit))))))))));
}
