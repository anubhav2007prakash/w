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
  Leaf,
  Activity,
} from "lucide-react";
import { MausamMitraModal } from "@/components/MausamMitraModal";
import { useLanguage } from "@/i18n/LanguageContext";

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

function getCategories(t: (k: string) => string): FeatureCategory[] {
  return [
    {
      id: "alerts",
      label: t("features.alerts_extremes"),
      emoji: "🚨",
      accentColor: "#FF4444",
      features: [
        { title: t("features.heat_cold_wave"), subtitle: t("features.heat_cold_sub"), icon: Thermometer, href: "/heatwave", color: "#FF7400", bgColor: "rgba(255,116,0,0.15)" },
        { title: t("features.lightning_alarm"), subtitle: t("features.lightning_sub"), icon: Zap, href: "/lightning-alarm", color: "#FFBE00", bgColor: "rgba(255,190,0,0.15)" },
        { title: t("features.urban_flood"), subtitle: t("features.urban_flood_sub"), icon: Droplets, href: "/flood", color: "#38bdf8", bgColor: "rgba(56,189,248,0.15)" },
        { title: t("features.winter_fog"), subtitle: t("features.winter_fog_sub"), icon: Eye, href: "/winter-fog", color: "#94a3b8", bgColor: "rgba(148,163,184,0.15)" },
        { title: t("features.cyclone_tracker"), subtitle: t("features.cyclone_sub"), icon: CloudRain, href: "/cyclone", color: "#a78bfa", bgColor: "rgba(167,139,250,0.15)" },
      ],
    },
    {
      id: "climate",
      label: t("features.climate_monsoon"),
      emoji: "🌧️",
      accentColor: "#00DDE5",
      features: [
        { title: t("features.monsoon_tracker"), subtitle: t("features.monsoon_sub"), icon: CloudRain, href: "/monsoon-tracker", color: "#00DDE5", bgColor: "rgba(0,221,229,0.15)" },
        { title: t("features.seasonal_outlook"), subtitle: t("features.seasonal_sub"), icon: TrendingUp, href: "/seasonal-outlook", color: "#8ED329", bgColor: "rgba(142,211,41,0.15)" },
        { title: t("features.radar_satellite"), subtitle: t("features.radar_sub"), icon: Radio, href: "/radar", color: "#a78bfa", bgColor: "rgba(167,139,250,0.15)" },
        { title: t("features.air_quality"), subtitle: t("features.air_quality_sub"), icon: Wind, href: "/air-quality", color: "#c084fc", bgColor: "rgba(192,132,252,0.15)" },
      ],
    },
    {
      id: "health",
      label: t("features.health_impact"),
      emoji: "🏥",
      accentColor: "#f472b6",
      features: [
        { title: t("features.health_allergy"), subtitle: t("features.health_allergy_sub"), icon: HeartPulse, href: "/health-index", color: "#f472b6", bgColor: "rgba(244,114,182,0.15)" },
        { title: t("features.activity_planner"), subtitle: t("features.activity_sub"), icon: CalendarCheck, href: "/activity-planner", color: "#FFBE00", bgColor: "rgba(255,190,0,0.15)" },
        { title: t("features.highway_route"), subtitle: t("features.highway_sub"), icon: Navigation, href: "/route-navigator", color: "#8ED329", bgColor: "rgba(142,211,41,0.15)" },
      ],
    },
    {
      id: "agri",
      label: t("features.agri_rural"),
      emoji: "🌾",
      accentColor: "#8ED329",
      features: [
        { title: t("features.agromet_crop"), subtitle: t("features.agromet_sub"), icon: Sprout, href: "/agromet", color: "#8ED329", bgColor: "rgba(142,211,41,0.15)" },
        { title: t("features.solar_yield"), subtitle: t("features.solar_sub"), icon: Sun, href: "/solar-estimator", color: "#FFBE00", bgColor: "rgba(255,190,0,0.15)" },
        { title: t("features.citizen_science"), subtitle: t("features.citizen_sub"), icon: Trophy, href: "/citizen-leaderboard", color: "#34d399", bgColor: "rgba(52,211,153,0.15)" },
      ],
    },
    {
      id: "marine",
      label: t("features.marine_coast"),
      emoji: "🌊",
      accentColor: "#38bdf8",
      features: [
        { title: t("features.marine_fishermen"), subtitle: t("features.marine_sub"), icon: Waves, href: "/marine", color: "#38bdf8", bgColor: "rgba(56,189,248,0.15)" },
        { title: t("features.himalayan_weather"), subtitle: t("features.himalayan_sub"), icon: Mountain, href: "/mountain-weather", color: "#cbd5e1", bgColor: "rgba(203,213,225,0.15)" },
        { title: t("features.aviation_metar"), subtitle: t("features.aviation_sub"), icon: Plane, href: "/aviation", color: "#a78bfa", bgColor: "rgba(167,139,250,0.15)" },
      ],
    },
    {
      id: "energy",
      label: t("features.energy_carbon"),
      emoji: "⚡",
      accentColor: "#FFBE00",
      features: [
        { title: t("features.energy_weather"), subtitle: t("features.energy_weather_sub"), icon: Zap, href: "/energy/weather-correlation", color: "#FFBE00", bgColor: "rgba(255,190,0,0.15)" },
        { title: t("features.carbon_tracker"), subtitle: t("features.carbon_tracker_sub"), icon: Leaf, href: "/energy/carbon-footprint", color: "#22c55e", bgColor: "rgba(34,197,94,0.15)" },
        { title: t("features.flood_energy"), subtitle: t("features.flood_energy_sub"), icon: Activity, href: "/energy/flood-impact", color: "#38bdf8", bgColor: "rgba(56,189,248,0.15)" },
      ],
    },
  ];
}

export const FeatureButtons: React.FC = () => {
  const router = useRouter();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { t } = useLanguage();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["alerts", "climate"])
  );

  const CATEGORIES = getCategories(t);

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
                {t("features.ask_mausam_mitra")}
                <span className="ml-1.5 bg-[#FFBE00] text-black text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase">
                  {t("common.voice")}
                </span>
              </span>
              <span className="text-[11px] text-white/80 font-medium block leading-tight mt-0.5">
                {t("features.weather_farming_copilot")}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold bg-white/20 px-3 py-1.5 rounded-full shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-[#FFBE00]" />
            <span>{t("features.chat_btn")}</span>
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
