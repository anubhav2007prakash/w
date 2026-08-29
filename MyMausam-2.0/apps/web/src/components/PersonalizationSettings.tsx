"use client";

import { usePersonalization, type ActivityMode, type UserInterests } from "@/context/PersonalizationContext";
import {
  Dumbbell, Car, Plane, Users, Sprout, TreePine, Waves, CalendarCheck,
  Bell, Accessibility, RotateCcw, User, Sparkles, Eye, EyeOff, ChevronRight,
} from "lucide-react";

const MODE_OPTIONS: { mode: ActivityMode; icon: React.ReactNode; label: string }[] = [
  { mode: "default", icon: <Sparkles size={18} />, label: "Default" },
  { mode: "fitness", icon: <Dumbbell size={18} />, label: "Fitness" },
  { mode: "commuter", icon: <Car size={18} />, label: "Commuter" },
  { mode: "travel", icon: <Plane size={18} />, label: "Travel" },
  { mode: "family", icon: <Users size={18} />, label: "Family" },
  { mode: "agriculture", icon: <Sprout size={18} />, label: "Agriculture" },
  { mode: "gardening", icon: <TreePine size={18} />, label: "Gardening" },
  { mode: "beach", icon: <Waves size={18} />, label: "Beach" },
  { mode: "event_planner", icon: <CalendarCheck size={18} />, label: "Event Planner" },
];

const INTEREST_LABELS: Record<keyof UserInterests, string> = {
  weather_alerts: "Weather Alerts",
  uv_index: "UV Index",
  air_quality: "Air Quality",
  fitness: "Fitness",
  agriculture: "Agriculture",
  travel: "Travel",
  events: "Events",
  marine: "Marine",
  energy: "Energy",
  carbon: "Carbon",
};

export function PersonalizationSettings() {
  const {
    userName, setUserName,
    activeMode, setActiveMode,
    interests, toggleInterest,
    notifications, toggleNotification,
    accessibility, toggleAccessibility,
    savedLocations, removeSavedLocation,
    resetOnboarding,
  } = usePersonalization();

  return (
    <div className="space-y-6 p-4 pb-24">
      {/* Profile */}
      <Section title="Profile" icon={<User size={16} />}>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Your name"
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#00DDE5]"
          />
        </div>
      </Section>

      {/* Activity Mode */}
      <Section title="Activity Mode" icon={<Sparkles size={16} />}>
        <div className="grid grid-cols-3 gap-2">
          {MODE_OPTIONS.map((opt) => (
            <button
              key={opt.mode}
              onClick={() => setActiveMode(opt.mode)}
              className={`flex flex-col items-center gap-1 p-2.5 rounded-xl text-xs font-medium transition-all ${
                activeMode === opt.mode ? "bg-[#00DDE5]/20 border border-[#00DDE5] text-[#00DDE5]" : "bg-white/5 border border-white/10 text-white/50"
              }`}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Interests */}
      <Section title="Interests" icon={<Sparkles size={16} />}>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(INTEREST_LABELS) as (keyof UserInterests)[]).map((key) => (
            <button
              key={key}
              onClick={() => toggleInterest(key)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                interests[key] ? "bg-[#00DDE5]/20 border border-[#00DDE5] text-[#00DDE5]" : "bg-white/5 border border-white/10 text-white/40"
              }`}
            >
              {interests[key] ? <Eye size={10} /> : <EyeOff size={10} />}
              {INTEREST_LABELS[key]}
            </button>
          ))}
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Alert Preferences" icon={<Bell size={16} />}>
        <div className="space-y-1">
          {(Object.keys(notifications) as (keyof typeof notifications)[]).map((key) => (
            <button
              key={key}
              onClick={() => toggleNotification(key)}
              className="w-full flex items-center justify-between py-2 px-1 border-b border-white/5 last:border-0"
            >
              <span className="text-sm text-white/80 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
              <div className={`w-8 h-4.5 rounded-full transition-colors ${notifications[key] ? "bg-[#00DDE5]" : "bg-white/20"} relative`}>
                <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-transform ${notifications[key] ? "translate-x-4" : "translate-x-0.5"}`} />
              </div>
            </button>
          ))}
        </div>
      </Section>

      {/* Saved Locations */}
      {savedLocations.length > 0 && (
        <Section title="Saved Locations" icon={<ChevronRight size={16} />}>
          <div className="space-y-1">
            {savedLocations.map((loc) => (
              <div key={loc.id} className="flex items-center gap-2 py-2 border-b border-white/5 last:border-0">
                <span className="text-sm text-white flex-1">{loc.name}</span>
                <span className="text-[10px] text-white/40 bg-white/10 px-2 py-0.5 rounded-full">{loc.label}</span>
                <button onClick={() => removeSavedLocation(loc.id)} className="text-red-400/60 text-xs">Remove</button>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Accessibility */}
      <Section title="Accessibility" icon={<Accessibility size={16} />}>
        <div className="space-y-1">
          {([
            { key: "largeText" as const, label: "Large Text" },
            { key: "highContrast" as const, label: "High Contrast" },
            { key: "colorblindMode" as const, label: "Colorblind Friendly" },
          ]).map((opt) => (
            <button
              key={opt.key}
              onClick={() => toggleAccessibility(opt.key)}
              className="w-full flex items-center justify-between py-2 px-1 border-b border-white/5 last:border-0"
            >
              <span className="text-sm text-white/80">{opt.label}</span>
              <div className={`w-8 h-4.5 rounded-full transition-colors ${accessibility[opt.key] ? "bg-[#00DDE5]" : "bg-white/20"} relative`}>
                <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-transform ${accessibility[opt.key] ? "translate-x-4" : "translate-x-0.5"}`} />
              </div>
            </button>
          ))}
        </div>
      </Section>

      {/* Reset */}
      <button
        onClick={resetOnboarding}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-red-400/80 text-sm font-medium"
      >
        <RotateCcw size={14} />
        Reset Personalization & Redo Onboarding
      </button>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[#00DDE5]">{icon}</span>
        <h3 className="text-sm font-bold text-white/80">{title}</h3>
      </div>
      {children}
    </div>
  );
}
