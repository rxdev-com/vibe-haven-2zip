import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import { useLanguage, languages } from "@/contexts/LanguageContext";
export default function LanguageSelector({ showIcon = true }) {
    const { addNotification } = useNotifications();
    const { language, setLanguage } = useLanguage();
    const handleLanguageChange = (newLanguage)=>{
        setLanguage(newLanguage);
        addNotification({
            title: "Language Changed",
            message: `Language switched to ${languages[newLanguage].nativeName}`,
            type: "success",
            icon: languages[newLanguage].flag
        });
    };
    return /*#__PURE__*/ React.createElement(Select, {
        value: language,
        onValueChange: handleLanguageChange
    }, /*#__PURE__*/ React.createElement(SelectTrigger, {
        className: "w-36"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center"
    }, showIcon && /*#__PURE__*/ React.createElement(Globe, {
        className: "w-4 h-4 mr-2"
    }), /*#__PURE__*/ React.createElement(SelectValue, null, /*#__PURE__*/ React.createElement("span", {
        className: "flex items-center"
    }, languages[language].flag, /*#__PURE__*/ React.createElement("span", {
        className: "ml-2"
    }, languages[language].nativeName))))), /*#__PURE__*/ React.createElement(SelectContent, null, Object.entries(languages).map(([code, lang])=>/*#__PURE__*/ React.createElement(SelectItem, {
            key: code,
            value: code
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center space-x-2"
        }, /*#__PURE__*/ React.createElement("span", null, lang.flag), /*#__PURE__*/ React.createElement("span", null, lang.nativeName), /*#__PURE__*/ React.createElement("span", {
            className: "text-xs text-gray-500"
        }, "(", lang.name, ")"))))));
}
// Translation context and hook
export const translations = {
    en: {
        // Common
        login: "Login",
        register: "Register",
        logout: "Logout",
        dashboard: "Dashboard",
        profile: "Profile",
        settings: "Settings",
        save: "Save",
        cancel: "Cancel",
        edit: "Edit",
        delete: "Delete",
        view: "View",
        back: "Back",
        next: "Next",
        loading: "Loading...",
        error: "Error",
        success: "Success",
        // Navigation
        home: "Home",
        marketplace: "Marketplace",
        orders: "Orders",
        inventory: "Inventory",
        analytics: "Analytics",
        // Vendor specific
        vendorDashboard: "Vendor Dashboard",
        findSuppliers: "Find Suppliers",
        myOrders: "My Orders",
        activeOrders: "Active Orders",
        inTransit: "In Transit",
        savedItems: "Saved Items",
        browseItems: "Browse Items",
        sellItems: "Sell Items",
        myListings: "My Listings",
        // Supplier specific
        supplierDashboard: "Supplier Dashboard",
        totalProducts: "Total Products",
        pendingOrders: "Pending Orders",
        monthlyRevenue: "Monthly Revenue",
        completedOrders: "Completed Orders",
        // Forms
        email: "Email",
        password: "Password",
        name: "Name",
        businessName: "Business Name",
        phone: "Phone",
        address: "Address",
        description: "Description",
        // Messages
        loginSuccess: "Login successful",
        loginFailed: "Login failed",
        invalidCredentials: "Invalid email or password",
        registrationSuccess: "Registration successful",
        profileUpdated: "Profile updated successfully",
        itemAdded: "Item added to cart",
        itemRemoved: "Item removed from cart"
    },
    hi: {
        // Common
        login: "लॉग���न",
        register: "पंजीकरण",
        logout: "लॉगआउट",
        dashboard: "डैशबोर्ड",
        profile: "प्रोफाइल",
        settings: "सेटिंग्स",
        save: "सेव करें",
        cancel: "रद्द करें",
        edit: "संपादित करें",
        delete: "हटाएं",
        view: "देखें",
        back: "वापस",
        next: "अगला",
        loading: "लोड हो रहा है...",
        error: "त्रुटि",
        success: "सफलता",
        // Navigation
        home: "होम",
        marketplace: "मार्केटप्लेस",
        orders: "ऑर्डर",
        inventory: "इन्वेंट्री",
        analytics: "एनालिटिक्स",
        // Vendor specific
        vendorDashboard: "विक्रेता डैशबोर्ड",
        findSuppliers: "आपूर्तिकर्ता खोजें",
        myOrders: "मेरे ऑर्डर",
        activeOrders: "सक्रिय ऑर्डर",
        inTransit: "ट्रांजिट में",
        savedItems: "सेव किए गए आइटम",
        browseItems: "आइटम ब्राउज़ करें",
        sellItems: "आइटम बेचें",
        myListings: "मेरी लिस्टिंग",
        // Supplier specific
        supplierDashboard: "आपूर्तिकर्ता डैशबोर्ड",
        totalProducts: "कुल उत्पाद",
        pendingOrders: "लंबित ऑर्डर",
        monthlyRevenue: "मासिक आय",
        completedOrders: "पूर्ण ऑर्डर",
        // Forms
        email: "ईमेल",
        password: "पासवर्ड",
        name: "नाम",
        businessName: "व्यवसाय का नाम",
        phone: "फोन",
        address: "पता",
        description: "विवरण",
        // Messages
        loginSuccess: "लॉगिन सफल",
        loginFailed: "लॉगिन असफल",
        invalidCredentials: "अमान्य ��मेल या पासवर्ड",
        registrationSuccess: "पंजीकरण सफल",
        profileUpdated: "प्रोफाइल सफलतापूर्वक अपडेट किया गया",
        itemAdded: "आइटम कार्ट में जोड़ा गया",
        itemRemoved: "आइटम कार्ट से हटाया गया"
    },
    ta: {
        // Common
        login: "உள்நுழை",
        register: "பதிவு செய்யவும்",
        logout: "வெளியேறு",
        dashboard: "டாஷ்போர்டு",
        profile: "சுயவிவரம்",
        settings: "அமைப்புகள்",
        save: "சேமி",
        cancel: "ரத்து செய்",
        edit: "திருத்து",
        delete: "நீக்கு",
        view: "பார்",
        back: "திரும்பு",
        next: "அடுத்து",
        loading: "ஏற்றுகிறது...",
        error: "பிழை",
        success: "வெற்றி",
        // Navigation
        home: "வீடு",
        marketplace: "சந்தை",
        orders: "ஆர்டர்கள்",
        inventory: "சரக்கு",
        analytics: "பகுப்பாய்வு",
        // Vendor specific
        vendorDashboard: "விற்பனையாளர் டாஷ்போர்டு",
        findSuppliers: "சப்ளையர்களைக் கண்டறியவும்",
        myOrders: "என் ஆர்டர்கள்",
        activeOrders: "செயலில் உள்ள ஆர்டர்கள்",
        inTransit: "போக்குவரத்தில்",
        savedItems: "சேமித்த பொருட்கள்",
        browseItems: "பொருட்களை உலாவவும்",
        sellItems: "பொருட்களை விற்கவும்",
        myListings: "என் பட்டியல்கள்",
        // Supplier specific
        supplierDashboard: "சப்ளையர் டாஷ்போர்டு",
        totalProducts: "மொத்த தயாரிப்புகள்",
        pendingOrders: "நிலுவையில் உள்ள ஆர்டர்கள்",
        monthlyRevenue: "மாதாந்திர வருமானம்",
        completedOrders: "முடிந்த ஆர்டர்கள்",
        // Forms
        email: "மின்னஞ்சல்",
        password: "கடவுச்சொல்",
        name: "பெயர்",
        businessName: "வணிகப் பெயர்",
        phone: "தொலைபேசி",
        address: "முகவரி",
        description: "விளக்கம்",
        // Messages
        loginSuccess: "உள்நுழைவு வெற்றிகரமாக",
        loginFailed: "உள்நுழைவு தோல்வி",
        invalidCredentials: "தவறான மின்னஞ்சல் அல்லது கடவ��ச்சொல்",
        registrationSuccess: "பதிவு வெற்றிகரமாக",
        profileUpdated: "சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது",
        itemAdded: "பொருள் கார்ட்டில் சேர்க்கப்பட்டது",
        itemRemoved: "பொருள் கார்ட்டிலிருந்து அகற்றப்பட்டது"
    },
    bn: {
        // Common translations in Bengali
        login: "লগইন",
        register: "নিবন্ধন",
        logout: "লগআউট",
        dashboard: "ড্যাশবোর্ড",
        profile: "প্রোফাইল",
        settings: "সেটিংস",
        save: "সংরক্ষণ করুন",
        cancel: "বাতিল করুন",
        edit: "সম্পাদনা করুন",
        delete: "মুছে ফেলুন",
        view: "দেখুন",
        back: "ফিরে যান",
        next: "পরবর্তী",
        loading: "লোড হচ্ছে...",
        error: "ত্রুটি",
        success: "সফলতা",
        // Navigation
        home: "হোম",
        marketplace: "মার্কেটপ্লেস",
        orders: "অর্ডার",
        inventory: "ইনভেন্টরি",
        analytics: "অ্যানালিটিক্স",
        // Vendor specific
        vendorDashboard: "ভেন্ডর ড্যাশবোর্ড",
        findSuppliers: "সরবরাহকারী খুঁজুন",
        myOrders: "আমার অর্ডার",
        activeOrders: "সক্রিয় অর্ডার",
        inTransit: "ট্রানজিটে",
        savedItems: "সংরক্ষিত আইটেম",
        browseItems: "আইটেম ব্রাউজ করুন",
        sellItems: "আইটেম বিক্রি করুন",
        myListings: "আমার তালিকা",
        // Add more translations...
        email: "ইমেইল",
        password: "পাসওয়ার্ড",
        name: "নাম",
        businessName: "ব্যবসার নাম",
        phone: "ফোন",
        address: "ঠিকানা",
        description: "বিবরণ"
    },
    te: {
        // Common translations in Telugu
        login: "లాగిన్",
        register: "నమోదు",
        logout: "లాగౌట్",
        dashboard: "డ్యాష్‌బోర్డ్",
        profile: "ప్రొఫైల్",
        settings: "సె��్టింగ్స్",
        save: "సేవ్ చేయండి",
        cancel: "రద్దు చేయండి",
        edit: "ఎడిట్ చేయండి",
        delete: "తొలగించండి",
        view: "చూడండి",
        back: "వెనుక",
        next: "తదుపరి",
        loading: "లోడవుతోంది...",
        error: "లోపం",
        success: "విజయం",
        email: "ఇమెయిల్",
        password: "పాస్‌వర్డ్",
        name: "పేరు",
        businessName: "వ్యాపార పేరు",
        phone: "ఫోన్",
        address: "చిరునామా",
        description: "వివరణ"
    },
    mr: {
        // Common translations in Marathi
        login: "लॉगिन",
        register: "नोंदणी",
        logout: "लॉगआउट",
        dashboard: "डॅशबोर्ड",
        profile: "प्रोफाइल",
        settings: "सेटिंग्ज",
        save: "सेव्ह करा",
        cancel: "रद्द करा",
        edit: "संपादित करा",
        delete: "हटवा",
        view: "पहा",
        back: "परत",
        next: "पुढे",
        loading: "लोड होत आहे...",
        error: "त्रुटी",
        success: "यश",
        email: "ईमेल",
        password: "पासवर्ड",
        name: "नाव",
        businessName: "व्यवसायाचे नाव",
        phone: "फोन",
        address: "पत्ता",
        description: "वर्णन"
    }
};
export const useTranslation = (language = 'en')=>{
    const t = (key)=>{
        return translations[language]?.[key] || translations.en[key] || key;
    };
    return {
        t
    };
};
