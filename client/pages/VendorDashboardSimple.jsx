import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { mockMaterials } from "@/lib/mockData";
export default function VendorDashboardSimple() {
    return /*#__PURE__*/ React.createElement("div", {
        className: "min-h-screen bg-gray-50"
    }, /* Header */ /*#__PURE__*/ React.createElement("header", {
        className: "bg-white border-b sticky top-0 z-50"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-center h-16"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-8 h-8 bg-gradient-to-r from-saffron-500 to-emerald-500 rounded-lg flex items-center justify-center"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-white font-bold text-sm"
    }, "JB")), /*#__PURE__*/ React.createElement("span", {
        className: "text-xl font-bold bg-gradient-to-r from-saffron-600 to-emerald-600 bg-clip-text text-transparent"
    }, "JugaduBazar")), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-4"
    }, /*#__PURE__*/ React.createElement(Link, {
        to: "/cart"
    }, /*#__PURE__*/ React.createElement(Button, {
        variant: "ghost",
        size: "sm"
    }, "Cart")), /*#__PURE__*/ React.createElement(Link, {
        to: "/vendor/profile"
    }, /*#__PURE__*/ React.createElement(Button, {
        variant: "ghost",
        size: "sm"
    }, "Profile")))))), /*#__PURE__*/ React.createElement("div", {
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    }, /* Welcome Section */ /*#__PURE__*/ React.createElement("div", {
        className: "mb-8"
    }, /*#__PURE__*/ React.createElement("h1", {
        className: "text-3xl font-bold text-gray-900 mb-2"
    }, "Welcome back, Rajesh!"), /*#__PURE__*/ React.createElement("p", {
        className: "text-gray-600"
    }, "Find the best raw materials for your street food business")), /* Development Mode Notice */ /*#__PURE__*/ React.createElement("div", {
        className: "mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-blue-800"
    }, /*#__PURE__*/ React.createElement("strong", null, "Development Mode:"), " Database not connected. Using mock data.")), /* Materials Grid */ /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    }, mockMaterials.map((material)=>/*#__PURE__*/ React.createElement("div", {
            key: material.id,
            className: "bg-white rounded-lg border p-6 hover:shadow-lg transition-shadow"
        }, /*#__PURE__*/ React.createElement("h3", {
            className: "text-lg font-semibold text-gray-900 mb-2"
        }, material.name), /*#__PURE__*/ React.createElement("p", {
            className: "text-gray-600 text-sm mb-2"
        }, material.supplier.businessName), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center justify-between"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "text-xl font-bold text-gray-900"
        }, "₹", material.price), /*#__PURE__*/ React.createElement("span", {
            className: "text-sm text-gray-500"
        }, material.unit)), /*#__PURE__*/ React.createElement("div", {
            className: "mt-4"
        }, /*#__PURE__*/ React.createElement(Button, {
            className: "w-full bg-gradient-to-r from-saffron-500 to-orange-500 hover:from-saffron-600 hover:to-orange-600"
        }, "Add to Cart")))))));
}
