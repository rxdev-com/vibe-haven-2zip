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
import VerifyEmail from "./pages/VerifyEmail";
import VendorDashboard from "./pages/VendorDashboard";
import SupplierDashboard from "./pages/SupplierDashboard";
import VendorProfile from "./pages/VendorProfile";
import SupplierProfile from "./pages/SupplierProfile";
import SupplierInventory from "./pages/SupplierInventory";
import SupplierPendingOrders from "./pages/SupplierPendingOrders";
import SupplierNotifications from "./pages/SupplierNotifications";
import OrderTracking from "./pages/OrderTracking";
import InTransit from "./pages/InTransit";
import Rating from "./pages/Rating";
import RatingsReviews from "./pages/RatingsReviews";
import SavedItems from "./pages/SavedItems";
import MaterialDetails from "./pages/MaterialDetails";
import VendorMarketplace from "./pages/VendorMarketplace";
import VendorMarketAnalysis from "./pages/VendorMarketAnalysis";
import VendorSellItems from "./pages/VendorSellItems";
import VendorMyListings from "./pages/VendorMyListings";
import VendorRevenue from "./pages/VendorRevenue";
import VendorActiveOrders from "./pages/VendorActiveOrders";
import OrderTrackingLive from "./pages/OrderTrackingLive";
import CartWithInstructions from "./pages/CartWithInstructions";
import VendorStoreReviews from "./pages/VendorStoreReviews";
import SupplierRevenue from "./pages/SupplierRevenue";
import SupplierCompletedOrders from "./pages/SupplierCompletedOrders";
import SupplierAnalytics from "./pages/SupplierAnalytics";
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const Vendor = ({ children }) => (
  <ProtectedRoute requiredRole="vendor">{children}</ProtectedRoute>
);
const Supplier = ({ children }) => (
  <ProtectedRoute requiredRole="supplier">{children}</ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <BrowserRouter>
          <AuthProvider>
            <NotificationProvider>
              <CartProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  {/* Public */}
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/register/:role" element={<Register />} />
                  <Route path="/verify-email" element={<VerifyEmail />} />

                  {/* Vendor */}
                  <Route path="/vendor" element={<Vendor><VendorDashboard /></Vendor>} />
                  <Route path="/vendor/dashboard" element={<Vendor><VendorDashboard /></Vendor>} />
                  <Route path="/vendor/profile" element={<Vendor><VendorProfile /></Vendor>} />
                  <Route path="/vendor/orders" element={<Vendor><OrderTracking /></Vendor>} />
                  <Route path="/vendor/active-orders" element={<Vendor><VendorActiveOrders /></Vendor>} />
                  <Route path="/vendor/in-transit" element={<Vendor><InTransit /></Vendor>} />
                  <Route path="/vendor/rating" element={<Vendor><Rating /></Vendor>} />
                  <Route path="/vendor/rating/:orderId" element={<Vendor><Rating /></Vendor>} />
                  <Route path="/vendor/ratings" element={<Vendor><RatingsReviews /></Vendor>} />
                  <Route path="/vendor/reviews" element={<Vendor><RatingsReviews /></Vendor>} />
                  <Route path="/vendor/store-reviews" element={<Vendor><VendorStoreReviews /></Vendor>} />
                  <Route path="/vendor/saved-items" element={<Vendor><SavedItems /></Vendor>} />
                  <Route path="/material/:id" element={<Vendor><MaterialDetails /></Vendor>} />
                  <Route path="/cart" element={<Vendor><CartWithInstructions /></Vendor>} />
                  <Route path="/track-order/:orderId" element={<Vendor><OrderTrackingLive /></Vendor>} />
                  <Route path="/vendor/marketplace" element={<Vendor><VendorMarketplace /></Vendor>} />
                  <Route path="/vendor/market-analysis" element={<Vendor><VendorMarketAnalysis /></Vendor>} />
                  <Route path="/vendor/sell-items" element={<Vendor><VendorSellItems /></Vendor>} />
                  <Route path="/vendor/my-listings" element={<Vendor><VendorMyListings /></Vendor>} />
                  <Route path="/vendor/revenue" element={<Vendor><VendorRevenue /></Vendor>} />

                  {/* Supplier */}
                  <Route path="/supplier" element={<Supplier><SupplierDashboard /></Supplier>} />
                  <Route path="/supplier/dashboard" element={<Supplier><SupplierDashboard /></Supplier>} />
                  <Route path="/supplier/profile" element={<Supplier><SupplierProfile /></Supplier>} />
                  <Route path="/supplier/inventory" element={<Supplier><SupplierInventory /></Supplier>} />
                  <Route path="/supplier/pending-orders" element={<Supplier><SupplierPendingOrders /></Supplier>} />
                  <Route path="/supplier/notifications" element={<Supplier><SupplierNotifications /></Supplier>} />
                  <Route path="/supplier/revenue" element={<Supplier><SupplierRevenue /></Supplier>} />
                  <Route path="/supplier/completed-orders" element={<Supplier><SupplierCompletedOrders /></Supplier>} />
                  <Route path="/supplier/analytics" element={<Supplier><SupplierAnalytics /></Supplier>} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </CartProvider>
            </NotificationProvider>
          </AuthProvider>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
