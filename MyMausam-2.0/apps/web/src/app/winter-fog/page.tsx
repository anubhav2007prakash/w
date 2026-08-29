"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { useWeather } from "@/context/WeatherContext";
import {
  CloudFog,
  Eye,
  AlertTriangle,
  MapPin,
  Clock,
  Plane,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";

interface FogStation {
  city: string;
  state: string;
  visibilityM: number;
  fogType: "Shallow" | "Moderate" | "Dense" | "Very Dense";
  color: string;
  airportStatus: "Normal" | "Diversions" | "Grounded" | "IFR Only";
  startTime: string;
  clearanceTime: string;
  advice: string;
}

const FOG_STATIONS: FogStation[] = [
  { city: "Delhi (Safdarjung)", state: "Delhi", visibilityM: 50, fogType: "Very Dense", color: "#FF2020", airportStatus: "Diversions", startTime: "02:00 AM", clearanceTime: "10:30 AM", advice: "Visibility below 50m. All flights at IGI under CAT III ILS. Avoid road travel." },
  { city: "Delhi (Palam)", state: "Delhi", visibilityM: 75, fogType: "Very Dense", color: "#FF2020", airportStatus: "Diversions", startTime: "02:30 AM", clearanceTime: "11:00 AM", advice: "CAT IIIB operations active. Expect 30-45 min delays on all arrivals." },
  { city: "Amritsar", state: "Punjab", visibilityM: 100, fogType: "Dense", color: "#FF7400", airportStatus: "IFR Only", startTime: "03:00 AM", clearanceTime: "10:00 AM", advice: "Dense fog on GT Road. NH-1 traffic advisory: Use fog lights, maintain 30m gap." },
  { city: "Lucknow", state: "Uttar Pradesh", visibilityM: 200, fogType: "Dense", color: "#FF7400", airportStatus: "IFR Only", startTime: "04:00 AM", clearanceTime: "09:30 AM", advice: "Chaudhary Charan Singh Airport on low-visibility procedures. Drive with hazard lights." },
  { city: "Patna", state: "Bihar", visibilityM: 150, fogType: "Dense", color: "#FF7400", airportStatus: "Normal", startTime: "03:30 AM", clearanceTime: "10:00 AM", advice: "Roadways bus services delayed. Railway running 1-3 hrs late on Howrah-Delhi route." },
  { city: "Kanpur", state: "Uttar Pradesh", visibilityM: 300, fogType: "Moderate", color: "#FFBE00", airportStatus: "Normal", startTime: "05:00 AM", clearanceTime: "08:30 AM", advice: "Moderate fog with intermittent dense patches. Agra-Lucknow Expressway caution." },
  { city: "Jaipur", state: "Rajasthan", visibilityM: 500, fogType: "Moderate", color: "#FFBE00", airportStatus: "Normal", startTime: "05:30 AM", clearanceTime: "08:00 AM", advice: "Morning fog lifting by mid-morning. No major disruption expected." },
];

export default function WinterFogPage() {
  const { activeLocation } = useWeather();
  const [selectedCity, setSelectedCity] = useState<string>(FOG_STATIONS[0].city);

  const selected = FOG_STATIONS.find((s) => s.city === selectedCity)!;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="Winter Fog & Visibility" subtitle="IMD Dense Fog Advisory & Airport Status" />

      <div className="p-4 space-y-4">
        {/* City Selector */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {FOG_STATIONS.map((station) => (
            <button
              key={station.city}
              onClick={() => setSelectedCity(station.city)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                selectedCity === station.city
                  ? "bg-[#00DDE5] text-[#06345C] shadow-lg scale-105"
                  : "glass-button text-white/80 hover:text-white"
              }`}
            >
              {station.city.split("(")[0].trim()}
            </button>
          ))}
        </div>

        {/* Selected Station */}
        <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <CloudFog className="w-4 h-4 text-white/80" />
                <h2 className="font-extrabold text-lg text-white leading-tight">{selected.city}</h2>
              </div>
              <span className="text-xs text-white/70 block mt-0.5 ml-6">{selected.state}</span>
            </div>
            <span
              className="text-[10px] font-black px-2.5 py-1 rounded-xl text-black shrink-0 shadow-md"
              style={{ backgroundColor: selected.color }}
            >
              {selected.fogType} Fog
            </span>
          </div>

          {/* Visibility Meter */}
          <div className="bg-black/20 p-4 rounded-2xl border border-white/10 text-center space-y-2">
            <Eye className="w-8 h-8 mx-auto text-white/60" />
            <span className="text-4xl font-black text-white block">{selected.visibilityM} m</span>
            <span className="text-xs text-white/60">Current Visibility</span>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mt-2">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min((selected.visibilityM / 1000) * 100, 100)}%`,
                  backgroundColor: selected.color,
                }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-white/50">
              <span>0m (Zero)</span>
              <span>1000m (Clear)</span>
            </div>
          </div>

          {/* Airport Status */}
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
            <Plane className="w-5 h-5 text-[#00DDE5] shrink-0" />
            <div className="flex-1">
              <span className="text-xs font-bold text-white block">Airport Operations</span>
              <span className="text-[10px] text-white/60">{selected.airportStatus}</span>
            </div>
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                selected.airportStatus === "Normal"
                  ? "bg-[#8ED329] text-black"
                  : selected.airportStatus === "Grounded"
                  ? "bg-[#FF2020] text-white"
                  : "bg-[#FFBE00] text-black"
              }`}
            >
              {selected.airportStatus}
            </span>
          </div>

          {/* Timing */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 text-center">
              <Clock className="w-4 h-4 mx-auto text-[#FFBE00] mb-1" />
              <span className="text-[9px] text-white/60 block">Fog Onset</span>
              <strong className="text-white text-sm block">{selected.startTime}</strong>
            </div>
            <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 text-center">
              <Clock className="w-4 h-4 mx-auto text-[#8ED329] mb-1" />
              <span className="text-[9px] text-white/60 block">Expected Clearance</span>
              <strong className="text-white text-sm block">{selected.clearanceTime}</strong>
            </div>
          </div>

          {/* Advice */}
          <div className="bg-black/20 p-3 rounded-xl text-xs text-white/90 leading-relaxed border border-white/5">
            <span className="text-[9px] font-bold text-[#00DDE5] uppercase tracking-wider block mb-1">
              Advisory
            </span>
            {selected.advice}
          </div>
        </div>

        {/* Driving Tips */}
        <div className="glass-card rounded-3xl p-5 border border-white/20 space-y-3">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#FFBE00]" />
            <span>Dense Fog Driving Protocol</span>
          </h3>
          <div className="space-y-2 text-xs text-white/85">
            <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-[#8ED329] shrink-0 mt-0.5" />
              <span><strong>Low beam only</strong> — High beams reflect off fog droplets and reduce visibility further.</span>
            </div>
            <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-[#8ED329] shrink-0 mt-0.5" />
              <span><strong>Follow road markings</strong> — Use right-edge white line as guide. Do not overtake.</span>
            </div>
            <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-[#8ED329] shrink-0 mt-0.5" />
              <span><strong>Speed limit:</strong> Dense fog (&lt;100m) — Max 30 km/h. Moderate fog (&lt;500m) — Max 50 km/h.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
