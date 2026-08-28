"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { useWeather } from "@/context/WeatherContext";
import {
  CalendarCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Sparkles,
  Award,
  Sun,
  CloudRain,
  Wind,
} from "lucide-react";

interface ActivityItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  score: number;
  verdict: "GO" | "CAUTION" | "NO-GO";
  verdictColor: string;
  bestWindow: string;
  riskFactor: string;
  tips: string[];
}

export default function ActivityPlannerPage() {
  const { currentWeather, activeLocation } = useWeather();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const temp = currentWeather?.temperature ?? 34.2;
  const humidity = currentWeather?.humidity ?? 38;
  const wind = currentWeather?.wind_speed ?? 9.4;
  const aqi = currentWeather?.aqi?.aqi ?? 95;

  const ACTIVITIES: ActivityItem[] = [
    {
      id: "cricket",
      name: "Outdoor Cricket & Football",
      category: "sports",
      icon: "🏏",
      score: temp > 36 ? 65 : 88,
      verdict: temp > 36 ? "CAUTION" : "GO",
      verdictColor: temp > 36 ? "#FFBE00" : "#8ED329",
      bestWindow: "06:00 AM – 09:30 AM & 05:00 PM – 07:00 PM",
      riskFactor: "Moderate afternoon heat stress & UV intensity",
      tips: ["Drink 250ml electrolyte water every 20 mins", "Avoid high-intensity play between 12 PM - 3 PM"],
    },
    {
      id: "wedding",
      name: "Outdoor Lawn Wedding / Reception",
      category: "events",
      icon: "🎪",
      score: 92,
      verdict: "GO",
      verdictColor: "#8ED329",
      bestWindow: "06:30 PM onwards (Pleasant Evening)",
      riskFactor: "Low (< 10% rain chance, light wind)",
      tips: ["Set up covered marquees with misting fans", "Evening temperatures drop to comfortable 27°C"],
    },
    {
      id: "drone",
      name: "Drone Surveying & Aerial Shots",
      category: "commercial",
      icon: "🚁",
      score: wind < 20 ? 95 : 45,
      verdict: wind < 20 ? "GO" : "NO-GO",
      verdictColor: wind < 20 ? "#8ED329" : "#FF2020",
      bestWindow: "06:30 AM – 11:00 AM (Calmest Wind)",
      riskFactor: `Current wind is ${wind.toFixed(1)} km/h (Safe limit: 25 km/h)`,
      tips: ["Check battery temperature in direct sunlight", "Monitor thermal gusts near asphalt roads"],
    },
    {
      id: "cycling",
      name: "Highway Road Cycling / Marathon",
      category: "sports",
      icon: "🚴",
      score: aqi < 100 ? 90 : 55,
      verdict: aqi < 100 ? "GO" : "CAUTION",
      verdictColor: aqi < 100 ? "#8ED329" : "#FFBE00",
      bestWindow: "05:30 AM – 07:30 AM (Coolest Air)",
      riskFactor: `Air Quality is ${aqi} AQI; clear road visibility`,
      tips: ["Wear UV protective sunglasses & helmet visor", "Start early before road asphalt heats up"],
    },
    {
      id: "construction",
      name: "Roof Concrete Pouring & Painting",
      category: "commercial",
      icon: "🏗️",
      score: 85,
      verdict: "GO",
      verdictColor: "#8ED329",
      bestWindow: "Early Morning (06:00 AM – 10:00 AM)",
      riskFactor: "High noon heat can cause rapid concrete drying",
      tips: ["Ensure adequate water curing to avoid thermal micro-cracks", "Keep fresh exterior paint shaded"],
    },
    {
      id: "laundry",
      name: "Outdoor Solar Clothes Drying",
      category: "home",
      icon: "🧺",
      score: 98,
      verdict: "GO",
      verdictColor: "#8ED329",
      bestWindow: "10:00 AM – 04:00 PM (Peak Solar UV)",
      riskFactor: "Zero rain risk; fast drying speed",
      tips: ["Heavy denim and bedsheets dry in under 90 minutes"],
    },
  ];

  const filteredActivities =
    selectedCategory === "all"
      ? ACTIVITIES
      : ACTIVITIES.filter((a) => a.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="Smart Activity Planner" subtitle="AI Go / No-Go Decision Radar" />

      <div className="p-4 space-y-4">
        {/* Banner */}
        <div className="glass-card rounded-3xl p-4.5 border border-white/20 shadow-xl space-y-1 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FFBE00] to-[#8ED329] p-[2px]">
              <div className="w-full h-full bg-[#062b4c] rounded-2xl flex items-center justify-center text-[#FFBE00]">
                <CalendarCheck className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="font-extrabold text-white text-base leading-none">
                Weather Feasibility Radar
              </h2>
              <p className="text-xs text-white/70 mt-1">
                Real-time suitability scoring for {activeLocation}
              </p>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {[
            { id: "all", label: "All Activities" },
            { id: "sports", label: "Sports & Fitness" },
            { id: "events", label: "Events & Weddings" },
            { id: "commercial", label: "Drone & Construction" },
            { id: "home", label: "Home & Garden" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                selectedCategory === cat.id
                  ? "bg-white text-[#06345C] shadow-lg scale-105"
                  : "glass-button text-white/80 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Activity Cards List */}
        <div className="space-y-3">
          {filteredActivities.map((act) => (
            <div
              key={act.id}
              className="glass-card rounded-3xl p-4.5 border border-white/15 shadow-lg space-y-3 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{act.icon}</span>
                  <div>
                    <h3 className="font-extrabold text-white text-sm leading-tight">{act.name}</h3>
                    <span className="text-[10px] text-white/60 uppercase font-semibold block mt-0.5">
                      {act.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-right shrink-0">
                  <span
                    className="text-[11px] font-black px-2.5 py-1 rounded-xl text-black shadow-md"
                    style={{ backgroundColor: act.verdictColor }}
                  >
                    {act.verdict} ({act.score}%)
                  </span>
                </div>
              </div>

              {/* Best Time Window */}
              <div className="bg-black/25 p-2.5 rounded-2xl flex items-center gap-2 text-xs text-white/90">
                <Clock className="w-4 h-4 text-[#00DDE5] shrink-0" />
                <div>
                  <span className="text-[9px] text-white/60 block uppercase font-bold">Optimal Window</span>
                  <span className="font-bold">{act.bestWindow}</span>
                </div>
              </div>

              {/* Risk Factor */}
              <div className="text-xs text-white/75 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-[#FFBE00] shrink-0" />
                <span><strong>Risk:</strong> {act.riskFactor}</span>
              </div>

              {/* Actionable Tips */}
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 space-y-1">
                {act.tips.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-[11px] text-white/85">
                    <CheckCircle2 className="w-3 h-3 text-[#8ED329] shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
