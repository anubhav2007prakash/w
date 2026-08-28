"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sprout,
  Zap,
  Sun,
  Sparkles,
  CloudRain,
  Bot,
  CalendarCheck,
  HeartPulse,
  Waves,
  Navigation,
  Trophy,
  Thermometer,
  Droplets,
  Eye,
  TrendingUp,
  Wind,
  Mountain,
  Radio,
  Plane,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { MausamMitraModal } from "@/components/MausamMitraModal";

interface FeatureItem {
  title: string;
  subtitle: string;
  icon: any;
  href: string;
  color: string;
  bgColor: string;
}

interface FeatureCategory {
  id: string;
  label: string;
  emoji: string;
  accentColor: string;
  features: FeatureItem[];
}

const CATEGORIES: FeatureCategory[] = [
  {
    id: "alerts",
    label: "Weather Alerts & Extremes",
    emoji: "🚨",
    accentColor: "#FF4444",
    features: [
      { title: "Heat Wave & Cold Wave", subtitle: "IMD Thermal Alerts", icon: Thermometer, href: "/heatwave", color: "#FF7400", bgColor: "rgba(255,116,0,0.15)" },
      { title: "Lightning Alarm", subtitle: "Flash-to-Bang Radar", icon: Zap, href: "/lightning-alarm", color: "#FFBE00", bgColor: "rgba(255,190,0,0.15)" },
      { title: "Urban Flood Nowcast", subtitle: "City Inundation Map", icon: Droplets, href: "/flood", color: "#38bdf8", bgColor: "rgba(56,189,248,0.15)" },
      { title: "Winter Fog", subtitle: "Visibility & Highway Fog", icon: Eye, href: "/winter-fog", color: "#94a3b8", bgColor: "rgba(148,163,184,0.15)" },
      { title: "Cyclone Tracker", subtitle: "Bay of Bengal & Arabian Sea", icon: CloudRain, href: "/cyclone", color: "#a78bfa", bgColor: "rgba(167,139,250,0.15)" },
    ],
  },
  {
    id: "climate",
    label: "Climate & Monsoon",
    emoji: "🌧️",
    accentColor: "#00DDE5",
    features: [
      { title: "Monsoon Tracker", subtitle: "Departure vs LPA Normals", icon: CloudRain, href: "/monsoon-tracker", color: "#00DDE5", bgColor: "rgba(0,221,229,0.15)" },
      { title: "Seasonal Outlook", subtitle: "3-Month IMD Prediction", icon: TrendingUp, href: "/seasonal-outlook", color: "#8ED329", bgColor: "rgba(142,211,41,0.15)" },
      { title: "Radar & Satellite", subtitle: "Doppler dBZ & INSAT-3D", icon: Radio, href: "/radar", color: "#a78bfa", bgColor: "rgba(167,139,250,0.15)" },
      { title: "Air Quality (SAFAR)", subtitle: "PM2.5, NO₂, Ozone & more", icon: Wind, href: "/air-quality", color: "#c084fc", bgColor: "rgba(192,132,252,0.15)" },
    ],
  },
  {
    id: "health",
    label: "Health & Human Impact",
    emoji: "🏥",
    accentColor: "#f472b6",
    features: [
      { title: "Health & Allergy Index", subtitle: "Pollen, WBGT, Migraine", icon: HeartPulse, href: "/health-index", color: "#f472b6", bgColor: "rgba(244,114,182,0.15)" },
      { title: "Activity Go/No-Go", subtitle: "Sport, Event & Work Planner", icon: CalendarCheck, href: "/activity-planner", color: "#FFBE00", bgColor: "rgba(255,190,0,0.15)" },
      { title: "Highway Route Weather", subtitle: "Waypoint Hazard Radar", icon: Navigation, href: "/route-navigator", color: "#8ED329", bgColor: "rgba(142,211,41,0.15)" },
    ],
  },
  {
    id: "agri",
    label: "Agriculture & Rural",
    emoji: "🌾",
    accentColor: "#8ED329",
    features: [
      { title: "Agromet & Crop Disease", subtitle: "Pathogen Risk & Spray Window", icon: Sprout, href: "/agromet", color: "#8ED329", bgColor: "rgba(142,211,41,0.15)" },
      { title: "Solar Yield Estimator", subtitle: "Rooftop kWh & Savings", icon: Sun, href: "/solar-estimator", color: "#FFBE00", bgColor: "rgba(255,190,0,0.15)" },
      { title: "Citizen Science", subtitle: "Cloud Classifier & Leaderboard", icon: Trophy, href: "/citizen-leaderboard", color: "#34d399", bgColor: "rgba(52,211,153,0.15)" },
    ],
  },
  {
    id: "marine",
    label: "Marine, Coast & Mountains",
    emoji: "🌊",
    accentColor: "#38bdf8",
    features: [
      { title: "Marine & Fishermen", subtitle: "Wave Height & PFZ Zones", icon: Waves, href: "/marine", color: "#38bdf8", bgColor: "rgba(56,189,248,0.15)" },
      { title: "Himalayan Weather", subtitle: "Pass Status & Avalanche Risk", icon: Mountain, href: "/mountain-weather", color: "#cbd5e1", bgColor: "rgba(203,213,225,0.15)" },
      { title: "Aviation METAR/TAF", subtitle: "Airport Weather Briefing", icon: Plane, href: "/aviation", color: "#a78bfa", bgColor: "rgba(167,139,250,0.15)" },
    ],
  },
];

export const FeatureButtons: React.FC = () => {
  const router = useRouter();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["alerts", "climate"])
  );

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <>
      <MausamMitraModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <section className="px-4 py-2 select-none space-y-3">
        {/* Hero AI Button */}
        <button
          onClick={() => setIsChatOpen(true)}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-[#0055A6] via-[#0077d4] to-[#00DDE5] hover:brightness-110 active:scale-[0.98] text-white font-extrabold text-sm rounded-3xl flex items-center justify-between shadow-xl border border-white/30 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center text-white shadow-inner">
              <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </div>
            <div className="text-left">
              <span className="text-sm font-black text-white block leading-tight">
                Ask Mausam Mitra AI
                <span className="ml-1.5 bg-[#FFBE00] text-black text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase">
                  Voice
                </span>
              </span>
              <span className="text-[11px] text-white/80 font-medium block leading-tight mt-0.5">
                Weather & Farming Copilot · English / Hindi
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold bg-white/20 px-3 py-1.5 rounded-full shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-[#FFBE00]" />
            <span>Chat</span>
          </div>
        </button>

        {/* Categorized Feature Sections */}
        {CATEGORIES.map((cat) => {
          const isExpanded = expandedCategories.has(cat.id);
          return (
            <div key={cat.id} className="space-y-2">
              <button
                onClick={() => toggleCategory(cat.id)}
                className="w-full flex items-center justify-between px-1 group"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="text-[11px] font-black uppercase tracking-widest"
                    style={{ color: cat.accentColor }}
                  >
                    {cat.emoji} {cat.label}
                  </span>
                </div>
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center transition-colors"
                  style={{ background: `${cat.accentColor}22` }}
                >
                  {isExpanded ? (
                    <ChevronUp className="w-3 h-3" style={{ color: cat.accentColor }} />
                  ) : (
                    <ChevronDown className="w-3 h-3" style={{ color: cat.accentColor }} />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="grid grid-cols-2 gap-2">
                  {cat.features.map((feature, idx) => {
                    const Icon = feature.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => router.push(feature.href)}
                        className="flex items-center gap-2.5 p-3 rounded-2xl border border-white/10 hover:border-white/25 active:scale-[0.97] transition-all text-left group"
                        style={{ background: "rgba(255,255,255,0.06)" }}
                      >
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                          style={{ background: feature.bgColor }}
                        >
                          <Icon className="w-4.5 h-4.5" style={{ color: feature.color }} />
                        </div>
                        <div className="overflow-hidden">
                          <span className="text-[12px] font-bold text-white block leading-snug line-clamp-1">
                            {feature.title}
                          </span>
                          <span className="text-[10px] text-white/55 block leading-tight mt-0.5 line-clamp-1">
                            {feature.subtitle}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="h-px bg-white/8" />
            </div>
          );
        })}
      </section>
    </>
  );
};
