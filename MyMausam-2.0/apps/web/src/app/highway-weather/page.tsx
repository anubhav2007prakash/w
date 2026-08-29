"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { useWeather } from "@/context/WeatherContext";
import {
  Car,
  CloudRain,
  Wind,
  Eye,
  Thermometer,
  MapPin,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface HighwayRoute {
  name: string;
  from: string;
  to: string;
  distance: string;
  temp: number;
  windSpeed: number;
  visibility: string;
  rainfall: number;
  roadCondition: "Clear" | "Wet" | "Waterlogged" | "Fog" | "Snow" | "Landslide";
  color: string;
  advisory: string;
  trafficStatus: "Smooth" | "Moderate" | "Heavy" | "Blocked";
  trafficColor: string;
}

const HIGHWAYS: HighwayRoute[] = [
  { name: "NH-44 (Delhi→Chandigarh)", from: "Delhi", to: "Chandigarh", distance: "243 km", temp: 18.5, windSpeed: 8, visibility: "100m (Dense Fog)", rainfall: 0, roadCondition: "Fog", color: "#FF7400", advisory: "Dense fog 2:00–10:00 AM. Use fog lights. Max speed 40 km/h. Ambala toll has fog advisory board.", trafficStatus: "Moderate", trafficColor: "#FFBE00" },
  { name: "NH-48 (Mumbai→Pune)", from: "Mumbai", to: "Pune", distance: "149 km", temp: 28.3, windSpeed: 12, visibility: "4 km", rainfall: 42, roadCondition: "Wet", color: "#FFBE00", advisory: "Intermittent rain on Expressway. Ghat section slippery. Use low beam. Avoid overtaking near Lonavala.", trafficStatus: "Smooth", trafficColor: "#8ED329" },
  { name: "NH-44 (Srinagar→Leh)", from: "Srinagar", to: "Leh", distance: "434 km", temp: -2.1, windSpeed: 35, visibility: "200m", rainfall: 25, roadCondition: "Snow", color: "#FF2020", advisory: "Zojila Pass CLOSED. Heavy snow. Banihal tunnel operational. Check BRO updates before travel.", trafficStatus: "Blocked", trafficColor: "#FF2020" },
  { name: "NH-16 (Chennai→Kolkata)", from: "Chennai", to: "Kolkata", distance: "1,360 km", temp: 32.1, windSpeed: 15, visibility: "8 km", rainfall: 8, roadCondition: "Clear", color: "#8ED329", advisory: "Clear roads. Normal driving conditions. Check Vizag stretch for traffic diversions.", trafficStatus: "Smooth", trafficColor: "#8ED329" },
  { name: "NH-48 (Delhi→Jaipur)", from: "Delhi", to: "Jaipur", distance: "281 km", temp: 22.4, windSpeed: 10, visibility: "150m (Fog)", rainfall: 0, roadCondition: "Fog", color: "#FF7400", advisory: "Moderate to dense fog on Dausa–Bandikui stretch. Neemrana toll fog cameras active.", trafficStatus: "Moderate", trafficColor: "#FFBE00" },
  { name: "NH-66 (Mumbai→Goa)", from: "Mumbai", to: "Goa", distance: "585 km", temp: 27.8, windSpeed: 18, visibility: "3 km", rainfall: 65, roadCondition: "Wet", color: "#FFBE00", advisory: "Heavy rain in Ratnagiri–Kolhapur stretch. Waterlogging near Chiplun. Pothole risk on ghat roads.", trafficStatus: "Heavy", trafficColor: "#FF7400" },
];

export default function HighwayWeatherPage() {
  const { activeLocation } = useWeather();
  const [selectedHighway, setSelectedHighway] = useState(0);

  const sel = HIGHWAYS[selectedHighway];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="Highway Route Weather" subtitle="NHAI Road Weather & Traffic Intelligence" />

      <div className="p-4 space-y-4">
        {/* Route Selector */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {HIGHWAYS.map((hw, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedHighway(idx)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                selectedHighway === idx
                  ? "bg-[#00DDE5] text-[#06345C] shadow-lg scale-105"
                  : "glass-button text-white/80 hover:text-white"
              }`}
            >
              {hw.name.split("(")[0].trim()}
            </button>
          ))}
        </div>

        {/* Selected Highway */}
        <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="font-extrabold text-sm text-white leading-tight">{sel.name}</h2>
              <span className="text-[10px] text-white/60 block mt-0.5">
                {sel.from} → {sel.to} • {sel.distance}
              </span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span
                className="text-[10px] font-black px-2.5 py-0.5 rounded-full text-black"
                style={{ backgroundColor: sel.color }}
              >
                {sel.roadCondition}
              </span>
              <span
                className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: sel.trafficColor + "30", color: sel.trafficColor }}
              >
                {sel.trafficStatus} Traffic
              </span>
            </div>
          </div>

          {/* Route Metrics */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-[#00DDE5]">
                <Thermometer className="w-4 h-4" />
                <span className="font-bold">Temperature</span>
              </div>
              <span className="text-xl font-black text-white block">{sel.temp}°C</span>
            </div>
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-[#FFBE00]">
                <Wind className="w-4 h-4" />
                <span className="font-bold">Wind</span>
              </div>
              <span className="text-xl font-black text-white block">{sel.windSpeed} km/h</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 text-center">
              <Eye className="w-4 h-4 mx-auto text-blue-200 mb-1" />
              <span className="text-[9px] text-white/60 block">Visibility</span>
              <strong className="text-white text-xs block">{sel.visibility}</strong>
            </div>
            <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 text-center">
              <CloudRain className="w-4 h-4 mx-auto text-[#00BFFF] mb-1" />
              <span className="text-[9px] text-white/60 block">Rainfall (24h)</span>
              <strong className="text-white text-xs block">{sel.rainfall} mm</strong>
            </div>
          </div>

          {/* Advisory */}
          <div className="bg-black/20 p-3 rounded-xl text-xs text-white/90 leading-relaxed border border-white/5">
            <span className="text-[9px] font-bold text-[#FFBE00] uppercase tracking-wider block mb-1">
              Route Advisory
            </span>
            {sel.advisory}
          </div>
        </div>

        {/* Driving Tips */}
        <div className="glass-card rounded-3xl p-5 border border-white/20 space-y-3">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#8ED329]" />
            <span>Condition-Specific Driving Tips</span>
          </h3>
          <div className="space-y-2 text-xs text-white/85">
            <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-[#FF7400] shrink-0 mt-0.5" />
              <span><strong>Fog:</strong> Low beam only. Use fog lights. Follow white edge line. No overtaking.</span>
            </div>
            <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-[#00BFFF] shrink-0 mt-0.5" />
              <span><strong>Rain:</strong> Increase following distance to 5 seconds. Avoid sudden braking. Check tyre tread.</span>
            </div>
            <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-[#00DDE5] shrink-0 mt-0.5" />
              <span><strong>Snow:</strong> Chains mandatory. Reduce speed to 30 km/h. Gentle braking only. 4x4 recommended.</span>
            </div>
            <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-[#FFBE00] shrink-0 mt-0.5" />
              <span><strong>Landslide:</strong> Never stop near cliff faces. If debris ahead, reverse immediately. Call 1033.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
