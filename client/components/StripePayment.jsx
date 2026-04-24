import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNotifications } from "@/contexts/NotificationContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { CreditCard, Lock, CheckCircle, Loader2, Shield, DollarSign } from "lucide-react";
export default function StripePayment({ isOpen, onClose, amount, items, onPaymentSuccess }) {
    const { addNotification } = useNotifications();
    const { t } = useLanguage();
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStep, setPaymentStep] = useState('details');
    const [cardDetails, setCardDetails] = useState({
        number: '',
        expiry: '',
        cvc: '',
        name: ''
    });
    const formatCardNumber = (value)=>{
        // Remove all non-digits
        const numbers = value.replace(/\D/g, '');
        // Add spaces every 4 digits
        return numbers.replace(/(\d{4})(?=\d)/g, '$1 ');
    };
    const formatExpiry = (value)=>{
        // Remove all non-digits
        const numbers = value.replace(/\D/g, '');
        // Add slash after 2 digits
        if (numbers.length >= 2) {
            return numbers.substring(0, 2) + '/' + numbers.substring(2, 4);
        }
        return numbers;
    };
    const handleCardNumberChange = (e)=>{
        const formatted = formatCardNumber(e.target.value);
        if (formatted.length <= 19) {
            // 16 digits + 3 spaces
            setCardDetails((prev)=>({
                    ...prev,
                    number: formatted
                }));
        }
    };
    const handleExpiryChange = (e)=>{
        const formatted = formatExpiry(e.target.value);
        if (formatted.length <= 5) {
            // MM/YY
            setCardDetails((prev)=>({
                    ...prev,
                    expiry: formatted
                }));
        }
    };
    const handleCvcChange = (e)=>{
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 4) {
            setCardDetails((prev)=>({
                    ...prev,
                    cvc: value
                }));
        }
    };
    const isFormValid = ()=>{
        return cardDetails.number.replace(/\s/g, '').length === 16 && cardDetails.expiry.length === 5 && cardDetails.cvc.length >= 3 && cardDetails.name.length > 0;
    };
    const processPayment = async ()=>{
        setIsProcessing(true);
        setPaymentStep('processing');
        try {
            // Simulate payment processing
            await new Promise((resolve)=>setTimeout(resolve, 3000));
            // Mock successful payment result
            const paymentResult = {
                id: `pi_${Math.random().toString(36).substr(2, 9)}`,
                status: 'succeeded',
                amount: amount * 100,
                // Convert to cents
                currency: 'inr',
                created: Math.floor(Date.now() / 1000),
                paymentMethod: `**** **** **** ${cardDetails.number.slice(-4)}`
            };
            setPaymentStep('success');
            // Notify parent component
            setTimeout(()=>{
                onPaymentSuccess(paymentResult);
                onClose();
                addNotification({
                    title: t("paymentSuccessful"),
                    message: t("orderConfirmed"),
                    type: "success",
                    icon: "💳"
                });
            }, 2000);
        } catch (error) {
            setPaymentStep('details');
            addNotification({
                title: t("paymentFailed"),
                message: t("paymentErrorMessage"),
                type: "error",
                icon: "❌"
            });
        } finally{
            setIsProcessing(false);
        }
    };
    const handleClose = ()=>{
        if (!isProcessing) {
            setPaymentStep('details');
            setCardDetails({
                number: '',
                expiry: '',
                cvc: '',
                name: ''
            });
            onClose();
        }
    };
    const renderPaymentForm = ()=>/*#__PURE__*/ React.createElement("div", {
            className: "space-y-6"
        }, /* Order Summary */ /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, {
            className: "pb-3"
        }, /*#__PURE__*/ React.createElement(CardTitle, {
            className: "text-lg"
        }, t('orderSummary'))), /*#__PURE__*/ React.createElement(CardContent, {
            className: "space-y-3"
        }, items.slice(0, 3).map((item, index)=>/*#__PURE__*/ React.createElement("div", {
                key: index,
                className: "flex justify-between items-center text-sm"
            }, /*#__PURE__*/ React.createElement("span", {
                className: "text-gray-600"
            }, item.name, " × ", item.quantity), /*#__PURE__*/ React.createElement("span", {
                className: "font-medium"
            }, "₹", (item.price * item.quantity).toLocaleString()))), items.length > 3 && /*#__PURE__*/ React.createElement("div", {
            className: "text-sm text-gray-500"
        }, t('andMoreItems', {
            count: items.length - 3
        })), /*#__PURE__*/ React.createElement("hr", {
            className: "my-2"
        }), /*#__PURE__*/ React.createElement("div", {
            className: "flex justify-between items-center font-semibold"
        }, /*#__PURE__*/ React.createElement("span", null, t('total')), /*#__PURE__*/ React.createElement("span", {
            className: "text-lg"
        }, "₹", amount.toLocaleString())))), /* Payment Form */ /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, {
            className: "pb-3"
        }, /*#__PURE__*/ React.createElement(CardTitle, {
            className: "text-lg flex items-center"
        }, /*#__PURE__*/ React.createElement(CreditCard, {
            className: "w-5 h-5 mr-2"
        }), t('paymentDetails')), /*#__PURE__*/ React.createElement(CardDescription, {
            className: "flex items-center text-green-600"
        }, /*#__PURE__*/ React.createElement(Shield, {
            className: "w-4 h-4 mr-1"
        }), t('securePayment'))), /*#__PURE__*/ React.createElement(CardContent, {
            className: "space-y-4"
        }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
            className: "block text-sm font-medium text-gray-700 mb-2"
        }, t('cardNumber')), /*#__PURE__*/ React.createElement(Input, {
            placeholder: "1234 5678 9012 3456",
            value: cardDetails.number,
            onChange: handleCardNumberChange,
            className: "font-mono"
        })), /*#__PURE__*/ React.createElement("div", {
            className: "grid grid-cols-2 gap-4"
        }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
            className: "block text-sm font-medium text-gray-700 mb-2"
        }, t('expiryDate')), /*#__PURE__*/ React.createElement(Input, {
            placeholder: "MM/YY",
            value: cardDetails.expiry,
            onChange: handleExpiryChange,
            className: "font-mono"
        })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
            className: "block text-sm font-medium text-gray-700 mb-2"
        }, t('cvc')), /*#__PURE__*/ React.createElement(Input, {
            placeholder: "123",
            value: cardDetails.cvc,
            onChange: handleCvcChange,
            className: "font-mono"
        }))), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
            className: "block text-sm font-medium text-gray-700 mb-2"
        }, t('cardholderName')), /*#__PURE__*/ React.createElement(Input, {
            placeholder: t('cardholderNamePlaceholder'),
            value: cardDetails.name,
            onChange: (e)=>setCardDetails((prev)=>({
                        ...prev,
                        name: e.target.value
                    }))
        })), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center space-x-2 text-xs text-gray-500"
        }, /*#__PURE__*/ React.createElement(Lock, {
            className: "w-3 h-3"
        }), /*#__PURE__*/ React.createElement("span", null, t('paymentSecurityNotice'))))));
    const renderProcessing = ()=>/*#__PURE__*/ React.createElement("div", {
            className: "text-center py-8"
        }, /*#__PURE__*/ React.createElement(Loader2, {
            className: "w-16 h-16 mx-auto mb-4 animate-spin text-blue-500"
        }), /*#__PURE__*/ React.createElement("h3", {
            className: "text-lg font-semibold mb-2"
        }, t('processingPayment')), /*#__PURE__*/ React.createElement("p", {
            className: "text-gray-600"
        }, t('pleaseWait')));
    const renderSuccess = ()=>/*#__PURE__*/ React.createElement("div", {
            className: "text-center py-8"
        }, /*#__PURE__*/ React.createElement(CheckCircle, {
            className: "w-16 h-16 mx-auto mb-4 text-green-500"
        }), /*#__PURE__*/ React.createElement("h3", {
            className: "text-lg font-semibold mb-2"
        }, t('paymentSuccessful')), /*#__PURE__*/ React.createElement("p", {
            className: "text-gray-600"
        }, t('orderBeingPrepared')));
    return /*#__PURE__*/ React.createElement(Dialog, {
        open: isOpen,
        onOpenChange: handleClose
    }, /*#__PURE__*/ React.createElement(DialogContent, {
        className: "sm:max-w-md max-h-[90vh] overflow-y-auto"
    }, /*#__PURE__*/ React.createElement(DialogHeader, null, /*#__PURE__*/ React.createElement(DialogTitle, {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(DollarSign, {
        className: "w-5 h-5 mr-2"
    }), paymentStep === 'details' && t('completePayment'), paymentStep === 'processing' && t('processingPayment'), paymentStep === 'success' && t('paymentSuccessful')), paymentStep === 'details' && /*#__PURE__*/ React.createElement(DialogDescription, null, t('securePaymentDescription'))), paymentStep === 'details' && renderPaymentForm(), paymentStep === 'processing' && renderProcessing(), paymentStep === 'success' && renderSuccess(), paymentStep === 'details' && /*#__PURE__*/ React.createElement(DialogFooter, {
        className: "flex gap-2"
    }, /*#__PURE__*/ React.createElement(Button, {
        variant: "outline",
        onClick: handleClose,
        disabled: isProcessing
    }, t('cancel')), /*#__PURE__*/ React.createElement(Button, {
        onClick: processPayment,
        disabled: !isFormValid() || isProcessing,
        className: "bg-green-600 hover:bg-green-700"
    }, /*#__PURE__*/ React.createElement(CreditCard, {
        className: "w-4 h-4 mr-2"
    }), t('payAmount', {
        amount: `₹${amount.toLocaleString()}`
    })))));
}
