"use client";

import React from "react";
import { Monitor, Smartphone, Volume2, VolumeX } from "lucide-react";
import { useWeather } from "@/context/WeatherContext";

export const ViewModeToggle: React.FC = () => {
  const { viewMode, toggleViewMode, isSpeaking, speakWeatherForecast, stopSpeaking } = useWeather();

  return (
    <div className="hidden lg:flex fixed top-4 right-4 z-50 items-center gap-2 select-none">
      {/* Audio broadcast trigger */}
      <button
        onClick={isSpeaking ? stopSpeaking : speakWeatherForecast}
        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-xl border border-white/20 ${
          isSpeaking ? "bg-[#FFBE00] text-[#06345C] animate-pulse" : "bg-[#062b4c]/80 text-white hover:bg-[#062b4c]"
        }`}
      >
        {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#FFBE00]" />}
        <span>{isSpeaking ? "Stop Broadcast" : "Audio Bulletin"}</span>
      </button>

      {/* Frame size toggle */}
      <button
        onClick={toggleViewMode}
        className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#062b4c]/80 text-white hover:bg-[#062b4c] transition-all flex items-center gap-1.5 shadow-xl border border-white/20"
      >
        {viewMode === "mobile" ? (
          <>
            <Monitor className="w-3.5 h-3.5 text-[#00DDE5]" />
            <span>Expand Frame</span>
          </>
        ) : (
          <>
            <Smartphone className="w-3.5 h-3.5 text-[#00DDE5]" />
            <span>Mobile Frame</span>
          </>
        )}
      </button>
    </div>
  );
};
