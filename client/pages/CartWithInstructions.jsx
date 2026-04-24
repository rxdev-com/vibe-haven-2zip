import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/contexts/CartContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import NotificationPanel from "@/components/NotificationPanel";
import ProfilePhoto from "@/components/ProfilePhoto";
import StripePayment from "@/components/StripePayment";
import { ArrowLeft, ShoppingCart, Plus, Minus, Trash2, CreditCard, Package, Info, Truck, Clock } from "lucide-react";
export default function CartWithInstructions() {
    const { items, updateQuantity, removeItem, totalAmount, clearCart } = useCart();
    const { addNotification } = useNotifications();
    const { user } = useAuth();
    const { t } = useLanguage();
    const [profileImage, setProfileImage] = useState("");
    const [supplierInstructions, setSupplierInstructions] = useState([]);
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [showStripePayment, setShowStripePayment] = useState(false);
    useEffect(()=>{
        const savedImage = localStorage.getItem("profileImage");
        if (savedImage) setProfileImage(savedImage);
        // Group items by supplier and initialize instructions
        const suppliers = [
            ...new Set(items.map((item)=>item.supplier))
        ];
        const initialInstructions = suppliers.map((supplier)=>({
                supplierId: supplier.replace(/\s+/g, '').toLowerCase(),
                supplierName: supplier,
                instructions: "",
                deliveryPreference: "standard",
                urgency: "normal"
            }));
        setSupplierInstructions(initialInstructions);
    }, [
        items
    ]);
    const updateSupplierInstructions = (supplierId, field, value)=>{
        setSupplierInstructions((prev)=>prev.map((instruction)=>instruction.supplierId === supplierId ? {
                    ...instruction,
                    [field]: value
                } : instruction));
    };
    const groupedItems = items.reduce((acc, item)=>{
        const supplier = item.supplier;
        if (!acc[supplier]) {
            acc[supplier] = [];
        }
        acc[supplier].push(item);
        return acc;
    }, {});
    const handleCheckout = ()=>{
        if (!deliveryAddress || !phoneNumber) {
            addNotification({
                title: t("missingInformation"),
                message: t("provideAddressAndPhone"),
                type: "error",
                icon: "⚠️"
            });
            return;
        }
        if (items.length === 0) {
            addNotification({
                title: t("emptyCart"),
                message: t("addItemsBeforeCheckout"),
                type: "error",
                icon: "🛒"
            });
            return;
        }
        // Open Stripe payment modal
        setShowStripePayment(true);
    };
    const handlePaymentSuccess = (paymentDetails)=>{
        // Simulate order placement with payment details
        addNotification({
            title: t("orderPlacedSuccessfully"),
            message: `${t("orderWorth")} ₹${totalAmount} ${t("placedWithSuppliers", {
                count: Object.keys(groupedItems).length
            })}`,
            type: "success",
            icon: "🎉"
        });
        // Store order details for tracking
        const orderData = {
            id: paymentDetails.id,
            items,
            total: totalAmount,
            supplierInstructions,
            deliveryAddress,
            phoneNumber,
            paymentDetails,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem(`order_${paymentDetails.id}`, JSON.stringify(orderData));
        // Clear cart after successful order
        setTimeout(()=>{
            clearCart();
            setDeliveryAddress("");
            setPhoneNumber("");
            setSupplierInstructions([]);
        }, 2000);
    };
    const getDeliveryTime = (preference)=>{
        switch(preference){
            case "express":
                return t("deliveryExpress");
            case "standard":
                return t("deliveryStandard");
            case "economy":
                return t("deliveryEconomy");
            default:
                return t("deliveryStandard");
        }
    };
    const getDeliveryFee = (preference, subtotal)=>{
        switch(preference){
            case "express":
                return Math.max(100, subtotal * 0.1);
            case "standard":
                return subtotal > 1000 ? 0 : 50;
            case "economy":
                return 0;
            default:
                return subtotal > 1000 ? 0 : 50;
        }
    };
    const getTotalWithDelivery = ()=>{
        let deliveryTotal = 0;
        Object.keys(groupedItems).forEach((supplier)=>{
            const supplierItems = groupedItems[supplier];
            const subtotal = supplierItems.reduce((sum, item)=>sum + item.price * item.quantity, 0);
            const instruction = supplierInstructions.find((inst)=>inst.supplierName === supplier);
            const deliveryFee = getDeliveryFee(instruction?.deliveryPreference || "standard", subtotal);
            deliveryTotal += deliveryFee;
        });
        return totalAmount + deliveryTotal;
    };
    if (items.length === 0) {
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
            className: "bg-saffron-100 text-saffron-700"
        }, t('shoppingCart'))), /*#__PURE__*/ React.createElement("div", {
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
            onClick: ()=>{}
        }, t('logout')))))), /*#__PURE__*/ React.createElement("div", {
            className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "text-center"
        }, /*#__PURE__*/ React.createElement(ShoppingCart, {
            className: "w-24 h-24 text-gray-300 mx-auto mb-6"
        }), /*#__PURE__*/ React.createElement("h2", {
            className: "text-2xl font-bold text-gray-900 mb-4"
        }, t('cartEmpty')), /*#__PURE__*/ React.createElement("p", {
            className: "text-gray-600 mb-8"
        }, t('cartEmptyDescription')), /*#__PURE__*/ React.createElement(Link, {
            to: "/vendor/dashboard"
        }, /*#__PURE__*/ React.createElement(Button, {
            className: "bg-gradient-to-r from-saffron-500 to-orange-500 hover:from-saffron-600 hover:to-orange-600"
        }, t('continueShopping'))))));
    }
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
        className: "bg-saffron-100 text-saffron-700"
    }, t('shoppingCart'))), /*#__PURE__*/ React.createElement("div", {
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
        onClick: ()=>{}
    }, t('logout')))))), /*#__PURE__*/ React.createElement("div", {
        className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    }, /* Header */ /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-4 mb-8"
    }, /*#__PURE__*/ React.createElement(Link, {
        to: "/vendor/dashboard"
    }, /*#__PURE__*/ React.createElement(Button, {
        variant: "outline",
        size: "sm"
    }, /*#__PURE__*/ React.createElement(ArrowLeft, {
        className: "w-4 h-4 mr-2"
    }), t('backToDashboard'))), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h1", {
        className: "text-3xl font-bold text-gray-900"
    }, t('shoppingCart')), /*#__PURE__*/ React.createElement("p", {
        className: "text-gray-600"
    }, t('reviewItemsAndProceed')))), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 lg:grid-cols-3 gap-8"
    }, /* Cart Items */ /*#__PURE__*/ React.createElement("div", {
        className: "lg:col-span-2 space-y-6"
    }, Object.entries(groupedItems).map(([supplier, supplierItems])=>{
        const subtotal = supplierItems.reduce((sum, item)=>sum + item.price * item.quantity, 0);
        const instruction = supplierInstructions.find((inst)=>inst.supplierName === supplier);
        const deliveryFee = getDeliveryFee(instruction?.deliveryPreference || "standard", subtotal);
        return /*#__PURE__*/ React.createElement(Card, {
            key: supplier
        }, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, {
            className: "flex items-center justify-between"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center"
        }, /*#__PURE__*/ React.createElement(Package, {
            className: "w-5 h-5 mr-2"
        }), supplier), /*#__PURE__*/ React.createElement(Badge, {
            variant: "outline"
        }, supplierItems.length, " ", t('items')))), /*#__PURE__*/ React.createElement(CardContent, {
            className: "space-y-4"
        }, /* Items */ /*#__PURE__*/ React.createElement("div", {
            className: "space-y-3"
        }, supplierItems.map((item)=>/*#__PURE__*/ React.createElement("div", {
                key: item.id,
                className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            }, /*#__PURE__*/ React.createElement("div", {
                className: "flex items-center space-x-3"
            }, /*#__PURE__*/ React.createElement("div", {
                className: "w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center"
            }, /*#__PURE__*/ React.createElement(Package, {
                className: "w-6 h-6 text-gray-400"
            })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h3", {
                className: "font-medium text-gray-900"
            }, item.name), /*#__PURE__*/ React.createElement("p", {
                className: "text-sm text-gray-500"
            }, "₹", item.price, "/", item.unit))), /*#__PURE__*/ React.createElement("div", {
                className: "flex items-center space-x-3"
            }, /*#__PURE__*/ React.createElement("div", {
                className: "flex items-center space-x-2"
            }, /*#__PURE__*/ React.createElement(Button, {
                variant: "outline",
                size: "sm",
                onClick: ()=>updateQuantity(item.id, Math.max(0, item.quantity - 1))
            }, /*#__PURE__*/ React.createElement(Minus, {
                className: "w-3 h-3"
            })), /*#__PURE__*/ React.createElement("span", {
                className: "w-8 text-center font-medium"
            }, item.quantity), /*#__PURE__*/ React.createElement(Button, {
                variant: "outline",
                size: "sm",
                onClick: ()=>updateQuantity(item.id, item.quantity + 1)
            }, /*#__PURE__*/ React.createElement(Plus, {
                className: "w-3 h-3"
            }))), /*#__PURE__*/ React.createElement("div", {
                className: "text-right"
            }, /*#__PURE__*/ React.createElement("p", {
                className: "font-semibold"
            }, "₹", (item.price * item.quantity).toLocaleString())), /*#__PURE__*/ React.createElement(Button, {
                variant: "ghost",
                size: "sm",
                onClick: ()=>removeItem(item.id),
                className: "text-red-600 hover:text-red-700"
            }, /*#__PURE__*/ React.createElement(Trash2, {
                className: "w-4 h-4"
            })))))), /* Supplier Instructions */ /*#__PURE__*/ React.createElement("div", {
            className: "grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t"
        }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
            className: "block text-sm font-medium text-gray-700 mb-2"
        }, t('deliveryPreference')), /*#__PURE__*/ React.createElement(Select, {
            value: instruction?.deliveryPreference || "standard",
            onValueChange: (value)=>updateSupplierInstructions(supplier.replace(/\s+/g, '').toLowerCase(), "deliveryPreference", value)
        }, /*#__PURE__*/ React.createElement(SelectTrigger, null, /*#__PURE__*/ React.createElement(SelectValue, null)), /*#__PURE__*/ React.createElement(SelectContent, null, /*#__PURE__*/ React.createElement(SelectItem, {
            value: "express"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center"
        }, /*#__PURE__*/ React.createElement(Truck, {
            className: "w-4 h-4 mr-2 text-red-500"
        }), t('expressDelivery'), " - ", getDeliveryTime("express"))), /*#__PURE__*/ React.createElement(SelectItem, {
            value: "standard"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center"
        }, /*#__PURE__*/ React.createElement(Truck, {
            className: "w-4 h-4 mr-2 text-blue-500"
        }), t('standardDelivery'), " - ", getDeliveryTime("standard"))), /*#__PURE__*/ React.createElement(SelectItem, {
            value: "economy"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center"
        }, /*#__PURE__*/ React.createElement(Clock, {
            className: "w-4 h-4 mr-2 text-green-500"
        }), t('economyDelivery'), " - ", getDeliveryTime("economy"))))), /*#__PURE__*/ React.createElement("p", {
            className: "text-xs text-gray-500 mt-1"
        }, t('deliveryFee'), ": ₹", deliveryFee)), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
            className: "block text-sm font-medium text-gray-700 mb-2"
        }, t('urgency')), /*#__PURE__*/ React.createElement(Select, {
            value: instruction?.urgency || "normal",
            onValueChange: (value)=>updateSupplierInstructions(supplier.replace(/\s+/g, '').toLowerCase(), "urgency", value)
        }, /*#__PURE__*/ React.createElement(SelectTrigger, null, /*#__PURE__*/ React.createElement(SelectValue, null)), /*#__PURE__*/ React.createElement(SelectContent, null, /*#__PURE__*/ React.createElement(SelectItem, {
            value: "normal"
        }, t('normalUrgency')), /*#__PURE__*/ React.createElement(SelectItem, {
            value: "urgent"
        }, t('urgentRequest')))))), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
            className: "block text-sm font-medium text-gray-700 mb-2"
        }, t('specialInstructions')), /*#__PURE__*/ React.createElement(Textarea, {
            placeholder: t('specialInstructionsPlaceholder'),
            value: instruction?.instructions || "",
            onChange: (e)=>updateSupplierInstructions(supplier.replace(/\s+/g, '').toLowerCase(), "instructions", e.target.value),
            rows: 2
        })), /*#__PURE__*/ React.createElement("div", {
            className: "flex justify-between items-center pt-3 border-t font-semibold"
        }, /*#__PURE__*/ React.createElement("span", null, t('subtotal'), ":"), /*#__PURE__*/ React.createElement("span", null, "₹", (subtotal + deliveryFee).toLocaleString()))));
    })), /* Checkout Summary */ /*#__PURE__*/ React.createElement("div", {
        className: "space-y-6"
    }, /* Delivery Information */ /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, null, t('deliveryInformation'))), /*#__PURE__*/ React.createElement(CardContent, {
        className: "space-y-4"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
        className: "block text-sm font-medium text-gray-700 mb-2"
    }, t('deliveryAddress'), " *"), /*#__PURE__*/ React.createElement(Textarea, {
        placeholder: t('deliveryAddressPlaceholder'),
        value: deliveryAddress,
        onChange: (e)=>setDeliveryAddress(e.target.value),
        rows: 3
    })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
        className: "block text-sm font-medium text-gray-700 mb-2"
    }, t('phoneNumber'), " *"), /*#__PURE__*/ React.createElement(Input, {
        placeholder: t('phoneNumberPlaceholder'),
        value: phoneNumber,
        onChange: (e)=>setPhoneNumber(e.target.value)
    })))), /* Order Summary */ /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, null, t('orderSummary'))), /*#__PURE__*/ React.createElement(CardContent, {
        className: "space-y-3"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between"
    }, /*#__PURE__*/ React.createElement("span", null, t('subtotal'), ":"), /*#__PURE__*/ React.createElement("span", null, "₹", totalAmount.toLocaleString())), /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between"
    }, /*#__PURE__*/ React.createElement("span", null, t('deliveryFees'), ":"), /*#__PURE__*/ React.createElement("span", null, "₹", (getTotalWithDelivery() - totalAmount).toLocaleString())), /*#__PURE__*/ React.createElement("hr", null), /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between font-semibold text-lg"
    }, /*#__PURE__*/ React.createElement("span", null, t('total'), ":"), /*#__PURE__*/ React.createElement("span", null, "₹", getTotalWithDelivery().toLocaleString())), /*#__PURE__*/ React.createElement(Button, {
        className: "w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 mt-4",
        onClick: handleCheckout,
        disabled: !deliveryAddress || !phoneNumber
    }, /*#__PURE__*/ React.createElement(CreditCard, {
        className: "w-4 h-4 mr-2"
    }), t('proceedToPayment')), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-2 text-xs text-gray-500 mt-2"
    }, /*#__PURE__*/ React.createElement(Info, {
        className: "w-3 h-3"
    }), /*#__PURE__*/ React.createElement("span", null, t('secureCheckoutNotice')))))))), /* Stripe Payment Modal */ /*#__PURE__*/ React.createElement(StripePayment, {
        isOpen: showStripePayment,
        onClose: ()=>setShowStripePayment(false),
        amount: getTotalWithDelivery(),
        items: items,
        onPaymentSuccess: handlePaymentSuccess
    }));
}
