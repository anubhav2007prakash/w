"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { useWeather } from "@/context/WeatherContext";
import {
  Mountain,
  Snowflake,
  Wind,
  Thermometer,
  AlertTriangle,
  MapPin,
  Clock,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";

interface MountainStation {
  name: string;
  altitude: string;
  region: string;
  temp: number;
  feelsLike: number;
  windSpeed: number;
  windGust: number;
  snowfall24h: number;
  visibility: string;
  avalancheRisk: "Low" | "Moderate" | "Considerable" | "High";
  color: string;
  condition: string;
  advice: string;
}

const MOUNTAIN_STATIONS: MountainStation[] = [
  { name: "Gulmarg", altitude: "2,650 m", region: "Jammu & Kashmir", temp: -4.2, feelsLike: -11.5, windSpeed: 35, windGust: 62, snowfall24h: 45, visibility: "200m", avalancheRisk: "Considerable", color: "#FF7400", condition: "Heavy Snowfall", advice: "Avalanche warning. Avoid exposed slopes above treeline. Check Banihal highway status." },
  { name: "Manali", altitude: "2,050 m", region: "Himachal Pradesh", temp: 2.8, feelsLike: -3.1, windSpeed: 18, windGust: 32, snowfall24h: 12, visibility: "500m", avalancheRisk: "Moderate", color: "#FFBE00", condition: "Light Snow", advice: "Rohtang Pass likely closed. Carry chains for vehicle. Watch for black ice on roads." },
  { name: "Shimla", altitude: "2,276 m", region: "Himachal Pradesh", temp: 5.1, feelsLike: 0.8, windSpeed: 12, windGust: 22, snowfall24h: 0, visibility: "2 km", avalancheRisk: "Low", color: "#8ED329", condition: "Partly Cloudy", advice: "Pleasant conditions. Good for sightseeing. Carry light jacket for evening." },
  { name: "Leh", altitude: "3,524 m", region: "Ladakh", temp: -8.5, feelsLike: -16.2, windSpeed: 28, windGust: 48, snowfall24h: 0, visibility: "8 km", avalancheRisk: "Moderate", color: "#FFBE00", condition: "Clear & Frigid", advice: "Extreme cold. Frostbite risk on exposed skin. Khardung La may be impassable." },
  { name: "Sonamarg", altitude: "2,800 m", region: "Jammu & Kashmir", temp: -1.5, feelsLike: -7.8, windSpeed: 22, windGust: 38, snowfall24h: 25, visibility: "300m", avalancheRisk: "High", color: "#FF2020", condition: "Heavy Snow", advice: "Srinagar-Leh highway closed. Evacuate from high-altitude camps. NDRF on standby." },
  { name: "Auli", altitude: "3,050 m", region: "Uttarakhand", temp: -2.8, feelsLike: -9.4, windSpeed: 20, windGust: 35, snowfall24h: 18, visibility: "600m", avalancheRisk: "Moderate", color: "#FFBE00", condition: "Moderate Snow", advice: "Ski resort operational with caution. Badrinath road may face disruption." },
];

export default function HimalayaWeatherPage() {
  const { activeLocation } = useWeather();
  const [selectedStation, setSelectedStation] = useState(0);

  const sel = MOUNTAIN_STATIONS[selectedStation];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="Mountain & Himalaya Weather" subtitle="High-Altitude Station Monitoring & Avalanche Risk" />

      <div className="p-4 space-y-4">
        {/* Station Selector */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {MOUNTAIN_STATIONS.map((station, idx) => (
            <button
              key={station.name}
              onClick={() => setSelectedStation(idx)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                selectedStation === idx
                  ? "bg-[#00DDE5] text-[#06345C] shadow-lg scale-105"
                  : "glass-button text-white/80 hover:text-white"
              }`}
            >
              {station.name}
            </button>
          ))}
        </div>

        {/* Selected Station */}
        <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Mountain className="w-4 h-4 text-[#00DDE5]" />
                <h2 className="font-extrabold text-lg text-white leading-tight">{sel.name}</h2>
              </div>
              <span className="text-[10px] text-white/60 block mt-0.5 ml-6">
                {sel.altitude} • {sel.region}
              </span>
            </div>
            <span
              className="text-[10px] font-black px-2.5 py-1 rounded-xl text-black shrink-0 shadow-md"
              style={{ backgroundColor: sel.color }}
            >
              {sel.condition}
            </span>
          </div>

          {/* Weather Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-[#00DDE5]">
                <Thermometer className="w-4 h-4" />
                <span className="font-bold">Temperature</span>
              </div>
              <span className="text-xl font-black text-white block">{sel.temp}°C</span>
              <span className="text-[10px] text-white/60">Feels like {sel.feelsLike}°C</span>
            </div>
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-[#FFBE00]">
                <Wind className="w-4 h-4" />
                <span className="font-bold">Wind</span>
              </div>
              <span className="text-xl font-black text-white block">{sel.windSpeed} km/h</span>
              <span className="text-[10px] text-white/60">Gusts: {sel.windGust} km/h</span>
            </div>
          </div>

          {/* Snowfall & Visibility */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 text-center">
              <Snowflake className="w-4 h-4 mx-auto text-[#00BFFF] mb-1" />
              <span className="text-[9px] text-white/60 block">24h Snowfall</span>
              <strong className="text-white text-sm block">{sel.snowfall24h} cm</strong>
            </div>
            <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 text-center">
              <span className="text-[9px] text-white/60 block">Visibility</span>
              <strong className="text-white text-sm block">{sel.visibility}</strong>
            </div>
          </div>

          {/* Avalanche Risk */}
          <div className="bg-black/20 p-3 rounded-2xl border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" style={{ color: sel.color }} />
              <div>
                <span className="text-xs font-bold text-white block">Avalanche Risk</span>
                <span className="text-[10px] text-white/60">HIMANISH/Jammu & Kashmir State Disaster Authority</span>
              </div>
            </div>
            <span
              className="text-[10px] font-black px-2.5 py-1 rounded-xl text-black shadow-md"
              style={{ backgroundColor: sel.color }}
            >
              {sel.avalancheRisk}
            </span>
          </div>

          {/* Advice */}
          <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-xs text-white/90 leading-relaxed">
            <span className="text-[9px] font-bold text-[#FFBE00] uppercase tracking-wider block mb-1">
              Advisory
            </span>
            {sel.advice}
          </div>
        </div>

        {/* Mountain Safety */}
        <div className="glass-card rounded-3xl p-5 border border-white/20 space-y-3">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#FFBE00]" />
            <span>High-Altitude Travel Safety</span>
          </h3>
          <div className="space-y-2 text-xs text-white/85">
            <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-[#8ED329] shrink-0 mt-0.5" />
              <span><strong>Acclimatize:</strong> Ascend gradually. Above 3,000m, gain no more than 300–500m/day.</span>
            </div>
            <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-[#8ED329] shrink-0 mt-0.5" />
              <span><strong>AMS Watch:</strong> Headache + nausea above 2,500m = descend immediately. Do not continue ascent.</span>
            </div>
            <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-[#8ED329] shrink-0 mt-0.5" />
              <span><strong>Roads:</strong> Check HP/PWD/J&K tourism before travel. Snow chains mandatory Oct–Mar.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
