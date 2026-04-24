import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useWhatsApp, CHAT_TEMPLATES } from "@/lib/whatsapp";
import { useNotifications } from "@/contexts/NotificationContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { MessageSquare, Send, Zap, Package, Star, CheckCircle } from "lucide-react";
export default function WhatsAppContact({ supplier, material, vendorName, trigger, size = "md" }) {
    const { chatWithSupplier, validatePhoneNumber } = useWhatsApp();
    const { addNotification } = useNotifications();
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState("");
    const [customMessage, setCustomMessage] = useState("");
    const templates = [
        {
            id: "product_inquiry",
            title: t("productInquiry"),
            description: t("askAboutAvailabilityAndDelivery"),
            icon: /*#__PURE__*/ React.createElement(Package, {
                className: "w-5 h-5"
            }),
            color: "bg-blue-100 text-blue-700",
            message: material ? CHAT_TEMPLATES.PRODUCT_INQUIRY(material.name, material.price, material.unit) : ""
        },
        {
            id: "bulk_order",
            title: t("bulkOrder"),
            description: t("inquireAboutBulkPricing"),
            icon: /*#__PURE__*/ React.createElement(Star, {
                className: "w-5 h-5"
            }),
            color: "bg-purple-100 text-purple-700",
            message: material ? CHAT_TEMPLATES.BULK_ORDER(material.name) : ""
        },
        {
            id: "urgent_requirement",
            title: t("urgentRequirement"),
            description: t("needImmediateDelivery"),
            icon: /*#__PURE__*/ React.createElement(Zap, {
                className: "w-5 h-5"
            }),
            color: "bg-red-100 text-red-700",
            message: material ? CHAT_TEMPLATES.URGENT_REQUIREMENT(material.name) : ""
        },
        {
            id: "quality_inquiry",
            title: t("qualityInquiry"),
            description: t("askAboutQualitySpecs"),
            icon: /*#__PURE__*/ React.createElement(CheckCircle, {
                className: "w-5 h-5"
            }),
            color: "bg-green-100 text-green-700",
            message: material ? CHAT_TEMPLATES.QUALITY_INQUIRY(material.name) : ""
        },
        {
            id: "general_inquiry",
            title: t("generalInquiry"),
            description: t("askForCatalogAndPricing"),
            icon: /*#__PURE__*/ React.createElement(MessageSquare, {
                className: "w-5 h-5"
            }),
            color: "bg-orange-100 text-orange-700",
            message: CHAT_TEMPLATES.GENERAL_INQUIRY()
        }
    ];
    const handleSendMessage = (template)=>{
        if (!validatePhoneNumber(supplier.phone)) {
            addNotification({
                title: t("invalidPhoneNumber"),
                message: t("pleaseCheckPhoneNumber"),
                type: "error",
                icon: "❌"
            });
            return;
        }
        let messageToSend = customMessage;
        if (template) {
            const selectedTemp = templates.find((t)=>t.id === template);
            messageToSend = selectedTemp?.message || customMessage;
        }
        chatWithSupplier({
            supplierName: supplier.businessName || supplier.name,
            supplierPhone: supplier.phone,
            materialName: material?.name,
            materialPrice: material?.price,
            materialUnit: material?.unit,
            customMessage: messageToSend,
            vendorName: vendorName
        });
        addNotification({
            title: t("openingWhatsApp"),
            message: `${t("startingChatWith")} ${supplier.name}`,
            type: "success",
            icon: "💬"
        });
        setIsOpen(false);
        setSelectedTemplate("");
        setCustomMessage("");
    };
    const ButtonSize = size === "sm" ? "sm" : size === "lg" ? "lg" : "default";
    const defaultTrigger = /*#__PURE__*/ React.createElement(Button, {
        variant: "outline",
        size: ButtonSize,
        className: "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
    }, /*#__PURE__*/ React.createElement(MessageSquare, {
        className: `${size === "sm" ? "w-3 h-3" : "w-4 h-4"} mr-2`
    }), size === "sm" ? "Chat" : t("whatsApp"));
    return /*#__PURE__*/ React.createElement(Dialog, {
        open: isOpen,
        onOpenChange: setIsOpen
    }, /*#__PURE__*/ React.createElement(DialogTrigger, {
        asChild: true
    }, trigger || defaultTrigger), /*#__PURE__*/ React.createElement(DialogContent, {
        className: "sm:max-w-md"
    }, /*#__PURE__*/ React.createElement(DialogHeader, null, /*#__PURE__*/ React.createElement(DialogTitle, {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(MessageSquare, {
        className: "w-5 h-5 mr-2 text-green-600"
    }), t("contactSupplier")), /*#__PURE__*/ React.createElement(DialogDescription, null, t("chooseMessageTemplate"), " ", supplier.businessName || supplier.name)), /* Supplier Info */ /*#__PURE__*/ React.createElement(Card, {
        className: "mb-4"
    }, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h4", {
        className: "font-semibold"
    }, supplier.businessName || supplier.name), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-500"
    }, supplier.phone), supplier.rating && /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-1 mt-1"
    }, /*#__PURE__*/ React.createElement(Star, {
        className: "w-3 h-3 fill-yellow-400 text-yellow-400"
    }), /*#__PURE__*/ React.createElement("span", {
        className: "text-xs text-gray-600"
    }, supplier.rating))), supplier.isVerified && /*#__PURE__*/ React.createElement(Badge, {
        className: "bg-green-100 text-green-700"
    }, /*#__PURE__*/ React.createElement(CheckCircle, {
        className: "w-3 h-3 mr-1"
    }), t("verified"))), material && /*#__PURE__*/ React.createElement("div", {
        className: "mt-3 p-2 bg-gray-50 rounded-lg"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-sm font-medium"
    }, material.name), /*#__PURE__*/ React.createElement("p", {
        className: "text-xs text-gray-500"
    }, "₹", material.price, "/", material.unit)))), /* Quick Templates */ /*#__PURE__*/ React.createElement("div", {
        className: "space-y-3 max-h-60 overflow-y-auto"
    }, /*#__PURE__*/ React.createElement("h4", {
        className: "font-medium text-sm text-gray-700"
    }, t("quickTemplates")), templates.map((template)=>/*#__PURE__*/ React.createElement(Card, {
            key: template.id,
            className: `cursor-pointer transition-colors hover:bg-gray-50 ${selectedTemplate === template.id ? "ring-2 ring-green-500" : ""}`,
            onClick: ()=>{
                setSelectedTemplate(template.id);
                setCustomMessage(template.message);
            }
        }, /*#__PURE__*/ React.createElement(CardContent, {
            className: "p-3"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-start space-x-3"
        }, /*#__PURE__*/ React.createElement("div", {
            className: `p-2 rounded-lg ${template.color}`
        }, template.icon), /*#__PURE__*/ React.createElement("div", {
            className: "flex-1"
        }, /*#__PURE__*/ React.createElement("h5", {
            className: "font-medium text-sm"
        }, template.title), /*#__PURE__*/ React.createElement("p", {
            className: "text-xs text-gray-500"
        }, template.description))))))), /* Custom Message */ /*#__PURE__*/ React.createElement("div", {
        className: "space-y-2"
    }, /*#__PURE__*/ React.createElement("label", {
        className: "text-sm font-medium text-gray-700"
    }, t("customMessage"), " (", t("optional"), ")"), /*#__PURE__*/ React.createElement(Textarea, {
        placeholder: t("customMessagePlaceholder"),
        value: customMessage,
        onChange: (e)=>setCustomMessage(e.target.value),
        rows: 3,
        className: "text-sm"
    })), /*#__PURE__*/ React.createElement(DialogFooter, {
        className: "flex gap-2"
    }, /*#__PURE__*/ React.createElement(Button, {
        variant: "outline",
        onClick: ()=>setIsOpen(false)
    }, t("cancel")), /*#__PURE__*/ React.createElement(Button, {
        onClick: ()=>handleSendMessage(selectedTemplate),
        disabled: !customMessage && !selectedTemplate,
        className: "bg-green-600 hover:bg-green-700"
    }, /*#__PURE__*/ React.createElement(Send, {
        className: "w-4 h-4 mr-2"
    }), t("sendMessage")))));
}
