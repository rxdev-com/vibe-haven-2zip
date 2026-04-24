import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNotifications } from "@/contexts/NotificationContext";
import { Upload, Image as ImageIcon, Camera, Eye, Trash2 } from "lucide-react";
export default function ImageUpload({ images, onImagesChange, isEditing, businessType }) {
    const { addNotification } = useNotifications();
    const fileInputRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const categories = [
        {
            value: "facility",
            label: "Facility/Factory",
            icon: "🏭"
        },
        {
            value: "equipment",
            label: "Equipment",
            icon: "⚙️"
        },
        {
            value: "products",
            label: "Products",
            icon: "📦"
        },
        {
            value: "certificates",
            label: "Certificates",
            icon: "📜"
        },
        {
            value: "team",
            label: "Team",
            icon: "👥"
        }
    ];
    const handleFileSelect = (files)=>{
        if (!files || !isEditing) return;
        Array.from(files).forEach((file)=>{
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e)=>{
                    const newImage = {
                        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                        url: e.target?.result,
                        title: file.name.replace(/\.[^/.]+$/, ""),
                        description: "",
                        category: "facility",
                        isMain: images.length === 0
                    };
                    onImagesChange([
                        ...images,
                        newImage
                    ]);
                    addNotification({
                        title: "Image Uploaded",
                        message: `${file.name} has been uploaded successfully`,
                        type: "success",
                        icon: "📸"
                    });
                };
                reader.readAsDataURL(file);
            }
        });
    };
    const handleDrop = (e)=>{
        e.preventDefault();
        setDragOver(false);
        handleFileSelect(e.dataTransfer.files);
    };
    const removeImage = (imageId)=>{
        const updatedImages = images.filter((img)=>img.id !== imageId);
        onImagesChange(updatedImages);
        addNotification({
            title: "Image Removed",
            message: "Image has been removed from your gallery",
            type: "info",
            icon: "🗑️"
        });
    };
    const updateImage = (imageId, updates)=>{
        const updatedImages = images.map((img)=>img.id === imageId ? {
                ...img,
                ...updates
            } : img);
        onImagesChange(updatedImages);
    };
    const setAsMain = (imageId)=>{
        const updatedImages = images.map((img)=>({
                ...img,
                isMain: img.id === imageId
            }));
        onImagesChange(updatedImages);
        addNotification({
            title: "Main Image Updated",
            message: "This image is now your main business photo",
            type: "success",
            icon: "⭐"
        });
    };
    const getCategoryIcon = (category)=>{
        return categories.find((cat)=>cat.value === category)?.icon || "📷";
    };
    const getCategoryLabel = (category)=>{
        return categories.find((cat)=>cat.value === category)?.label || "Other";
    };
    return /*#__PURE__*/ React.createElement("div", {
        className: "space-y-6"
    }, /* Upload Area */ isEditing && /*#__PURE__*/ React.createElement(Card, {
        className: `border-2 border-dashed transition-colors ${dragOver ? 'border-saffron-400 bg-saffron-50' : 'border-gray-300'}`,
        onDrop: handleDrop,
        onDragOver: (e)=>{
            e.preventDefault();
            setDragOver(true);
        },
        onDragLeave: ()=>setDragOver(false)
    }, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-8 text-center"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "space-y-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center"
    }, /*#__PURE__*/ React.createElement(Camera, {
        className: "w-8 h-8 text-gray-400"
    })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h3", {
        className: "text-lg font-medium text-gray-900 mb-2"
    }, "Upload Business Images"), /*#__PURE__*/ React.createElement("p", {
        className: "text-gray-500 mb-4"
    }, "Drag and drop images here, or click to browse"), /*#__PURE__*/ React.createElement(Button, {
        onClick: ()=>fileInputRef.current?.click(),
        className: "bg-gradient-to-r from-saffron-500 to-orange-500 hover:from-saffron-600 hover:to-orange-600"
    }, /*#__PURE__*/ React.createElement(Upload, {
        className: "w-4 h-4 mr-2"
    }), "Choose Images"), /*#__PURE__*/ React.createElement("input", {
        ref: fileInputRef,
        type: "file",
        multiple: true,
        accept: "image/*",
        className: "hidden",
        onChange: (e)=>handleFileSelect(e.target.files)
    })), /*#__PURE__*/ React.createElement("p", {
        className: "text-xs text-gray-400"
    }, "Supported formats: JPG, PNG, GIF. Max size: 5MB per image")))), /* Image Gallery */ images.length > 0 && /*#__PURE__*/ React.createElement("div", {
        className: "space-y-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between"
    }, /*#__PURE__*/ React.createElement("h3", {
        className: "text-lg font-medium text-gray-900"
    }, "Business Gallery (", images.length, " images)"), !isEditing && images.length > 6 && /*#__PURE__*/ React.createElement(Button, {
        variant: "outline",
        size: "sm"
    }, /*#__PURE__*/ React.createElement(Eye, {
        className: "w-4 h-4 mr-2"
    }), "View All")), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    }, images.map((image)=>/*#__PURE__*/ React.createElement(Card, {
            key: image.id,
            className: "overflow-hidden group"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "relative"
        }, /*#__PURE__*/ React.createElement("img", {
            src: image.url,
            alt: image.title,
            className: "w-full h-48 object-cover"
        }), image.isMain && /*#__PURE__*/ React.createElement(Badge, {
            className: "absolute top-2 left-2 bg-yellow-500 text-white"
        }, "⭐ Main Photo"), /*#__PURE__*/ React.createElement(Badge, {
            variant: "secondary",
            className: "absolute top-2 right-2 bg-white/90"
        }, getCategoryIcon(image.category), " ", getCategoryLabel(image.category)), isEditing && /*#__PURE__*/ React.createElement("div", {
            className: "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2"
        }, /*#__PURE__*/ React.createElement(Button, {
            size: "sm",
            variant: "secondary",
            onClick: ()=>setSelectedImage(image)
        }, /*#__PURE__*/ React.createElement(Eye, {
            className: "w-4 h-4"
        })), !image.isMain && /*#__PURE__*/ React.createElement(Button, {
            size: "sm",
            variant: "secondary",
            onClick: ()=>setAsMain(image.id)
        }, "⭐"), /*#__PURE__*/ React.createElement(Button, {
            size: "sm",
            variant: "destructive",
            onClick: ()=>removeImage(image.id)
        }, /*#__PURE__*/ React.createElement(Trash2, {
            className: "w-4 h-4"
        })))), /*#__PURE__*/ React.createElement(CardContent, {
            className: "p-4"
        }, isEditing ? /*#__PURE__*/ React.createElement("div", {
            className: "space-y-3"
        }, /*#__PURE__*/ React.createElement(Input, {
            placeholder: "Image title",
            value: image.title,
            onChange: (e)=>updateImage(image.id, {
                    title: e.target.value
                })
        }), /*#__PURE__*/ React.createElement(Input, {
            placeholder: "Description",
            value: image.description,
            onChange: (e)=>updateImage(image.id, {
                    description: e.target.value
                })
        }), /*#__PURE__*/ React.createElement("select", {
            value: image.category,
            onChange: (e)=>updateImage(image.id, {
                    category: e.target.value
                }),
            className: "w-full p-2 border rounded-md"
        }, categories.map((cat)=>/*#__PURE__*/ React.createElement("option", {
                key: cat.value,
                value: cat.value
            }, cat.icon, " ", cat.label)))) : /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h4", {
            className: "font-medium text-gray-900 mb-1"
        }, image.title), image.description && /*#__PURE__*/ React.createElement("p", {
            className: "text-sm text-gray-600"
        }, image.description))))))), /* No Images State */ images.length === 0 && !isEditing && /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-12 text-center"
    }, /*#__PURE__*/ React.createElement(ImageIcon, {
        className: "w-16 h-16 text-gray-300 mx-auto mb-4"
    }), /*#__PURE__*/ React.createElement("h3", {
        className: "text-lg font-medium text-gray-900 mb-2"
    }, "No Images Added"), /*#__PURE__*/ React.createElement("p", {
        className: "text-gray-500"
    }, businessType === "supplier" ? "Upload photos of your facility, equipment, and products to build trust with vendors" : "Add photos of your food stall, kitchen, and specialties to showcase your business"))), /* Quick Tips */ isEditing && /*#__PURE__*/ React.createElement(Card, {
        className: "bg-blue-50 border-blue-200"
    }, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-4"
    }, /*#__PURE__*/ React.createElement("h4", {
        className: "font-medium text-blue-900 mb-2"
    }, "📸 Photo Tips"), /*#__PURE__*/ React.createElement("ul", {
        className: "text-sm text-blue-800 space-y-1"
    }, /*#__PURE__*/ React.createElement("li", null, "• Take clear, well-lit photos of your ", businessType === "supplier" ? "factory/warehouse" : "food stall"), /*#__PURE__*/ React.createElement("li", null, "• Include photos of your equipment and ", businessType === "supplier" ? "storage facilities" : "cooking area"), /*#__PURE__*/ React.createElement("li", null, "• Add certificates and licenses to build credibility"), /*#__PURE__*/ React.createElement("li", null, "• Team photos help create a personal connection"), /*#__PURE__*/ React.createElement("li", null, "• Set your best photo as the main image")))));
}
