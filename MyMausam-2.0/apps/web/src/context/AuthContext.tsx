"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { UserProfile, AuthCredentials, AuthContextType } from "@/types/auth";
import { PersonaType } from "@/types/weather";

const STORAGE_KEY = "mausam_auth_user";

export const DEMO_USERS: Record<"citizen" | "farmer" | "official" | "aviation", UserProfile> = {
  citizen: {
    id: "usr-citizen-01",
    name: "Anubhav Prakash",
    email: "anubhav@mausam.gov.in",
    phone: "+91 98765 43210",
    role: "citizen",
    persona: "health",
    defaultLocation: "Ghaziabad",
    defaultDistrict: "Ghaziabad",
    defaultState: "Uttar Pradesh",
    avatarId: "health_guard",
    isVerified: true,
    memberSince: "January 2026",
    badge: "Verified Citizen",
    preferredLanguage: "en",
  },
  farmer: {
    id: "usr-farmer-02",
    name: "Ramesh Patel",
    email: "ramesh.farmer@agromet.in",
    phone: "+91 94123 56789",
    role: "farmer",
    persona: "farmer",
    defaultLocation: "Meerut",
    defaultDistrict: "Meerut",
    defaultState: "Uttar Pradesh",
    avatarId: "farmer_sun",
    isVerified: true,
    memberSince: "August 2025",
    badge: "Kisan Mitra Verified",
    preferredLanguage: "hi",
  },
  official: {
    id: "usr-official-03",
    name: "Dr. Priya Nair",
    email: "priya.nair@imd.gov.in",
    phone: "+91 98111 22334",
    role: "official",
    persona: "event_planner",
    defaultLocation: "New Delhi",
    defaultDistrict: "New Delhi",
    defaultState: "Delhi",
    avatarId: "meteorologist",
    isVerified: true,
    memberSince: "March 2024",
    badge: "IMD Senior Scientist",
    preferredLanguage: "en",
  },
  aviation: {
    id: "usr-aviation-04",
    name: "Capt. Vikram Singh",
    email: "vikram.aviation@airports.in",
    phone: "+91 99887 66554",
    role: "aviation",
    persona: "commuter",
    defaultLocation: "Bengaluru",
    defaultDistrict: "Bengaluru Urban",
    defaultState: "Karnataka",
    avatarId: "aviation_pilot",
    isVerified: true,
    memberSince: "November 2025",
    badge: "Aviation MET Specialist",
    preferredLanguage: "en",
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<"signin" | "signup">("signin");

  // Load saved session on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          setUser(JSON.parse(saved));
        }
      }
    } catch (err) {
      console.error("Failed to parse saved auth user:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openAuthModal = useCallback((mode: "signin" | "signup" = "signin") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const login = useCallback(
    async (credentials: { email?: string; phone?: string; password?: string }) => {
      setIsLoading(true);
      // Simulate network request
      await new Promise((res) => setTimeout(res, 500));

      const emailLower = (credentials.email || "").toLowerCase().trim();
      const phoneClean = (credentials.phone || "").replace(/\D/g, "");

      // Match demo user or construct dynamic profile
      let matchedUser: UserProfile | null = null;

      if (emailLower.includes("farmer") || phoneClean.endsWith("6789")) {
        matchedUser = DEMO_USERS.farmer;
      } else if (emailLower.includes("priya") || emailLower.includes("imd")) {
        matchedUser = DEMO_USERS.official;
      } else if (emailLower.includes("aviation") || emailLower.includes("vikram")) {
        matchedUser = DEMO_USERS.aviation;
      } else if (emailLower.includes("anubhav") || emailLower) {
        matchedUser = {
          ...DEMO_USERS.citizen,
          email: credentials.email || DEMO_USERS.citizen.email,
          name: emailLower ? emailLower.split("@")[0].replace(/[._-]/g, " ") : "Citizen User",
        };
      } else if (phoneClean) {
        matchedUser = {
          ...DEMO_USERS.citizen,
          phone: credentials.phone,
          name: `Citizen ${phoneClean.slice(-4)}`,
        };
      }

      if (!matchedUser) {
        setIsLoading(false);
        return { success: false, error: "Invalid credentials provided." };
      }

      setUser(matchedUser);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(matchedUser));
      }
      setIsLoading(false);
      setIsAuthModalOpen(false);
      return { success: true };
    },
    []
  );

  const signup = useCallback(async (details: AuthCredentials) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 600));

    if (!details.name) {
      setIsLoading(false);
      return { success: false, error: "Full Name is required." };
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now().toString(36)}`,
      name: details.name,
      email: details.email || `${details.name.toLowerCase().replace(/\s+/g, ".")}@citizen.imd.in`,
      phone: details.phone,
      role: details.role || (details.persona === "farmer" ? "farmer" : "citizen"),
      persona: details.persona || "health",
      defaultLocation: details.defaultLocation || "Ghaziabad",
      isVerified: true,
      memberSince: "Just now",
      badge: details.persona === "farmer" ? "Kisan Mitra" : "Registered Citizen",
      preferredLanguage: "en",
    };

    setUser(newUser);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    }
    setIsLoading(false);
    setIsAuthModalOpen(false);
    return { success: true };
  }, []);

  const loginWithPhone = useCallback(async (phone: string, otp: string) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 500));

    if (!phone || otp.length < 4) {
      setIsLoading(false);
      return { success: false, error: "Please enter a valid 4-digit OTP." };
    }

    const phoneUser: UserProfile = {
      id: `usr-ph-${phone.replace(/\D/g, "")}`,
      name: `User ${phone.slice(-4)}`,
      email: `${phone.replace(/\D/g, "")}@mobile.imd.gov.in`,
      phone: phone,
      role: "citizen",
      persona: "farmer",
      defaultLocation: "Ghaziabad",
      isVerified: true,
      memberSince: "Today",
      badge: "Mobile Verified Citizen",
      preferredLanguage: "hi",
    };

    setUser(phoneUser);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(phoneUser));
    }
    setIsLoading(false);
    setIsAuthModalOpen(false);
    return { success: true };
  }, []);

  const loginWithDemo = useCallback(
    async (demoKey: "citizen" | "farmer" | "official" | "aviation") => {
      setIsLoading(true);
      await new Promise((res) => setTimeout(res, 300));
      const demoUser = DEMO_USERS[demoKey];
      setUser(demoUser);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUser));
      }
      setIsLoading(false);
      setIsAuthModalOpen(false);
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      if (!user) return;
      const updated = { ...user, ...updates };
      setUser(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        loginWithPhone,
        loginWithDemo,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
