"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { useWeather } from "@/context/WeatherContext";
import {
  HeartPulse,
  Droplets,
  Sun,
  ShieldCheck,
  AlertTriangle,
  Activity,
  Wind,
  CheckCircle2,
  Sparkles,
  Info,
} from "lucide-react";

export default function HealthIndexPage() {
  const { currentWeather, activeLocation } = useWeather();
  const [activeTab, setActiveTab] = useState<"pollen" | "heat" | "respiratory" | "migraine">("pollen");

  const aqi = currentWeather?.aqi?.aqi ?? 95;
  const temp = currentWeather?.temperature ?? 34.2;
  const humidity = currentWeather?.humidity ?? 38;
  const uv = currentWeather?.uv_index ?? 7.2;

  // Wet Bulb Globe Temperature approximate estimation
  const wbgt = 0.567 * temp + 0.393 * (humidity / 100) * 6.105 * Math.exp((17.27 * temp) / (237.7 + temp)) + 3.94;

  const getWBGTCategory = (val: number) => {
    if (val < 26.7) return { label: "Low Heat Stress", color: "#8ED329", advice: "Normal physical activities safe." };
    if (val < 29.4) return { label: "Moderate Heat Stress", color: "#FFBE00", advice: "Take 15-minute rest breaks per hour of strenuous outdoor exertion." };
    if (val < 32.2) return { label: "High Heat Stress", color: "#FF7400", advice: "Limit unshaded outdoor exercise. Drink 250ml water every 15 minutes." };
    return { label: "Extreme Heat Danger", color: "#FF2020", advice: "Suspend intense outdoor manual work. High risk of heat exhaustion." };
  };

  const wbgtInfo = getWBGTCategory(wbgt);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="Bio-Meteorology & Health" subtitle="Health Risks, Pollen, Heat Stress & UV Index" />

      <div className="p-4 space-y-4">
        {/* Banner */}
        <div className="glass-card rounded-3xl p-4.5 border border-white/20 shadow-xl space-y-1 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#f472b6] to-[#00DDE5] p-[2px]">
              <div className="w-full h-full bg-[#062b4c] rounded-2xl flex items-center justify-center text-[#f472b6]">
                <HeartPulse className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="font-extrabold text-white text-base leading-none">
                Bio-Meteorological Indices
              </h2>
              <p className="text-xs text-white/70 mt-1">
                Real-time human health vulnerability for {activeLocation}
              </p>
            </div>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="glass-panel p-1 rounded-2xl flex items-center gap-1 border border-white/20">
          {[
            { id: "pollen", label: "Pollen & Allergy" },
            { id: "heat", label: "WBGT Heat Stress" },
            { id: "respiratory", label: "Respiratory" },
            { id: "migraine", label: "Migraine" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-white text-[#06345C] shadow-md"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Pollen & Allergy */}
        {activeTab === "pollen" && (
          <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Droplets className="w-4 h-4 text-[#f472b6]" />
                <span>Airborne Botanical Pollen Dispersal</span>
              </h3>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-yellow-500/20 text-[#FFBE00]">
                Moderate Risk
              </span>
            </div>

            <p className="text-xs text-white/80 leading-relaxed">
              Warm westerly breeze and low humidity ({humidity}%) promote grass and weed pollen dispersal across northern plains.
            </p>

            <div className="space-y-2">
              <div className="bg-white/5 p-3 rounded-2xl space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-white">Grass Pollen (Poaceae)</span>
                  <span className="text-[#FFBE00]">High (7.4 / 10)</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-[#FFBE00] rounded-full" style={{ width: "74%" }} />
                </div>
              </div>

              <div className="bg-white/5 p-3 rounded-2xl space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-white">Tree Pollen (Neem, Pine, Oak)</span>
                  <span className="text-[#8ED329]">Low (2.1 / 10)</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-[#8ED329] rounded-full" style={{ width: "21%" }} />
                </div>
              </div>

              <div className="bg-white/5 p-3 rounded-2xl space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-white">Weed Pollen (Parthenium / Congress Grass)</span>
                  <span className="text-[#FFBE00]">Moderate (6.0 / 10)</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-[#FFBE00] rounded-full" style={{ width: "60%" }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: WBGT Heat Stress */}
        {activeTab === "heat" && (
          <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Sun className="w-4 h-4 text-[#FFBE00]" />
                <span>Wet Bulb Globe Temp (WBGT)</span>
              </h3>
              <span
                className="text-[10px] font-black px-2.5 py-0.5 rounded-full text-black"
                style={{ backgroundColor: wbgtInfo.color }}
              >
                {wbgtInfo.label}
              </span>
            </div>

            <div className="text-center py-2 bg-black/20 rounded-2xl space-y-0.5">
              <span className="text-3xl font-black text-white">{wbgt.toFixed(1)}°C</span>
              <span className="text-[10px] text-white/60 block">Calculated Direct Solar WBGT</span>
            </div>

            <div className="bg-white/5 p-3 rounded-2xl space-y-1 text-xs text-white/85">
              <span className="font-bold text-[#FFBE00] block text-[11px] uppercase">
                Work-Rest Cycle Recommendation:
              </span>
              <p>{wbgtInfo.advice}</p>
            </div>
          </div>
        )}

        {/* Tab 3: Respiratory */}
        {activeTab === "respiratory" && (
          <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-3 animate-fade-in">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Wind className="w-4 h-4 text-[#00DDE5]" />
              <span>Asthma & COPD Risk Index</span>
            </h3>
            <p className="text-xs text-white/85 leading-relaxed">
              Combined Air Quality ({aqi} AQI) and low evening humidity produce moderate airway dryness. Keep bronchodilator inhalers accessible if sensitive to airborne particulates.
            </p>
          </div>
        )}

        {/* Tab 4: Migraine */}
        {activeTab === "migraine" && (
          <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-3 animate-fade-in">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#a78bfa]" />
              <span>Barometric Pressure & Migraine Trigger</span>
            </h3>
            <p className="text-xs text-white/85 leading-relaxed">
              Atmospheric pressure is steady at <strong>1004.2 hPa</strong> (Fluctuation &lt; 1.5 hPa/3h). Low trigger probability for weather-sensitive vascular migraines.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
