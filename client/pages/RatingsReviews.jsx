import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Star, ThumbsUp, MessageSquare, CheckCircle, Search,
  ChevronDown, X, Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ordersAPI } from "@/lib/api";

const MOCK_REVIEWS = [
  {
    id: "r1",
    supplierName: "Kumar Oil Mills",
    initials: "KD",
    color: "bg-blue-600",
    date: "1/25/2025",
    orderId: "ORD-2025-001",
    verified: true,
    rating: 5,
    title: "Excellent quality ghee and timely delivery",
    body: "The pure ghee was of exceptional quality and the mustard oil was fresh. Packaging was excellent and delivery was on time. Highly recommended for anyone looking for authentic products.",
    tags: ["Pure Ghee", "Mustard Oil"],
    supplierResponse: "Thank you for your wonderful feedback! We're delighted that you loved our products. Quality is our top priority.",
    responseDate: "1/26/2025",
    helpful: 12,
  },
  {
    id: "r2",
    supplierName: "Fresh Spice Co.",
    initials: "FS",
    color: "bg-emerald-600",
    date: "1/24/2025",
    orderId: "ORD-2025-002",
    verified: true,
    rating: 4,
    title: "Good spices but delivery was delayed",
    body: "The garam masala and red chili powder were fresh and aromatic. Quality is really good but the delivery was a day late. Overall satisfied with the purchase.",
    tags: ["Garam Masala", "Red Chili Powder"],
    supplierResponse: null,
    helpful: 8,
  },
  {
    id: "r3",
    supplierName: "Grain Merchants",
    initials: "GM",
    color: "bg-purple-600",
    date: "1/23/2025",
    orderId: "ORD-2025-003",
    verified: true,
    rating: 5,
    title: "Perfect basmati rice quality",
    body: "The basmati rice was of premium quality with long grains and wonderful aroma. Packaging was professional and the price was very reasonable. Will definitely order again.",
    tags: ["Basmati Rice"],
    supplierResponse: "We're thrilled that you enjoyed our premium basmati rice! Thank you for choosing us.",
    responseDate: "1/24/2025",
    helpful: 15,
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

export default function RatingsReviews() {
  const { toast } = useToast();
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showWriteForm, setShowWriteForm] = useState(false);
  const [writeRating, setWriteRating] = useState(4);
  const [hoverRating, setHoverRating] = useState(0);
  const [writeTitle, setWriteTitle] = useState("");
  const [writeBody, setWriteBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [helpfulIds, setHelpfulIds] = useState(new Set());

  const avgRating = (Object.entries(DIST).reduce((sum, [n, c]) => sum + n * c, 0) / TOTAL_REVIEWS).toFixed(1);

  const filtered = reviews.filter((r) => {
    const matchSearch =
      !search ||
      r.supplierName.toLowerCase().includes(search.toLowerCase()) ||
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

  const handleSubmitReview = async () => {
    if (!writeTitle.trim() || !writeBody.trim()) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    const newReview = {
      id: `r${Date.now()}`,
      supplierName: "My Review",
      initials: "ME",
      color: "bg-saffron-500",
      date: new Date().toLocaleDateString("en-US"),
      orderId: "ORD-2025-NEW",
      verified: true,
      rating: writeRating,
      title: writeTitle,
      body: writeBody,
      tags: [],
      supplierResponse: null,
      helpful: 0,
    };
    setReviews((prev) => [newReview, ...prev]);
    setWriteTitle("");
    setWriteBody("");
    setWriteRating(4);
    setShowWriteForm(false);
    setSubmitting(false);
    toast({ title: "Review submitted!", description: "Thank you for your feedback." });
  };

  const toggleHelpful = (id) => {
    setHelpfulIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
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
            <Button
              className="bg-saffron-500 hover:bg-saffron-600 text-white text-sm"
              onClick={() => setShowWriteForm((v) => !v)}
            >
              ✏ Write Review
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Ratings & Reviews</h1>
          <p className="text-sm text-gray-500">Your feedback and reviews for supplier orders</p>
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
            { icon: "💬", label: "Supplier Responses", value: 2, color: "text-blue-600" },
            { icon: "🤝", label: "Helpful Votes", value: 47, color: "text-purple-600" },
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

        {/* Write Review Form */}
        {showWriteForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
            <Card>
              <CardContent className="p-5">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">Write a Review</h3>
                    <p className="text-sm text-gray-500">Share your experience with other vendors</p>
                  </div>
                  <button onClick={() => setShowWriteForm(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          onMouseEnter={() => setHoverRating(n)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setWriteRating(n)}
                        >
                          <Star className={`w-7 h-7 transition-colors ${n <= (hoverRating || writeRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Review Title</label>
                    <Input
                      value={writeTitle}
                      onChange={(e) => setWriteTitle(e.target.value)}
                      placeholder="Summarize your experience..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                    <Textarea
                      value={writeBody}
                      onChange={(e) => setWriteBody(e.target.value)}
                      placeholder="Tell others about your experience with this supplier..."
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSubmitReview}
                      disabled={submitting}
                      className="bg-saffron-500 hover:bg-saffron-600 text-white"
                    >
                      {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : "Submit Review"}
                    </Button>
                    <Button variant="outline" onClick={() => setShowWriteForm(false)}>Cancel</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Search + Filter */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reviews, suppliers..."
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
                          <p className="font-semibold text-gray-900">{r.supplierName}</p>
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

                  {r.supplierResponse && (
                    <div className="bg-gray-50 border-l-4 border-blue-400 rounded-r-lg p-3 mb-3">
                      <p className="text-xs font-semibold text-gray-700 mb-1">Response from {r.supplierName}:</p>
                      <p className="text-sm text-gray-600">{r.supplierResponse}</p>
                      {r.responseDate && <p className="text-xs text-gray-400 mt-1">{r.responseDate}</p>}
                    </div>
                  )}

                  <button
                    onClick={() => toggleHelpful(r.id)}
                    className={`inline-flex items-center gap-1 text-xs transition-colors ${helpfulIds.has(r.id) ? "text-blue-600" : "text-gray-500 hover:text-blue-600"}`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    Helpful ({r.helpful + (helpfulIds.has(r.id) ? 1 : 0)})
                  </button>
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
