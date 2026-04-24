import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, LogOut } from "lucide-react";
import NotificationPanel from "@/components/NotificationPanel";
import ProfilePhoto from "@/components/ProfilePhoto";
import LanguageSelector from "@/components/LanguageSelector";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

export default function AppHeader({ title, badgeColor = "bg-saffron-100 text-saffron-700" }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const cart = useCart?.() || { totalItems: 0 };
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    setProfileImage(localStorage.getItem("profileImage") || "");
  }, []);

  const isVendor = user?.role === "vendor";

  return (
    <header className="bg-white/90 backdrop-blur border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-r from-saffron-500 to-emerald-500 rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12">
                <span className="text-white font-bold text-sm">JB</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-saffron-600 to-emerald-600 bg-clip-text text-transparent hidden sm:block">
                JugaduBazar
              </span>
            </Link>
            {title && <Badge className={badgeColor}>{title}</Badge>}
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <LanguageSelector />
            <NotificationPanel />
            {isVendor && (
              <Link to="/cart">
                <Button variant="ghost" size="sm" className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cart.totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-saffron-500 text-white rounded-full text-xs flex items-center justify-center animate-pulse">
                      {cart.totalItems > 9 ? "9+" : cart.totalItems}
                    </span>
                  )}
                </Button>
              </Link>
            )}
            <Link
              to={isVendor ? "/vendor/profile" : "/supplier/profile"}
              className="flex items-center"
            >
              <ProfilePhoto
                currentImage={profileImage}
                userName={user?.name || "User"}
                size="sm"
                onImageChange={(url) => {
                  setProfileImage(url);
                  if (url) localStorage.setItem("profileImage", url);
                }}
              />
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="hidden sm:inline-flex"
            >
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="sm:hidden"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
