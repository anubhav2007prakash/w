"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type ActivityMode =
  | "default"
  | "fitness"
  | "commuter"
  | "travel"
  | "family"
  | "agriculture"
  | "gardening"
  | "beach"
  | "event_planner";

export interface SavedLocation {
  id: string;
  name: string;
  label: "home" | "work" | "school" | "other";
  lat?: number;
  lon?: number;
}

export interface UserInterests {
  weather_alerts: boolean;
  uv_index: boolean;
  air_quality: boolean;
  fitness: boolean;
  agriculture: boolean;
  travel: boolean;
  events: boolean;
  marine: boolean;
  energy: boolean;
  carbon: boolean;
}

export interface AccessibilitySettings {
  largeText: boolean;
  highContrast: boolean;
  colorblindMode: boolean;
}

export interface RecommendationFeedback {
  id: string;
  rating: "up" | "down" | null;
  hidden: boolean;
}

export interface NotificationPreferences {
  heatRisk: boolean;
  rainRisk: boolean;
  uvRisk: boolean;
  windRisk: boolean;
  fogRisk: boolean;
  lightning: boolean;
  thunderstorm: boolean;
  cyclone: boolean;
  smartTiming: boolean;
}

interface PersonalizationContextType {
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
  resetOnboarding: () => void;

  userName: string;
  setUserName: (name: string) => void;

  activeMode: ActivityMode;
  setActiveMode: (mode: ActivityMode) => void;

  interests: UserInterests;
  toggleInterest: (key: keyof UserInterests) => void;
  setInterests: (i: UserInterests) => void;

  savedLocations: SavedLocation[];
  addSavedLocation: (loc: SavedLocation) => void;
  removeSavedLocation: (id: string) => void;
  primaryLocation: SavedLocation | null;

  accessibility: AccessibilitySettings;
  toggleAccessibility: (key: keyof AccessibilitySettings) => void;

  notifications: NotificationPreferences;
  toggleNotification: (key: keyof NotificationPreferences) => void;

  feedback: RecommendationFeedback[];
  submitFeedback: (id: string, rating: "up" | "down") => void;
  hideRecommendation: (id: string) => void;
  isHidden: (id: string) => boolean;

  getGreeting: () => string;
  getDailySummary: () => string;
  getRelevanceScore: (category: string) => number;
  explainRecommendation: (category: string) => string;
}

const DEFAULT_INTERESTS: UserInterests = {
  weather_alerts: true,
  uv_index: true,
  air_quality: true,
  fitness: false,
  agriculture: false,
  travel: false,
  events: false,
  marine: false,
  energy: false,
  carbon: false,
};

const DEFAULT_NOTIFICATIONS: NotificationPreferences = {
  heatRisk: true,
  rainRisk: true,
  uvRisk: true,
  windRisk: true,
  fogRisk: true,
  lightning: true,
  thunderstorm: true,
  cyclone: true,
  smartTiming: true,
};

const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  largeText: false,
  highContrast: false,
  colorblindMode: false,
};

const STORAGE_KEY = "mausam_personalization";

function loadState<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveState(key: string, value: unknown) {
  if (typeof window !== "undefined") {
    localStorage.setItem(`${STORAGE_KEY}_${key}`, JSON.stringify(value));
  }
}

const PersonalizationContext = createContext<PersonalizationContextType | undefined>(undefined);

export function PersonalizationProvider({ children }: { children: React.ReactNode }) {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => loadState("onboarding", false));
  const [userName, setUserNameState] = useState(() => loadState("userName", ""));
  const [activeMode, setActiveModeState] = useState<ActivityMode>(() => loadState("mode", "default"));
  const [interests, setInterestsState] = useState<UserInterests>(() => loadState("interests", DEFAULT_INTERESTS));
  const [savedLocations, setSavedLocationsState] = useState<SavedLocation[]>(() => loadState("locations", []));
  const [accessibility, setAccessibilityState] = useState<AccessibilitySettings>(() => loadState("accessibility", DEFAULT_ACCESSIBILITY));
  const [notifications, setNotificationsState] = useState<NotificationPreferences>(() => loadState("notifications", DEFAULT_NOTIFICATIONS));
  const [feedback, setFeedbackState] = useState<RecommendationFeedback[]>(() => loadState("feedback", []));

  const completeOnboarding = () => { setHasCompletedOnboarding(true); saveState("onboarding", true); };
  const resetOnboarding = () => { setHasCompletedOnboarding(false); saveState("onboarding", false); };

  const setUserName = (name: string) => { setUserNameState(name); saveState("userName", name); };

  const setActiveMode = (mode: ActivityMode) => { setActiveModeState(mode); saveState("mode", mode); };

  const toggleInterest = (key: keyof UserInterests) => {
    setInterestsState((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      saveState("interests", next);
      return next;
    });
  };

  const setInterests = (i: UserInterests) => { setInterestsState(i); saveState("interests", i); };

  const addSavedLocation = (loc: SavedLocation) => {
    setSavedLocationsState((prev) => {
      const next = [loc, ...prev.filter((l) => l.id !== loc.id)].slice(0, 10);
      saveState("locations", next);
      return next;
    });
  };

  const removeSavedLocation = (id: string) => {
    setSavedLocationsState((prev) => {
      const next = prev.filter((l) => l.id !== id);
      saveState("locations", next);
      return next;
    });
  };

  const primaryLocation = savedLocations.find((l) => l.label === "home") || savedLocations[0] || null;

  const toggleAccessibility = (key: keyof AccessibilitySettings) => {
    setAccessibilityState((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      saveState("accessibility", next);
      return next;
    });
  };

  const toggleNotification = (key: keyof NotificationPreferences) => {
    setNotificationsState((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      saveState("notifications", next);
      return next;
    });
  };

  const submitFeedback = (id: string, rating: "up" | "down") => {
    setFeedbackState((prev) => {
      const existing = prev.find((f) => f.id === id);
      const next = existing
        ? prev.map((f) => (f.id === id ? { ...f, rating } : f))
        : [...prev, { id, rating, hidden: false }];
      saveState("feedback", next);
      return next;
    });
  };

  const hideRecommendation = (id: string) => {
    setFeedbackState((prev) => {
      const existing = prev.find((f) => f.id === id);
      const next = existing
        ? prev.map((f) => (f.id === id ? { ...f, hidden: true } : f))
        : [...prev, { id, rating: null, hidden: true }];
      saveState("feedback", next);
      return next;
    });
  };

  const isHidden = useCallback(
    (id: string) => feedback.some((f) => f.id === id && f.hidden),
    [feedback]
  );

  const getGreeting = useCallback(() => {
    const hour = new Date().getHours();
    const name = userName || "there";
    if (hour < 6) return `Good night, ${name}`;
    if (hour < 12) return `Good morning, ${name}`;
    if (hour < 17) return `Good afternoon, ${name}`;
    if (hour < 21) return `Good evening, ${name}`;
    return `Good night, ${name}`;
  }, [userName]);

  const getDailySummary = useCallback(() => {
    const hour = new Date().getHours();
    if (activeMode === "fitness") return "Plan your workout around today's weather conditions.";
    if (activeMode === "commuter") return "Check the best departure time for your commute today.";
    if (activeMode === "travel") return "See packing suggestions and sightseeing conditions.";
    if (activeMode === "family") return "Review outdoor safety for family activities today.";
    if (activeMode === "agriculture") return "Check spray windows and irrigation timing.";
    if (activeMode === "beach") return "Tide times and coastal safety conditions for today.";
    if (activeMode === "event_planner") return "Outdoor event feasibility and weather windows.";
    if (hour < 9) return "Start your day with the latest weather and alerts.";
    if (hour < 17) return "Afternoon weather update — stay informed and safe.";
    return "Evening forecast — plan for tomorrow.";
  }, [activeMode]);

  const getRelevanceScore = useCallback(
    (category: string): number => {
      let score = 50;
      if (interests.weather_alerts && category.includes("alert")) score += 20;
      if (interests.uv_index && category.includes("uv")) score += 15;
      if (interests.air_quality && category.includes("aqi")) score += 15;
      if (interests.fitness && category.includes("fitness")) score += 20;
      if (interests.agriculture && category.includes("agri")) score += 20;
      if (interests.travel && category.includes("travel")) score += 20;
      if (interests.events && category.includes("event")) score += 20;
      if (interests.marine && category.includes("marine")) score += 20;
      if (interests.energy && category.includes("energy")) score += 15;
      if (interests.carbon && category.includes("carbon")) score += 15;
      if (activeMode !== "default" && category.includes(activeMode)) score += 25;
      return Math.min(score, 100);
    },
    [interests, activeMode]
  );

  const explainRecommendation = useCallback(
    (category: string): string => {
      const reasons: string[] = [];
      if (interests.weather_alerts && category.includes("alert")) reasons.push("you enabled weather alerts");
      if (interests.fitness && category.includes("fitness")) reasons.push("fitness is one of your interests");
      if (interests.agriculture && category.includes("agri")) reasons.push("agriculture matches your interests");
      if (activeMode !== "default" && category.includes(activeMode)) reasons.push(`you're in ${activeMode} mode`);
      if (reasons.length === 0) reasons.push("this is generally relevant weather info");
      return `Showing this because ${reasons.join(" and ")}.`;
    },
    [interests, activeMode]
  );

  return (
    <PersonalizationContext.Provider
      value={{
        hasCompletedOnboarding,
        completeOnboarding,
        resetOnboarding,
        userName,
        setUserName,
        activeMode,
        setActiveMode,
        interests,
        toggleInterest,
        setInterests,
        savedLocations,
        addSavedLocation,
        removeSavedLocation,
        primaryLocation,
        accessibility,
        toggleAccessibility,
        notifications,
        toggleNotification,
        feedback,
        submitFeedback,
        hideRecommendation,
        isHidden,
        getGreeting,
        getDailySummary,
        getRelevanceScore,
        explainRecommendation,
      }}
    >
      {children}
    </PersonalizationContext.Provider>
  );
}

export function usePersonalization() {
  const ctx = useContext(PersonalizationContext);
  if (!ctx) throw new Error("usePersonalization must be used within PersonalizationProvider");
  return ctx;
}
