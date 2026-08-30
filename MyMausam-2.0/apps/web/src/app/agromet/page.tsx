"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { useWeather } from "@/context/WeatherContext";
import {
  Sprout,
  Droplets,
  Thermometer,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ChevronLeft,
} from "lucide-react";

const MANDI_RATES = [
  { name: "Wheat", emoji: "🌾", price: "₹2,250", unit: "/ quintal", change: "+2.1%", trending: "up" as const },
  { name: "Onion", emoji: "🧅", price: "₹1,800", unit: "/ quintal", change: "-1.4%", trending: "down" as const },
  { name: "Cotton", emoji: "🌸", price: "₹6,100", unit: "/ quintal", change: "+0.8%", trending: "up" as const },
];

export default function AgrometPage() {
  const { activeLocation } = useWeather();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d2847] to-[#061a2e] pb-24 select-none">
      <Header showBack={true} title="Farmer Kisan Agromet Rainfall" subtitle={activeLocation} />

      <div className="p-4 space-y-4 max-w-[480px] mx-auto">
        {/* Weather Metrics Cards - matching Figma */}
        <div className="grid grid-cols-3 gap-3">
          {/* Rainfall */}
          <div className="rounded-2xl p-4 border border-white/15 bg-white/8 backdrop-blur-xl text-center">
            <span className="text-4xl block mb-2">💧</span>
            <span className="text-[11px] text-white/70 block">Rainfall</span>
            <span className="text-2xl font-black text-white block mt-0.5">12mm</span>
          </div>

          {/* Soil Moisture */}
          <div className="rounded-2xl p-4 border border-white/15 bg-white/8 backdrop-blur-xl text-center">
            <span className="text-4xl block mb-2">🌱</span>
            <span className="text-[11px] text-white/70 block">Soil Moisture</span>
            <span className="text-2xl font-black text-white block mt-0.5">68%</span>
          </div>

          {/* Temperature */}
          <div className="rounded-2xl p-4 border border-white/15 bg-white/8 backdrop-blur-xl text-center">
            <span className="text-4xl block mb-2">🌡️</span>
            <span className="text-[11px] text-white/70 block">Temperature</span>
            <span className="text-2xl font-black text-white block mt-0.5">28°C</span>
          </div>
        </div>

        {/* Mandi Rate Section */}
        <div className="rounded-3xl p-5 border border-white/15 shadow-xl bg-white/8 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[#8ED329]" />
            <h3 className="text-lg font-black text-white">Mandi Rate</h3>
          </div>

          <div className="space-y-2.5">
            {MANDI_RATES.map((item) => (
              <div
                key={item.name}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-sm font-bold text-white">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-white">
                    {item.price} <span className="text-white/50 text-xs">{item.unit}</span>
                  </span>
                  <div className="flex items-center gap-1">
                    {item.trending === "up" ? (
                      <TrendingUp className="w-4 h-4 text-[#8ED329]" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-[#FF2020]" />
                    )}
                    <span className={`text-xs font-bold ${
                      item.trending === "up" ? "text-[#8ED329]" : "text-[#FF2020]"
                    }`}>
                      {item.change}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Advisory Banner */}
          <div className="mt-4 p-4 rounded-2xl bg-[#FFBE00]/10 border border-[#FFBE00]/25">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <span className="text-xs font-bold text-[#FFBE00] block">Advisory:</span>
                <span className="text-sm font-black text-white block mt-0.5">Spraying not recommended</span>
                <span className="text-[11px] text-white/60 block mt-1 leading-relaxed">
                  High humidity & forecasted rain on Wed may affect spray efficacy.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
