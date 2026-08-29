"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { useWeather } from "@/context/WeatherContext";
import {
  CloudRain,
  Wind,
  MapPin,
  Calendar,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  Globe,
} from "lucide-react";

interface MonsoonStation {
  name: string;
  region: string;
  onset: string;
  withdrawal: string;
  rainfallMm: number;
  normalMm: number;
  departure: number;
  status: "Active" | "Break" | "Intensifying" | "Withdrawn";
  color: string;
}

const MONSOON_DATA: MonsoonStation[] = [
  { name: "Kerala", region: "South India", onset: "01 Jun", withdrawal: "15 Oct", rainfallMm: 1842, normalMm: 1720, departure: 7, status: "Active", color: "#8ED329" },
  { name: "Mumbai", region: "West India", onset: "10 Jun", withdrawal: "05 Oct", rainfallMm: 2215, normalMm: 2180, departure: 2, status: "Active", color: "#8ED329" },
  { name: "Delhi", region: "North India", onset: "25 Jun", withdrawal: "25 Sep", rainfallMm: 520, normalMm: 620, departure: -16, status: "Break", color: "#FFBE00" },
  { name: "Kolkata", region: "East India", onset: "10 Jun", withdrawal: "10 Oct", rainfallMm: 1380, normalMm: 1400, departure: -1, status: "Active", color: "#8ED329" },
  { name: "Chennai", region: "Southeast Coast", onset: "01 Jun", withdrawal: "01 Oct", rainfallMm: 385, normalMm: 420, departure: -8, status: "Active", color: "#8ED329" },
  { name: "Bengaluru", region: "South Interior", onset: "05 Jun", withdrawal: "01 Oct", rainfallMm: 620, normalMm: 580, departure: 7, status: "Intensifying", color: "#00DDE5" },
  { name: "Patna", region: "East Central", onset: "15 Jun", withdrawal: "20 Sep", rainfallMm: 890, normalMm: 1020, departure: -13, status: "Break", color: "#FFBE00" },
  { name: "Shillong", region: "Northeast", onset: "01 Jun", withdrawal: "15 Oct", rainfallMm: 2850, normalMm: 2680, departure: 6, status: "Active", color: "#8ED329" },
];

export default function MonsoonTrackerPage() {
  const { activeLocation } = useWeather();
  const [selectedStation, setSelectedStation] = useState(0);

  const sel = MONSOON_DATA[selectedStation];
  const allIndiaAvg = Math.round(MONSOON_DATA.reduce((a, b) => a + ((b.rainfallMm / b.normalMm) * 100), 0) / MONSOON_DATA.length);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="All-India Monsoon Tracker" subtitle="IMD Southwest Monsoon Real-Time Dashboard" />

      <div className="p-4 space-y-4">
        {/* National Summary */}
        <div className="glass-card rounded-3xl p-4.5 border border-white/20 shadow-xl space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00BFFF] to-[#0055A6] p-[2px]">
              <div className="w-full h-full bg-[#062b4c] rounded-2xl flex items-center justify-center text-[#00BFFF]">
                <Globe className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="font-extrabold text-white text-base leading-none">
                Southwest Monsoon 2026
              </h2>
              <p className="text-xs text-white/70 mt-1">
                All-India Rainfall: {allIndiaAvg}% of LPA
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-[#8ED329]/15 p-2.5 rounded-xl border border-[#8ED329]/20">
              <CheckCircle2 className="w-4 h-4 mx-auto text-[#8ED329] mb-1" />
              <span className="text-[9px] text-white/60 block">Normal+</span>
              <strong className="text-[#8ED329] text-sm block">
                {MONSOON_DATA.filter((d) => d.departure >= -10 && d.departure <= 10).length}
              </strong>
            </div>
            <div className="bg-[#FFBE00]/15 p-2.5 rounded-xl border border-[#FFBE00]/20">
              <AlertTriangle className="w-4 h-4 mx-auto text-[#FFBE00] mb-1" />
              <span className="text-[9px] text-white/60 block">Deficient</span>
              <strong className="text-[#FFBE00] text-sm block">
                {MONSOON_DATA.filter((d) => d.departure < -10).length}
              </strong>
            </div>
            <div className="bg-[#00BFFF]/15 p-2.5 rounded-xl border border-[#00BFFF]/20">
              <TrendingUp className="w-4 h-4 mx-auto text-[#00BFFF] mb-1" />
              <span className="text-[9px] text-white/60 block">Excess</span>
              <strong className="text-[#00BFFF] text-sm block">
                {MONSOON_DATA.filter((d) => d.departure > 10).length}
              </strong>
            </div>
          </div>
        </div>

        {/* Station Selector */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {MONSOON_DATA.map((station, idx) => (
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
                <MapPin className="w-4 h-4 text-[#00DDE5]" />
                <h2 className="font-extrabold text-lg text-white leading-tight">{sel.name}</h2>
              </div>
              <span className="text-xs text-white/70 block mt-0.5 ml-6">{sel.region}</span>
            </div>
            <span
              className="text-[10px] font-black px-2.5 py-1 rounded-xl text-black shrink-0 shadow-md"
              style={{ backgroundColor: sel.color }}
            >
              {sel.status}
            </span>
          </div>

          {/* Rainfall Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] text-white/60 block">Season Rainfall</span>
              <span className="text-xl font-black text-white block">{sel.rainfallMm} mm</span>
              <span className="text-[10px] text-white/60">Normal: {sel.normalMm} mm</span>
            </div>
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] text-white/60 block">Departure</span>
              <span className={`text-xl font-black block ${sel.departure >= 0 ? "text-[#8ED329]" : "text-[#FF7400]"}`}>
                {sel.departure > 0 ? "+" : ""}{sel.departure}%
              </span>
              <span className={`text-[10px] font-bold ${sel.departure >= 0 ? "text-[#8ED329]" : "text-[#FF7400]"}`}>
                {sel.departure >= 0 ? "Above Normal" : "Below Normal"}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1.5">
            <div className="flex justify-between text-[10px] text-white/60">
              <span>Rainfall Progress</span>
              <span>{Math.round((sel.rainfallMm / sel.normalMm) * 100)}%</span>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min((sel.rainfallMm / sel.normalMm) * 100, 100)}%`,
                  backgroundColor: sel.color,
                }}
              />
            </div>
          </div>

          {/* Key Dates */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 text-center">
              <Calendar className="w-4 h-4 mx-auto text-[#00DDE5] mb-1" />
              <span className="text-[9px] text-white/60 block">Onset Date</span>
              <strong className="text-white text-sm block">{sel.onset}</strong>
            </div>
            <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 text-center">
              <Calendar className="w-4 h-4 mx-auto text-[#FFBE00] mb-1" />
              <span className="text-[9px] text-white/60 block">Expected Withdrawal</span>
              <strong className="text-white text-sm block">{sel.withdrawal}</strong>
            </div>
          </div>
        </div>

        {/* IMD LPA Note */}
        <div className="glass-card rounded-3xl p-5 border border-white/20 space-y-2">
          <p className="text-xs text-white/70 leading-relaxed">
            <strong className="text-white/90">LPA = Long Period Average</strong> (1971–2020 baseline). Departures are calculated against district-level normal rainfall. IMD uses 364 designated rain gauge stations for national monsoon monitoring.
          </p>
        </div>
      </div>
    </div>
  );
}
