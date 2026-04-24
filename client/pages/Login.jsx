import React, { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Store, ArrowLeft } from "lucide-react";
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();
    // Redirect if already logged in
    if (isAuthenticated) {
        const from = location.state?.from?.pathname || "/vendor/dashboard";
        return /*#__PURE__*/ React.createElement(Navigate, {
            to: from,
            replace: true
        });
    }
    const handleLogin = async (role)=>{
        if (!email || !password) {
            return;
        }
        const success = await login(email, password, role);
        if (success) {
            const redirectPath = role === "vendor" ? "/vendor/dashboard" : "/supplier/dashboard";
            window.location.href = redirectPath;
        }
    };
    return /*#__PURE__*/ React.createElement("div", {
        className: "min-h-screen bg-gradient-to-br from-orange-50 via-white to-emerald-50 flex items-center justify-center p-4"
    }, /* Back to home */ /*#__PURE__*/ React.createElement(Link, {
        to: "/",
        className: "absolute top-6 left-6 flex items-center text-gray-600 hover:text-saffron-600 transition-colors"
    }, /*#__PURE__*/ React.createElement(ArrowLeft, {
        className: "w-4 h-4 mr-2"
    }), "Back to Home"), /*#__PURE__*/ React.createElement("div", {
        className: "w-full max-w-md"
    }, /* Logo */ /*#__PURE__*/ React.createElement("div", {
        className: "text-center mb-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-center space-x-2 mb-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-10 h-10 bg-gradient-to-r from-saffron-500 to-emerald-500 rounded-lg flex items-center justify-center"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-white font-bold"
    }, "JB")), /*#__PURE__*/ React.createElement("span", {
        className: "text-2xl font-bold bg-gradient-to-r from-saffron-600 to-emerald-600 bg-clip-text text-transparent"
    }, "JugaduBazar")), /*#__PURE__*/ React.createElement("h1", {
        className: "text-2xl font-bold text-gray-900 mb-2"
    }, "Welcome Back"), /*#__PURE__*/ React.createElement("p", {
        className: "text-gray-600"
    }, "Sign in to your account")), /*#__PURE__*/ React.createElement(Tabs, {
        defaultValue: "vendor",
        className: "w-full"
    }, /*#__PURE__*/ React.createElement(TabsList, {
        className: "grid w-full grid-cols-2 mb-6"
    }, /*#__PURE__*/ React.createElement(TabsTrigger, {
        value: "vendor",
        className: "flex items-center space-x-2"
    }, /*#__PURE__*/ React.createElement(ShoppingCart, {
        className: "w-4 h-4"
    }), /*#__PURE__*/ React.createElement("span", null, "Vendor")), /*#__PURE__*/ React.createElement(TabsTrigger, {
        value: "supplier",
        className: "flex items-center space-x-2"
    }, /*#__PURE__*/ React.createElement(Store, {
        className: "w-4 h-4"
    }), /*#__PURE__*/ React.createElement("span", null, "Supplier"))), /*#__PURE__*/ React.createElement(TabsContent, {
        value: "vendor"
    }, /*#__PURE__*/ React.createElement(Card, {
        className: "border-2 border-saffron-100"
    }, /*#__PURE__*/ React.createElement(CardHeader, {
        className: "text-center"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-12 h-12 bg-gradient-to-r from-saffron-500 to-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4"
    }, /*#__PURE__*/ React.createElement(ShoppingCart, {
        className: "w-6 h-6 text-white"
    })), /*#__PURE__*/ React.createElement(CardTitle, null, "Vendor Login"), /*#__PURE__*/ React.createElement(CardDescription, null, "Access your vendor dashboard to browse materials and manage orders")), /*#__PURE__*/ React.createElement(CardContent, {
        className: "space-y-4"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement(Label, {
        htmlFor: "vendor-email"
    }, "Email"), /*#__PURE__*/ React.createElement(Input, {
        id: "vendor-email",
        type: "email",
        placeholder: "vendor@example.com",
        value: email,
        onChange: (e)=>setEmail(e.target.value)
    })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement(Label, {
        htmlFor: "vendor-password"
    }, "Password"), /*#__PURE__*/ React.createElement(Input, {
        id: "vendor-password",
        type: "password",
        placeholder: "Enter your password",
        value: password,
        onChange: (e)=>setPassword(e.target.value)
    })), /*#__PURE__*/ React.createElement(Button, {
        className: "w-full bg-gradient-to-r from-saffron-500 to-orange-500 hover:from-saffron-600 hover:to-orange-600",
        onClick: ()=>handleLogin("vendor"),
        disabled: isLoading || !email || !password
    }, isLoading ? "Signing in..." : "Sign in as Vendor")))), /*#__PURE__*/ React.createElement(TabsContent, {
        value: "supplier"
    }, /*#__PURE__*/ React.createElement(Card, {
        className: "border-2 border-emerald-100"
    }, /*#__PURE__*/ React.createElement(CardHeader, {
        className: "text-center"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center mx-auto mb-4"
    }, /*#__PURE__*/ React.createElement(Store, {
        className: "w-6 h-6 text-white"
    })), /*#__PURE__*/ React.createElement(CardTitle, null, "Supplier Login"), /*#__PURE__*/ React.createElement(CardDescription, null, "Access your supplier dashboard to manage inventory and orders")), /*#__PURE__*/ React.createElement(CardContent, {
        className: "space-y-4"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement(Label, {
        htmlFor: "supplier-email"
    }, "Email"), /*#__PURE__*/ React.createElement(Input, {
        id: "supplier-email",
        type: "email",
        placeholder: "supplier@example.com",
        value: email,
        onChange: (e)=>setEmail(e.target.value)
    })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement(Label, {
        htmlFor: "supplier-password"
    }, "Password"), /*#__PURE__*/ React.createElement(Input, {
        id: "supplier-password",
        type: "password",
        placeholder: "Enter your password",
        value: password,
        onChange: (e)=>setPassword(e.target.value)
    })), /*#__PURE__*/ React.createElement(Button, {
        className: "w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600",
        onClick: ()=>handleLogin("supplier"),
        disabled: isLoading || !email || !password
    }, isLoading ? "Signing in..." : "Sign in as Supplier"))))), /* Demo Credentials */ /*#__PURE__*/ React.createElement("div", {
        className: "bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6"
    }, /*#__PURE__*/ React.createElement("h4", {
        className: "text-sm font-medium text-blue-900 mb-2"
    }, "Demo Credentials"), /*#__PURE__*/ React.createElement("div", {
        className: "text-xs text-blue-700 space-y-1"
    }, /*#__PURE__*/ React.createElement("p", null, /*#__PURE__*/ React.createElement("strong", null, "Vendor:"), " vendor@example.com / vendor123"), /*#__PURE__*/ React.createElement("p", null, /*#__PURE__*/ React.createElement("strong", null, "Supplier:"), " supplier@example.com / supplier123"), /*#__PURE__*/ React.createElement("p", null, /*#__PURE__*/ React.createElement("strong", null, "Demo:"), " demo@jugadubazar.com / demo123"))), /*#__PURE__*/ React.createElement("div", {
        className: "text-center mt-6"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-600"
    }, "Don't have an account?", " ", /*#__PURE__*/ React.createElement(Link, {
        to: "/register",
        className: "text-saffron-600 hover:text-saffron-700 font-medium"
    }, "Sign up here")))));
}
