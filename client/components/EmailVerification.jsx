import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, RefreshCw, CheckCircle, AlertTriangle } from "lucide-react";
export default function EmailVerification({ onVerified }) {
    const { user, verifyEmail, resendEmailVerification, isLoading } = useAuth();
    const [verificationCode, setVerificationCode] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [countdown, setCountdown] = useState(0);
    useEffect(()=>{
        if (countdown > 0) {
            const timer = setTimeout(()=>setCountdown(countdown - 1), 1000);
            return ()=>clearTimeout(timer);
        }
    }, [
        countdown
    ]);
    const handleVerifyEmail = async ()=>{
        if (!verificationCode.trim()) return;
        setIsVerifying(true);
        const success = await verifyEmail(verificationCode);
        if (success) {
            setVerificationCode("");
            onVerified?.();
        }
        setIsVerifying(false);
    };
    const handleResendCode = async ()=>{
        setIsResending(true);
        const success = await resendEmailVerification();
        if (success) {
            setCountdown(60);
        }
        // 1 minute cooldown
        setIsResending(false);
    };
    const handleCodeChange = (e)=>{
        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
        setVerificationCode(value);
    };
    const handleKeyPress = (e)=>{
        if (e.key === "Enter" && verificationCode.length === 6) {
            handleVerifyEmail();
        }
    };
    if (!user) return null;
    return /*#__PURE__*/ React.createElement("div", {
        className: "min-h-screen bg-gradient-to-br from-orange-50 via-white to-emerald-50 flex items-center justify-center p-4"
    }, /*#__PURE__*/ React.createElement(Card, {
        className: "w-full max-w-md"
    }, /*#__PURE__*/ React.createElement(CardHeader, {
        className: "text-center"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-16 h-16 bg-gradient-to-r from-saffron-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4"
    }, /*#__PURE__*/ React.createElement(Mail, {
        className: "w-8 h-8 text-white"
    })), /*#__PURE__*/ React.createElement(CardTitle, {
        className: "text-2xl"
    }, "Verify Your Email"), /*#__PURE__*/ React.createElement(CardDescription, {
        className: "text-base"
    }, "We've sent a verification code to", /*#__PURE__*/ React.createElement("br", null), /*#__PURE__*/ React.createElement("strong", null, user.email))), /*#__PURE__*/ React.createElement(CardContent, {
        className: "space-y-6"
    }, /*#__PURE__*/ React.createElement(Alert, {
        className: "border-yellow-200 bg-yellow-50"
    }, /*#__PURE__*/ React.createElement(AlertTriangle, {
        className: "h-4 w-4 text-yellow-600"
    }), /*#__PURE__*/ React.createElement(AlertDescription, {
        className: "text-yellow-800"
    }, "Please verify your email to access all features of JugaduBazar")), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-4"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
        htmlFor: "verification-code",
        className: "block text-sm font-medium text-gray-700 mb-2"
    }, "Enter 6-digit verification code"), /*#__PURE__*/ React.createElement(Input, {
        id: "verification-code",
        type: "text",
        placeholder: "123456",
        value: verificationCode,
        onChange: handleCodeChange,
        onKeyPress: handleKeyPress,
        className: "text-center text-xl tracking-widest font-mono",
        maxLength: 6,
        disabled: isVerifying
    }), /*#__PURE__*/ React.createElement("p", {
        className: "text-xs text-gray-500 mt-1 text-center"
    }, "Enter the 6-digit code sent to your email")), /*#__PURE__*/ React.createElement(Button, {
        onClick: handleVerifyEmail,
        disabled: verificationCode.length !== 6 || isVerifying,
        className: "w-full bg-gradient-to-r from-saffron-500 to-orange-500 hover:from-saffron-600 hover:to-orange-600"
    }, isVerifying ? /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement(RefreshCw, {
        className: "w-4 h-4 mr-2 animate-spin"
    }), "Verifying...") : /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement(CheckCircle, {
        className: "w-4 h-4 mr-2"
    }), "Verify Email"))), /*#__PURE__*/ React.createElement("div", {
        className: "text-center space-y-3"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-600"
    }, "Didn't receive the code?"), /*#__PURE__*/ React.createElement(Button, {
        variant: "outline",
        onClick: handleResendCode,
        disabled: isResending || countdown > 0,
        className: "w-full"
    }, isResending ? /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement(RefreshCw, {
        className: "w-4 h-4 mr-2 animate-spin"
    }), "Sending...") : countdown > 0 ? `Resend in ${countdown}s` : /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement(Mail, {
        className: "w-4 h-4 mr-2"
    }), "Resend Code")), /*#__PURE__*/ React.createElement("div", {
        className: "pt-4 border-t border-gray-200"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-xs text-gray-500"
    }, "For demo purposes, enter any 6-digit number to verify"), /*#__PURE__*/ React.createElement("p", {
        className: "text-xs text-gray-400 mt-1"
    }, "Example: 123456 or 999999"))))));
}
