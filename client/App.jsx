import React from "react";
import "./global.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotificationProvider } from "./contexts/NotificationContext";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VendorDashboard from "./pages/VendorDashboard";
import SupplierDashboard from "./pages/SupplierDashboard";
import VendorProfile from "./pages/VendorProfile";
import SupplierProfile from "./pages/SupplierProfile";
import SupplierInventory from "./pages/SupplierInventory";
import SupplierPendingOrders from "./pages/SupplierPendingOrders";
import OrderTracking from "./pages/OrderTracking";
import InTransit from "./pages/InTransit";
import Rating from "./pages/Rating";
import SavedItems from "./pages/SavedItems";
import MaterialDetails from "./pages/MaterialDetails";
import VendorMarketplace from "./pages/VendorMarketplace";
import VendorSellItems from "./pages/VendorSellItems";
import VendorMyListings from "./pages/VendorMyListings";
import VendorRevenue from "./pages/VendorRevenue";
import VendorActiveOrders from "./pages/VendorActiveOrders";
import OrderTrackingLive from "./pages/OrderTrackingLive";
import CartWithInstructions from "./pages/CartWithInstructions";
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound";
const queryClient = new QueryClient();
const App = ()=>/*#__PURE__*/ React.createElement(QueryClientProvider, {
        client: queryClient
    }, /*#__PURE__*/ React.createElement(TooltipProvider, null, /*#__PURE__*/ React.createElement(LanguageProvider, null, /*#__PURE__*/ React.createElement(AuthProvider, null, /*#__PURE__*/ React.createElement(NotificationProvider, null, /*#__PURE__*/ React.createElement(CartProvider, null, /*#__PURE__*/ React.createElement(Toaster, null), /*#__PURE__*/ React.createElement(Sonner, null), /*#__PURE__*/ React.createElement(BrowserRouter, null, /*#__PURE__*/ React.createElement(Routes, null, /*#__PURE__*/ React.createElement(Route, {
        path: "/",
        element: /*#__PURE__*/ React.createElement(Index, null)
    }), /*#__PURE__*/ React.createElement(Route, {
        path: "/login",
        element: /*#__PURE__*/ React.createElement(Login, null)
    }), /*#__PURE__*/ React.createElement(Route, {
        path: "/register",
        element: /*#__PURE__*/ React.createElement(Register, null)
    }), /* Protected Vendor Routes */ /*#__PURE__*/ React.createElement(Route, {
        path: "/vendor/dashboard",
        element: /*#__PURE__*/ React.createElement(ProtectedRoute, {
            requiredRole: "vendor"
        }, /*#__PURE__*/ React.createElement(VendorDashboard, null))
    }), /*#__PURE__*/ React.createElement(Route, {
        path: "/vendor/profile",
        element: /*#__PURE__*/ React.createElement(ProtectedRoute, {
            requiredRole: "vendor"
        }, /*#__PURE__*/ React.createElement(VendorProfile, null))
    }), /*#__PURE__*/ React.createElement(Route, {
        path: "/vendor/orders",
        element: /*#__PURE__*/ React.createElement(ProtectedRoute, {
            requiredRole: "vendor"
        }, /*#__PURE__*/ React.createElement(OrderTracking, null))
    }), /*#__PURE__*/ React.createElement(Route, {
        path: "/vendor/active-orders",
        element: /*#__PURE__*/ React.createElement(ProtectedRoute, {
            requiredRole: "vendor"
        }, /*#__PURE__*/ React.createElement(VendorActiveOrders, null))
    }), /*#__PURE__*/ React.createElement(Route, {
        path: "/vendor/in-transit",
        element: /*#__PURE__*/ React.createElement(ProtectedRoute, {
            requiredRole: "vendor"
        }, /*#__PURE__*/ React.createElement(InTransit, null))
    }), /*#__PURE__*/ React.createElement(Route, {
        path: "/vendor/rating",
        element: /*#__PURE__*/ React.createElement(ProtectedRoute, {
            requiredRole: "vendor"
        }, /*#__PURE__*/ React.createElement(Rating, null))
    }), /*#__PURE__*/ React.createElement(Route, {
        path: "/vendor/saved-items",
        element: /*#__PURE__*/ React.createElement(ProtectedRoute, {
            requiredRole: "vendor"
        }, /*#__PURE__*/ React.createElement(SavedItems, null))
    }), /*#__PURE__*/ React.createElement(Route, {
        path: "/material/:id",
        element: /*#__PURE__*/ React.createElement(ProtectedRoute, {
            requiredRole: "vendor"
        }, /*#__PURE__*/ React.createElement(MaterialDetails, null))
    }), /*#__PURE__*/ React.createElement(Route, {
        path: "/cart",
        element: /*#__PURE__*/ React.createElement(ProtectedRoute, {
            requiredRole: "vendor"
        }, /*#__PURE__*/ React.createElement(CartWithInstructions, null))
    }), /*#__PURE__*/ React.createElement(Route, {
        path: "/track-order/:orderId",
        element: /*#__PURE__*/ React.createElement(ProtectedRoute, {
            requiredRole: "vendor"
        }, /*#__PURE__*/ React.createElement(OrderTrackingLive, null))
    }), /*#__PURE__*/ React.createElement(Route, {
        path: "/vendor/marketplace",
        element: /*#__PURE__*/ React.createElement(ProtectedRoute, {
            requiredRole: "vendor"
        }, /*#__PURE__*/ React.createElement(VendorMarketplace, null))
    }), /*#__PURE__*/ React.createElement(Route, {
        path: "/vendor/sell-items",
        element: /*#__PURE__*/ React.createElement(ProtectedRoute, {
            requiredRole: "vendor"
        }, /*#__PURE__*/ React.createElement(VendorSellItems, null))
    }), /*#__PURE__*/ React.createElement(Route, {
        path: "/vendor/my-listings",
        element: /*#__PURE__*/ React.createElement(ProtectedRoute, {
            requiredRole: "vendor"
        }, /*#__PURE__*/ React.createElement(VendorMyListings, null))
    }), /*#__PURE__*/ React.createElement(Route, {
        path: "/vendor/revenue",
        element: /*#__PURE__*/ React.createElement(ProtectedRoute, {
            requiredRole: "vendor"
        }, /*#__PURE__*/ React.createElement(VendorRevenue, null))
    }), /* Protected Supplier Routes */ /*#__PURE__*/ React.createElement(Route, {
        path: "/supplier/dashboard",
        element: /*#__PURE__*/ React.createElement(ProtectedRoute, {
            requiredRole: "supplier"
        }, /*#__PURE__*/ React.createElement(SupplierDashboard, null))
    }), /*#__PURE__*/ React.createElement(Route, {
        path: "/supplier",
        element: /*#__PURE__*/ React.createElement(ProtectedRoute, {
            requiredRole: "supplier"
        }, /*#__PURE__*/ React.createElement(SupplierDashboard, null))
    }), /*#__PURE__*/ React.createElement(Route, {
        path: "/supplier/profile",
        element: /*#__PURE__*/ React.createElement(ProtectedRoute, {
            requiredRole: "supplier"
        }, /*#__PURE__*/ React.createElement(SupplierProfile, null))
    }), /*#__PURE__*/ React.createElement(Route, {
        path: "/supplier/inventory",
        element: /*#__PURE__*/ React.createElement(ProtectedRoute, {
            requiredRole: "supplier"
        }, /*#__PURE__*/ React.createElement(SupplierInventory, null))
    }), /*#__PURE__*/ React.createElement(Route, {
        path: "/supplier/pending-orders",
        element: /*#__PURE__*/ React.createElement(ProtectedRoute, {
            requiredRole: "supplier"
        }, /*#__PURE__*/ React.createElement(SupplierPendingOrders, null))
    }), /*#__PURE__*/ React.createElement(Route, {
        path: "/supplier/revenue",
        element: /*#__PURE__*/ React.createElement(ProtectedRoute, {
            requiredRole: "supplier"
        }, /*#__PURE__*/ React.createElement(Placeholder, {
            title: "Revenue Analytics",
            description: "View your monthly revenue and financial analytics",
            backTo: "/supplier/dashboard",
            backLabel: "Back to Dashboard"
        }))
    }), /*#__PURE__*/ React.createElement(Route, {
        path: "/supplier/completed-orders",
        element: /*#__PURE__*/ React.createElement(ProtectedRoute, {
            requiredRole: "supplier"
        }, /*#__PURE__*/ React.createElement(Placeholder, {
            title: "Completed Orders",
            description: "View all your completed orders and delivery history",
            backTo: "/supplier/dashboard",
            backLabel: "Back to Dashboard"
        }))
    }), /*#__PURE__*/ React.createElement(Route, {
        path: "/supplier/analytics",
        element: /*#__PURE__*/ React.createElement(ProtectedRoute, {
            requiredRole: "supplier"
        }, /*#__PURE__*/ React.createElement(Placeholder, {
            title: "Analytics & Reports",
            description: "View detailed analytics and business reports",
            backTo: "/supplier/dashboard",
            backLabel: "Back to Dashboard"
        }))
    }), /* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */ /*#__PURE__*/ React.createElement(Route, {
        path: "*",
        element: /*#__PURE__*/ React.createElement(NotFound, null)
    })))))))));
export default App;
