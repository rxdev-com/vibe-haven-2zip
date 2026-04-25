import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-emerald-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-8xl font-bold bg-gradient-to-r from-saffron-600 to-emerald-600 bg-clip-text text-transparent mb-4"
        >
          404
        </motion.h1>
        <p className="text-xl text-gray-700 mb-2">Oops! Page not found</p>
        <p className="text-sm text-gray-500 mb-8">
          The page <code className="bg-gray-100 px-1 rounded">{location.pathname}</code> doesn&apos;t exist.
        </p>
        <Link to="/">
          <Button className="bg-gradient-to-r from-saffron-500 to-emerald-500 hover:from-saffron-600 hover:to-emerald-600">
            <Home className="w-4 h-4 mr-2" /> Return to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
