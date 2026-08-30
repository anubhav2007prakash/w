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
  Cloud,
  MapPin,
  AlertTriangle,
  Eye,
  Activity,
} from "lucide-react";

export default function ForecastPage() {
  const { currentWeather, formatTemp, activeLocation } = useWeather();
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  const DAYS = [
    { day: "Today", date: "25 Aug", condition: "Heavy rain", max: 28, min: 24, humidity: 92, rain: 90, wind: 18, uv: 3.5, icon: "🌧️" },
    { day: "Monday", date: "26 Aug", condition: "Cloudy", max: 31, min: 25, humidity: 65, rain: 30, wind: 12, uv: 5.2, icon: "☁️" },
    { day: "Tuesday", date: "27 Aug", condition: "Sunny", max: 33, min: 26, humidity: 45, rain: 10, wind: 8, uv: 7.4, icon: "☀️" },
    { day: "Wednesday", date: "28 Aug", condition: "Partly cloudy", max: 32, min: 25, humidity: 55, rain: 20, wind: 10, uv: 6.0, icon: "⛅" },
    { day: "Thursday", date: "29 Aug", condition: "Light rain", max: 29, min: 24, humidity: 72, rain: 55, wind: 14, uv: 4.0, icon: "🌧️" },
    { day: "Friday", date: "30 Aug", condition: "Sunny", max: 34, min: 26, humidity: 40, rain: 5, wind: 7, uv: 8.0, icon: "☀️" },
    { day: "Saturday", date: "31 Aug", condition: "Cloudy", max: 30, min: 25, humidity: 60, rain: 25, wind: 11, uv: 5.5, icon: "☁️" },
  ];

  const HOURLY = [
    { time: "12PM", rain: 90, icon: "🌧️", active: true },
    { time: "2PM", rain: 85, icon: "🌧️", active: false },
    { time: "3PM", rain: 80, icon: "🌧️", active: false },
    { time: "4PM", rain: 75, icon: "🌧️", active: false },
    { time: "6PM", rain: 60, icon: "🌦️", active: false },
  ];

  const sel = DAYS[selectedDayIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d2847] to-[#061a2e] pb-24 select-none">
      <Header showBack={true} title="Stormy Sunday" subtitle={activeLocation} />

      <div className="p-4 space-y-4 max-w-[480px] mx-auto">
        {/* Today's Weather Hero Card */}
        <div className="rounded-3xl p-5 border border-white/15 shadow-2xl bg-white/8 backdrop-blur-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-white/70">
                <span className="font-bold">Today</span>
                <span>•</span>
                <span>Sun, 25 Aug • Now</span>
              </div>
              <div className="flex items-baseline">
                <span className="text-5xl font-black text-white">28</span>
                <span className="text-2xl font-bold text-white/80">°C</span>
              </div>
              <span className="text-sm font-bold text-white block">Heavy rain</span>
              <div className="flex items-center gap-3 text-[11px] text-white/60 pt-1">
                <span className="flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-[#00DDE5]" />
                  Feels like 26°C
                </span>
                <span>•</span>
                <span>Wind 18 km/h</span>
                <span>•</span>
                <span>Humidity 92%</span>
              </div>
            </div>
            <div className="text-6xl">🌧️</div>
          </div>
        </div>

        {/* Hourly Forecast Strip */}
        <div>
          <h3 className="text-[11px] font-bold text-white/60 uppercase tracking-wider mb-2 text-center">
            Hourly Forecast
          </h3>
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
            {HOURLY.map((h, idx) => (
              <div
                key={idx}
                className={`shrink-0 w-[72px] p-3 rounded-2xl text-center transition-all ${
                  h.active
                    ? "bg-white/15 border-2 border-[#FFBE00] shadow-lg"
                    : "bg-white/5 border border-white/10"
                }`}
              >
                <span className={`text-[11px] font-bold block ${h.active ? "text-[#FFBE00]" : "text-white/70"}`}>
                  {h.time}
                </span>
                <span className="text-2xl block my-1.5">{h.icon}</span>
                <span className={`text-sm font-black block ${h.active ? "text-[#FFBE00]" : "text-white"}`}>
                  {h.rain}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Storm Timeline Banner */}
        <div className="rounded-2xl bg-[#FFBE00]/15 border border-[#FFBE00]/30 p-3.5 flex items-center gap-3">
          <span className="text-2xl">⛈️</span>
          <div className="flex-1">
            <span className="text-xs font-black text-[#FFBE00] block">
              Heavy Storm Expected • 3:30–4:30 PM
            </span>
            <span className="text-[11px] text-white/70 block mt-0.5">
              Seek shelter, strong winds & heavy rainfall possible
            </span>
          </div>
        </div>

        {/* 7-Day Forecast */}
        <div className="rounded-3xl p-4 border border-white/15 shadow-xl bg-white/8 backdrop-blur-xl">
          <h3 className="text-[11px] font-bold text-white/60 uppercase tracking-wider mb-3 text-center">
            7-Day Forecast
          </h3>
          <div className="space-y-1">
            {DAYS.map((d, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedDayIndex(idx)}
                className={`p-3 rounded-2xl transition-all flex items-center gap-3 cursor-pointer ${
                  selectedDayIndex === idx
                    ? "bg-[#FFBE00]/15 border border-[#FFBE00]/30"
                    : "hover:bg-white/5 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2.5 w-28">
                  <span className="text-xl">{d.icon}</span>
                  <div>
                    <span className="text-xs font-bold text-white block leading-tight">
                      {d.day}
                    </span>
                    <span className="text-[10px] text-white/50 block leading-tight">
                      {d.condition}
                    </span>
                  </div>
                </div>
                <div className="flex-1" />
                <span className="text-sm font-bold text-white">{d.max}°C</span>
              </div>
            ))}
          </div>
        </div>

        {/* Air Quality Card */}
        <div className="rounded-3xl p-4 border border-white/15 shadow-xl bg-white/8 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#FFBE00]" />
              <span className="text-sm font-bold text-white">Air Quality</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#FFBE00]/20 text-[#FFBE00] text-[10px] font-bold">
              Moderate
            </span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-black text-white">AQI 156</span>
          </div>
          <p className="text-[11px] text-white/60 mb-2">
            PM2.5 78 µg/m³ • PM10 102 µg/m³
          </p>
          <p className="text-[11px] text-white/50">
            Sensitive groups should reduce outdoor activity
          </p>
        </div>
      </div>
    </div>
  );
}
