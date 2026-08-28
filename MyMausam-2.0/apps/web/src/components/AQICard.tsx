"use client";

import React from "react";
import { Wind, ShieldAlert, CheckCircle, Info } from "lucide-react";
import { AQIInfo } from "@/types/weather";
import { useRouter } from "next/navigation";

interface AQICardProps {
  aqiData: AQIInfo;
}

export const AQICard: React.FC<AQICardProps> = ({ aqiData }) => {
  const router = useRouter();
  const aqi = aqiData.aqi;

  const getAQISpectrumWidth = (val: number) => {
    return `${Math.min((val / 500) * 100, 100)}%`;
  };

  const getAQILabelColor = (val: number) => {
    if (val <= 50) return { bg: "#8ED329", text: "#000", label: "Good" };
    if (val <= 100) return { bg: "#AAFF00", text: "#000", label: "Satisfactory" };
    if (val <= 200) return { bg: "#FFBE00", text: "#000", label: "Moderate" };
    if (val <= 300) return { bg: "#FF7400", text: "#fff", label: "Poor" };
    if (val <= 400) return { bg: "#FF2020", text: "#fff", label: "Very Poor" };
    return { bg: "#8B0000", text: "#fff", label: "Severe" };
  };

  const badge = getAQILabelColor(aqi);

  return (
    <section className="px-4 py-1 select-none">
      <div
        onClick={() => router.push("/air-quality")}
        className="glass-card rounded-3xl p-4.5 border border-white/20 shadow-xl space-y-3 cursor-pointer hover:border-white/40 transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-300">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-white/60 font-bold uppercase tracking-wider block leading-none">
                CPCB National Air Quality
              </span>
              <h3 className="text-sm font-black text-white leading-none mt-0.5">
                SAFAR Station Index
              </h3>
            </div>
          </div>

          <span
            className="text-[10px] font-black px-2.5 py-1 rounded-full shadow-md"
            style={{ backgroundColor: badge.bg, color: badge.text }}
          >
            {badge.label} ({aqi})
          </span>
        </div>

        {/* 0–500 Segmented Gradient Spectrum Bar */}
        <div className="space-y-1">
          <div className="h-2.5 rounded-full overflow-hidden bg-black/30 p-[1px] border border-white/10">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-[#8ED329] via-[#FFBE00] via-[#FF7400] to-[#FF2020]"
              style={{ width: getAQISpectrumWidth(aqi) }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-white/50 font-bold px-0.5">
            <span>0 Good</span>
            <span>100 Mod</span>
            <span>200 Poor</span>
            <span>300 V.Poor</span>
            <span>500+</span>
          </div>
        </div>

        {/* Pollutants Chips Grid */}
        <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
          <div className="bg-white/5 p-1.5 rounded-xl border border-white/5">
            <span className="text-white/50 block text-[9px]">PM2.5</span>
            <strong className="text-white">{aqiData.pm25 || 42} µg</strong>
          </div>
          <div className="bg-white/5 p-1.5 rounded-xl border border-white/5">
            <span className="text-white/50 block text-[9px]">PM10</span>
            <strong className="text-white">{aqiData.pm10 || 88} µg</strong>
          </div>
          <div className="bg-white/5 p-1.5 rounded-xl border border-white/5">
            <span className="text-white/50 block text-[9px]">NO₂</span>
            <strong className="text-white">{aqiData.no2 || 24} µg</strong>
          </div>
          <div className="bg-white/5 p-1.5 rounded-xl border border-white/5">
            <span className="text-white/50 block text-[9px]">O₃</span>
            <strong className="text-white">{aqiData.o3 || 32} µg</strong>
          </div>
        </div>
      </div>
    </section>
  );
};
