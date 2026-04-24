import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Star, ThumbsUp, MessageCircle, Search, Award, Package } from "lucide-react";
const mockReviews = [
    {
        id: "1",
        orderId: "ORD-2025-001",
        supplier: "Kumar Oil Mills",
        supplierAvatar: "KO",
        rating: 5,
        title: "Excellent quality ghee and timely delivery",
        comment: "The pure ghee was of exceptional quality and the mustard oil was fresh. Packaging was excellent and delivery was on time. Highly recommended for anyone looking for authentic products.",
        date: "2025-01-25",
        items: [
            "Pure Ghee",
            "Mustard Oil"
        ],
        helpful: 12,
        verified: true,
        response: {
            text: "Thank you for your wonderful feedback! We're delighted that you loved our products. Quality is our top priority.",
            date: "2025-01-25"
        }
    },
    {
        id: "2",
        orderId: "ORD-2025-002",
        supplier: "Fresh Spice Co.",
        supplierAvatar: "FS",
        rating: 4,
        title: "Good spices but delivery was delayed",
        comment: "The garam masala and red chili powder were fresh and aromatic. Quality is really good but the delivery was a day late. Overall satisfied with the purchase.",
        date: "2025-01-24",
        items: [
            "Garam Masala",
            "Red Chili Powder"
        ],
        helpful: 8,
        verified: true
    },
    {
        id: "3",
        orderId: "ORD-2025-003",
        supplier: "Grain Merchants",
        supplierAvatar: "GM",
        rating: 5,
        title: "Perfect basmati rice quality",
        comment: "The basmati rice was of premium quality with long grains and wonderful aroma. Packaging was professional and the price was very reasonable. Will definitely order again.",
        date: "2025-01-23",
        items: [
            "Basmati Rice"
        ],
        helpful: 15,
        verified: true,
        response: {
            text: "We're thrilled that you enjoyed our premium basmati rice! Thank you for choosing us.",
            date: "2025-01-23"
        }
    },
    {
        id: "4",
        orderId: "ORD-2025-004",
        supplier: "Organic Vegetables",
        supplierAvatar: "OV",
        rating: 3,
        title: "Fresh vegetables but packaging could be better",
        comment: "The onions and tomatoes were fresh and good quality. However, some tomatoes were slightly damaged due to poor packaging. Taste was good overall.",
        date: "2025-01-22",
        items: [
            "Fresh Onions",
            "Tomatoes"
        ],
        helpful: 5,
        verified: true
    },
    {
        id: "5",
        orderId: "ORD-2025-005",
        supplier: "Dairy Fresh",
        supplierAvatar: "DF",
        rating: 4,
        title: "Good paneer quality",
        comment: "The paneer was fresh and soft. Perfect for making curries. Price is reasonable and delivery was quick. Satisfied with the purchase.",
        date: "2025-01-21",
        items: [
            "Paneer"
        ],
        helpful: 7,
        verified: true
    }
];
const ratingStats = {
    averageRating: 4.2,
    totalReviews: 127,
    distribution: {
        5: 65,
        4: 32,
        3: 18,
        2: 8,
        1: 4
    }
};
export default function Rating() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [reviews] = useState(mockReviews);
    const [searchTerm, setSearchTerm] = useState("");
    const [ratingFilter, setRatingFilter] = useState("all");
    const [newReview, setNewReview] = useState({
        rating: 5,
        title: "",
        comment: ""
    });
    const [showReviewForm, setShowReviewForm] = useState(false);
    const filteredReviews = reviews.filter((review)=>{
        const matchesSearch = review.supplier.toLowerCase().includes(searchTerm.toLowerCase()) || review.title.toLowerCase().includes(searchTerm.toLowerCase()) || review.comment.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRating = ratingFilter === "all" || review.rating.toString() === ratingFilter;
        return matchesSearch && matchesRating;
    });
    const handleSubmitReview = ()=>{
        if (!newReview.title || !newReview.comment) {
            toast({
                title: "Please fill all fields",
                description: "Title and comment are required",
                variant: "destructive"
            });
            return;
        }
        toast({
            title: "Review Submitted",
            description: "Thank you for your feedback! Your review has been posted."
        });
        setNewReview({
            rating: 5,
            title: "",
            comment: ""
        });
        setShowReviewForm(false);
    };
    const handleHelpful = (reviewId)=>{
        toast({
            title: "Thank you!",
            description: "Your feedback has been recorded"
        });
    };
    const renderStars = (rating, size = "w-4 h-4")=>{
        return Array.from({
            length: 5
        }, (_, i)=>/*#__PURE__*/ React.createElement(Star, {
                key: i,
                className: `${size} ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`
            }));
    };
    const getPercentage = (count)=>{
        return Math.round(count / ratingStats.totalReviews * 100);
    };
    return /*#__PURE__*/ React.createElement("div", {
        className: "min-h-screen bg-gray-50"
    }, /* Header */ /*#__PURE__*/ React.createElement("header", {
        className: "bg-white border-b sticky top-0 z-40"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between h-16"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-4"
    }, /*#__PURE__*/ React.createElement(Link, {
        to: "/vendor/dashboard",
        className: "flex items-center text-gray-600 hover:text-saffron-600 transition-colors"
    }, /*#__PURE__*/ React.createElement(ArrowLeft, {
        className: "w-4 h-4 mr-2"
    }), "Back to Dashboard"), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-8 h-8 bg-gradient-to-r from-saffron-500 to-emerald-500 rounded-lg flex items-center justify-center"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-white font-bold text-sm"
    }, "JB")), /*#__PURE__*/ React.createElement("span", {
        className: "text-xl font-bold bg-gradient-to-r from-saffron-600 to-emerald-600 bg-clip-text text-transparent"
    }, "JugaduBazar"))), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center space-x-2"
    }, /*#__PURE__*/ React.createElement(Badge, {
        className: "bg-yellow-100 text-yellow-700"
    }, /*#__PURE__*/ React.createElement(Star, {
        className: "w-3 h-3 mr-1"
    }), ratingStats.averageRating, "/5"), /*#__PURE__*/ React.createElement(Button, {
        size: "sm",
        onClick: ()=>setShowReviewForm(!showReviewForm),
        className: "bg-gradient-to-r from-saffron-500 to-orange-500"
    }, "Write Review"))))), /*#__PURE__*/ React.createElement("div", {
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    }, /* Page Header */ /*#__PURE__*/ React.createElement("div", {
        className: "mb-8"
    }, /*#__PURE__*/ React.createElement("h1", {
        className: "text-3xl font-bold text-gray-900 mb-2"
    }, "Ratings & Reviews"), /*#__PURE__*/ React.createElement("p", {
        className: "text-gray-600"
    }, "Your feedback and reviews for supplier orders")), /* Rating Overview */ /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
    }, /*#__PURE__*/ React.createElement(Card, {
        className: "lg:col-span-1"
    }, /*#__PURE__*/ React.createElement(CardHeader, {
        className: "text-center"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "mx-auto w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4"
    }, /*#__PURE__*/ React.createElement(Star, {
        className: "w-8 h-8 text-white fill-current"
    })), /*#__PURE__*/ React.createElement(CardTitle, {
        className: "text-3xl font-bold"
    }, ratingStats.averageRating), /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-center space-x-1 mb-2"
    }, renderStars(Math.round(ratingStats.averageRating))), /*#__PURE__*/ React.createElement(CardDescription, null, "Based on ", ratingStats.totalReviews, " reviews"))), /*#__PURE__*/ React.createElement(Card, {
        className: "lg:col-span-2"
    }, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, null, "Rating Distribution")), /*#__PURE__*/ React.createElement(CardContent, null, /*#__PURE__*/ React.createElement("div", {
        className: "space-y-3"
    }, [
        5,
        4,
        3,
        2,
        1
    ].map((rating)=>/*#__PURE__*/ React.createElement("div", {
            key: rating,
            className: "flex items-center"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "text-sm font-medium w-8"
        }, rating), /*#__PURE__*/ React.createElement(Star, {
            className: "w-4 h-4 text-yellow-400 fill-current mr-2"
        }), /*#__PURE__*/ React.createElement("div", {
            className: "flex-1 bg-gray-200 rounded-full h-2 mr-3"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "bg-yellow-400 h-2 rounded-full",
            style: {
                width: `${getPercentage(ratingStats.distribution[rating])}%`
            }
        })), /*#__PURE__*/ React.createElement("span", {
            className: "text-sm text-gray-600 w-12"
        }, ratingStats.distribution[rating]))))))), /* Quick Stats */ /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
    }, /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-4 text-center"
    }, /*#__PURE__*/ React.createElement(Award, {
        className: "w-6 h-6 text-yellow-500 mx-auto mb-2"
    }), /*#__PURE__*/ React.createElement("p", {
        className: "text-lg font-bold text-gray-900"
    }, reviews.filter((r)=>r.rating >= 4).length), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-600"
    }, "Positive Reviews"))), /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-4 text-center"
    }, /*#__PURE__*/ React.createElement(MessageCircle, {
        className: "w-6 h-6 text-blue-500 mx-auto mb-2"
    }), /*#__PURE__*/ React.createElement("p", {
        className: "text-lg font-bold text-gray-900"
    }, reviews.filter((r)=>r.response).length), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-600"
    }, "Supplier Responses"))), /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-4 text-center"
    }, /*#__PURE__*/ React.createElement(ThumbsUp, {
        className: "w-6 h-6 text-green-500 mx-auto mb-2"
    }), /*#__PURE__*/ React.createElement("p", {
        className: "text-lg font-bold text-gray-900"
    }, reviews.reduce((sum, r)=>sum + r.helpful, 0)), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-600"
    }, "Helpful Votes"))), /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-4 text-center"
    }, /*#__PURE__*/ React.createElement(Package, {
        className: "w-6 h-6 text-purple-500 mx-auto mb-2"
    }), /*#__PURE__*/ React.createElement("p", {
        className: "text-lg font-bold text-gray-900"
    }, reviews.filter((r)=>r.verified).length), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-600"
    }, "Verified Purchases")))), /* Write Review Form */ showReviewForm && /*#__PURE__*/ React.createElement(Card, {
        className: "mb-8"
    }, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, null, "Write a Review"), /*#__PURE__*/ React.createElement(CardDescription, null, "Share your experience with other vendors")), /*#__PURE__*/ React.createElement(CardContent, {
        className: "space-y-4"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
        className: "block text-sm font-medium text-gray-700 mb-2"
    }, "Rating"), /*#__PURE__*/ React.createElement("div", {
        className: "flex space-x-1"
    }, [
        1,
        2,
        3,
        4,
        5
    ].map((rating)=>/*#__PURE__*/ React.createElement("button", {
            key: rating,
            onClick: ()=>setNewReview((prev)=>({
                        ...prev,
                        rating
                    })),
            className: "p-1"
        }, /*#__PURE__*/ React.createElement(Star, {
            className: `w-6 h-6 ${rating <= newReview.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`
        }))))), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
        className: "block text-sm font-medium text-gray-700 mb-2"
    }, "Review Title"), /*#__PURE__*/ React.createElement(Input, {
        placeholder: "Summarize your experience...",
        value: newReview.title,
        onChange: (e)=>setNewReview((prev)=>({
                    ...prev,
                    title: e.target.value
                }))
    })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
        className: "block text-sm font-medium text-gray-700 mb-2"
    }, "Your Review"), /*#__PURE__*/ React.createElement(Textarea, {
        placeholder: "Tell others about your experience with this supplier...",
        rows: 4,
        value: newReview.comment,
        onChange: (e)=>setNewReview((prev)=>({
                    ...prev,
                    comment: e.target.value
                }))
    })), /*#__PURE__*/ React.createElement("div", {
        className: "flex gap-2"
    }, /*#__PURE__*/ React.createElement(Button, {
        onClick: handleSubmitReview
    }, "Submit Review"), /*#__PURE__*/ React.createElement(Button, {
        variant: "outline",
        onClick: ()=>setShowReviewForm(false)
    }, "Cancel")))), /* Search and Filters */ /*#__PURE__*/ React.createElement(Card, {
        className: "mb-6"
    }, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex gap-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex-1 relative"
    }, /*#__PURE__*/ React.createElement(Search, {
        className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
    }), /*#__PURE__*/ React.createElement(Input, {
        placeholder: "Search reviews, suppliers...",
        value: searchTerm,
        onChange: (e)=>setSearchTerm(e.target.value),
        className: "pl-10"
    })), /*#__PURE__*/ React.createElement("select", {
        value: ratingFilter,
        onChange: (e)=>setRatingFilter(e.target.value),
        className: "px-3 py-2 border border-gray-300 rounded-md"
    }, /*#__PURE__*/ React.createElement("option", {
        value: "all"
    }, "All Ratings"), /*#__PURE__*/ React.createElement("option", {
        value: "5"
    }, "5 Stars"), /*#__PURE__*/ React.createElement("option", {
        value: "4"
    }, "4 Stars"), /*#__PURE__*/ React.createElement("option", {
        value: "3"
    }, "3 Stars"), /*#__PURE__*/ React.createElement("option", {
        value: "2"
    }, "2 Stars"), /*#__PURE__*/ React.createElement("option", {
        value: "1"
    }, "1 Star"))))), /* Reviews List */ /*#__PURE__*/ React.createElement("div", {
        className: "space-y-6"
    }, filteredReviews.length === 0 ? /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-12 text-center"
    }, /*#__PURE__*/ React.createElement(MessageCircle, {
        className: "w-12 h-12 text-gray-300 mx-auto mb-4"
    }), /*#__PURE__*/ React.createElement("h3", {
        className: "text-lg font-medium text-gray-900 mb-2"
    }, "No reviews found"), /*#__PURE__*/ React.createElement("p", {
        className: "text-gray-500"
    }, searchTerm || ratingFilter !== "all" ? "Try adjusting your search or filter criteria" : "Start by ordering from suppliers to leave reviews"))) : filteredReviews.map((review)=>/*#__PURE__*/ React.createElement(Card, {
            key: review.id
        }, /*#__PURE__*/ React.createElement(CardContent, {
            className: "p-6"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-start justify-between mb-4"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center space-x-3"
        }, /*#__PURE__*/ React.createElement(Avatar, null, /*#__PURE__*/ React.createElement(AvatarFallback, {
            className: "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
        }, review.supplierAvatar)), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h4", {
            className: "font-semibold text-gray-900"
        }, review.supplier), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center space-x-2"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex space-x-1"
        }, renderStars(review.rating)), /*#__PURE__*/ React.createElement("span", {
            className: "text-sm text-gray-500"
        }, new Date(review.date).toLocaleDateString()), review.verified && /*#__PURE__*/ React.createElement(Badge, {
            variant: "secondary",
            className: "text-xs"
        }, "Verified Purchase")))), /*#__PURE__*/ React.createElement(Badge, {
            variant: "outline",
            className: "text-xs"
        }, review.orderId)), /*#__PURE__*/ React.createElement("h5", {
            className: "font-medium text-gray-900 mb-2"
        }, review.title), /*#__PURE__*/ React.createElement("p", {
            className: "text-gray-700 mb-3"
        }, review.comment), /*#__PURE__*/ React.createElement("div", {
            className: "flex flex-wrap gap-2 mb-4"
        }, review.items.map((item, idx)=>/*#__PURE__*/ React.createElement(Badge, {
                key: idx,
                variant: "outline",
                className: "text-xs"
            }, item))), review.response && /*#__PURE__*/ React.createElement("div", {
            className: "bg-gray-50 border-l-4 border-blue-500 p-4 mt-4"
        }, /*#__PURE__*/ React.createElement("p", {
            className: "text-sm font-medium text-gray-900 mb-1"
        }, "Response from ", review.supplier, ":"), /*#__PURE__*/ React.createElement("p", {
            className: "text-sm text-gray-700"
        }, review.response.text), /*#__PURE__*/ React.createElement("p", {
            className: "text-xs text-gray-500 mt-2"
        }, new Date(review.response.date).toLocaleDateString())), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center justify-between mt-4 pt-4 border-t border-gray-200"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center space-x-4"
        }, /*#__PURE__*/ React.createElement("button", {
            onClick: ()=>handleHelpful(review.id),
            className: "flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
        }, /*#__PURE__*/ React.createElement(ThumbsUp, {
            className: "w-4 h-4"
        }), /*#__PURE__*/ React.createElement("span", null, "Helpful (", review.helpful, ")"))))))))));
}
