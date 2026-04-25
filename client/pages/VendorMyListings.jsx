import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Tag, Plus } from "lucide-react";
import AppHeader from "@/components/AppHeader";

export default function VendorMyListings() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="My Listings" />
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
          <Card>
            <CardContent className="text-center py-16">
              <Tag className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h2 className="text-lg font-semibold mb-2">
                Vendor Resale Marketplace
              </h2>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                You haven&apos;t posted any items for resale yet. Use the vendor
                marketplace to buy from or sell to other street-food vendors.
              </p>
              <div className="flex justify-center gap-3 flex-wrap">
                <Link to="/vendor/sell-items">
                  <Button className="bg-gradient-to-r from-saffron-500 to-orange-500">
                    <Plus className="w-4 h-4 mr-2" /> Post Item for Resale
                  </Button>
                </Link>
                <Link to="/vendor/marketplace">
                  <Button variant="outline">Browse Marketplace</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
