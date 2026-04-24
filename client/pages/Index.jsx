import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Store,
  CheckCircle,
  MapPin,
  Clock,
  Shield,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, ease: "easeOut" },
};

export default function Index() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === "vendor" ? "/vendor/dashboard" : "/supplier/dashboard");
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-emerald-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-r from-saffron-500 to-emerald-500 rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12">
                <span className="text-white font-bold text-sm">JB</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-saffron-600 to-emerald-600 bg-clip-text text-transparent">
                JugaduBazar
              </span>
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-gray-600 hover:text-saffron-600 transition-colors">
                  Login
                </Button>
              </Link>
              <Link to="/register/vendor">
                <Button className="bg-gradient-to-r from-saffron-500 to-saffron-600 hover:from-saffron-600 hover:to-saffron-700 transition-all hover:shadow-lg">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-saffron-300 to-orange-300 rounded-full blur-3xl"
        />
        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-br from-emerald-300 to-green-300 rounded-full blur-3xl"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Badge className="mb-6 bg-gradient-to-r from-saffron-100 to-emerald-100 text-saffron-700 border-saffron-200 inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Revolutionizing Street-Food Supply Chain
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Connect{" "}
              <span className="bg-gradient-to-r from-saffron-600 to-emerald-600 bg-clip-text text-transparent">
                Street Food Vendors
              </span>{" "}
              with Local Suppliers
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              JugaduBazar solves the raw-material sourcing problem for Indian
              street-food vendors. Get fresh ingredients, competitive prices,
              and reliable delivery — all in one platform.
            </p>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -6 }}
              >
                <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-2 hover:border-saffron-300 h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-saffron-50 to-orange-50 opacity-50" />
                  <CardHeader className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-saffron-500 to-orange-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                      <ShoppingCart className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-left">I&apos;m a Vendor</CardTitle>
                    <CardDescription className="text-left text-gray-600">
                      Source raw materials from trusted local suppliers with competitive prices and fast delivery
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <ul className="space-y-2 text-left mb-6">
                      <li className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                        Browse materials by category
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                        Compare prices &amp; ratings
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                        Track order status in real-time
                      </li>
                    </ul>
                    <Link to="/register/vendor" className="w-full block">
                      <Button className="w-full bg-gradient-to-r from-saffron-500 to-orange-500 hover:from-saffron-600 hover:to-orange-600 transition-all">
                        Start as Vendor <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -6 }}
              >
                <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-2 hover:border-emerald-300 h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-50 opacity-50" />
                  <CardHeader className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                      <Store className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-left">I&apos;m a Supplier</CardTitle>
                    <CardDescription className="text-left text-gray-600">
                      Sell your raw materials to local street-food vendors and grow your business
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <ul className="space-y-2 text-left mb-6">
                      <li className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                        List your products easily
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                        Manage orders efficiently
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                        Build trusted reputation
                      </li>
                    </ul>
                    <Link to="/register/supplier" className="w-full block">
                      <Button className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 transition-all">
                        Start as Supplier <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose JugaduBazar?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We understand the unique challenges of street-food vendors and provide solutions that work.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: MapPin,
                gradient: "from-saffron-500 to-orange-500",
                title: "Local Network",
                desc: "Connect with suppliers in your area for faster delivery and better relationships.",
              },
              {
                icon: Clock,
                gradient: "from-emerald-500 to-green-500",
                title: "Real-time Tracking",
                desc: "Track your orders from confirmation to delivery with live status updates.",
              },
              {
                icon: Shield,
                gradient: "from-blue-500 to-purple-500",
                title: "Trusted Quality",
                desc: "Verified suppliers with ratings and reviews ensure you get quality materials.",
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center group cursor-default"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${f.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-lg`}
                >
                  <f.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-r from-saffron-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: "500+", label: "Active Vendors", color: "text-saffron-600" },
              { value: "200+", label: "Trusted Suppliers", color: "text-emerald-600" },
              { value: "10K+", label: "Orders Completed", color: "text-saffron-600" },
              { value: "₹2L+", label: "Money Saved", color: "text-emerald-600" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className={`text-3xl md:text-4xl font-bold ${s.color} mb-2`}>{s.value}</div>
                <div className="text-gray-600">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-saffron-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">JB</span>
              </div>
              <span className="text-xl font-bold">JugaduBazar</span>
            </div>
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} JugaduBazar. Empowering street-food vendors across India.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
