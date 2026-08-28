"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import {
  Radio,
  Play,
  Pause,
  RotateCcw,
  Layers,
  MapPin,
  Sparkles,
  Info,
  Maximize2,
} from "lucide-react";

interface RadarStation {
  name: string;
  lat: number;
  lon: number;
  state: string;
  status: string;
  rangeKm: number;
}

const STATIONS: RadarStation[] = [
  { name: "Delhi (Palam DWR)", lat: 28.56, lon: 77.09, state: "Delhi NCR", status: "Operational", rangeKm: 250 },
  { name: "Jaipur DWR", lat: 26.82, lon: 75.80, state: "Rajasthan", status: "Operational", rangeKm: 250 },
  { name: "Mumbai (Colaba)", lat: 18.90, lon: 72.81, state: "Maharashtra", status: "Operational", rangeKm: 250 },
  { name: "Kolkata DWR", lat: 22.65, lon: 88.45, state: "West Bengal", status: "Operational", rangeKm: 250 },
  { name: "Chennai DWR", lat: 13.08, lon: 80.29, state: "Tamil Nadu", status: "Operational", rangeKm: 250 },
  { name: "Cherrapunji DWR", lat: 25.29, lon: 91.73, state: "Meghalaya", status: "Operational", rangeKm: 250 },
];

export default function RadarPage() {
  const [selectedStation, setSelectedStation] = useState<RadarStation>(STATIONS[0]);
  const [selectedLayer, setSelectedLayer] = useState<"reflectivity" | "satellite" | "wind" | "lightning">("reflectivity");
  const [isPlaying, setIsPlaying] = useState(true);
  const [frameIndex, setFrameIndex] = useState(0);

  const FRAMES = [
    "-60m (19:30 IST)",
    "-45m (19:45 IST)",
    "-30m (20:00 IST)",
    "-15m (20:15 IST)",
    "Live (20:30 IST)",
  ];

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setFrameIndex((prev) => (prev + 1) % FRAMES.length);
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isPlaying, FRAMES.length]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="Doppler Radar & Satellite" subtitle="IMD DWR High-Resolution Reflectivity" />

      <div className="p-4 space-y-4">
        {/* Layer Selector Chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {[
            { id: "reflectivity", label: "Doppler dBZ" },
            { id: "satellite", label: "INSAT-3D Infrared" },
            { id: "wind", label: "Wind Streamlines" },
            { id: "lightning", label: "Lightning Density" },
          ].map((layer) => (
            <button
              key={layer.id}
              onClick={() => setSelectedLayer(layer.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                selectedLayer === layer.id
                  ? "bg-[#00DDE5] text-[#06345C] shadow-lg scale-105"
                  : "glass-button text-white/80 hover:text-white"
              }`}
            >
              {layer.label}
            </button>
          ))}
        </div>

        {/* Interactive Radar Display Screen */}
        <div className="glass-card rounded-3xl p-4 border border-white/20 shadow-2xl space-y-3 relative overflow-hidden">
          {/* Station Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#00DDE5] animate-pulse" />
              <h3 className="font-extrabold text-sm text-white">{selectedStation.name}</h3>
            </div>
            <span className="text-[10px] bg-green-500/20 text-[#8ED329] font-bold px-2 py-0.5 rounded-full">
              {selectedStation.status}
            </span>
          </div>

          {/* Simulated Radar Mosaic Display with Concentric Range Rings */}
          <div className="relative w-full aspect-square rounded-2xl bg-[#031d36] border border-white/15 overflow-hidden flex items-center justify-center shadow-inner">
            {/* Concentric 50km, 100km, 150km, 200km range rings */}
            <div className="absolute w-[80%] h-[80%] rounded-full border border-white/10 flex items-center justify-center">
              <span className="absolute top-1 text-[8px] text-white/40">200 km</span>
              <div className="w-[66%] h-[66%] rounded-full border border-white/10 flex items-center justify-center">
                <span className="absolute top-1 text-[8px] text-white/40">100 km</span>
                <div className="w-[50%] h-[50%] rounded-full border border-white/10 flex items-center justify-center">
                  <span className="absolute top-1 text-[8px] text-white/40">50 km</span>
                </div>
              </div>
            </div>

            {/* Crosshairs */}
            <div className="absolute w-full h-[1px] bg-white/10" />
            <div className="absolute h-full w-[1px] bg-white/10" />

            {/* Radar Sweeper Animation */}
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,transparent_300deg,rgba(0,221,229,0.35)_360deg)] animate-spin-slow origin-center pointer-events-none" />

            {/* Simulated Weather Echo Clusters */}
            <div className="absolute top-1/4 left-1/3 w-16 h-16 rounded-full bg-[#8ED329]/40 blur-md animate-pulse" />
            <div className="absolute top-1/3 left-1/4 w-10 h-10 rounded-full bg-[#FFBE00]/50 blur-sm animate-pulse" />
            <div className="absolute bottom-1/3 right-1/4 w-20 h-12 rounded-full bg-[#00DDE5]/30 blur-lg" />

            {/* Center Radar Transmitter Dot */}
            <div className="w-3 h-3 rounded-full bg-[#00DDE5] ring-4 ring-[#00DDE5]/30 z-10" />

            {/* Active Time Badge */}
            <div className="absolute top-3 left-3 bg-black/60 px-2.5 py-1 rounded-xl text-[10px] font-mono text-white border border-white/15">
              {FRAMES[frameIndex]}
            </div>

            <div className="absolute bottom-3 right-3 bg-black/60 px-2 py-0.5 rounded-lg text-[9px] font-mono text-white/70">
              Range: {selectedStation.rangeKm} km
            </div>
          </div>

          {/* Time-Lapse Playback Controls */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-white transition flex items-center gap-1.5 text-xs font-bold"
            >
              {isPlaying ? <Pause className="w-4 h-4 text-[#FFBE00]" /> : <Play className="w-4 h-4 text-[#8ED329]" />}
              <span>{isPlaying ? "Pause" : "Play Loop"}</span>
            </button>

            <div className="flex-1 flex gap-1">
              {FRAMES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setIsPlaying(false);
                    setFrameIndex(i);
                  }}
                  className={`flex-1 h-2 rounded-full transition-all ${
                    frameIndex === i ? "bg-[#00DDE5] scale-y-125" : "bg-white/20"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* dBZ Reflectivity Scale */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[9px] text-white/60 font-bold">
              <span>Light (15 dBZ)</span>
              <span>Moderate (35 dBZ)</span>
              <span>Severe / Hail (&gt; 55 dBZ)</span>
            </div>
            <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 via-green-400 via-yellow-400 to-red-600" />
          </div>
        </div>

        {/* Station Switcher Grid */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-white/80 uppercase tracking-wider block px-1">
            Select Radar Station
          </span>
          <div className="grid grid-cols-2 gap-2">
            {STATIONS.map((station) => (
              <button
                key={station.name}
                onClick={() => setSelectedStation(station)}
                className={`p-3 rounded-2xl text-left border transition-all ${
                  selectedStation.name === station.name
                    ? "bg-white text-[#06345C] border-white shadow-xl scale-[1.02]"
                    : "glass-card text-white hover:bg-white/15 border-white/15"
                }`}
              >
                <span className="text-xs font-bold block leading-snug truncate">{station.name}</span>
                <span className={`text-[10px] block mt-0.5 ${selectedStation.name === station.name ? "text-gray-600" : "text-white/60"}`}>
                  {station.state}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
