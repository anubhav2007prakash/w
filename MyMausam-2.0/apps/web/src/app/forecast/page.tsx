"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { useWeather } from "@/context/WeatherContext";
import {
  Calendar,
  CloudSun,
  Sun,
  CloudRain,
  CloudLightning,
  Droplets,
  Wind,
  Gauge,
  Sunrise,
  Sunset,
} from "lucide-react";

export default function ForecastPage() {
  const { currentWeather, formatTemp, activeLocation } = useWeather();
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  const DAYS = [
    { day: "Today", date: "27 Aug", condition: "Partly Cloudy", max: 35.8, min: 25.9, humidity: 38, rain: 10, wind: 9.4, uv: 7.2 },
    { day: "Friday", date: "28 Aug", condition: "Overcast Sky", max: 34.5, min: 26.2, humidity: 45, rain: 25, wind: 12.0, uv: 6.5 },
    { day: "Saturday", date: "29 Aug", condition: "Light Rain", max: 32.1, min: 24.8, humidity: 62, rain: 65, wind: 14.5, uv: 4.8 },
    { day: "Sunday", date: "30 Aug", condition: "Thunderstorm", max: 30.8, min: 23.5, humidity: 75, rain: 80, wind: 22.0, uv: 3.5 },
    { day: "Monday", date: "31 Aug", condition: "Scattered Rain", max: 31.5, min: 24.2, humidity: 60, rain: 45, wind: 15.0, uv: 5.2 },
    { day: "Tuesday", date: "01 Sep", condition: "Partly Cloudy", max: 33.2, min: 25.0, humidity: 50, rain: 20, wind: 10.5, uv: 6.8 },
    { day: "Wednesday", date: "02 Sep", condition: "Sunny", max: 34.8, min: 25.5, humidity: 42, rain: 10, wind: 8.5, uv: 7.4 },
  ];

  const sel = DAYS[selectedDayIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="7-Day Extended Matrix" subtitle="Detailed Daily Meteorological Parameters" />

      <div className="p-4 space-y-4">
        {/* Horizontal Day Selector */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {DAYS.map((d, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedDayIndex(idx)}
              className={`p-3 rounded-2xl shrink-0 text-center transition-all ${
                selectedDayIndex === idx
                  ? "bg-white text-[#06345C] shadow-xl scale-105"
                  : "glass-card text-white hover:bg-white/15"
              }`}
            >
              <span className="text-[10px] font-bold block opacity-70">{d.day}</span>
              <span className="text-sm font-black block mt-0.5">{d.date.split(" ")[0]}</span>
              <span className="text-[10px] font-bold text-[#00DDE5] block mt-0.5">{formatTemp(d.max)}</span>
            </button>
          ))}
        </div>

        {/* Selected Day Expanded Detail Card */}
        <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-white/60 font-bold uppercase tracking-wider block">
                {sel.day}, {sel.date} • {activeLocation}
              </span>
              <h2 className="text-xl font-black text-white leading-tight mt-0.5">{sel.condition}</h2>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-white">{formatTemp(sel.max)}</span>
              <span className="text-xs text-white/60 block">Min {formatTemp(sel.min)}</span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-[#00DDE5]">
                <Droplets className="w-4 h-4" />
                <span className="font-bold">Rainfall Chance</span>
              </div>
              <span className="text-lg font-black text-white block">{sel.rain}%</span>
              <span className="text-[10px] text-white/60">Relative Humidity: {sel.humidity}%</span>
            </div>

            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-[#FFBE00]">
                <Wind className="w-4 h-4" />
                <span className="font-bold">Wind Velocity</span>
              </div>
              <span className="text-lg font-black text-white block">{sel.wind} km/h</span>
              <span className="text-[10px] text-white/60">UV Index: {sel.uv}</span>
            </div>
          </div>

          {/* Astronomical Timings */}
          <div className="bg-black/25 p-3.5 rounded-2xl flex items-center justify-around text-xs">
            <div className="flex items-center gap-2">
              <Sunrise className="w-4 h-4 text-[#FFBE00]" />
              <div>
                <span className="text-[10px] text-white/60 block">Sunrise</span>
                <strong className="text-white">05:54 AM</strong>
              </div>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div className="flex items-center gap-2">
              <Sunset className="w-4 h-4 text-[#FFBE00]" />
              <div>
                <span className="text-[10px] text-white/60 block">Sunset</span>
                <strong className="text-white">06:51 PM</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
