"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { useWeather } from "@/context/WeatherContext";
import {
  Sun,
  Zap,
  TrendingUp,
  Leaf,
  IndianRupee,
  Sparkles,
  Info,
  Sliders,
  CheckCircle2,
} from "lucide-react";

export default function SolarEstimatorPage() {
  const { currentWeather, activeLocation } = useWeather();
  const [capacityKw, setCapacityKw] = useState<number>(3);
  const [tariffPerKwh, setTariffPerKwh] = useState<number>(7.5);

  const solarIrradianceKwhM2 = 5.4; // Average for Northern India plains
  const peakSunHours = 5.6;
  const systemEfficiency = 0.82;

  // Daily yield calculation: capacity (kW) * Peak Sun Hours * Performance Ratio
  const dailyKwh = capacityKw * peakSunHours * systemEfficiency;
  const monthlyKwh = dailyKwh * 30;
  const monthlySavingsInr = monthlyKwh * tariffPerKwh;
  const annualSavingsInr = monthlySavingsInr * 12;
  const carbonOffsetKg = dailyKwh * 0.82 * 30; // ~0.82 kg CO2 per kWh grid offset

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="Solar Yield Estimator" subtitle="Rooftop Energy & Savings Calculator" />

      <div className="p-4 space-y-4">
        {/* Banner */}
        <div className="glass-card rounded-3xl p-4.5 border border-white/20 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FFBE00] to-[#f59e0b] p-[2px]">
              <div className="w-full h-full bg-[#062b4c] rounded-2xl flex items-center justify-center text-[#FFBE00]">
                <Sun className="w-5 h-5 animate-spin-slow" />
              </div>
            </div>
            <div>
              <h2 className="font-extrabold text-white text-base leading-none">
                Solar Generation Telemetry
              </h2>
              <p className="text-xs text-white/70 mt-1">
                Solar irradiance: <strong>5.4 kWh/m²/day</strong> ({activeLocation})
              </p>
            </div>
          </div>
        </div>

        {/* Input Sliders Card */}
        <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#00DDE5]" />
              <span>Rooftop Solar Configuration</span>
            </h3>
          </div>

          {/* Slider 1: System Capacity (kW) */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-white/75 font-medium">Installed Capacity</span>
              <strong className="text-[#00DDE5] text-sm">{capacityKw} kW ({(capacityKw * 100).toFixed(0)} sq.ft roof)</strong>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={capacityKw}
              onChange={(e) => setCapacityKw(parseFloat(e.target.value))}
              className="w-full accent-[#00DDE5] cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-white/50">
              <span>1 kW (Small Home)</span>
              <span>5 kW (Villa)</span>
              <span>20 kW (Commercial)</span>
            </div>
          </div>

          {/* Slider 2: Electricity Tariff (₹/kWh) */}
          <div className="space-y-1.5 pt-2 border-t border-white/10">
            <div className="flex justify-between text-xs">
              <span className="text-white/75 font-medium">State DISCOM Tariff</span>
              <strong className="text-[#8ED329] text-sm">₹{tariffPerKwh.toFixed(1)} / unit</strong>
            </div>
            <input
              type="range"
              min="4.0"
              max="14.0"
              step="0.5"
              value={tariffPerKwh}
              onChange={(e) => setTariffPerKwh(parseFloat(e.target.value))}
              className="w-full accent-[#8ED329] cursor-pointer"
            />
          </div>
        </div>

        {/* Generated Energy Output Metrics */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Daily Output */}
          <div className="glass-card rounded-2xl p-4 border border-white/15 shadow-md">
            <div className="flex items-center gap-2 text-white/75">
              <Zap className="w-4 h-4 text-[#FFBE00]" />
              <span className="text-xs font-bold">Daily Generation</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-black text-white">{dailyKwh.toFixed(1)}</span>
              <span className="text-xs text-[#00DDE5] ml-1 font-bold">kWh / day</span>
            </div>
            <span className="text-[10px] text-white/60 block mt-1">~{(dailyKwh * tariffPerKwh).toFixed(0)} ₹ saved / day</span>
          </div>

          {/* Monthly Savings */}
          <div className="glass-card rounded-2xl p-4 border border-white/15 shadow-md">
            <div className="flex items-center gap-2 text-white/75">
              <IndianRupee className="w-4 h-4 text-[#8ED329]" />
              <span className="text-xs font-bold">Monthly Savings</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-black text-[#8ED329]">₹{monthlySavingsInr.toFixed(0)}</span>
            </div>
            <span className="text-[10px] text-white/60 block mt-1">₹{annualSavingsInr.toFixed(0)} annual return</span>
          </div>
        </div>

        {/* Carbon Offset Card */}
        <div className="glass-card rounded-3xl p-4.5 border border-white/20 shadow-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#8ED329]/20 flex items-center justify-center text-[#8ED329] shrink-0">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-white block">
              Environmental Carbon Offset
            </span>
            <p className="text-[11px] text-white/75 mt-0.5">
              Reduces <strong>{carbonOffsetKg.toFixed(0)} kg CO₂</strong> monthly (equivalent to planting <strong>{(carbonOffsetKg / 20).toFixed(0)} mature trees</strong>).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
