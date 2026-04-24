import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/contexts/NotificationContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Star, StarHalf, User, Check, ThumbsUp } from "lucide-react";
// Mock reviews data
const mockReviews = [
    {
        id: "1",
        rating: 5,
        comment: "Excellent service! Fast delivery and great quality products. Highly recommended for all vendors.",
        reviewerName: "Sharma Food Corner",
        date: new Date('2024-01-15'),
        orderId: "ORD123",
        helpful: 8,
        verified: true
    },
    {
        id: "2",
        rating: 4,
        comment: "Good quality ingredients and reasonable prices. Communication could be better but overall satisfied.",
        reviewerName: "Delhi Street Food",
        date: new Date('2024-01-10'),
        orderId: "ORD124",
        helpful: 5,
        verified: true
    },
    {
        id: "3",
        rating: 5,
        comment: "Best supplier in the area! Always reliable and professional. Been ordering for 6 months now.",
        reviewerName: "Mumbai Chaat House",
        date: new Date('2024-01-08'),
        helpful: 12,
        verified: true
    },
    {
        id: "4",
        rating: 3,
        comment: "Average experience. Products are okay but delivery was delayed twice.",
        reviewerName: "Kolkata Kitchen",
        date: new Date('2024-01-05'),
        orderId: "ORD125",
        helpful: 2,
        verified: false
    }
];
export default function VendorRating({ vendor, trigger, canReview = false, onReviewSubmitted }) {
    const { addNotification } = useNotifications();
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [reviews] = useState(mockReviews);
    const renderStars = (rating, size = "w-4 h-4")=>{
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        for(let i = 0; i < fullStars; i++){
            stars.push(/*#__PURE__*/ React.createElement(Star, {
                key: i,
                className: `${size} fill-yellow-400 text-yellow-400`
            }));
        }
        if (hasHalfStar) {
            stars.push(/*#__PURE__*/ React.createElement(StarHalf, {
                key: "half",
                className: `${size} fill-yellow-400 text-yellow-400`
            }));
        }
        const remainingStars = 5 - Math.ceil(rating);
        for(let i = 0; i < remainingStars; i++){
            stars.push(/*#__PURE__*/ React.createElement(Star, {
                key: `empty-${i}`,
                className: `${size} text-gray-300`
            }));
        }
        return stars;
    };
    const handleSubmitReview = ()=>{
        if (rating === 0) {
            addNotification({
                title: t("pleaseProvideRating"),
                message: t("ratingRequired"),
                type: "error",
                icon: "⭐"
            });
            return;
        }
        const reviewData = {
            rating,
            comment,
            vendorId: vendor.id,
            reviewerName: "Your Business Name"
        };
        // This would come from user context
        // Mock submission
        addNotification({
            title: t("reviewSubmitted"),
            message: t("thankYouForReview"),
            type: "success",
            icon: "🌟"
        });
        onReviewSubmitted?.(reviewData);
        setShowReviewForm(false);
        setRating(0);
        setComment("");
    };
    const getRatingDistribution = ()=>{
        const distribution = {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0
        };
        reviews.forEach((review)=>{
            distribution[review.rating]++;
        });
        return distribution;
    };
    const ratingDistribution = getRatingDistribution();
    const totalReviews = reviews.length;
    const defaultTrigger = /*#__PURE__*/ React.createElement(Button, {
        variant: "outline",
        size: "sm"
    }, /*#__PURE__*/ React.createElement(Star, {
        className: "w-4 h-4 mr-2"
    }), vendor.rating.toFixed(1), " (", vendor.totalReviews, ")");
    return /*#__PURE__*/ React.createElement(Dialog, {
        open: isOpen,
        onOpenChange: setIsOpen
    }, /*#__PURE__*/ React.createElement(DialogTrigger, {
        asChild: true
    }, trigger || defaultTrigger), /*#__PURE__*/ React.createElement(DialogContent, {
        className: "sm:max-w-2xl max-h-[90vh] overflow-y-auto"
    }, /*#__PURE__*/ React.createElement(DialogHeader, null, /*#__PURE__*/ React.createElement(DialogTitle, {
        className: "flex items-center"
    }, /*#__PURE__*/ React.createElement(Star, {
        className: "w-5 h-5 mr-2 text-yellow-500"
    }), t("vendorRatingsAndReviews")), /*#__PURE__*/ React.createElement(DialogDescription, null, vendor.businessName, " • ", t("overallRating"), ": ", vendor.rating.toFixed(1), "/5")), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-6"
    }, /* Rating Overview */ /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardContent, {
        className: "p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-6"
    }, /* Overall Rating */ /*#__PURE__*/ React.createElement("div", {
        className: "text-center"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "text-4xl font-bold text-gray-900 mb-2"
    }, vendor.rating.toFixed(1)), /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-center mb-2"
    }, renderStars(vendor.rating, "w-5 h-5")), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-600"
    }, t("basedOnReviews", {
        count: vendor.totalReviews
    }))), /* Rating Distribution */ /*#__PURE__*/ React.createElement("div", {
        className: "space-y-2"
    }, [
        5,
        4,
        3,
        2,
        1
    ].map((stars)=>/*#__PURE__*/ React.createElement("div", {
            key: stars,
            className: "flex items-center space-x-3"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "text-sm font-medium w-8"
        }, stars), /*#__PURE__*/ React.createElement(Star, {
            className: "w-4 h-4 fill-yellow-400 text-yellow-400"
        }), /*#__PURE__*/ React.createElement("div", {
            className: "flex-1 bg-gray-200 rounded-full h-2"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "bg-yellow-400 h-2 rounded-full",
            style: {
                width: `${totalReviews > 0 ? ratingDistribution[stars] / totalReviews * 100 : 0}%`
            }
        })), /*#__PURE__*/ React.createElement("span", {
            className: "text-sm text-gray-600 w-8"
        }, ratingDistribution[stars]))))))), /* Actions */ canReview && /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-center"
    }, /*#__PURE__*/ React.createElement(Button, {
        onClick: ()=>setShowReviewForm(true),
        className: "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
    }, /*#__PURE__*/ React.createElement(Star, {
        className: "w-4 h-4 mr-2"
    }), t("writeReview"))), /* Review Form */ showReviewForm && /*#__PURE__*/ React.createElement(Card, null, /*#__PURE__*/ React.createElement(CardHeader, null, /*#__PURE__*/ React.createElement(CardTitle, {
        className: "text-lg"
    }, t("writeYourReview")), /*#__PURE__*/ React.createElement(CardDescription, null, t("shareYourExperience"))), /*#__PURE__*/ React.createElement(CardContent, {
        className: "space-y-4"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
        className: "block text-sm font-medium text-gray-700 mb-2"
    }, t("yourRating"), " *"), /*#__PURE__*/ React.createElement("div", {
        className: "flex space-x-1"
    }, [
        1,
        2,
        3,
        4,
        5
    ].map((star)=>/*#__PURE__*/ React.createElement("button", {
            key: star,
            type: "button",
            onClick: ()=>setRating(star),
            className: "focus:outline-none"
        }, /*#__PURE__*/ React.createElement(Star, {
            className: `w-8 h-8 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-400"}`
        }))))), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
        className: "block text-sm font-medium text-gray-700 mb-2"
    }, t("yourComment")), /*#__PURE__*/ React.createElement(Textarea, {
        placeholder: t("shareDetailedFeedback"),
        value: comment,
        onChange: (e)=>setComment(e.target.value),
        rows: 4
    })), /*#__PURE__*/ React.createElement("div", {
        className: "flex gap-2"
    }, /*#__PURE__*/ React.createElement(Button, {
        variant: "outline",
        onClick: ()=>setShowReviewForm(false)
    }, t("cancel")), /*#__PURE__*/ React.createElement(Button, {
        onClick: handleSubmitReview
    }, /*#__PURE__*/ React.createElement(Check, {
        className: "w-4 h-4 mr-2"
    }), t("submitReview"))))), /* Reviews List */ /*#__PURE__*/ React.createElement("div", {
        className: "space-y-4"
    }, /*#__PURE__*/ React.createElement("h3", {
        className: "text-lg font-semibold"
    }, t("customerReviews")), reviews.map((review)=>/*#__PURE__*/ React.createElement(Card, {
            key: review.id
        }, /*#__PURE__*/ React.createElement(CardContent, {
            className: "p-4"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-start justify-between mb-3"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center space-x-3"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
        }, /*#__PURE__*/ React.createElement(User, {
            className: "w-5 h-5 text-white"
        })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center space-x-2"
        }, /*#__PURE__*/ React.createElement("h4", {
            className: "font-medium"
        }, review.reviewerName), review.verified && /*#__PURE__*/ React.createElement(Badge, {
            className: "bg-green-100 text-green-700 text-xs"
        }, /*#__PURE__*/ React.createElement(Check, {
            className: "w-3 h-3 mr-1"
        }), t("verified"))), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center space-x-2 mt-1"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex"
        }, renderStars(review.rating, "w-3 h-3")), /*#__PURE__*/ React.createElement("span", {
            className: "text-xs text-gray-500"
        }, review.date.toLocaleDateString()))))), /*#__PURE__*/ React.createElement("p", {
            className: "text-gray-700 mb-3"
        }, review.comment), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center justify-between text-sm"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center space-x-4"
        }, review.orderId && /*#__PURE__*/ React.createElement("span", {
            className: "text-gray-500"
        }, t("order"), ": ", review.orderId), /*#__PURE__*/ React.createElement(Button, {
            variant: "ghost",
            size: "sm",
            className: "text-gray-500 hover:text-blue-600"
        }, /*#__PURE__*/ React.createElement(ThumbsUp, {
            className: "w-3 h-3 mr-1"
        }), t("helpful"), " (", review.helpful, ")")))))))), /*#__PURE__*/ React.createElement(DialogFooter, null, /*#__PURE__*/ React.createElement(Button, {
        variant: "outline",
        onClick: ()=>setIsOpen(false)
    }, t("close")))));
}
