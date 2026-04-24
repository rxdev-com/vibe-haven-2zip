import { useToast } from "@/hooks/use-toast";
export const formatPhoneNumber = (phone)=>{
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, "");
    // If it starts with +91, remove the +
    if (cleanPhone.startsWith("91") && cleanPhone.length === 12) {
        return cleanPhone;
    }
    // If it's a 10-digit number, add country code
    if (cleanPhone.length === 10) {
        return `91${cleanPhone}`;
    }
    return cleanPhone;
};
export const generateWhatsAppMessage = (data)=>{
    const { materialName, materialPrice, materialUnit, customMessage, vendorName } = data;
    if (customMessage) {
        return customMessage;
    }
    let message = `Hi! I'm ${vendorName || "a vendor"} from JugaduBazar.`;
    if (materialName) {
        message += `\n\nI'm interested in your *${materialName}*`;
        if (materialPrice && materialUnit) {
            message += ` (₹${materialPrice}/${materialUnit})`;
        }
        message += `.\n\nCould you please provide me with:`;
        message += `\n• Current availability and stock`;
        message += `\n• Minimum order quantity`;
        message += `\n• Delivery details and timeline`;
        message += `\n• Any bulk discounts available`;
        message += `\n\nThank you for your time!`;
    } else {
        message += `\n\nI'm looking for quality raw materials for my food business. Could you please share your product catalog and pricing details?`;
        message += `\n\nThank you!`;
    }
    return message;
};
export const openWhatsAppChat = (data)=>{
    const formattedPhone = formatPhoneNumber(data.supplierPhone);
    const message = generateWhatsAppMessage(data);
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    // Open WhatsApp in new tab
    window.open(whatsappUrl, "_blank");
};
export const useWhatsApp = ()=>{
    const { toast } = useToast();
    const chatWithSupplier = (data)=>{
        try {
            openWhatsAppChat(data);
            toast({
                title: "Opening WhatsApp",
                description: `Starting chat with ${data.supplierName}`
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Unable to open WhatsApp. Please try again.",
                variant: "destructive"
            });
        }
    };
    const validatePhoneNumber = (phone)=>{
        const cleanPhone = formatPhoneNumber(phone);
        return cleanPhone.length >= 10 && cleanPhone.length <= 15;
    };
    return {
        chatWithSupplier,
        validatePhoneNumber,
        formatPhoneNumber,
        generateWhatsAppMessage
    };
};
// Quick chat templates
export const CHAT_TEMPLATES = {
    PRODUCT_INQUIRY: (materialName, price, unit)=>`Hi! I'm interested in your ${materialName} (₹${price}/${unit}). Could you provide more details about availability and delivery?`,
    BULK_ORDER: (materialName)=>`Hi! I'm planning to place a bulk order for ${materialName}. Could you share your bulk pricing and minimum order quantities?`,
    URGENT_REQUIREMENT: (materialName)=>`Hi! I have an urgent requirement for ${materialName}. Is it available for immediate delivery? Please let me know ASAP.`,
    QUALITY_INQUIRY: (materialName)=>`Hi! I'd like to know more about the quality specifications and certifications for your ${materialName}. Could you share the details?`,
    GENERAL_INQUIRY: ()=>`Hi! I'm a vendor from JugaduBazar looking for quality raw materials. Could you share your product catalog and pricing?`
};
