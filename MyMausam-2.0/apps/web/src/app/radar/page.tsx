"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { useWeather } from "@/context/WeatherContext";
import {
  Play,
  Pause,
  RefreshCw,
  MapPin,
} from "lucide-react";

const STATIONS = [
  { key: "Delhi", name: "Delhi (Palam DWR)", lat: 28.5665, lon: 77.1031, state: "Delhi NCR" },
  { key: "Jaipur", name: "Jaipur DWR", lat: 26.82, lon: 75.80, state: "Rajasthan" },
  { key: "Mumbai", name: "Mumbai (Colaba)", lat: 18.90, lon: 72.81, state: "Maharashtra" },
  { key: "Kolkata", name: "Kolkata DWR", lat: 22.65, lon: 88.45, state: "West Bengal" },
  { key: "Chennai", name: "Chennai DWR", lat: 13.08, lon: 80.29, state: "Tamil Nadu" },
  { key: "Cherrapunji", name: "Cherrapunji DWR", lat: 25.29, lon: 91.73, state: "Meghalaya" },
];

const FRAMES = ["12PM", "1PM", "2PM", "3PM", "3:30–4:30PM", "5PM", "6PM"];

const INTENSITY_COLORS = [
  { label: "Light", color: "#4A90D9" },
  { label: "Moderate", color: "#00DDE5" },
  { label: "Heavy", color: "#FFBE00" },
  { label: "Severe", color: "#FF2020" },
];

export default function RadarPage() {
  const { activeLocation } = useWeather();
  const [selectedStation, setSelectedStation] = useState(STATIONS[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [frameIndex, setFrameIndex] = useState(0);
  const [showStationPicker, setShowStationPicker] = useState(false);

  // Time-lapse animation
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setFrameIndex((prev) => (prev + 1) % FRAMES.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Generate simulated radar blobs
  const radarBlobs = React.useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      x: 15 + Math.random() * 70,
      y: 10 + Math.random() * 80,
      size: 20 + Math.random() * 60,
      intensity: Math.random(),
      opacity: 0.3 + Math.random() * 0.5,
    }));
  }, []);

  const getIntensityColor = (intensity: number) => {
    if (intensity > 0.75) return "#FF2020";
    if (intensity > 0.5) return "#FFBE00";
    if (intensity > 0.25) return "#00DDE5";
    return "#4A90D9";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d2847] to-[#061a2e] pb-24 select-none">
      <Header showBack={true} title="Stormy Sunday" subtitle={`${activeLocation} • India`} />

      <div className="p-4 space-y-4 max-w-[480px] mx-auto">
        {/* Station Selector */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowStationPicker(!showStationPicker)}
            className="text-xs text-white/70 flex items-center gap-1.5 hover:text-white transition"
          >
            <MapPin className="w-3.5 h-3.5 text-[#FFBE00]" />
            <span className="font-bold">{selectedStation.name}</span>
          </button>
        </div>

        {/* Station Picker Dropdown */}
        {showStationPicker && (
          <div className="rounded-2xl bg-white/10 border border-white/15 p-2 space-y-1 animate-fade-in">
            {STATIONS.map((stn) => (
              <button
                key={stn.key}
                onClick={() => {
                  setSelectedStation(stn);
                  setShowStationPicker(false);
                }}
                className={`w-full text-left p-2.5 rounded-xl text-xs transition ${
                  selectedStation.key === stn.key
                    ? "bg-[#FFBE00]/20 text-[#FFBE00] font-bold"
                    : "text-white/70 hover:bg-white/10"
                }`}
              >
                <span className="block font-bold">{stn.name}</span>
                <span className="text-[10px] text-white/50">{stn.state}</span>
              </button>
            ))}
          </div>
        )}

        {/* Radar Map Display */}
        <div className="rounded-3xl border border-white/15 shadow-2xl bg-[#0a1628] overflow-hidden relative">
          {/* Map Container */}
          <div className="aspect-square relative overflow-hidden">
            {/* Dark map background with grid */}
            <div className="absolute inset-0 bg-[#0d1f35]">
              {/* Grid lines */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                {/* Distance circles */}
                <circle cx="50" cy="50" r="15" fill="none" stroke="rgba(0,221,229,0.2)" strokeWidth="0.3" strokeDasharray="2,2" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(0,221,229,0.15)" strokeWidth="0.3" strokeDasharray="2,2" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(0,221,229,0.1)" strokeWidth="0.3" strokeDasharray="2,2" />
                {/* Cross lines */}
                <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(0,221,229,0.08)" strokeWidth="0.2" />
                <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(0,221,229,0.08)" strokeWidth="0.2" />
              </svg>

              {/* Radar blobs */}
              {radarBlobs.map((blob, i) => (
                <div
                  key={i}
                  className="absolute rounded-full blur-md"
                  style={{
                    left: `${blob.x}%`,
                    top: `${blob.y}%`,
                    width: `${blob.size}px`,
                    height: `${blob.size}px`,
                    backgroundColor: getIntensityColor(blob.intensity),
                    opacity: blob.opacity * (0.5 + (frameIndex / FRAMES.length) * 0.5),
                    transform: `translate(-50%, -50%) scale(${0.8 + (frameIndex % 3) * 0.1})`,
                    transition: "opacity 0.5s, transform 0.5s",
                  }}
                />
              ))}

              {/* Center marker */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="w-8 h-8 bg-[#0055A6] rounded-full flex items-center justify-center shadow-lg shadow-[#0055A6]/50 border-2 border-white/30">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div className="text-center mt-1">
                  <span className="text-[10px] font-bold text-white bg-[#0055A6]/80 px-2 py-0.5 rounded-full">
                    {activeLocation} • Now
                  </span>
                </div>
              </div>

              {/* Distance labels */}
              <span className="absolute text-[9px] text-white/40 font-bold" style={{ top: "35%", right: "22%" }}>10km</span>
              <span className="absolute text-[9px] text-white/40 font-bold" style={{ top: "55%", right: "12%" }}>20km</span>
              <span className="absolute text-[9px] text-white/40 font-bold" style={{ top: "65%", right: "5%" }}>30km</span>
            </div>
          </div>
        </div>

        {/* Rain Intensity Legend */}
        <div>
          <span className="text-xs font-bold text-white/70 block mb-2">Rain Intensity</span>
          <div className="flex items-center gap-4">
            {INTENSITY_COLORS.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs font-bold text-white/80">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Player */}
        <div className="rounded-3xl p-4 border border-white/15 shadow-xl bg-white/8 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            {/* Play/Pause Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 rounded-full bg-[#FFBE00] flex items-center justify-center shadow-lg shadow-[#FFBE00]/30 shrink-0 active:scale-95 transition"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-[#06345C]" />
              ) : (
                <Play className="w-5 h-5 text-[#06345C] ml-0.5" />
              )}
            </button>

            <div className="flex-1">
              {/* Time labels */}
              <div className="flex justify-between mb-1.5">
                <span className="text-[10px] text-white/50 font-bold">12PM</span>
                <span className="text-[10px] text-white/50 font-bold">6PM</span>
              </div>

              {/* Timeline bar */}
              <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                {/* Progress gradient */}
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: `${((frameIndex + 1) / FRAMES.length) * 100}%`,
                    background: "linear-gradient(90deg, #4A90D9, #00DDE5, #FFBE00, #FF2020)",
                    transition: "width 0.3s",
                  }}
                />
                {/* Current position indicator */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#FFBE00] rounded-full border-2 border-white shadow-md z-10"
                  style={{
                    left: `calc(${((frameIndex + 0.5) / FRAMES.length) * 100}% - 8px)`,
                    transition: "left 0.3s",
                  }}
                />
              </div>

              {/* Current time label */}
              <div className="flex justify-center mt-2">
                <span className="text-xs font-bold text-[#FFBE00] bg-[#FFBE00]/15 px-3 py-1 rounded-full">
                  {FRAMES[frameIndex]}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-[11px] text-white/60 mt-3 text-center">
            Heaviest rain expected 3:30–4:30PM • moving southeast →
          </p>
        </div>
      </div>
    </div>
  );
}
