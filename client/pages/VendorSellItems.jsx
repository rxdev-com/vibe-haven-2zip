import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Tag, Sparkles } from "lucide-react";
import AppHeader from "@/components/AppHeader";

export default function VendorSellItems() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="Sell Items" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/vendor/dashboard"
          className="inline-flex items-center text-sm text-gray-600 hover:text-saffron-600 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-saffron-500 to-orange-500 p-8 text-white text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-2" />
              <h2 className="text-2xl font-bold">Vendor-to-Vendor Resale</h2>
              <p className="text-white/90 mt-1">Coming soon</p>
            </div>
            <CardContent className="text-center py-8">
              <Tag className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                We&apos;re working on letting vendors resell surplus inventory to
                other vendors. In the meantime, you can browse the marketplace
                and source raw materials directly from suppliers.
              </p>
              <div className="flex justify-center gap-3 flex-wrap">
                <Link to="/vendor/dashboard">
                  <Button className="bg-gradient-to-r from-saffron-500 to-orange-500">
                    Browse Suppliers
                  </Button>
                </Link>
                <Link to="/vendor/marketplace">
                  <Button variant="outline">Open Marketplace</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
