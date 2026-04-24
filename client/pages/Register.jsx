import React, { useState, useEffect } from "react";
import {
  Link,
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCart, Store, ArrowLeft, Loader2 } from "lucide-react";

export default function Register() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register, isAuthenticated, user, isLoading } = useAuth();

  // Role can come from /register/vendor, /register/supplier, or ?role=
  const roleFromPath =
    params.role === "vendor" || params.role === "supplier" ? params.role : null;
  const roleFromQuery =
    searchParams.get("role") === "supplier" ? "supplier" : "vendor";
  const initialRole = roleFromPath || roleFromQuery;

  const [activeTab, setActiveTab] = useState(initialRole);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    businessName: "",
    address: "",
    description: "",
  });

  useEffect(() => {
    setActiveTab(initialRole);
  }, [initialRole]);

  // Sync URL when user clicks a tab
  const handleTabChange = (val) => {
    setActiveTab(val);
    navigate(`/register/${val}`, { replace: true });
  };

  if (isAuthenticated && user) {
    return (
      <Navigate
        to={user.role === "vendor" ? "/vendor/dashboard" : "/supplier/dashboard"}
        replace
      />
    );
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (role) => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.businessName
    ) {
      toast({
        title: "Missing fields",
        description: "Please fill in name, email, password, and business name.",
        variant: "destructive",
      });
      return;
    }
    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please confirm your password correctly.",
        variant: "destructive",
      });
      return;
    }
    const ok = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone || undefined,
      role,
      businessName: formData.businessName,
      address: formData.address || undefined,
      description: formData.description || undefined,
    });
    if (ok) {
      navigate(role === "vendor" ? "/vendor/dashboard" : "/supplier/dashboard", {
        replace: true,
      });
    }
  };

  const isVendor = activeTab === "vendor";
  const themeBorder = isVendor ? "border-saffron-100" : "border-emerald-100";
  const themeIconBg = isVendor
    ? "from-saffron-500 to-orange-500"
    : "from-emerald-500 to-green-500";
  const themeBtn = isVendor
    ? "from-saffron-500 to-orange-500 hover:from-saffron-600 hover:to-orange-600"
    : "from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600";
  const Icon = isVendor ? ShoppingCart : Store;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center text-gray-600 hover:text-saffron-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <motion.div
              whileHover={{ rotate: 12, scale: 1.1 }}
              className="w-10 h-10 bg-gradient-to-r from-saffron-500 to-emerald-500 rounded-lg flex items-center justify-center"
            >
              <span className="text-white font-bold">JB</span>
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-saffron-600 to-emerald-600 bg-clip-text text-transparent">
              JugaduBazar
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Join JugaduBazar
          </h1>
          <p className="text-gray-600">
            Create your {activeTab} account in seconds
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="vendor" className="flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4" />
              <span>Vendor</span>
            </TabsTrigger>
            <TabsTrigger value="supplier" className="flex items-center space-x-2">
              <Store className="w-4 h-4" />
              <span>Supplier</span>
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: isVendor ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isVendor ? 20 : -20 }}
              transition={{ duration: 0.25 }}
            >
              <Card className={`border-2 ${themeBorder} transition-shadow hover:shadow-lg`}>
                <CardHeader className="text-center">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${themeIconBg} rounded-lg flex items-center justify-center mx-auto mb-4`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>
                    Register as {isVendor ? "Vendor" : "Supplier"}
                  </CardTitle>
                  <CardDescription>
                    {isVendor
                      ? "Source raw materials from trusted suppliers"
                      : "Sell raw materials to street-food vendors"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="reg-name">Full Name</Label>
                      <Input
                        id="reg-name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="reg-phone">Phone</Label>
                      <Input
                        id="reg-phone"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="reg-email">Email</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="reg-business">
                      {isVendor ? "Stall / Business Name" : "Business / Brand Name"}
                    </Label>
                    <Input
                      id="reg-business"
                      placeholder={
                        isVendor
                          ? "Your street-food stall name"
                          : "Your supply business name"
                      }
                      value={formData.businessName}
                      onChange={(e) =>
                        handleInputChange("businessName", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="reg-address">Address</Label>
                    <Textarea
                      id="reg-address"
                      placeholder={
                        isVendor
                          ? "Your stall location"
                          : "Your warehouse / business address"
                      }
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      className="resize-none"
                      rows={2}
                    />
                  </div>
                  {!isVendor && (
                    <div>
                      <Label htmlFor="reg-desc">Business Description</Label>
                      <Textarea
                        id="reg-desc"
                        placeholder="What materials do you supply?"
                        value={formData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        className="resize-none"
                        rows={2}
                      />
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="reg-pass">Password</Label>
                      <Input
                        id="reg-pass"
                        type="password"
                        placeholder="Min 6 chars"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="reg-confirm">Confirm</Label>
                      <Input
                        id="reg-confirm"
                        type="password"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange("confirmPassword", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <Button
                    className={`w-full bg-gradient-to-r ${themeBtn} transition-all`}
                    onClick={() => handleRegister(activeTab)}
                    disabled={
                      isLoading ||
                      !formData.name ||
                      !formData.email ||
                      !formData.password ||
                      !formData.businessName
                    }
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      `Register as ${isVendor ? "Vendor" : "Supplier"}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </Tabs>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to={`/login?role=${activeTab}`}
              className="text-saffron-600 hover:text-saffron-700 font-medium"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
