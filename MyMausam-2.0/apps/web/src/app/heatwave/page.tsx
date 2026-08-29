"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { useWeather } from "@/context/WeatherContext";
import {
  Thermometer,
  AlertTriangle,
  Flame,
  Snowflake,
  Clock,
  MapPin,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";

interface HeatWaveAlert {
  district: string;
  state: string;
  maxTemp: number;
  heatIndex: number;
  alertLevel: "Normal" | "Heat Wave" | "Severe Heat Wave" | "Cold Wave";
  color: string;
  duration: string;
  advice: string;
}

const HEAT_COLD_DATA: HeatWaveAlert[] = [
  { district: "Barmer", state: "Rajasthan", maxTemp: 45.2, heatIndex: 52.1, alertLevel: "Severe Heat Wave", color: "#FF2020", duration: "4 days", advice: "Avoid outdoor exposure 12:00–4:00 PM. Drink ORS water every 30 min. Watch for heatstroke symptoms." },
  { district: "Churu", state: "Rajasthan", maxTemp: 44.8, heatIndex: 50.5, alertLevel: "Heat Wave", color: "#FF7400", duration: "3 days", advice: "Ensure adequate hydration. Use wet towels on neck. Keep livestock in shade." },
  { district: "Nagpur", state: "Maharashtra", maxTemp: 43.1, heatIndex: 48.7, alertLevel: "Heat Wave", color: "#FF7400", duration: "2 days", advice: "Schools may declare holiday. Hospitals on heat-wave alert. Avoid strenuous outdoor work." },
  { district: "Cuttack", state: "Odisha", maxTemp: 42.0, heatIndex: 47.3, alertLevel: "Heat Wave", color: "#FFBE00", duration: "2 days", advice: "ORS camps activated. Stay hydrated. Avoid direct sun between 11 AM–4 PM." },
  { district: "Phalodi", state: "Rajasthan", maxTemp: 46.5, heatIndex: 54.2, alertLevel: "Severe Heat Wave", color: "#FF2020", duration: "5 days", advice: "Extreme danger level. All outdoor work suspended. Cool shelters mandatory." },
  { district: "Ludhiana", state: "Punjab", maxTemp: 12.5, heatIndex: 8.2, alertLevel: "Cold Wave", color: "#00BFFF", duration: "3 days", advice: "Dense fog advisory. Wear warm layers. Use room heaters safely — ensure ventilation." },
  { district: "Srinagar", state: "Jammu & Kashmir", maxTemp: -2.3, heatIndex: -8.5, alertLevel: "Cold Wave", color: "#00BFFF", duration: "5 days", advice: "Severe cold wave. Roads may freeze. Protect pipes from bursting. Ensure livestock warmth." },
  { district: "Amritsar", state: "Punjab", maxTemp: 4.1, heatIndex: 1.0, alertLevel: "Cold Wave", color: "#00BFFF", duration: "4 days", advice: "Cold day conditions. Fog disrupts rail/air. Keep emergency heating accessible." },
];

export default function HeatWavePage() {
  const { activeLocation } = useWeather();
  const [filter, setFilter] = useState<"all" | "heat" | "cold">("all");

  const filtered = HEAT_COLD_DATA.filter((d) => {
    if (filter === "heat") return d.maxTemp > 35;
    if (filter === "cold") return d.maxTemp < 20;
    return true;
  });

  const heatAlerts = HEAT_COLD_DATA.filter((d) => d.maxTemp > 35).length;
  const coldAlerts = HEAT_COLD_DATA.filter((d) => d.maxTemp < 20).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="Heat & Cold Wave Alerts" subtitle="IMD Extreme Temperature Monitoring" />

      <div className="p-4 space-y-4">
        {/* Summary Banner */}
        <div className="glass-card rounded-3xl p-4.5 border border-white/20 shadow-xl space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF2020] to-[#FFBE00] p-[2px]">
              <div className="w-full h-full bg-[#062b4c] rounded-2xl flex items-center justify-center text-[#FF2020]">
                <Thermometer className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="font-extrabold text-white text-base leading-none">
                National Heat & Cold Wave Status
              </h2>
              <p className="text-xs text-white/70 mt-1">
                IMD Headquarters, New Delhi • Updated 08:30 IST
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-[#FF2020]/15 p-3 rounded-2xl border border-[#FF2020]/20">
              <Flame className="w-5 h-5 mx-auto text-[#FF2020] mb-1" />
              <span className="text-[10px] text-white/70 block">Heat Wave Districts</span>
              <span className="text-2xl font-black text-[#FF2020] block">{heatAlerts}</span>
            </div>
            <div className="bg-[#00BFFF]/15 p-3 rounded-2xl border border-[#00BFFF]/20">
              <Snowflake className="w-5 h-5 mx-auto text-[#00BFFF] mb-1" />
              <span className="text-[10px] text-white/70 block">Cold Wave Districts</span>
              <span className="text-2xl font-black text-[#00BFFF] block">{coldAlerts}</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="glass-panel p-1 rounded-2xl flex items-center gap-1 border border-white/20">
          {(["all", "heat", "cold"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all capitalize ${
                filter === tab
                  ? "bg-white text-[#06345C] shadow-md"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {tab === "all" ? "All Alerts" : tab === "heat" ? "🔥 Heat Wave" : "❄️ Cold Wave"}
            </button>
          ))}
        </div>

        {/* Alert Cards */}
        <div className="space-y-3">
          {filtered.map((alert, idx) => (
            <div
              key={idx}
              className="glass-card rounded-3xl p-4.5 border border-white/15 shadow-md space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#00DDE5]" />
                    <h3 className="font-extrabold text-white text-sm">{alert.district}</h3>
                  </div>
                  <span className="text-[10px] text-white/60 block mt-0.5 ml-5">{alert.state}</span>
                </div>
                <span
                  className="text-[10px] font-black px-2.5 py-0.5 rounded-full text-black shrink-0"
                  style={{ backgroundColor: alert.color }}
                >
                  {alert.alertLevel}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[9px] text-white/60 block">
                    {alert.maxTemp > 35 ? "Max Temperature" : "Min Temperature"}
                  </span>
                  <span className="text-lg font-black text-white block">{alert.maxTemp}°C</span>
                </div>
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[9px] text-white/60 block">
                    {alert.maxTemp > 35 ? "Heat Index (Feels Like)" : "Wind Chill"}
                  </span>
                  <span className="text-lg font-black text-white block">{alert.heatIndex}°C</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-white/60">
                <Clock className="w-3 h-3" />
                <span>Duration: {alert.duration}</span>
              </div>

              <div className="bg-black/20 p-2.5 rounded-xl text-[11px] text-white/90 leading-relaxed border border-white/5">
                <span className="text-[9px] font-bold text-[#FFBE00] uppercase tracking-wider block mb-1">
                  Advisory
                </span>
                {alert.advice}
              </div>
            </div>
          ))}
        </div>

        {/* Safety Guidelines */}
        <div className="glass-card rounded-3xl p-5 border border-white/20 space-y-3">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#FFBE00]" />
            <span>IMD & NDMA Heat Stroke First Aid</span>
          </h3>
          <div className="space-y-2 text-xs text-white/85">
            <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-[#8ED329] shrink-0 mt-0.5" />
              <span><strong>Cool the person:</strong> Move to shade. Apply cold wet cloths to neck, armpits, groin.</span>
            </div>
            <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-[#8ED329] shrink-0 mt-0.5" />
              <span><strong>Hydrate:</strong> Sip cool water or ORS every 15 minutes. Do NOT give alcohol or caffeine.</span>
            </div>
            <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-[#8ED329] shrink-0 mt-0.5" />
              <span><strong>Emergency:</strong> If confusion, seizures, or temp above 40°C — call 108 immediately.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
