import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import NotificationPanel from "@/components/NotificationPanel";
import ProfilePhoto from "@/components/ProfilePhoto";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Calendar, Target, BarChart3, PieChart, Download } from "lucide-react";
// Mock revenue data
const mockRevenueData = {
    currentMonth: {
        revenue: 125000,
        orders: 84,
        growth: 15.3,
        avgOrderValue: 1488
    },
    lastMonth: {
        revenue: 108500,
        orders: 73,
        growth: 8.7,
        avgOrderValue: 1486
    },
    weeklyData: [
        {
            week: "Week 1",
            revenue: 28000,
            orders: 18
        },
        {
            week: "Week 2",
            revenue: 32000,
            orders: 21
        },
        {
            week: "Week 3",
            revenue: 35000,
            orders: 24
        },
        {
            week: "Week 4",
            revenue: 30000,
            orders: 21
        }
    ],
    topProducts: [
        {
            name: "Premium Basmati Rice",
            revenue: 45000,
            units: 150,
            percentage: 36
        },
        {
            name: "Organic Spice Mix",
            revenue: 28000,
            units: 112,
            percentage: 22
        },
        {
            name: "Refined Oil",
            revenue: 22000,
            units: 88,
            percentage: 18
        },
        {
            name: "Wheat Flour",
            revenue: 18000,
            units: 90,
            percentage: 14
        },
        {
            name: "Other Items",
            revenue: 12000,
            units: 60,
            percentage: 10
        }
    ],
    monthlyTrend: [
        {
            month: "Jan",
            revenue: 95000,
            orders: 58
        },
        {
            month: "Feb",
            revenue: 102000,
            orders: 65
        },
        {
            month: "Mar",
            revenue: 108500,
            orders: 73
        },
        {
            month: "Apr",
            revenue: 125000,
            orders: 84
        }
    ],
    paymentMethods: [
        {
            method: "UPI",
            amount: 75000,
            percentage: 60
        },
        {
            method: "Bank Transfer",
            amount: 37500,
            percentage: 30
        },
        {
            method: "Cash on Delivery",
            amount: 12500,
            percentage: 10
        }
    ]
};
export default function VendorRevenue() {
    const { user, logout } = useAuth();
    const { t } = useLanguage();
    const [profileImage, setProfileImage] = useState("");
    const [selectedPeriod, setSelectedPeriod] = useState("current_month");
    useEffect(()=>{
        const savedImage = localStorage.getItem("profileImage");
        if (savedImage) {
            setProfileImage(savedImage);
        }
    }, []);
    const formatCurrency = (amount)=>{
        return `₹${amount.toLocaleString()}`;
    };
    const getGrowthColor = (growth)=>{
        return growth >= 0 ? "text-green-600" : "text-red-600";
    };
    const getGrowthIcon = (growth)=>{
        return growth >= 0 ? /*#__PURE__*/ React.createElement(TrendingUp, {
            className: "w-4 h-4"
        }) : /*#__PURE__*/ React.createElement(TrendingDown, {
            className: "w-4 h-4"
        });
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
        className: "bg-blue-100 text-blue-700"
    }, "Revenue Analytics")), /*#__PURE__*/ React.createElement("div", {
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
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    }, /* Header with Back Button */ /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between mb-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-4"
    }, /*#__PURE__*/ React.createElement(Link, {
        to: "/vendor/dashboard"
    }, /*#__PURE__*/ React.createElement(Button, {
        variant: "outline",
        size: "sm"
    }, /*#__PURE__*/ React.createElement(ArrowLeft, {
        className: "w-4 h-4 mr-2"
    }), t('backToDashboard'))), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h1", {
        className: "text-3xl font-bold text-gray-900"
    }, "Revenue Analytics"), /*#__PURE__*/ React.createElement("p", {
        className: "text-gray-600"
    }, "Track your business performance and financial insights"))), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-4"
    }, /*#__PURE__*/ React.createElement(Select, {
        value: selectedPeriod,
        onValueChange: setSelectedPeriod
    }, /*#__PURE__*/ React.createElement(SelectTrigger, {
        className: "w-48"
    }, /*#__PURE__*/ React.createElement(Calendar, {
        className: "w-4 h-4 mr-2"
    }), /*#__PURE__*/ React.createElement(SelectValue, null)), /*#__PURE__*/ React.createElement(SelectContent, null, /*#__PURE__*/ React.createElement(SelectItem, {
        value: "current_month"
    }, "Current Month"), /*#__PURE__*/ React.createElement(SelectItem, {
        value: "last_month"
    }, "Last Month"), /*#__PURE__*/ React.createElement(SelectItem, {
        value: "quarter"
    }, "This Quarter"), /*#__PURE__*/ React.createElement(SelectItem, {
        value: "year"
    }, "This Year"))), /*#__PURE__*/ React.createElement(Button, {
        className: "bg-green-600 hover:bg-green-700"
    }, /*#__PURE__*/ React.createElement(Download, {
        className: "w-4 h-4 mr-2"
    }), "Export Report"))), /* Key Metrics */ /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
    }, /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-600"
    }, "Total Revenue"), /*#__PURE__*/ React.createElement("p", {
        className: "text-3xl font-bold text-gray-900"
    }, formatCurrency(mockRevenueData.currentMonth.revenue)), /*#__PURE__*/ React.createElement("div", {
        className: `flex items-center mt-2 ${getGrowthColor(mockRevenueData.currentMonth.growth)}`
    }, getGrowthIcon(mockRevenueData.currentMonth.growth), /*#__PURE__*/ React.createElement("span", {
        className: "text-sm font-medium ml-1"
    }, "+", mockRevenueData.currentMonth.growth, "% from last month"))), /*#__PURE__*/ React.createElement("div", {
        className: "w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"
    }, /*#__PURE__*/ React.createElement(DollarSign, {
        className: "w-6 h-6 text-green-600"
    }))))), /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-600"
    }, "Total Orders"), /*#__PURE__*/ React.createElement("p", {
        className: "text-3xl font-bold text-gray-900"
    }, mockRevenueData.currentMonth.orders), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center mt-2 text-green-600"
    }, /*#__PURE__*/ React.createElement(TrendingUp, {
        className: "w-4 h-4"
    }), /*#__PURE__*/ React.createElement("span", {
        className: "text-sm font-medium ml-1"
    }, "+", mockRevenueData.currentMonth.orders - mockRevenueData.lastMonth.orders, " orders"))), /*#__PURE__*/ React.createElement("div", {
        className: "w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
    }, /*#__PURE__*/ React.createElement(ShoppingCart, {
        className: "w-6 h-6 text-blue-600"
    }))))), /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-600"
    }, "Avg Order Value"), /*#__PURE__*/ React.createElement("p", {
        className: "text-3xl font-bold text-gray-900"
    }, formatCurrency(mockRevenueData.currentMonth.avgOrderValue)), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center mt-2 text-green-600"
    }, /*#__PURE__*/ React.createElement(TrendingUp, {
        className: "w-4 h-4"
    }), /*#__PURE__*/ React.createElement("span", {
        className: "text-sm font-medium ml-1"
    }, "+₹", mockRevenueData.currentMonth.avgOrderValue - mockRevenueData.lastMonth.avgOrderValue))), /*#__PURE__*/ React.createElement("div", {
        className: "w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"
    }, /*#__PURE__*/ React.createElement(Target, {
        className: "w-6 h-6 text-purple-600"
    }))))), /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-600"
    }, "Growth Rate"), /*#__PURE__*/ React.createElement("p", {
        className: "text-3xl font-bold text-gray-900"
    }, "+", mockRevenueData.currentMonth.growth, "%"), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center mt-2 text-green-600"
    }, /*#__PURE__*/ React.createElement(TrendingUp, {
        className: "w-4 h-4"
    }), /*#__PURE__*/ React.createElement("span", {
        className: "text-sm font-medium ml-1"
    }, "vs last month"))), /*#__PURE__*/ React.createElement("div", {
        className: "w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center"
    }, /*#__PURE__*/ React.createElement(BarChart3, {
        className: "w-6 h-6 text-orange-600"
    })))))), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
    }, /* Weekly Revenue Chart */ /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(BarChart3, {
        className: "w-5 h-5 mr-2"
    }), "Weekly Revenue"), /*#__PURE__*/ React.createElement(CardDescription, null, "Revenue breakdown by week")), /*#__PURE__*/ React.createElement(CardContent, null, /*#__PURE__*/ React.createElement("div", {
        className: "space-y-4"
    }, mockRevenueData.weeklyData.map((week, index)=>/*#__PURE__*/ React.createElement("div", {
            key: week.week,
            className: "flex items-center justify-between"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center space-x-3"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-3 h-3 bg-green-500 rounded-full"
        }), /*#__PURE__*/ React.createElement("span", {
            className: "font-medium"
        }, week.week)), /*#__PURE__*/ React.createElement("div", {
            className: "text-right"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "font-semibold"
        }, formatCurrency(week.revenue)), /*#__PURE__*/ React.createElement("div", {
            className: "text-sm text-gray-500"
        }, week.orders, " orders"))))))), /* Top Products */ /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(PieChart, {
        className: "w-5 h-5 mr-2"
    }), "Top Products"), /*#__PURE__*/ React.createElement(CardDescription, null, "Best performing products by revenue")), /*#__PURE__*/ React.createElement(CardContent, null, /*#__PURE__*/ React.createElement("div", {
        className: "space-y-4"
    }, mockRevenueData.topProducts.map((product, index)=>/*#__PURE__*/ React.createElement("div", {
            key: product.name,
            className: "flex items-center justify-between"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center space-x-3"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "text-white font-semibold text-xs"
        }, index + 1)), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
            className: "font-medium"
        }, product.name), /*#__PURE__*/ React.createElement("div", {
            className: "text-sm text-gray-500"
        }, product.units, " units sold"))), /*#__PURE__*/ React.createElement("div", {
            className: "text-right"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "font-semibold"
        }, formatCurrency(product.revenue)), /*#__PURE__*/ React.createElement("div", {
            className: "text-sm text-gray-500"
        }, product.percentage, "%")))))))), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 lg:grid-cols-2 gap-8"
    }, /* Monthly Trend */ /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, null, "Monthly Trend"), /*#__PURE__*/ React.createElement(CardDescription, null, "Revenue growth over the last 4 months")), /*#__PURE__*/ React.createElement(CardContent, null, /*#__PURE__*/ React.createElement("div", {
        className: "space-y-4"
    }, mockRevenueData.monthlyTrend.map((month)=>/*#__PURE__*/ React.createElement("div", {
            key: month.month,
            className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "font-medium"
        }, month.month), /*#__PURE__*/ React.createElement("div", {
            className: "text-right"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "font-semibold"
        }, formatCurrency(month.revenue)), /*#__PURE__*/ React.createElement("div", {
            className: "text-sm text-gray-500"
        }, month.orders, " orders"))))))), /* Payment Methods */ /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, null, "Payment Methods"), /*#__PURE__*/ React.createElement(CardDescription, null, "Revenue breakdown by payment method")), /*#__PURE__*/ React.createElement(CardContent, null, /*#__PURE__*/ React.createElement("div", {
        className: "space-y-4"
    }, mockRevenueData.paymentMethods.map((method)=>/*#__PURE__*/ React.createElement("div", {
            key: method.method,
            className: "flex items-center justify-between"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center space-x-3"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-3 h-3 bg-blue-500 rounded-full"
        }), /*#__PURE__*/ React.createElement("span", {
            className: "font-medium"
        }, method.method)), /*#__PURE__*/ React.createElement("div", {
            className: "text-right"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "font-semibold"
        }, formatCurrency(method.amount)), /*#__PURE__*/ React.createElement("div", {
            className: "text-sm text-gray-500"
        }, method.percentage, "%"))))))))));
}
