"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { useWeather } from "@/context/WeatherContext";
import { CloudRain, Clock, Droplets, ShieldCheck } from "lucide-react";

export default function RainAlertPage() {
  const { activeLocation } = useWeather();
  const [activeHourIndex, setActiveHourIndex] = useState(0);

  const INTERVALS = [
    { time: "Now (20:30)", prob: 10, intensity: "Nil / Trace", status: "Dry" },
    { time: "21:30 IST", prob: 15, intensity: "Light Drizzle", status: "Scattered" },
    { time: "22:30 IST", prob: 10, intensity: "Nil", status: "Dry" },
    { time: "23:30 IST", prob: 5, intensity: "Nil", status: "Clear" },
    { time: "00:30 IST", prob: 5, intensity: "Nil", status: "Clear" },
    { time: "01:30 IST", prob: 10, intensity: "Trace", status: "Passing Cloud" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="Rain Alert & Nowcast" subtitle="Minute-by-Minute Precipitation Radar" />

      <div className="p-4 space-y-4">
        {/* Banner */}
        <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00DDE5]/20 flex items-center justify-center text-[#00DDE5]">
              <CloudRain className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-white text-base leading-none">
                Precipitation Timeline
              </h2>
              <p className="text-xs text-white/70 mt-1">
                Radar extrapolation nowcast for {activeLocation}
              </p>
            </div>
          </div>
        </div>

        {/* Timeline list */}
        <div className="space-y-2.5">
          {INTERVALS.map((item, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl p-4 border border-white/15 shadow-md flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#00DDE5]" />
                <div>
                  <span className="font-bold text-white text-sm block leading-tight">{item.time}</span>
                  <span className="text-[10px] text-white/60 block mt-0.5">{item.intensity}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-16 h-2 rounded-full bg-black/30 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#00DDE5] to-[#FFBE00]"
                    style={{ width: `${item.prob}%` }}
                  />
                </div>
                <span className="font-black text-white w-10 text-right">{item.prob}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
