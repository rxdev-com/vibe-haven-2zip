import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
const AuthContext = /*#__PURE__*/ createContext(undefined);
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    // Load user from localStorage on mount
    useEffect(()=>{
        const savedUser = localStorage.getItem("user");
        const token = localStorage.getItem("authToken");
        if (savedUser && token) {
            try {
                const userData = JSON.parse(savedUser);
                setUser(userData);
            } catch (error) {
                // Clear invalid data
                localStorage.removeItem("user");
                localStorage.removeItem("authToken");
            }
        }
        setIsLoading(false);
    }, []);
    const login = async (email, password, role)=>{
        try {
            setIsLoading(true);
            // Mock authentication - replace with actual API call
            await new Promise((resolve)=>setTimeout(resolve, 1000));
            // Simulate different users based on role
            const mockUser = {
                id: Date.now().toString(),
                name: role === "vendor" ? "Rajesh Kumar" : "Priya Supplies",
                email,
                phone: "+91 98765 43210",
                role,
                businessName: role === "vendor" ? "Rajesh's Chaat Corner" : "Priya Raw Materials Supply",
                address: role === "vendor" ? "Sector 15, Noida, Uttar Pradesh" : "Industrial Area, Ghaziabad, UP",
                description: role === "vendor" ? "Serving delicious North Indian street food since 2015" : "Premium quality raw materials supplier for food businesses",
                isVerified: true,
                emailVerified: false,
                // New users need email verification
                emailVerificationSentAt: new Date().toISOString()
            };
            // Check for valid credentials (mock)
            const validCredentials = email === "vendor@example.com" && password === "vendor123" && role === "vendor" || email === "supplier@example.com" && password === "supplier123" && role === "supplier" || email === "demo@jugadubazar.com" && password === "demo123";
            if (!validCredentials) {
                toast({
                    title: "Login failed",
                    description: "Invalid email or password",
                    variant: "destructive"
                });
                return false;
            }
            // Save to localStorage
            const authToken = btoa(`${email}:${Date.now()}`);
            // Mock token
            localStorage.setItem("user", JSON.stringify(mockUser));
            localStorage.setItem("authToken", authToken);
            setUser(mockUser);
            // Check if email verification is needed
            if (!mockUser.emailVerified) {
                toast({
                    title: "Email Verification Required",
                    description: "Please check your email and verify your account to access all features",
                    variant: "destructive"
                });
                // Send verification email automatically
                setTimeout(()=>{
                    sendEmailVerificationInternal(mockUser.email);
                }, 1000);
            } else {
                toast({
                    title: "Welcome back!",
                    description: `Successfully logged in as ${role}`
                });
            }
            return true;
        } catch (error) {
            toast({
                title: "Login error",
                description: "An error occurred during login. Please try again.",
                variant: "destructive"
            });
            return false;
        } finally{
            setIsLoading(false);
        }
    };
    const register = async (userData)=>{
        try {
            setIsLoading(true);
            // Mock registration - replace with actual API call
            await new Promise((resolve)=>setTimeout(resolve, 1500));
            // Check if email already exists (mock)
            if (userData.email === "existing@example.com") {
                toast({
                    title: "Registration failed",
                    description: "An account with this email already exists",
                    variant: "destructive"
                });
                return false;
            }
            toast({
                title: "Account created!",
                description: `Successfully registered as ${userData.role}. Please login to continue.`
            });
            return true;
        } catch (error) {
            toast({
                title: "Registration error",
                description: "An error occurred during registration. Please try again.",
                variant: "destructive"
            });
            return false;
        } finally{
            setIsLoading(false);
        }
    };
    const logout = ()=>{
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
        localStorage.removeItem("profileImage");
        // Clear profile image too
        setUser(null);
        toast({
            title: "Logged out",
            description: "You have been successfully logged out"
        });
    };
    const updateProfile = (updates)=>{
        if (user) {
            const updatedUser = {
                ...user,
                ...updates
            };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
        }
    };
    // Internal method for sending verification email
    const sendEmailVerificationInternal = async (email)=>{
        try {
            // Simulate API call to send verification email
            await new Promise((resolve)=>setTimeout(resolve, 1000));
            toast({
                title: "Verification Email Sent",
                description: `A verification link has been sent to ${email}`
            });
            return true;
        } catch (error) {
            toast({
                title: "Failed to Send Email",
                description: "Could not send verification email. Please try again.",
                variant: "destructive"
            });
            return false;
        }
    };
    const sendEmailVerification = async ()=>{
        if (!user) return false;
        return sendEmailVerificationInternal(user.email);
    };
    const verifyEmail = async (code)=>{
        try {
            setIsLoading(true);
            // Simulate API call to verify email with code
            await new Promise((resolve)=>setTimeout(resolve, 1500));
            // Mock verification - accept any 6-digit code
            if (code.length === 6 && /^\d+$/.test(code)) {
                if (user) {
                    const updatedUser = {
                        ...user,
                        emailVerified: true
                    };
                    setUser(updatedUser);
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                }
                toast({
                    title: "Email Verified Successfully!",
                    description: "Your email has been verified. You can now access all features."
                });
                return true;
            } else {
                toast({
                    title: "Invalid Verification Code",
                    description: "Please enter a valid 6-digit verification code",
                    variant: "destructive"
                });
                return false;
            }
        } catch (error) {
            toast({
                title: "Verification Failed",
                description: "Could not verify email. Please try again.",
                variant: "destructive"
            });
            return false;
        } finally{
            setIsLoading(false);
        }
    };
    const resendEmailVerification = async ()=>{
        if (!user) return false;
        if (user.emailVerificationSentAt) {
            const lastSent = new Date(user.emailVerificationSentAt);
            const now = new Date();
            const diffInMinutes = (now.getTime() - lastSent.getTime()) / (1000 * 60);
            if (diffInMinutes < 1) {
                toast({
                    title: "Please Wait",
                    description: "You can resend verification email after 1 minute",
                    variant: "destructive"
                });
                return false;
            }
        }
        const success = await sendEmailVerificationInternal(user.email);
        if (success && user) {
            const updatedUser = {
                ...user,
                emailVerificationSentAt: new Date().toISOString()
            };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
        }
        return success;
    };
    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        sendEmailVerification,
        verifyEmail,
        resendEmailVerification
    };
    return /*#__PURE__*/ React.createElement(AuthContext.Provider, {
        value: value
    }, children);
}
// Demo credentials for testing
export const DEMO_CREDENTIALS = {
    vendor: {
        email: "vendor@example.com",
        password: "vendor123"
    },
    supplier: {
        email: "supplier@example.com",
        password: "supplier123"
    },
    demo: {
        email: "demo@jugadubazar.com",
        password: "demo123"
    }
};
