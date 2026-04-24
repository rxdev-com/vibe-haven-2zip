import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import EmailVerification from "./EmailVerification";
import { Loader2 } from "lucide-react";
export default function ProtectedRoute({ children, requiredRole }) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const location = useLocation();
    const [showEmailVerification, setShowEmailVerification] = useState(false);
    // Show loading spinner while checking authentication
    if (isLoading) {
        return /*#__PURE__*/ React.createElement("div", {
            className: "min-h-screen bg-gray-50 flex items-center justify-center"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "text-center"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-12 h-12 bg-gradient-to-r from-saffron-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4"
        }, /*#__PURE__*/ React.createElement(Loader2, {
            className: "w-6 h-6 text-white animate-spin"
        })), /*#__PURE__*/ React.createElement("h2", {
            className: "text-xl font-semibold text-gray-900 mb-2"
        }, "Loading..."), /*#__PURE__*/ React.createElement("p", {
            className: "text-gray-600"
        }, "Checking your authentication")));
    }
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return /*#__PURE__*/ React.createElement(Navigate, {
            to: "/login",
            state: {
                from: location
            },
            replace: true
        });
    }
    // Check role-specific access
    if (requiredRole && user?.role !== requiredRole) {
        // Redirect to appropriate dashboard if user has wrong role
        const redirectPath = user?.role === "vendor" ? "/vendor/dashboard" : "/supplier/dashboard";
        return /*#__PURE__*/ React.createElement(Navigate, {
            to: redirectPath,
            replace: true
        });
    }
    // Check if email verification is required
    if (user && !user.emailVerified && !showEmailVerification) {
        return /*#__PURE__*/ React.createElement(EmailVerification, {
            onVerified: ()=>setShowEmailVerification(false)
        });
    }
    return /*#__PURE__*/ React.createElement(React.Fragment, null, children);
}
