import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import ProfilePhoto from "@/components/ProfilePhoto";
import DeliveryMap from "@/components/DeliveryMap";
import NotificationPanel from "@/components/NotificationPanel";
import { ArrowLeft, MapPin, Edit, Save, Star, Package, TrendingUp, Clock, Users, Camera, Plus, Trash2, Upload } from "lucide-react";
const mockSalesHistory = [
    {
        month: "Jan 2024",
        revenue: 125000,
        orders: 45,
        growth: 12
    },
    {
        month: "Feb 2024",
        revenue: 140000,
        orders: 52,
        growth: 15
    },
    {
        month: "Mar 2024",
        revenue: 135000,
        orders: 48,
        growth: -3
    },
    {
        month: "Apr 2024",
        revenue: 158000,
        orders: 61,
        growth: 17
    },
    {
        month: "May 2024",
        revenue: 162000,
        orders: 65,
        growth: 3
    }
];
export default function SupplierProfile() {
    const { addNotification } = useNotifications();
    const { user, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [profileImage, setProfileImage] = useState("");
    const [activeTab, setActiveTab] = useState("business-info");
    useEffect(()=>{
        const savedImage = localStorage.getItem("profileImage");
        if (savedImage) {
            setProfileImage(savedImage);
        }
    }, []);
    const [profileData, setProfileData] = useState({
        name: user?.name || "Kumar Singh",
        email: user?.email || "kumar@kumaroilmills.com",
        phone: "+91 87654 32109",
        businessName: user?.businessName || "Kumar Oil Mills",
        businessType: "Wholesale Distributor",
        address: "Industrial Area, Sector 62, Noida, Uttar Pradesh",
        description: "Leading supplier of premium quality oils and fats for the food industry. Serving Delhi NCR since 1998 with authentic and pure products.",
        established: "1998",
        license: "FSSAI-12345678901234",
        gstNumber: "09AABCU9603R1ZX",
        panNumber: "AABCU9603R",
        categories: [
            "Oils & Fats",
            "Spices",
            "Grains"
        ],
        deliveryAreas: [
            "Delhi",
            "Noida",
            "Gurgaon",
            "Faridabad",
            "Greater Noida"
        ],
        minOrderAmount: 500,
        deliveryCharges: 50,
        freeDeliveryAbove: 1000,
        businessHours: "9:00 AM - 6:00 PM",
        acceptingOrders: true,
        coordinates: {
            lat: 28.6139,
            lng: 77.2090
        }
    });
    const [businessImages, setBusinessImages] = useState([
        {
            id: "1",
            url: "/api/placeholder/400/300",
            title: "Main Factory Building",
            description: "Our modern oil processing facility with state-of-the-art equipment",
            category: "facility",
            isMain: true
        },
        {
            id: "2",
            url: "/api/placeholder/400/300",
            title: "Production Line",
            description: "Automated oil extraction and bottling machinery",
            category: "equipment",
            isMain: false
        },
        {
            id: "3",
            url: "/api/placeholder/400/300",
            title: "Quality Control Lab",
            description: "In-house testing facility ensuring product quality",
            category: "facility",
            isMain: false
        },
        {
            id: "4",
            url: "/api/placeholder/400/300",
            title: "FSSAI Certificate",
            description: "Food safety certification and compliance documents",
            category: "certificates",
            isMain: false
        },
        {
            id: "5",
            url: "/api/placeholder/400/300",
            title: "Our Team",
            description: "Dedicated team of professionals ensuring quality service",
            category: "team",
            isMain: false
        }
    ]);
    const [deliverySettings, setDeliverySettings] = useState({
        areas: profileData.deliveryAreas,
        minOrder: profileData.minOrderAmount,
        deliveryFee: profileData.deliveryCharges,
        freeDeliveryAbove: profileData.freeDeliveryAbove,
        maxDeliveryDistance: 25,
        estimatedDeliveryTime: "2-4 hours",
        operatingDays: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ]
    });
    const handleSave = ()=>{
        setIsEditing(false);
        addNotification({
            title: "Profile Updated",
            message: "Your supplier profile has been successfully updated",
            type: "success",
            icon: "✅"
        });
    };
    const handleToggleOrders = (accepting)=>{
        setProfileData((prev)=>({
                ...prev,
                acceptingOrders: accepting
            }));
        addNotification({
            title: accepting ? "Now Accepting Orders" : "Stopped Accepting Orders",
            message: accepting ? "Your store is now visible to vendors and accepting new orders" : "You've temporarily stopped accepting new orders",
            type: accepting ? "success" : "warning",
            icon: accepting ? "🟢" : "🔴"
        });
    };
    const handleImageUpload = (files)=>{
        if (files && files.length > 0) {
            Array.from(files).forEach((file)=>{
                const reader = new FileReader();
                reader.onload = (e)=>{
                    if (e.target?.result) {
                        const newImage = {
                            id: Date.now().toString(),
                            url: e.target.result,
                            title: file.name,
                            description: "Business image",
                            category: "facility",
                            isMain: false
                        };
                        setBusinessImages((prev)=>[
                                ...prev,
                                newImage
                            ]);
                    }
                };
                reader.readAsDataURL(file);
            });
            addNotification({
                title: "Images Uploaded",
                message: "Business images have been added to your profile",
                type: "success",
                icon: "📸"
            });
        }
    };
    const removeImage = (imageId)=>{
        setBusinessImages((prev)=>prev.filter((img)=>img.id !== imageId));
        addNotification({
            title: "Image Removed",
            message: "Image has been removed from your profile",
            type: "info",
            icon: "🗑️"
        });
    };
    const updateDeliverySettings = (key, value)=>{
        setDeliverySettings((prev)=>({
                ...prev,
                [key]: value
            }));
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
        className: "bg-emerald-100 text-emerald-700"
    }, "Supplier Profile")), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-4"
    }, /*#__PURE__*/ React.createElement(NotificationPanel, null), /*#__PURE__*/ React.createElement(ProfilePhoto, {
        currentImage: profileImage,
        userName: user?.name || "User",
        size: "sm",
        onImageChange: (url)=>setProfileImage(url)
    }), /*#__PURE__*/ React.createElement(Button, {
        variant: "outline",
        size: "sm",
        onClick: logout
    }, "Logout"))))), /*#__PURE__*/ React.createElement("div", {
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    }, /* Header */ /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between mb-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-4"
    }, /*#__PURE__*/ React.createElement(Link, {
        to: "/supplier"
    }, /*#__PURE__*/ React.createElement(Button, {
        variant: "outline",
        size: "sm"
    }, /*#__PURE__*/ React.createElement(ArrowLeft, {
        className: "w-4 h-4 mr-2"
    }), "Back to Dashboard")), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h1", {
        className: "text-3xl font-bold text-gray-900"
    }, "Supplier Profile"), /*#__PURE__*/ React.createElement("p", {
        className: "text-gray-600"
    }, "Manage your business information and settings"))), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-3"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-2"
    }, /*#__PURE__*/ React.createElement(Switch, {
        checked: profileData.acceptingOrders,
        onCheckedChange: handleToggleOrders
    }), /*#__PURE__*/ React.createElement("span", {
        className: "text-sm font-medium"
    }, profileData.acceptingOrders ? "Accepting Orders" : "Orders Paused")), isEditing ? /*#__PURE__*/ React.createElement(Button, {
        onClick: handleSave,
        className: "bg-green-500 hover:bg-green-600"
    }, /*#__PURE__*/ React.createElement(Save, {
        className: "w-4 h-4 mr-2"
    }), "Save Changes") : /*#__PURE__*/ React.createElement(Button, {
        onClick: ()=>setIsEditing(true),
        variant: "outline"
    }, /*#__PURE__*/ React.createElement(Edit, {
        className: "w-4 h-4 mr-2"
    }), "Edit Profile"))), /* Profile Overview Card */ /*#__PURE__*/ React.createElement(Card, {
        className: "mb-8"
    }, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-6"
    }, /*#__PURE__*/ React.createElement(Avatar, {
        className: "w-24 h-24"
    }, /*#__PURE__*/ React.createElement(AvatarFallback, {
        className: "text-3xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white"
    }, profileData.businessName.charAt(0))), /*#__PURE__*/ React.createElement("div", {
        className: "flex-1"
    }, /*#__PURE__*/ React.createElement("h2", {
        className: "text-2xl font-bold text-gray-900"
    }, profileData.businessName), /*#__PURE__*/ React.createElement("p", {
        className: "text-gray-600 mb-2"
    }, profileData.businessType), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-4 text-sm text-gray-500"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(MapPin, {
        className: "w-4 h-4 mr-1"
    }), profileData.address.split(",")[0]), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(Star, {
        className: "w-4 h-4 mr-1 fill-yellow-400 text-yellow-400"
    }), "4.8 Rating"), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(Package, {
        className: "w-4 h-4 mr-1"
    }), "186 Orders"), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(Clock, {
        className: "w-4 h-4 mr-1"
    }), "Since ", profileData.established))), /*#__PURE__*/ React.createElement("div", {
        className: "text-right"
    }, /*#__PURE__*/ React.createElement(Badge, {
        className: profileData.acceptingOrders ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
    }, profileData.acceptingOrders ? "🟢 Active" : "🔴 Inactive"))))), /* Main Content Tabs */ /*#__PURE__*/ React.createElement(Tabs, {
        value: activeTab,
        onValueChange: setActiveTab,
        className: "space-y-6"
    }, /*#__PURE__*/ React.createElement(TabsList, {
        className: "grid w-full grid-cols-4"
    }, /*#__PURE__*/ React.createElement(TabsTrigger, {
        value: "business-info"
    }, "Business Info"), /*#__PURE__*/ React.createElement(TabsTrigger, {
        value: "images"
    }, "Images"), /*#__PURE__*/ React.createElement(TabsTrigger, {
        value: "delivery-settings"
    }, "Delivery Settings"), /*#__PURE__*/ React.createElement(TabsTrigger, {
        value: "sales-history"
    }, "Sales History")), /* Business Info Tab */ /*#__PURE__*/ React.createElement(TabsContent, {
        value: "business-info",
        className: "space-y-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 lg:grid-cols-2 gap-6"
    }, /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, null, "Basic Information"), /*#__PURE__*/ React.createElement(CardDescription, null, "Update your business details")), /*#__PURE__*/ React.createElement(CardContent, {
        className: "space-y-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "space-y-2"
    }, /*#__PURE__*/ React.createElement(Label, {
        htmlFor: "businessName"
    }, "Business Name"), /*#__PURE__*/ React.createElement(Input, {
        id: "businessName",
        value: profileData.businessName,
        onChange: (e)=>setProfileData((prev)=>({
                    ...prev,
                    businessName: e.target.value
                })),
        disabled: !isEditing
    })), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-2"
    }, /*#__PURE__*/ React.createElement(Label, {
        htmlFor: "ownerName"
    }, "Owner Name"), /*#__PURE__*/ React.createElement(Input, {
        id: "ownerName",
        value: profileData.name,
        onChange: (e)=>setProfileData((prev)=>({
                    ...prev,
                    name: e.target.value
                })),
        disabled: !isEditing
    })), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-2"
    }, /*#__PURE__*/ React.createElement(Label, {
        htmlFor: "email"
    }, "Email"), /*#__PURE__*/ React.createElement(Input, {
        id: "email",
        type: "email",
        value: profileData.email,
        disabled: true
    })), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-2"
    }, /*#__PURE__*/ React.createElement(Label, {
        htmlFor: "phone"
    }, "Phone"), /*#__PURE__*/ React.createElement(Input, {
        id: "phone",
        value: profileData.phone,
        onChange: (e)=>setProfileData((prev)=>({
                    ...prev,
                    phone: e.target.value
                })),
        disabled: !isEditing
    })), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-2"
    }, /*#__PURE__*/ React.createElement(Label, {
        htmlFor: "businessType"
    }, "Business Type"), /*#__PURE__*/ React.createElement(Select, {
        value: profileData.businessType,
        onValueChange: (value)=>setProfileData((prev)=>({
                    ...prev,
                    businessType: value
                })),
        disabled: !isEditing
    }, /*#__PURE__*/ React.createElement(SelectTrigger, null, /*#__PURE__*/ React.createElement(SelectValue, null)), /*#__PURE__*/ React.createElement(SelectContent, null, /*#__PURE__*/ React.createElement(SelectItem, {
        value: "Wholesale Distributor"
    }, "Wholesale Distributor"), /*#__PURE__*/ React.createElement(SelectItem, {
        value: "Manufacturer"
    }, "Manufacturer"), /*#__PURE__*/ React.createElement(SelectItem, {
        value: "Retailer"
    }, "Retailer"), /*#__PURE__*/ React.createElement(SelectItem, {
        value: "Trader"
    }, "Trader")))))), /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, null, "Legal Information"), /*#__PURE__*/ React.createElement(CardDescription, null, "Business licenses and certifications")), /*#__PURE__*/ React.createElement(CardContent, {
        className: "space-y-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "space-y-2"
    }, /*#__PURE__*/ React.createElement(Label, {
        htmlFor: "gstNumber"
    }, "GST Number"), /*#__PURE__*/ React.createElement(Input, {
        id: "gstNumber",
        value: profileData.gstNumber,
        onChange: (e)=>setProfileData((prev)=>({
                    ...prev,
                    gstNumber: e.target.value
                })),
        disabled: !isEditing
    })), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-2"
    }, /*#__PURE__*/ React.createElement(Label, {
        htmlFor: "panNumber"
    }, "PAN Number"), /*#__PURE__*/ React.createElement(Input, {
        id: "panNumber",
        value: profileData.panNumber,
        onChange: (e)=>setProfileData((prev)=>({
                    ...prev,
                    panNumber: e.target.value
                })),
        disabled: !isEditing
    })), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-2"
    }, /*#__PURE__*/ React.createElement(Label, {
        htmlFor: "license"
    }, "FSSAI License"), /*#__PURE__*/ React.createElement(Input, {
        id: "license",
        value: profileData.license,
        onChange: (e)=>setProfileData((prev)=>({
                    ...prev,
                    license: e.target.value
                })),
        disabled: !isEditing
    })), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-2"
    }, /*#__PURE__*/ React.createElement(Label, {
        htmlFor: "established"
    }, "Established Year"), /*#__PURE__*/ React.createElement(Input, {
        id: "established",
        value: profileData.established,
        onChange: (e)=>setProfileData((prev)=>({
                    ...prev,
                    established: e.target.value
                })),
        disabled: !isEditing
    })))), /*#__PURE__*/ React.createElement(Card, {
        className: "lg:col-span-2"
    }, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, null, "Address & Description")), /*#__PURE__*/ React.createElement(CardContent, {
        className: "space-y-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "space-y-2"
    }, /*#__PURE__*/ React.createElement(Label, {
        htmlFor: "address"
    }, "Complete Address"), /*#__PURE__*/ React.createElement(Textarea, {
        id: "address",
        value: profileData.address,
        onChange: (e)=>setProfileData((prev)=>({
                    ...prev,
                    address: e.target.value
                })),
        disabled: !isEditing,
        rows: 3
    })), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-2"
    }, /*#__PURE__*/ React.createElement(Label, {
        htmlFor: "description"
    }, "Business Description"), /*#__PURE__*/ React.createElement(Textarea, {
        id: "description",
        value: profileData.description,
        onChange: (e)=>setProfileData((prev)=>({
                    ...prev,
                    description: e.target.value
                })),
        disabled: !isEditing,
        rows: 4
    })))))), /* Images Tab */ /*#__PURE__*/ React.createElement(TabsContent, {
        value: "images",
        className: "space-y-6"
    }, /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement(CardTitle, null, "Business Images"), /*#__PURE__*/ React.createElement(CardDescription, null, "Upload photos of your facility, products, and certificates")), /*#__PURE__*/ React.createElement(Button, {
        onClick: ()=>document.getElementById('image-upload')?.click()
    }, /*#__PURE__*/ React.createElement(Upload, {
        className: "w-4 h-4 mr-2"
    }), "Upload Images"), /*#__PURE__*/ React.createElement("input", {
        id: "image-upload",
        type: "file",
        multiple: true,
        accept: "image/*",
        onChange: (e)=>handleImageUpload(e.target.files),
        className: "hidden"
    }))), /*#__PURE__*/ React.createElement(CardContent, null, /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    }, businessImages.map((image)=>/*#__PURE__*/ React.createElement("div", {
            key: image.id,
            className: "relative group"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "aspect-video bg-gray-200 rounded-lg overflow-hidden"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
        }, /*#__PURE__*/ React.createElement(Camera, {
            className: "w-8 h-8 text-gray-400"
        }))), /*#__PURE__*/ React.createElement("div", {
            className: "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        }, /*#__PURE__*/ React.createElement(Button, {
            size: "sm",
            variant: "destructive",
            onClick: ()=>removeImage(image.id)
        }, /*#__PURE__*/ React.createElement(Trash2, {
            className: "w-4 h-4"
        }))), /*#__PURE__*/ React.createElement("div", {
            className: "absolute top-2 left-2"
        }, image.isMain && /*#__PURE__*/ React.createElement(Badge, {
            className: "bg-blue-500"
        }, "Main")), /*#__PURE__*/ React.createElement("div", {
            className: "mt-2"
        }, /*#__PURE__*/ React.createElement("h4", {
            className: "font-medium text-sm"
        }, image.title), /*#__PURE__*/ React.createElement("p", {
            className: "text-xs text-gray-500"
        }, image.description), /*#__PURE__*/ React.createElement(Badge, {
            variant: "outline",
            className: "mt-1 text-xs"
        }, image.category)))))))), /* Delivery Settings Tab */ /*#__PURE__*/ React.createElement(TabsContent, {
        value: "delivery-settings",
        className: "space-y-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 lg:grid-cols-2 gap-6"
    }, /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, null, "Delivery Configuration"), /*#__PURE__*/ React.createElement(CardDescription, null, "Set your delivery zones and pricing")), /*#__PURE__*/ React.createElement(CardContent, {
        className: "space-y-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "space-y-2"
    }, /*#__PURE__*/ React.createElement(Label, null, "Minimum Order Amount (₹)"), /*#__PURE__*/ React.createElement(Input, {
        type: "number",
        value: deliverySettings.minOrder,
        onChange: (e)=>updateDeliverySettings('minOrder', parseInt(e.target.value))
    })), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-2"
    }, /*#__PURE__*/ React.createElement(Label, null, "Delivery Fee (₹)"), /*#__PURE__*/ React.createElement(Input, {
        type: "number",
        value: deliverySettings.deliveryFee,
        onChange: (e)=>updateDeliverySettings('deliveryFee', parseInt(e.target.value))
    })), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-2"
    }, /*#__PURE__*/ React.createElement(Label, null, "Free Delivery Above (₹)"), /*#__PURE__*/ React.createElement(Input, {
        type: "number",
        value: deliverySettings.freeDeliveryAbove,
        onChange: (e)=>updateDeliverySettings('freeDeliveryAbove', parseInt(e.target.value))
    })), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-2"
    }, /*#__PURE__*/ React.createElement(Label, null, "Max Delivery Distance (km)"), /*#__PURE__*/ React.createElement(Input, {
        type: "number",
        value: deliverySettings.maxDeliveryDistance,
        onChange: (e)=>updateDeliverySettings('maxDeliveryDistance', parseInt(e.target.value))
    })), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-2"
    }, /*#__PURE__*/ React.createElement(Label, null, "Estimated Delivery Time"), /*#__PURE__*/ React.createElement(Select, {
        value: deliverySettings.estimatedDeliveryTime,
        onValueChange: (value)=>updateDeliverySettings('estimatedDeliveryTime', value)
    }, /*#__PURE__*/ React.createElement(SelectTrigger, null, /*#__PURE__*/ React.createElement(SelectValue, null)), /*#__PURE__*/ React.createElement(SelectContent, null, /*#__PURE__*/ React.createElement(SelectItem, {
        value: "1-2 hours"
    }, "1-2 hours"), /*#__PURE__*/ React.createElement(SelectItem, {
        value: "2-4 hours"
    }, "2-4 hours"), /*#__PURE__*/ React.createElement(SelectItem, {
        value: "4-6 hours"
    }, "4-6 hours"), /*#__PURE__*/ React.createElement(SelectItem, {
        value: "Same day"
    }, "Same day"), /*#__PURE__*/ React.createElement(SelectItem, {
        value: "Next day"
    }, "Next day")))))), /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, null, "Delivery Areas"), /*#__PURE__*/ React.createElement(CardDescription, null, "Manage your service areas")), /*#__PURE__*/ React.createElement(CardContent, null, /*#__PURE__*/ React.createElement("div", {
        className: "space-y-3"
    }, deliverySettings.areas.map((area, index)=>/*#__PURE__*/ React.createElement("div", {
            key: index,
            className: "flex items-center justify-between p-2 border rounded"
        }, /*#__PURE__*/ React.createElement("span", null, area), /*#__PURE__*/ React.createElement(Button, {
            size: "sm",
            variant: "ghost",
            onClick: ()=>{
                const newAreas = deliverySettings.areas.filter((_, i)=>i !== index);
                updateDeliverySettings('areas', newAreas);
            }
        }, /*#__PURE__*/ React.createElement(Trash2, {
            className: "w-4 h-4"
        })))), /*#__PURE__*/ React.createElement(Button, {
        variant: "outline",
        onClick: ()=>{
            const newArea = prompt("Enter new delivery area:");
            if (newArea) {
                updateDeliverySettings('areas', [
                    ...deliverySettings.areas,
                    newArea
                ]);
            }
        }
    }, /*#__PURE__*/ React.createElement(Plus, {
        className: "w-4 h-4 mr-2"
    }), "Add Area"))))), /* Delivery Map */ /*#__PURE__*/ React.createElement(DeliveryMap, null)), /* Sales History Tab */ /*#__PURE__*/ React.createElement(TabsContent, {
        value: "sales-history",
        className: "space-y-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
    }, /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(TrendingUp, {
        className: "w-8 h-8 text-green-500 mr-3"
    }), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-600"
    }, "Total Revenue"), /*#__PURE__*/ React.createElement("p", {
        className: "text-2xl font-bold text-gray-900"
    }, "₹7,20,000"))))), /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(Package, {
        className: "w-8 h-8 text-blue-500 mr-3"
    }), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-600"
    }, "Total Orders"), /*#__PURE__*/ React.createElement("p", {
        className: "text-2xl font-bold text-gray-900"
    }, "271"))))), /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(Users, {
        className: "w-8 h-8 text-purple-500 mr-3"
    }), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-600"
    }, "Active Customers"), /*#__PURE__*/ React.createElement("p", {
        className: "text-2xl font-bold text-gray-900"
    }, "89")))))), /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, null, "Monthly Performance"), /*#__PURE__*/ React.createElement(CardDescription, null, "Revenue and order trends over time")), /*#__PURE__*/ React.createElement(CardContent, null, /*#__PURE__*/ React.createElement("div", {
        className: "space-y-4"
    }, mockSalesHistory.map((data)=>/*#__PURE__*/ React.createElement("div", {
            key: data.month,
            className: "flex items-center justify-between p-4 border rounded-lg"
        }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h4", {
            className: "font-medium"
        }, data.month), /*#__PURE__*/ React.createElement("p", {
            className: "text-sm text-gray-500"
        }, data.orders, " orders")), /*#__PURE__*/ React.createElement("div", {
            className: "text-right"
        }, /*#__PURE__*/ React.createElement("p", {
            className: "font-semibold text-lg"
        }, "₹", data.revenue.toLocaleString()), /*#__PURE__*/ React.createElement("div", {
            className: `text-sm flex items-center ${data.growth >= 0 ? 'text-green-600' : 'text-red-600'}`
        }, data.growth >= 0 ? '↗' : '↘', " ", Math.abs(data.growth), "%")))))))))));
}
