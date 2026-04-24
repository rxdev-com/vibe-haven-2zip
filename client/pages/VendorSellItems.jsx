import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import NotificationPanel from "@/components/NotificationPanel";
import ProfilePhoto from "@/components/ProfilePhoto";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import { ArrowLeft, Plus, Camera, Package, DollarSign, AlertCircle } from "lucide-react";
const categories = [
    {
        value: "spices",
        label: "Spices & Seasonings"
    },
    {
        value: "oils",
        label: "Oils & Fats"
    },
    {
        value: "grains",
        label: "Grains & Cereals"
    },
    {
        value: "equipment",
        label: "Kitchen Equipment"
    },
    {
        value: "packaging",
        label: "Packaging Materials"
    },
    {
        value: "utensils",
        label: "Utensils & Tools"
    },
    {
        value: "other",
        label: "Other Items"
    }
];
const conditions = [
    {
        value: "new",
        label: "Brand New",
        color: "bg-green-100 text-green-700"
    },
    {
        value: "like-new",
        label: "Like New",
        color: "bg-emerald-100 text-emerald-700"
    },
    {
        value: "excellent",
        label: "Excellent",
        color: "bg-blue-100 text-blue-700"
    },
    {
        value: "good",
        label: "Good",
        color: "bg-yellow-100 text-yellow-700"
    },
    {
        value: "fair",
        label: "Fair",
        color: "bg-orange-100 text-orange-700"
    }
];
export default function VendorSellItems() {
    const { addNotification } = useNotifications();
    const { user, logout } = useAuth();
    const { t } = useLanguage();
    const [profileImage, setProfileImage] = useState("");
    const [images, setImages] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        price: "",
        originalPrice: "",
        condition: "",
        description: "",
        urgency: "normal",
        tags: ""
    });
    useEffect(()=>{
        const savedImage = localStorage.getItem("profileImage");
        if (savedImage) {
            setProfileImage(savedImage);
        }
    }, []);
    const handleInputChange = (field, value)=>{
        setFormData((prev)=>({
                ...prev,
                [field]: value
            }));
    };
    const handleImageUpload = (event)=>{
        const files = event.target.files;
        if (files) {
            Array.from(files).forEach((file)=>{
                const reader = new FileReader();
                reader.onload = (e)=>{
                    if (e.target?.result) {
                        setImages((prev)=>[
                                ...prev,
                                e.target.result
                            ]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };
    const removeImage = (index)=>{
        setImages((prev)=>prev.filter((_, i)=>i !== index));
    };
    const handleSubmit = (e)=>{
        e.preventDefault();
        if (!formData.title || !formData.category || !formData.price || !formData.condition) {
            addNotification({
                title: t("missingInformation"),
                message: t("fillRequiredFields"),
                type: "error",
                icon: "⚠️"
            });
            return;
        }
        // Mock submission
        addNotification({
            title: t("itemListedSuccessfully"),
            message: `"${formData.title}" ${t("postedToMarketplace")}`,
            type: "success",
            icon: "✅"
        });
        // Reset form
        setFormData({
            title: "",
            category: "",
            price: "",
            originalPrice: "",
            condition: "",
            description: "",
            urgency: "normal",
            tags: ""
        });
        setImages([]);
    };
    const calculateSavings = ()=>{
        if (formData.price && formData.originalPrice) {
            const price = parseFloat(formData.price);
            const original = parseFloat(formData.originalPrice);
            if (original > price) {
                const savings = ((original - price) / original * 100).toFixed(0);
                return `${savings}% off`;
            }
        }
        return null;
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
        className: "bg-green-100 text-green-700"
    }, t('sellItems'))), /*#__PURE__*/ React.createElement("div", {
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
    }, t('logout')))))), /*#__PURE__*/ React.createElement("div", {
        className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
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
    }, t('listYourItems')), /*#__PURE__*/ React.createElement("p", {
        className: "text-gray-600"
    }, t('sellUnusedItemsToOtherVendors')))), /*#__PURE__*/ React.createElement("form", {
        onSubmit: handleSubmit
    }, /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 lg:grid-cols-3 gap-8"
    }, /* Main Form */ /*#__PURE__*/ React.createElement("div", {
        className: "lg:col-span-2 space-y-6"
    }, /* Basic Information */ /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(Package, {
        className: "w-5 h-5 mr-2"
    }), t('basicInformation')), /*#__PURE__*/ React.createElement(CardDescription, null, t('provideEssentialDetails'))), /*#__PURE__*/ React.createElement(CardContent, {
        className: "space-y-4"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
        className: "block text-sm font-medium text-gray-700 mb-2"
    }, t('itemTitle'), " *"), /*#__PURE__*/ React.createElement(Input, {
        placeholder: t('itemTitlePlaceholder'),
        value: formData.title,
        onChange: (e)=>handleInputChange("title", e.target.value),
        className: "w-full"
    })), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-4"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
        className: "block text-sm font-medium text-gray-700 mb-2"
    }, t('category'), " *"), /*#__PURE__*/ React.createElement(Select, {
        value: formData.category,
        onValueChange: (value)=>handleInputChange("category", value)
    }, /*#__PURE__*/ React.createElement(SelectTrigger, null, /*#__PURE__*/ React.createElement(SelectValue, {
        placeholder: t('selectCategory')
    })), /*#__PURE__*/ React.createElement(SelectContent, null, categories.map((cat)=>/*#__PURE__*/ React.createElement(SelectItem, {
            key: cat.value,
            value: cat.value
        }, cat.label))))), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
        className: "block text-sm font-medium text-gray-700 mb-2"
    }, t('condition'), " *"), /*#__PURE__*/ React.createElement(Select, {
        value: formData.condition,
        onValueChange: (value)=>handleInputChange("condition", value)
    }, /*#__PURE__*/ React.createElement(SelectTrigger, null, /*#__PURE__*/ React.createElement(SelectValue, {
        placeholder: t('selectCondition')
    })), /*#__PURE__*/ React.createElement(SelectContent, null, conditions.map((condition)=>/*#__PURE__*/ React.createElement(SelectItem, {
            key: condition.value,
            value: condition.value
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center"
        }, /*#__PURE__*/ React.createElement("span", {
            className: `inline-block w-2 h-2 rounded-full mr-2 ${condition.color.split(' ')[0]}`
        }), condition.label))))))), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
        className: "block text-sm font-medium text-gray-700 mb-2"
    }, t('description')), /*#__PURE__*/ React.createElement(Textarea, {
        placeholder: t('descriptionPlaceholder'),
        value: formData.description,
        onChange: (e)=>handleInputChange("description", e.target.value),
        rows: 4
    })))), /* Pricing */ /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(DollarSign, {
        className: "w-5 h-5 mr-2"
    }), t('pricing')), /*#__PURE__*/ React.createElement(CardDescription, null, t('setCompetitivePrices'))), /*#__PURE__*/ React.createElement(CardContent, {
        className: "space-y-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-4"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
        className: "block text-sm font-medium text-gray-700 mb-2"
    }, t('sellingPrice'), " (₹) *"), /*#__PURE__*/ React.createElement(Input, {
        type: "number",
        placeholder: "5000",
        value: formData.price,
        onChange: (e)=>handleInputChange("price", e.target.value)
    })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
        className: "block text-sm font-medium text-gray-700 mb-2"
    }, t('originalPrice'), " (₹)"), /*#__PURE__*/ React.createElement(Input, {
        type: "number",
        placeholder: "8000",
        value: formData.originalPrice,
        onChange: (e)=>handleInputChange("originalPrice", e.target.value)
    }))), calculateSavings() && /*#__PURE__*/ React.createElement("div", {
        className: "p-3 bg-green-50 border border-green-200 rounded-lg"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-green-800 text-sm font-medium"
    }, "🏷️ ", t('greatDeal'), " ", calculateSavings())))), /* Images */ /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(Camera, {
        className: "w-5 h-5 mr-2"
    }), t('photos')), /*#__PURE__*/ React.createElement(CardDescription, null, t('addPhotosToShowcase'))), /*#__PURE__*/ React.createElement(CardContent, null, /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-2 md:grid-cols-3 gap-4"
    }, images.map((image, index)=>/*#__PURE__*/ React.createElement("div", {
            key: index,
            className: "relative group"
        }, /*#__PURE__*/ React.createElement("img", {
            src: image,
            alt: `Upload ${index + 1}`,
            className: "w-full h-24 object-cover rounded-lg border"
        }), /*#__PURE__*/ React.createElement(Button, {
            type: "button",
            variant: "destructive",
            size: "sm",
            className: "absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity",
            onClick: ()=>removeImage(index)
        }, "×"))), images.length < 5 && /*#__PURE__*/ React.createElement("label", {
        className: "w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "text-center"
    }, /*#__PURE__*/ React.createElement(Camera, {
        className: "w-6 h-6 text-gray-400 mx-auto mb-1"
    }), /*#__PURE__*/ React.createElement("span", {
        className: "text-xs text-gray-500"
    }, t('addPhoto'))), /*#__PURE__*/ React.createElement("input", {
        type: "file",
        accept: "image/*",
        onChange: handleImageUpload,
        className: "hidden",
        multiple: true
    })))))), /* Sidebar */ /*#__PURE__*/ React.createElement("div", {
        className: "space-y-6"
    }, /* Preview */ /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, {
        className: "text-lg"
    }, t('preview'))), /*#__PURE__*/ React.createElement(CardContent, null, /*#__PURE__*/ React.createElement("div", {
        className: "space-y-3"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "aspect-video bg-gray-100 rounded-lg flex items-center justify-center"
    }, images.length > 0 ? /*#__PURE__*/ React.createElement("img", {
        src: images[0],
        alt: "Preview",
        className: "w-full h-full object-cover rounded-lg"
    }) : /*#__PURE__*/ React.createElement(Package, {
        className: "w-12 h-12 text-gray-400"
    })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h3", {
        className: "font-semibold text-gray-900"
    }, formData.title || t('itemTitle')), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-2 mt-1"
    }, formData.condition && /*#__PURE__*/ React.createElement(Badge, {
        className: conditions.find((c)=>c.value === formData.condition)?.color
    }, conditions.find((c)=>c.value === formData.condition)?.label), formData.category && /*#__PURE__*/ React.createElement(Badge, {
        variant: "outline",
        className: "text-xs"
    }, categories.find((c)=>c.value === formData.category)?.label))), formData.price && /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-xl font-bold text-gray-900"
    }, "₹", parseInt(formData.price).toLocaleString()), calculateSavings() && /*#__PURE__*/ React.createElement(Badge, {
        className: "bg-green-100 text-green-700"
    }, calculateSavings()))))), /* Additional Options */ /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, {
        className: "text-lg"
    }, t('additionalOptions'))), /*#__PURE__*/ React.createElement(CardContent, {
        className: "space-y-4"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
        className: "block text-sm font-medium text-gray-700 mb-2"
    }, t('urgency')), /*#__PURE__*/ React.createElement(Select, {
        value: formData.urgency,
        onValueChange: (value)=>handleInputChange("urgency", value)
    }, /*#__PURE__*/ React.createElement(SelectTrigger, null, /*#__PURE__*/ React.createElement(SelectValue, null)), /*#__PURE__*/ React.createElement(SelectContent, null, /*#__PURE__*/ React.createElement(SelectItem, {
        value: "normal"
    }, t('normalSale')), /*#__PURE__*/ React.createElement(SelectItem, {
        value: "urgent"
    }, t('urgentSale'))))), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
        className: "block text-sm font-medium text-gray-700 mb-2"
    }, t('tags'), " (", t('commaSeparated'), ")"), /*#__PURE__*/ React.createElement(Input, {
        placeholder: t('tagsPlaceholder'),
        value: formData.tags,
        onChange: (e)=>handleInputChange("tags", e.target.value)
    })))), /* Submit Button */ /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardContent, {
        className: "pt-6"
    }, /*#__PURE__*/ React.createElement(Button, {
        type: "submit",
        className: "w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
    }, /*#__PURE__*/ React.createElement(Plus, {
        className: "w-4 h-4 mr-2"
    }), t('listItemForSale')), /*#__PURE__*/ React.createElement("div", {
        className: "mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-start"
    }, /*#__PURE__*/ React.createElement(AlertCircle, {
        className: "w-4 h-4 text-blue-600 mt-0.5 mr-2"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "text-sm text-blue-800"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "font-medium"
    }, t('listingGuidelines'), ":"), /*#__PURE__*/ React.createElement("ul", {
        className: "mt-1 text-xs space-y-1"
    }, /*#__PURE__*/ React.createElement("li", null, "• ", t('beHonestAboutCondition')), /*#__PURE__*/ React.createElement("li", null, "• ", t('includeClearPhotos')), /*#__PURE__*/ React.createElement("li", null, "• ", t('respondPromptly')), /*#__PURE__*/ React.createElement("li", null, "• ", t('priceCompetitively')))))))))))));
}
