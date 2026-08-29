"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { useWeather } from "@/context/WeatherContext";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  MapPin,
  Thermometer,
  Droplets,
  Sun,
  Cloud,
} from "lucide-react";

interface SeasonalOutlook {
  season: string;
  period: string;
  region: string;
  tempDeparture: "Above Normal" | "Normal" | "Below Normal";
  rainfallDeparture: "Excess" | "Normal" | "Deficient";
  tempValue: string;
  rainfallValue: string;
  icon: React.ReactNode;
}

const OUTLOOKS: SeasonalOutlook[] = [
  { season: "Monsoon 2026", period: "Jun–Sep", region: "All India", tempDeparture: "Normal", rainfallDeparture: "Excess", tempValue: "+0.3°C", rainfallValue: "106% LPA", icon: <Droplets className="w-4 h-4" /> },
  { season: "Post-Monsoon", period: "Oct–Dec", region: "South India", tempDeparture: "Above Normal", rainfallDeparture: "Normal", tempValue: "+0.8°C", rainfallValue: "98% LPA", icon: <Sun className="w-4 h-4" /> },
  { season: "Winter", period: "Jan–Feb", region: "North India", tempDeparture: "Above Normal", rainfallDeparture: "Deficient", tempValue: "+1.2°C", rainfallValue: "72% LPA", icon: <Cloud className="w-4 h-4" /> },
  { season: "Pre-Monsoon", period: "Mar–May", region: "Central India", tempDeparture: "Above Normal", rainfallDeparture: "Normal", tempValue: "+0.9°C", rainfallValue: "102% LPA", icon: <Thermometer className="w-4 h-4" /> },
];

const MONTHLY_DATA = [
  { month: "Jan", temp: 21.5, rain: 18, normal: 22 },
  { month: "Feb", temp: 24.8, rain: 22, normal: 25 },
  { month: "Mar", temp: 29.2, rain: 15, normal: 30 },
  { month: "Apr", temp: 34.1, rain: 12, normal: 35 },
  { month: "May", temp: 38.5, rain: 30, normal: 39 },
  { month: "Jun", temp: 35.2, rain: 165, normal: 35 },
  { month: "Jul", temp: 31.8, rain: 280, normal: 32 },
  { month: "Aug", temp: 31.2, rain: 260, normal: 31 },
  { month: "Sep", temp: 31.5, rain: 170, normal: 32 },
  { month: "Oct", temp: 29.8, rain: 45, normal: 30 },
  { month: "Nov", temp: 25.4, rain: 12, normal: 26 },
  { month: "Dec", temp: 22.1, rain: 8, normal: 23 },
];

export default function ClimateOutlookPage() {
  const { activeLocation } = useWeather();
  const [selectedSeason, setSelectedSeason] = useState(0);

  const sel = OUTLOOKS[selectedSeason];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="Seasonal Climate Outlook" subtitle="IMD Long-Range Forecast & Climate Services" />

      <div className="p-4 space-y-4">
        {/* Season Selector */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {OUTLOOKS.map((outlook, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedSeason(idx)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                selectedSeason === idx
                  ? "bg-[#00DDE5] text-[#06345C] shadow-lg scale-105"
                  : "glass-button text-white/80 hover:text-white"
              }`}
            >
              {outlook.season}
            </button>
          ))}
        </div>

        {/* Season Detail */}
        <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="font-extrabold text-lg text-white leading-tight">{sel.season}</h2>
              <span className="text-xs text-white/70 block mt-0.5">{sel.period} • {sel.region}</span>
            </div>
            <div className="text-[#00DDE5]">{sel.icon}</div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] text-white/60 block">Temperature Departure</span>
              <span className="text-lg font-black text-white block">{sel.tempValue}</span>
              <span
                className={`text-[10px] font-bold ${
                  sel.tempDeparture.includes("Above")
                    ? "text-[#FF2020]"
                    : sel.tempDeparture.includes("Below")
                    ? "text-[#00BFFF]"
                    : "text-[#8ED329]"
                }`}
              >
                {sel.tempDeparture === "Above Normal" && <TrendingUp className="w-3 h-3 inline mr-0.5" />}
                {sel.tempDeparture === "Below Normal" && <TrendingDown className="w-3 h-3 inline mr-0.5" />}
                {sel.tempDeparture}
              </span>
            </div>
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] text-white/60 block">Rainfall vs LPA</span>
              <span className="text-lg font-black text-white block">{sel.rainfallValue}</span>
              <span
                className={`text-[10px] font-bold ${
                  sel.rainfallDeparture === "Excess"
                    ? "text-[#00BFFF]"
                    : sel.rainfallDeparture === "Deficient"
                    ? "text-[#FF7400]"
                    : "text-[#8ED329]"
                }`}
              >
                {sel.rainfallDeparture === "Excess" && <TrendingUp className="w-3 h-3 inline mr-0.5" />}
                {sel.rainfallDeparture === "Deficient" && <TrendingDown className="w-3 h-3 inline mr-0.5" />}
                {sel.rainfallDeparture}
              </span>
            </div>
          </div>
        </div>

        {/* Monthly Temperature Chart */}
        <div className="glass-card rounded-3xl p-5 border border-white/20 space-y-3">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#FFBE00]" />
            <span>Monthly Temperature Trend ({activeLocation})</span>
          </h3>

          <div className="space-y-2">
            {MONTHLY_DATA.map((m) => (
              <div key={m.month} className="flex items-center gap-2 text-xs">
                <span className="w-8 text-[10px] text-white/60 font-bold shrink-0">{m.month}</span>
                <div className="flex-1 h-4 bg-white/5 rounded-full overflow-hidden relative">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(m.temp / 42) * 100}%`,
                      backgroundColor: m.temp > 35 ? "#FF2020" : m.temp > 30 ? "#FFBE00" : "#00DDE5",
                    }}
                  />
                </div>
                <span className="w-10 text-right text-[10px] font-bold text-white shrink-0">{m.temp}°C</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Rainfall */}
        <div className="glass-card rounded-3xl p-5 border border-white/20 space-y-3">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Droplets className="w-4 h-4 text-[#00BFFF]" />
            <span>Monthly Rainfall (mm)</span>
          </h3>

          <div className="flex items-end gap-1 h-32">
            {MONTHLY_DATA.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[8px] text-white/50 font-bold">{m.rain}</span>
                <div
                  className="w-full rounded-t-md transition-all"
                  style={{
                    height: `${(m.rain / 300) * 100}%`,
                    minHeight: "2px",
                    backgroundColor: m.rain > 200 ? "#00BFFF" : m.rain > 100 ? "#00DDE5" : "#00DDE580",
                  }}
                />
                <span className="text-[8px] text-white/50 font-bold">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ICPMFS Note */}
        <div className="glass-card rounded-3xl p-5 border border-white/20 space-y-2">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#8ED329]" />
            <span>IMD Climate Prediction Notes</span>
          </h3>
          <p className="text-xs text-white/80 leading-relaxed">
            Forecasts based on IMD&apos;s monsoon mission coupled model (MMF), EOS LSSM, and IITM Earth System Model. LPA = Long Period Average (1971–2020 baseline). Seasonal outlooks are probabilistic; regional variations expected.
          </p>
          <p className="text-[10px] text-white/50">
            Source: India Meteorological Department, Ministry of Earth Sciences
          </p>
        </div>
      </div>
    </div>
  );
}
