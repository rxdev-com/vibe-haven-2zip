import React, { useState, useEffect } from "react";
import { Link, Navigate, useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Store, ArrowLeft, Loader2 } from "lucide-react";

export default function Login() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") === "supplier" ? "supplier" : "vendor";
  const [activeTab, setActiveTab] = useState(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setActiveTab(initialRole);
  }, [initialRole]);

  if (isAuthenticated && user) {
    const from =
      location.state?.from?.pathname ||
      (user.role === "vendor" ? "/vendor/dashboard" : "/supplier/dashboard");
    return <Navigate to={from} replace />;
  }

  const handleLogin = async (role) => {
    if (!email || !password) return;
    const success = await login(email, password, role);
    if (success) {
      navigate(role === "vendor" ? "/vendor/dashboard" : "/supplier/dashboard", { replace: true });
    }
  };

  const fillDemo = (role) => {
    if (role === "vendor") {
      setEmail("vendor@example.com");
      setPassword("vendor123");
    } else {
      setEmail("supplier@example.com");
      setPassword("supplier123");
    }
    setActiveTab(role);
  };

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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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

          <TabsContent value="vendor">
            <Card className="border-2 border-saffron-100 transition-shadow hover:shadow-lg">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-saffron-500 to-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Vendor Login</CardTitle>
                <CardDescription>Browse materials and place orders</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="vlogin-email">Email</Label>
                  <Input
                    id="vlogin-email"
                    type="email"
                    placeholder="vendor@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="vlogin-pass">Password</Label>
                  <Input
                    id="vlogin-pass"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin("vendor")}
                  />
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-saffron-500 to-orange-500 hover:from-saffron-600 hover:to-orange-600 transition-all"
                  onClick={() => handleLogin("vendor")}
                  disabled={isLoading || !email || !password}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...
                    </>
                  ) : (
                    "Sign in as Vendor"
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="supplier">
            <Card className="border-2 border-emerald-100 transition-shadow hover:shadow-lg">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Supplier Login</CardTitle>
                <CardDescription>Manage inventory and incoming orders</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="slogin-email">Email</Label>
                  <Input
                    id="slogin-email"
                    type="email"
                    placeholder="supplier@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="slogin-pass">Password</Label>
                  <Input
                    id="slogin-pass"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin("supplier")}
                  />
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 transition-all"
                  onClick={() => handleLogin("supplier")}
                  disabled={isLoading || !email || !password}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...
                    </>
                  ) : (
                    "Sign in as Supplier"
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Demo Credentials</h4>
          <div className="text-xs text-blue-700 space-y-2">
            <button
              type="button"
              onClick={() => fillDemo("vendor")}
              className="block w-full text-left hover:underline"
            >
              <strong>Vendor:</strong> vendor@example.com / vendor123 — click to autofill
            </button>
            <button
              type="button"
              onClick={() => fillDemo("supplier")}
              className="block w-full text-left hover:underline"
            >
              <strong>Supplier:</strong> supplier@example.com / supplier123 — click to autofill
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              to={`/register/${activeTab}`}
              className="text-saffron-600 hover:text-saffron-700 font-medium"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
