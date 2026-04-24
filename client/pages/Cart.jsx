import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { ArrowLeft, Minus, Plus, Trash2, Package, ShoppingBag, CreditCard, MapPin, Clock, Truck } from "lucide-react";
export default function Cart() {
    const { items, totalItems, totalAmount, updateQuantity, removeItem, clearCart } = useCart();
    const { addNotification } = useNotifications();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const deliveryFee = totalAmount > 500 ? 0 : 50;
    const finalAmount = totalAmount + deliveryFee;
    const handleCheckout = async ()=>{
        setIsCheckingOut(true);
        // Simulate checkout process
        setTimeout(()=>{
            // Clear cart and show success notification
            clearCart();
            setIsCheckingOut(false);
            addNotification({
                title: "Order Placed Successfully!",
                message: `Your order worth ₹${finalAmount} has been placed and will be delivered soon.`,
                type: "success",
                actionUrl: "/vendor/orders",
                icon: "🎉"
            });
            // Redirect to orders page or dashboard
            window.location.href = "/vendor/orders";
        }, 2000);
    };
    if (items.length === 0) {
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
        }, "JugaduBazar"))))), /* Empty Cart */ /*#__PURE__*/ React.createElement("div", {
            className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "text-center"
        }, /*#__PURE__*/ React.createElement(ShoppingBag, {
            className: "w-24 h-24 text-gray-300 mx-auto mb-6"
        }), /*#__PURE__*/ React.createElement("h1", {
            className: "text-2xl font-bold text-gray-900 mb-4"
        }, "Your Cart is Empty"), /*#__PURE__*/ React.createElement("p", {
            className: "text-gray-600 mb-8"
        }, "Add some raw materials to your cart to get started"), /*#__PURE__*/ React.createElement(Link, {
            to: "/vendor/dashboard"
        }, /*#__PURE__*/ React.createElement(Button, {
            className: "bg-gradient-to-r from-saffron-500 to-orange-500 hover:from-saffron-600 hover:to-orange-600"
        }, "Browse Materials")))));
    }
    return /*#__PURE__*/ React.createElement("div", {
        className: "min-h-screen bg-gray-50"
    }, /* Header */ /*#__PURE__*/ React.createElement("header", {
        className: "bg-white border-b"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
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
        className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between mb-8"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h1", {
        className: "text-3xl font-bold text-gray-900"
    }, "Shopping Cart"), /*#__PURE__*/ React.createElement("p", {
        className: "text-gray-600"
    }, totalItems, " item", totalItems !== 1 ? 's' : '', " in your cart")), /*#__PURE__*/ React.createElement(Button, {
        variant: "outline",
        onClick: clearCart,
        className: "text-red-600 hover:text-red-700 hover:bg-red-50"
    }, /*#__PURE__*/ React.createElement(Trash2, {
        className: "w-4 h-4 mr-2"
    }), "Clear Cart")), /*#__PURE__*/ React.createElement("div", {
        className: "grid lg:grid-cols-3 gap-8"
    }, /* Cart Items */ /*#__PURE__*/ React.createElement("div", {
        className: "lg:col-span-2 space-y-4"
    }, items.map((item)=>/*#__PURE__*/ React.createElement(Card, {
            key: item.id
        }, /*#__PURE__*/ React.createElement(CardContent, {
            className: "p-6"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center space-x-4"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center"
        }, /*#__PURE__*/ React.createElement(Package, {
            className: "w-8 h-8 text-gray-400"
        })), /*#__PURE__*/ React.createElement("div", {
            className: "flex-1"
        }, /*#__PURE__*/ React.createElement("h3", {
            className: "font-semibold text-lg text-gray-900"
        }, item.name), /*#__PURE__*/ React.createElement("p", {
            className: "text-gray-600"
        }, item.supplier), /*#__PURE__*/ React.createElement(Badge, {
            variant: "secondary",
            className: "mt-1"
        }, item.category)), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center space-x-3"
        }, /*#__PURE__*/ React.createElement(Button, {
            variant: "outline",
            size: "sm",
            onClick: ()=>updateQuantity(item.id, item.quantity - 1),
            disabled: item.quantity <= 1
        }, /*#__PURE__*/ React.createElement(Minus, {
            className: "w-4 h-4"
        })), /*#__PURE__*/ React.createElement("span", {
            className: "w-12 text-center font-medium"
        }, item.quantity), /*#__PURE__*/ React.createElement(Button, {
            variant: "outline",
            size: "sm",
            onClick: ()=>updateQuantity(item.id, item.quantity + 1)
        }, /*#__PURE__*/ React.createElement(Plus, {
            className: "w-4 h-4"
        }))), /*#__PURE__*/ React.createElement("div", {
            className: "text-right"
        }, /*#__PURE__*/ React.createElement("p", {
            className: "text-lg font-bold text-gray-900"
        }, "₹", item.price * item.quantity), /*#__PURE__*/ React.createElement("p", {
            className: "text-sm text-gray-500"
        }, "₹", item.price, " ", item.unit)), /*#__PURE__*/ React.createElement(Button, {
            variant: "ghost",
            size: "sm",
            onClick: ()=>removeItem(item.id),
            className: "text-red-600 hover:text-red-700 hover:bg-red-50"
        }, /*#__PURE__*/ React.createElement(Trash2, {
            className: "w-4 h-4"
        }))))))), /* Order Summary */ /*#__PURE__*/ React.createElement("div", {
        className: "space-y-6"
    }, /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, null, "Order Summary")), /*#__PURE__*/ React.createElement(CardContent, {
        className: "space-y-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between"
    }, /*#__PURE__*/ React.createElement("span", null, "Subtotal (", totalItems, " items)"), /*#__PURE__*/ React.createElement("span", null, "₹", totalAmount)), /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between"
    }, /*#__PURE__*/ React.createElement("span", null, "Delivery Fee"), /*#__PURE__*/ React.createElement("span", {
        className: deliveryFee === 0 ? "text-green-600" : ""
    }, deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`)), deliveryFee === 0 && /*#__PURE__*/ React.createElement("p", {
        className: "text-xs text-green-600"
    }, "Free delivery on orders above ₹500"), /*#__PURE__*/ React.createElement(Separator, null), /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between text-lg font-bold"
    }, /*#__PURE__*/ React.createElement("span", null, "Total"), /*#__PURE__*/ React.createElement("span", null, "₹", finalAmount)))), /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(Truck, {
        className: "w-5 h-5 mr-2"
    }), "Delivery Information")), /*#__PURE__*/ React.createElement(CardContent, {
        className: "space-y-3"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center text-sm text-gray-600"
    }, /*#__PURE__*/ React.createElement(Clock, {
        className: "w-4 h-4 mr-2"
    }), /*#__PURE__*/ React.createElement("span", null, "Estimated delivery: 2-4 hours")), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center text-sm text-gray-600"
    }, /*#__PURE__*/ React.createElement(MapPin, {
        className: "w-4 h-4 mr-2"
    }), /*#__PURE__*/ React.createElement("span", null, "Delivery to: Rajesh's Chaat Corner")))), /*#__PURE__*/ React.createElement(Button, {
        className: "w-full bg-gradient-to-r from-saffron-500 to-orange-500 hover:from-saffron-600 hover:to-orange-600 py-3",
        onClick: handleCheckout,
        disabled: isCheckingOut
    }, isCheckingOut ? /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("div", {
        className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
    }), "Processing...") : /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement(CreditCard, {
        className: "w-4 h-4 mr-2"
    }), "Proceed to Checkout - ₹", finalAmount))))));
}
