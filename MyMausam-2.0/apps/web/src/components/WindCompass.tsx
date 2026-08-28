"use client";

import React from "react";
import { Compass, Wind, Navigation } from "lucide-react";

interface WindCompassProps {
  speedKmh: number;
  direction: string;
  degrees: number;
}

export const WindCompass: React.FC<WindCompassProps> = ({
  speedKmh,
  direction,
  degrees,
}) => {
  const getBeaufortScale = (speed: number) => {
    if (speed < 6) return "Light Air";
    if (speed < 12) return "Light Breeze";
    if (speed < 20) return "Gentle Breeze";
    if (speed < 29) return "Moderate Breeze";
    if (speed < 39) return "Fresh Breeze";
    return "Strong Breeze";
  };

  return (
    <div className="flex items-center gap-3 bg-white/5 p-2.5 rounded-2xl border border-white/10 select-none">
      {/* 3D Dial */}
      <div className="relative w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-black/20 shadow-inner shrink-0">
        <span className="absolute top-0.5 text-[8px] font-bold text-white/50">N</span>
        <span className="absolute bottom-0.5 text-[8px] font-bold text-white/50">S</span>
        <span className="absolute left-1 text-[8px] font-bold text-white/50">W</span>
        <span className="absolute right-1 text-[8px] font-bold text-white/50">E</span>

        {/* Rotating Compass Needle */}
        <div
          className="w-full h-full flex items-center justify-center transition-transform duration-700 ease-out"
          style={{ transform: `rotate(${degrees}deg)` }}
        >
          <div className="flex flex-col items-center">
            <div className="w-0 h-0 border-x-[3px] border-x-transparent border-b-[10px] border-b-[#FF2020]" />
            <div className="w-0.5 h-3 bg-white/40" />
          </div>
        </div>
      </div>

      {/* Wind Stats */}
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center gap-1">
          <Wind className="w-3.5 h-3.5 text-[#00DDE5]" />
          <span className="text-xs font-bold text-white leading-tight">
            {speedKmh.toFixed(1)} km/h {direction}
          </span>
        </div>
        <span className="text-[10px] text-white/70 block leading-tight mt-0.5 truncate">
          {getBeaufortScale(speedKmh)} • {degrees}°
        </span>
      </div>
    </div>
  );
};
