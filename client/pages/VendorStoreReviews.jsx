import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Star, ThumbsUp, MessageSquare, CheckCircle, Search,
  ChevronDown, X, Loader2, Reply,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const MOCK_STORE_REVIEWS = [
  {
    id: "r1",
    customerName: "Rajesh Patel",
    initials: "RP",
    color: "bg-blue-600",
    date: "1/25/2025",
    orderId: "ORD-2025-001",
    verified: true,
    rating: 5,
    title: "Excellent quality products and fast delivery",
    body: "Amazing experience with this store. The vegetables were fresh, the spices were authentic, and delivery was super fast. Will definitely order again!",
    tags: ["Fresh Produce", "Good Pricing"],
    vendorResponse: "Thank you for the wonderful feedback! We're committed to providing the best quality products.",
    responseDate: "1/26/2025",
    helpful: 12,
    vendorLiked: false,
  },
  {
    id: "r2",
    customerName: "Priya Sharma",
    initials: "PS",
    color: "bg-emerald-600",
    date: "1/24/2025",
    orderId: "ORD-2025-002",
    verified: true,
    rating: 4,
    title: "Good products but packaging could be better",
    body: "The items were of good quality and pricing is reasonable. However, the packaging was a bit loose. Delivery was on time though.",
    tags: ["Good Value", "Fast Delivery"],
    vendorResponse: null,
    responseDate: null,
    helpful: 8,
    vendorLiked: false,
  },
  {
    id: "r3",
    customerName: "Vikram Singh",
    initials: "VS",
    color: "bg-purple-600",
    date: "1/23/2025",
    orderId: "ORD-2025-003",
    verified: true,
    rating: 5,
    title: "Best dal and spices in the market",
    body: "I've tried many stores but this one has the best quality dal and spices. The prices are fair and customer service is excellent. Highly recommended!",
    tags: ["Premium Quality", "Best Prices"],
    vendorResponse: "We're honored by your kind words! Thank you for being a valued customer.",
    responseDate: "1/24/2025",
    helpful: 20,
    vendorLiked: true,
  },
];

const DIST = { 5: 63, 4: 22, 3: 18, 2: 8, 1: 4 };
const TOTAL_REVIEWS = Object.values(DIST).reduce((a, b) => a + b, 0);

function StarRow({ n, count }) {
  const pct = Math.round((count / TOTAL_REVIEWS) * 100);
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-3 text-right text-gray-600">{n}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2">
        <div className="h-2 bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-6 text-gray-500 text-xs">{count}</span>
    </div>
  );
}

function Stars({ rating, size = "sm" }) {
  const cls = size === "sm" ? "w-4 h-4" : "w-6 h-6";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`${cls} ${n <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
      ))}
    </div>
  );
}

export default function VendorStoreReviews() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState(MOCK_STORE_REVIEWS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [likedIds, setLikedIds] = useState(new Set(reviews.filter(r => r.vendorLiked).map(r => r.id)));

  const avgRating = (Object.entries(DIST).reduce((sum, [n, c]) => sum + n * c, 0) / TOTAL_REVIEWS).toFixed(1);

  const filtered = reviews.filter((r) => {
    const matchSearch =
      !search ||
      r.customerName.toLowerCase().includes(search.toLowerCase()) ||
      r.body.toLowerCase().includes(search.toLowerCase()) ||
      r.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "5" && r.rating === 5) ||
      (filter === "4" && r.rating === 4) ||
      (filter === "3" && r.rating === 3) ||
      (filter === "verified" && r.verified);
    return matchSearch && matchFilter;
  });

  const handleSubmitReply = async (reviewId) => {
    if (!replyText.trim()) {
      toast({ title: "Please write a reply", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              vendorResponse: replyText,
              responseDate: new Date().toLocaleDateString("en-US"),
            }
          : r,
      ),
    );
    setReplyText("");
    setReplyingTo(null);
    setSubmitting(false);
    toast({ title: "Reply posted!", description: "Your response has been added." });
  };

  const toggleLike = (id) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/vendor/dashboard" className="text-sm text-gray-500 hover:text-saffron-600">
            ← Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm text-yellow-600 font-semibold">
              <Star className="w-4 h-4 fill-yellow-400" /> {avgRating}/5
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Your Store Reviews</h1>
          <p className="text-sm text-gray-500">See what customers are saying about your shop</p>
        </motion.div>

        {/* Summary + Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          {/* Overall rating */}
          <Card>
            <CardContent className="p-5 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
              </div>
              <p className="text-4xl font-bold text-gray-900">{avgRating}</p>
              <Stars rating={Math.round(parseFloat(avgRating))} size="sm" />
              <p className="text-sm text-gray-500 mt-1">Based on {TOTAL_REVIEWS} reviews</p>
            </CardContent>
          </Card>

          {/* Distribution */}
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Rating Distribution</h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((n) => (
                  <StarRow key={n} n={n} count={DIST[n]} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            { icon: "👍", label: "Positive Reviews", value: 4, color: "text-emerald-600" },
            { icon: "💬", label: "Your Responses", value: 2, color: "text-blue-600" },
            { icon: "❤️", label: "Liked by You", value: likedIds.size, color: "text-red-600" },
            { icon: "✅", label: "Verified Purchases", value: 5, color: "text-saffron-600" },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="p-3 text-center">
                <div className="text-2xl mb-1">{s.icon}</div>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reviews, customers..."
              className="pl-9"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-200 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-saffron-500"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="verified">Verified Only</option>
          </select>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filtered.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${r.color} text-white flex items-center justify-center font-bold text-sm`}>
                        {r.initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900">{r.customerName}</p>
                          {r.verified && (
                            <Badge className="bg-emerald-100 text-emerald-700 text-xs gap-1">
                              <CheckCircle className="w-3 h-3" /> Verified Purchase
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Stars rating={r.rating} />
                          <span className="text-xs text-gray-400">{r.date}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{r.orderId}</span>
                  </div>

                  <p className="font-semibold text-gray-900 mb-1">{r.title}</p>
                  <p className="text-sm text-gray-600 mb-3">{r.body}</p>

                  {r.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {r.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  )}

                  {r.vendorResponse && (
                    <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-lg p-3 mb-3">
                      <p className="text-xs font-semibold text-gray-700 mb-1">Your Response:</p>
                      <p className="text-sm text-gray-600">{r.vendorResponse}</p>
                      {r.responseDate && <p className="text-xs text-gray-400 mt-1">{r.responseDate}</p>}
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleLike(r.id)}
                      className={`inline-flex items-center gap-1 text-xs transition-colors ${likedIds.has(r.id) ? "text-red-600" : "text-gray-500 hover:text-red-600"}`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${likedIds.has(r.id) ? "fill-current" : ""}`} />
                      Like ({r.helpful + (likedIds.has(r.id) ? 1 : 0)})
                    </button>

                    {!r.vendorResponse && (
                      <button
                        onClick={() => setReplyingTo(r.id)}
                        className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        <Reply className="w-3.5 h-3.5" />
                        Reply
                      </button>
                    )}
                  </div>

                  {replyingTo === r.id && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 pt-4 border-t">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Your Reply</label>
                          <Textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Share your response with the customer..."
                            rows={3}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleSubmitReply(r.id)}
                            disabled={submitting}
                            className="bg-blue-500 hover:bg-blue-600 text-white text-sm"
                          >
                            {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Posting...</> : "Post Reply"}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setReplyingTo(null)}>Cancel</Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <Card><CardContent className="text-center py-12">
              <MessageSquare className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">No reviews found</p>
            </CardContent></Card>
          )}
        </div>
      </div>
    </div>
  );
}
