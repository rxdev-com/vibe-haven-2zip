import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import ImageUpload from "@/components/ImageUpload";
import ProfilePhoto from "@/components/ProfilePhoto";
import { ArrowLeft, MapPin, Phone, Mail, Edit, Save, Star, Package, TrendingUp, Clock, Camera } from "lucide-react";
export default function VendorProfile() {
    const { addNotification } = useNotifications();
    const { user, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [profileImage, setProfileImage] = useState("");
    const [profileData, setProfileData] = useState({
        name: user?.name || "Rajesh Kumar",
        email: user?.email || "rajesh@example.com",
        phone: user?.phone || "+91 98765 43210",
        businessName: user?.businessName || "Rajesh's Chaat Corner",
        address: user?.address || "Sector 15, Noida, Uttar Pradesh",
        description: user?.description || "Serving delicious North Indian street food since 2015. Known for our famous aloo tikki chaat and chole bhature.",
        established: "2015",
        specialties: [
            "Chaat",
            "Chole Bhature",
            "Samosa",
            "Lassi"
        ]
    });
    // Load saved profile image from localStorage
    useEffect(()=>{
        const savedImage = localStorage.getItem("profileImage");
        if (savedImage) {
            setProfileImage(savedImage);
        }
    }, []);
    const [businessImages, setBusinessImages] = useState([
        {
            id: "1",
            url: "/api/placeholder/400/300",
            title: "Rajesh's Chaat Corner",
            description: "Our vibrant street food stall serving authentic North Indian delicacies",
            category: "facility",
            isMain: true
        },
        {
            id: "2",
            url: "/api/placeholder/400/300",
            title: "Fresh Cooking Station",
            description: "Clean and hygienic cooking area with modern equipment",
            category: "equipment",
            isMain: false
        },
        {
            id: "3",
            url: "/api/placeholder/400/300",
            title: "Famous Chole Bhature",
            description: "Our signature dish loved by customers across Delhi",
            category: "products",
            isMain: false
        },
        {
            id: "4",
            url: "/api/placeholder/400/300",
            title: "Food License",
            description: "Valid food safety license and health certificates",
            category: "certificates",
            isMain: false
        }
    ]);
    const handleSave = ()=>{
        // Update the auth context with new profile data
        updateProfile(profileData);
        setIsEditing(false);
        addNotification({
            title: "Profile Updated",
            message: "Your vendor profile has been successfully updated",
            type: "success",
            icon: "✅"
        });
    };
    const stats = [
        {
            label: "Total Orders",
            value: "156",
            icon: Package,
            color: "text-blue-600"
        },
        {
            label: "Avg Rating",
            value: "4.8",
            icon: Star,
            color: "text-yellow-600"
        },
        {
            label: "Monthly Spend",
            value: "₹28,450",
            icon: TrendingUp,
            color: "text-green-600"
        },
        {
            label: "Member Since",
            value: "2023",
            icon: Clock,
            color: "text-purple-600"
        }
    ];
    const orderHistory = [
        {
            date: "2024-01-15",
            supplier: "Kumar Oil Mills",
            items: "Mustard Oil (2L)",
            amount: 360,
            status: "Delivered"
        },
        {
            date: "2024-01-14",
            supplier: "Spice Garden",
            items: "Garam Masala (1kg)",
            amount: 320,
            status: "Delivered"
        },
        {
            date: "2024-01-13",
            supplier: "Fresh Veggie Hub",
            items: "Onions (5kg)",
            amount: 175,
            status: "Delivered"
        },
        {
            date: "2024-01-12",
            supplier: "Grain Traders Co.",
            items: "Basmati Rice (10kg)",
            amount: 1200,
            status: "Delivered"
        }
    ];
    return /*#__PURE__*/ React.createElement("div", {
        className: "min-h-screen bg-gray-50"
    }, /* Header */ /*#__PURE__*/ React.createElement("header", {
        className: "bg-white border-b"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between h-16"
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
    }, "JugaduBazar"))))), /*#__PURE__*/ React.createElement("div", {
        className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    }, /* Profile Header */ /*#__PURE__*/ React.createElement(Card, {
        className: "mb-8"
    }, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-start justify-between mb-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-col items-center space-y-2"
    }, /*#__PURE__*/ React.createElement(ProfilePhoto, {
        currentImage: profileImage,
        userName: profileData.name,
        size: "lg",
        showChangeButton: isEditing,
        onImageChange: (url)=>{
            setProfileImage(url);
        }
    })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h1", {
        className: "text-2xl font-bold text-gray-900"
    }, profileData.name), /*#__PURE__*/ React.createElement("p", {
        className: "text-lg text-gray-600"
    }, profileData.businessName), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center mt-2 text-sm text-gray-500"
    }, /*#__PURE__*/ React.createElement(MapPin, {
        className: "w-4 h-4 mr-1"
    }), profileData.address))), /*#__PURE__*/ React.createElement(Button, {
        variant: isEditing ? "default" : "outline",
        onClick: isEditing ? handleSave : ()=>setIsEditing(true),
        className: isEditing ? "bg-gradient-to-r from-saffron-500 to-orange-500 hover:from-saffron-600 hover:to-orange-600" : ""
    }, isEditing ? /*#__PURE__*/ React.createElement(Save, {
        className: "w-4 h-4 mr-2"
    }) : /*#__PURE__*/ React.createElement(Edit, {
        className: "w-4 h-4 mr-2"
    }), isEditing ? "Save Changes" : "Edit Profile")), /* Main Business Image */ businessImages.find((img)=>img.isMain) && /*#__PURE__*/ React.createElement("div", {
        className: "mb-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "relative h-32 bg-gray-100 rounded-lg overflow-hidden"
    }, /*#__PURE__*/ React.createElement("img", {
        src: businessImages.find((img)=>img.isMain)?.url,
        alt: "Main business",
        className: "w-full h-full object-cover"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "absolute bottom-3 left-4 text-white"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-sm font-medium"
    }, businessImages.find((img)=>img.isMain)?.title)), /*#__PURE__*/ React.createElement(Badge, {
        className: "absolute top-3 right-3 bg-saffron-500"
    }, "Main Photo"))), /* Stats */ /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-2 md:grid-cols-4 gap-4"
    }, stats.map((stat, index)=>/*#__PURE__*/ React.createElement("div", {
            key: index,
            className: "text-center p-4 bg-gray-50 rounded-lg"
        }, /*#__PURE__*/ React.createElement(stat.icon, {
            className: `w-6 h-6 mx-auto mb-2 ${stat.color}`
        }), /*#__PURE__*/ React.createElement("p", {
            className: "text-xl font-bold text-gray-900"
        }, stat.value), /*#__PURE__*/ React.createElement("p", {
            className: "text-sm text-gray-600"
        }, stat.label)))))), /* Profile Details */ /*#__PURE__*/ React.createElement(Tabs, {
        defaultValue: "details",
        className: "space-y-6"
    }, /*#__PURE__*/ React.createElement(TabsList, {
        className: "grid w-full grid-cols-4"
    }, /*#__PURE__*/ React.createElement(TabsTrigger, {
        value: "details"
    }, "Profile Details"), /*#__PURE__*/ React.createElement(TabsTrigger, {
        value: "business"
    }, "Business Info"), /*#__PURE__*/ React.createElement(TabsTrigger, {
        value: "images",
        className: "flex items-center space-x-1"
    }, /*#__PURE__*/ React.createElement(Camera, {
        className: "w-4 h-4"
    }), /*#__PURE__*/ React.createElement("span", null, "Images")), /*#__PURE__*/ React.createElement(TabsTrigger, {
        value: "history"
    }, "Order History")), /*#__PURE__*/ React.createElement(TabsContent, {
        value: "details"
    }, /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, null, "Personal Information"), /*#__PURE__*/ React.createElement(CardDescription, null, "Manage your personal details and contact information")), /*#__PURE__*/ React.createElement(CardContent, {
        className: "space-y-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-6"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement(Label, {
        htmlFor: "name"
    }, "Full Name"), /*#__PURE__*/ React.createElement(Input, {
        id: "name",
        value: profileData.name,
        onChange: (e)=>setProfileData((prev)=>({
                    ...prev,
                    name: e.target.value
                })),
        disabled: !isEditing
    })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement(Label, {
        htmlFor: "email"
    }, "Email"), /*#__PURE__*/ React.createElement("div", {
        className: "relative"
    }, /*#__PURE__*/ React.createElement(Mail, {
        className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
    }), /*#__PURE__*/ React.createElement(Input, {
        id: "email",
        type: "email",
        value: profileData.email,
        onChange: (e)=>setProfileData((prev)=>({
                    ...prev,
                    email: e.target.value
                })),
        disabled: !isEditing,
        className: "pl-10"
    }))), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement(Label, {
        htmlFor: "phone"
    }, "Phone Number"), /*#__PURE__*/ React.createElement("div", {
        className: "relative"
    }, /*#__PURE__*/ React.createElement(Phone, {
        className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
    }), /*#__PURE__*/ React.createElement(Input, {
        id: "phone",
        value: profileData.phone,
        onChange: (e)=>setProfileData((prev)=>({
                    ...prev,
                    phone: e.target.value
                })),
        disabled: !isEditing,
        className: "pl-10"
    }))), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement(Label, {
        htmlFor: "established"
    }, "Business Since"), /*#__PURE__*/ React.createElement(Input, {
        id: "established",
        value: profileData.established,
        onChange: (e)=>setProfileData((prev)=>({
                    ...prev,
                    established: e.target.value
                })),
        disabled: !isEditing
    }))), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement(Label, {
        htmlFor: "address"
    }, "Address"), /*#__PURE__*/ React.createElement("div", {
        className: "relative"
    }, /*#__PURE__*/ React.createElement(MapPin, {
        className: "absolute left-3 top-3 text-gray-400 w-4 h-4"
    }), /*#__PURE__*/ React.createElement(Textarea, {
        id: "address",
        value: profileData.address,
        onChange: (e)=>setProfileData((prev)=>({
                    ...prev,
                    address: e.target.value
                })),
        disabled: !isEditing,
        className: "pl-10 resize-none",
        rows: 3
    })))))), /*#__PURE__*/ React.createElement(TabsContent, {
        value: "business"
    }, /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, null, "Business Information"), /*#__PURE__*/ React.createElement(CardDescription, null, "Details about your street food business")), /*#__PURE__*/ React.createElement(CardContent, {
        className: "space-y-6"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement(Label, {
        htmlFor: "businessName"
    }, "Business Name"), /*#__PURE__*/ React.createElement(Input, {
        id: "businessName",
        value: profileData.businessName,
        onChange: (e)=>setProfileData((prev)=>({
                    ...prev,
                    businessName: e.target.value
                })),
        disabled: !isEditing
    })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement(Label, {
        htmlFor: "description"
    }, "Business Description"), /*#__PURE__*/ React.createElement(Textarea, {
        id: "description",
        value: profileData.description,
        onChange: (e)=>setProfileData((prev)=>({
                    ...prev,
                    description: e.target.value
                })),
        disabled: !isEditing,
        className: "resize-none",
        rows: 4
    })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement(Label, null, "Specialties"), /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-wrap gap-2 mt-2"
    }, profileData.specialties.map((specialty, index)=>/*#__PURE__*/ React.createElement(Badge, {
            key: index,
            variant: "secondary",
            className: "bg-saffron-100 text-saffron-700"
        }, specialty))))))), /*#__PURE__*/ React.createElement(TabsContent, {
        value: "images"
    }, /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(Camera, {
        className: "w-5 h-5 mr-2"
    }), "Business Gallery"), /*#__PURE__*/ React.createElement(CardDescription, null, "Share photos of your food stall, specialties, and cooking area to attract customers")), /*#__PURE__*/ React.createElement(CardContent, null, /*#__PURE__*/ React.createElement(ImageUpload, {
        images: businessImages,
        onImagesChange: setBusinessImages,
        isEditing: isEditing,
        businessType: "vendor"
    })))), /*#__PURE__*/ React.createElement(TabsContent, {
        value: "history"
    }, /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, null, "Order History"), /*#__PURE__*/ React.createElement(CardDescription, null, "Your recent orders and purchases")), /*#__PURE__*/ React.createElement(CardContent, null, /*#__PURE__*/ React.createElement("div", {
        className: "space-y-4"
    }, orderHistory.map((order, index)=>/*#__PURE__*/ React.createElement("div", {
            key: index,
            className: "flex items-center justify-between p-4 border rounded-lg"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex-1"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center space-x-3"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "font-medium"
        }, order.date), /*#__PURE__*/ React.createElement(Badge, {
            className: "bg-green-100 text-green-700"
        }, order.status)), /*#__PURE__*/ React.createElement("p", {
            className: "text-sm text-gray-600 mt-1"
        }, order.supplier), /*#__PURE__*/ React.createElement("p", {
            className: "text-sm text-gray-500"
        }, order.items)), /*#__PURE__*/ React.createElement("div", {
            className: "text-right"
        }, /*#__PURE__*/ React.createElement("p", {
            className: "font-semibold"
        }, "₹", order.amount)))))))))));
}
