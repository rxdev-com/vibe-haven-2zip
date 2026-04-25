import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNotifications } from "@/contexts/NotificationContext";
import AppHeader from "@/components/AppHeader";
import {
  ArrowLeft,
  Search,
  Edit,
  Trash2,
  Eye,
  Package,
  TrendingUp,
  AlertCircle,
  Plus,
  Pause,
  PlayCircle,
} from "lucide-react";

const STORAGE_KEY = "vendor_resale_listings";

const statusColor = (status) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700";
    case "sold":
      return "bg-blue-100 text-blue-700";
    case "paused":
      return "bg-yellow-100 text-yellow-700";
    case "expired":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function VendorMyListings() {
  const { addNotification } = useNotifications();
  const [listings, setListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDeleteDialog, setShowDeleteDialog] = useState(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setListings(saved);
    } catch {
      setListings([]);
    }
  }, []);

  const persist = (next) => {
    setListings(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || listing.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteListing = (listingId) => {
    persist(listings.filter((l) => l.id !== listingId));
    addNotification({
      title: "Listing Deleted",
      message: "Your listing has been removed from the marketplace",
      type: "success",
    });
    setShowDeleteDialog(null);
  };

  const handleToggleStatus = (listingId, currentStatus) => {
    if (currentStatus === "sold") return;
    const newStatus = currentStatus === "active" ? "paused" : "active";
    persist(
      listings.map((l) =>
        l.id === listingId
          ? { ...l, status: newStatus, lastUpdated: new Date().toISOString() }
          : l,
      ),
    );
    addNotification({
      title: `Listing ${newStatus === "active" ? "Activated" : "Paused"}`,
      message: `Your listing is now ${newStatus}`,
      type: "info",
    });
  };

  const totalStats = {
    total: listings.length,
    active: listings.filter((l) => l.status === "active").length,
    sold: listings.filter((l) => l.status === "sold").length,
    totalViews: listings.reduce((sum, l) => sum + (l.views || 0), 0),
    totalInquiries: listings.reduce((sum, l) => sum + (l.inquiries || 0), 0),
    totalEarnings: listings
      .filter((l) => l.status === "sold")
      .reduce((sum, l) => sum + (l.soldPrice || l.price || 0), 0),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="My Listings" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center space-x-4">
            <Link to="/vendor/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
              <p className="text-gray-600">
                Manage your marketplace listings and track performance
              </p>
            </div>
          </div>
          <Link to="/vendor/sell-items">
            <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
              <Plus className="w-4 h-4 mr-2" /> Add New Listing
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8"
        >
          {[
            { label: "Total Listings", value: totalStats.total, color: "text-gray-900" },
            { label: "Active", value: totalStats.active, color: "text-green-600" },
            { label: "Sold", value: totalStats.sold, color: "text-blue-600" },
            { label: "Total Views", value: totalStats.totalViews, color: "text-purple-600" },
            { label: "Inquiries", value: totalStats.totalInquiries, color: "text-orange-600" },
            {
              label: "Earned",
              value: `₹${totalStats.totalEarnings.toLocaleString()}`,
              color: "text-emerald-600",
            },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4 text-center">
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Filters */}
        <div className="bg-white rounded-lg border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search your listings..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredListings.map((listing, idx) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.03 }}
              >
                <Card className="group hover:shadow-lg transition-shadow overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="relative">
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                        {listing.images && listing.images[0] ? (
                          <img
                            src={listing.images[0]}
                            alt={listing.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <Package className="w-16 h-16 text-gray-400" />
                        )}
                      </div>
                      <div className="absolute top-2 left-2 flex gap-2">
                        <Badge className={statusColor(listing.status)}>
                          {listing.status.charAt(0).toUpperCase() +
                            listing.status.slice(1)}
                        </Badge>
                        {listing.urgency === "urgent" && (
                          <Badge className="bg-red-500 text-white">Urgent</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-saffron-600 transition-colors mb-2 line-clamp-2">
                      {listing.title}
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-2xl font-bold text-gray-900">
                          ₹{listing.price.toLocaleString()}
                        </span>
                        {listing.originalPrice > listing.price && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            ₹{listing.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                      <div className="p-2 bg-gray-50 rounded">
                        <div className="text-lg font-semibold text-gray-900">
                          {listing.views || 0}
                        </div>
                        <div className="text-xs text-gray-600">Views</div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <div className="text-lg font-semibold text-gray-900">
                          {listing.inquiries || 0}
                        </div>
                        <div className="text-xs text-gray-600">Inquiries</div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <div className="text-lg font-semibold text-gray-900">
                          {listing.views > 0
                            ? Math.round(
                                ((listing.inquiries || 0) / listing.views) * 100,
                              )
                            : 0}
                          %
                        </div>
                        <div className="text-xs text-gray-600">Rate</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mb-4">
                      Posted: {new Date(listing.postedDate).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" size="sm">
                        <Eye className="w-4 h-4 mr-1" /> View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(listing.id, listing.status)}
                        disabled={listing.status === "sold"}
                        title={listing.status === "active" ? "Pause" : "Activate"}
                      >
                        {listing.status === "active" ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <PlayCircle className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => setShowDeleteDialog(listing.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredListings.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No listings found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "You haven't listed any items yet"}
            </p>
            {!searchTerm && statusFilter === "all" && (
              <Link to="/vendor/sell-items">
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                  <Plus className="w-4 h-4 mr-2" /> Create Your First Listing
                </Button>
              </Link>
            )}
          </motion.div>
        )}

        <Dialog
          open={showDeleteDialog !== null}
          onOpenChange={() => setShowDeleteDialog(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Listing</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this listing? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() =>
                  showDeleteDialog && handleDeleteListing(showDeleteDialog)
                }
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
