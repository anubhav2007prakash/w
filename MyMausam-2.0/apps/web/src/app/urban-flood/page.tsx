"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { useWeather } from "@/context/WeatherContext";
import {
  CloudRain,
  Droplets,
  AlertTriangle,
  MapPin,
  Clock,
  TrendingUp,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";

interface FloodZone {
  city: string;
  state: string;
  rainfallMm24h: number;
  rainfallIntensity: "Light" | "Moderate" | "Heavy" | "Very Heavy";
  waterLevelM: number;
  riskLevel: "Low" | "Moderate" | "High" | "Extreme";
  color: string;
  affectedAreas: string[];
  advice: string;
}

const FLOOD_ZONES: FloodZone[] = [
  { city: "Mumbai", state: "Maharashtra", rainfallMm24h: 187.5, rainfallIntensity: "Very Heavy", waterLevelM: 2.1, riskLevel: "High", color: "#FF7400", affectedAreas: ["Andheri Subway", "Sion", "Dadar", "Kurla"], advice: "Avoid low-lying areas. Metro/subway may suspend. Keep emergency kit ready." },
  { city: "Chennai", state: "Tamil Nadu", rainfallMm24h: 142.3, rainfallIntensity: "Heavy", waterLevelM: 1.8, riskLevel: "Moderate", color: "#FFBE00", affectedAreas: ["T. Nagar", "Adyar", "Chromepet", "Ambattur"], advice: "Waterlogging expected in underpasses. Avoid driving through standing water." },
  { city: "Kolkata", state: "West Bengal", rainfallMm24h: 156.8, rainfallIntensity: "Heavy", waterLevelM: 2.4, riskLevel: "High", color: "#FF7400", affectedAreas: ["Salt Lake", "EM Bypass", "Howrah Bridge", "Ballygunge"], advice: "Tidal surge combined with heavy rain. Avoid riverside areas." },
  { city: "Delhi NCR", state: "Delhi", rainfallMm24h: 78.2, rainfallIntensity: "Moderate", waterLevelM: 0.6, riskLevel: "Moderate", color: "#FFBE00", affectedAreas: ["Pragati Maidan", "ITO", "Munirka", "Rajouri Garden"], advice: "Drainage congestion possible. Monitor traffic alerts." },
  { city: "Bengaluru", state: "Karnataka", rainfallMm24h: 95.4, rainfallIntensity: "Heavy", waterLevelM: 1.2, riskLevel: "Moderate", color: "#FFBE00", affectedAreas: ["Koramangala", "HSR Layout", "Whitefield", "Marathahalli"], advice: "Lake overflow risk in VRL zones. Avoid evening commute through low-lying roads." },
  { city: "Hyderabad", state: "Telangana", rainfallMm24h: 54.1, rainfallIntensity: "Moderate", waterLevelM: 0.4, riskLevel: "Low", color: "#8ED329", affectedAreas: ["Malkajgiri", "Secunderabad", "LB Nagar"], advice: "Normal urban drainage should handle. Monitor for sudden intensification." },
];

export default function UrbanFloodPage() {
  const { activeLocation } = useWeather();
  const [selectedCity, setSelectedCity] = useState<string>(FLOOD_ZONES[0].city);

  const selected = FLOOD_ZONES.find((z) => z.city === selectedCity)!;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="Urban Flood Nowcast" subtitle="IMD City Flood Risk & Waterlogging Alerts" />

      <div className="p-4 space-y-4">
        {/* City Selector */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {FLOOD_ZONES.map((zone) => (
            <button
              key={zone.city}
              onClick={() => setSelectedCity(zone.city)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                selectedCity === zone.city
                  ? "bg-[#00DDE5] text-[#06345C] shadow-lg scale-105"
                  : "glass-button text-white/80 hover:text-white"
              }`}
            >
              {zone.city}
            </button>
          ))}
        </div>

        {/* Selected City Card */}
        <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#00DDE5]" />
                <h2 className="font-extrabold text-lg text-white leading-tight">{selected.city}</h2>
              </div>
              <span className="text-xs text-white/70 block mt-0.5 ml-6">{selected.state}</span>
            </div>
            <span
              className="text-[10px] font-black px-2.5 py-1 rounded-xl text-black shadow-md shrink-0"
              style={{ backgroundColor: selected.color }}
            >
              {selected.riskLevel} Risk
            </span>
          </div>

          {/* Rain & Water Level */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-[#00DDE5]">
                <CloudRain className="w-4 h-4" />
                <span className="font-bold">24h Rainfall</span>
              </div>
              <span className="text-xl font-black text-white block">{selected.rainfallMm24h} mm</span>
              <span className="text-[10px] text-white/60">{selected.rainfallIntensity} Intensity</span>
            </div>
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-[#FFBE00]">
                <TrendingUp className="w-4 h-4" />
                <span className="font-bold">Water Level</span>
              </div>
              <span className="text-xl font-black text-white block">{selected.waterLevelM} m</span>
              <span className="text-[10px] text-white/60">Above Normal Drainage</span>
            </div>
          </div>

          {/* Affected Areas */}
          <div className="bg-black/20 p-3 rounded-2xl border border-white/5 space-y-2">
            <span className="text-[9px] font-bold text-[#FFBE00] uppercase tracking-wider block">
              Likely Waterlogging Zones
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selected.affectedAreas.map((area) => (
                <span key={area} className="px-2 py-0.5 bg-white/10 rounded-full text-[10px] text-white/90 font-bold">
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Advice */}
          <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-xs text-white/90 leading-relaxed">
            <span className="text-[9px] font-bold text-[#8ED329] uppercase tracking-wider block mb-1">
              Advisory
            </span>
            {selected.advice}
          </div>
        </div>

        {/* Rainfall Intensity Legend */}
        <div className="glass-card rounded-3xl p-5 border border-white/20 space-y-3">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Droplets className="w-4 h-4 text-[#00DDE5]" />
            <span>IMD Urban Rainfall Classification</span>
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-[#8ED329]/15 p-2.5 rounded-xl border border-[#8ED329]/20">
              <strong className="text-[#8ED329] block">Light: &lt; 64.5 mm/24h</strong>
              <span className="text-white/70">Normal drainage handles</span>
            </div>
            <div className="bg-[#FFBE00]/15 p-2.5 rounded-xl border border-[#FFBE00]/20">
              <strong className="text-[#FFBE00] block">Moderate: 64.5–115.5 mm</strong>
              <span className="text-white/70">Localized waterlogging likely</span>
            </div>
            <div className="bg-[#FF7400]/15 p-2.5 rounded-xl border border-[#FF7400]/20">
              <strong className="text-[#FF7400] block">Heavy: 115.6–204.4 mm</strong>
              <span className="text-white/70">Major disruption expected</span>
            </div>
            <div className="bg-[#FF2020]/15 p-2.5 rounded-xl border border-[#FF2020]/20">
              <strong className="text-[#FF2020] block">Very Heavy: &gt; 204.5 mm</strong>
              <span className="text-white/70">Severe flooding, evacuate low areas</span>
            </div>
          </div>
        </div>

        {/* Safety */}
        <div className="glass-card rounded-3xl p-5 border border-white/20 space-y-3">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#FFBE00]" />
            <span>Flood Safety Checklist</span>
          </h3>
          <div className="space-y-2 text-xs text-white/85">
            <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-[#8ED329] shrink-0 mt-0.5" />
              <span><strong>Never drive through flooded roads</strong> — 6 inches of water can knock you down, 2 feet can float a car.</span>
            </div>
            <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-[#8ED329] shrink-0 mt-0.5" />
              <span><strong>Move to higher floors</strong> if water rises. Never go to the roof unless water is at your door.</span>
            </div>
            <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-[#8ED329] shrink-0 mt-0.5" />
              <span><strong>Emergency number:</strong> NDRF 011-24363260 • Disaster Helpline 108 • Police 100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
