import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { authAPI, authToken, userData as userStore } from "@/lib/api";

const AuthContext = createContext(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // On mount, hydrate user from cached data, then verify with backend
  useEffect(() => {
    const cached = userStore.get();
    if (cached) setUser(cached);
    const token = authToken.get();
    if (!token) {
      setIsLoading(false);
      return;
    }
    authAPI
      .me()
      .then((res) => {
        setUser(res.user);
        userStore.set(res.user);
      })
      .catch(() => {
        // Invalid/expired token
        authToken.remove();
        userStore.remove();
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(
    async (email, password, role) => {
      try {
        setIsLoading(true);
        const res = await authAPI.login({ email, password });
        if (role && res.user.role !== role) {
          toast({
            title: "Wrong account type",
            description: `This account is registered as a ${res.user.role}, not a ${role}.`,
            variant: "destructive",
          });
          return false;
        }
        authToken.set(res.token);
        userStore.set(res.user);
        setUser(res.user);
        toast({
          title: "Welcome back!",
          description: `Signed in as ${res.user.name}`,
        });
        return true;
      } catch (e) {
        toast({
          title: "Login failed",
          description: e.message || "Invalid credentials",
          variant: "destructive",
        });
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [toast],
  );

  const register = useCallback(
    async (data) => {
      try {
        setIsLoading(true);
        const res = await authAPI.register(data);
        // Auto-login on register since backend returns token
        if (res.token) {
          authToken.set(res.token);
          userStore.set(res.user);
          setUser(res.user);
        }
        toast({
          title: "Account created!",
          description: `Welcome to JugaduBazar, ${res.user?.name || data.name}!`,
        });
        return true;
      } catch (e) {
        toast({
          title: "Registration failed",
          description: e.message || "Please try again",
          variant: "destructive",
        });
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [toast],
  );

  const logout = useCallback(() => {
    authToken.remove();
    userStore.remove();
    setUser(null);
    toast({ title: "Logged out", description: "See you soon!" });
  }, [toast]);

  const updateProfile = useCallback(
    async (updates) => {
      try {
        const res = await authAPI.updateProfile(updates);
        setUser(res.user);
        userStore.set(res.user);
        toast({ title: "Profile updated" });
        return true;
      } catch (e) {
        toast({
          title: "Could not update profile",
          description: e.message,
          variant: "destructive",
        });
        return false;
      }
    },
    [toast],
  );

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const DEMO_CREDENTIALS = {
  vendor: { email: "vendor@example.com", password: "vendor123" },
  supplier: { email: "supplier@example.com", password: "supplier123" },
};
