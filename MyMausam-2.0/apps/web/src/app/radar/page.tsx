"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import {
  Radio,
  Play,
  Pause,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { WeatherAPI } from "@/lib/api";
import { RadarData } from "@/types/weather";
import { LoadingSkeleton, ErrorState, EmptyState } from "@/components/PageStates";

interface StationDef {
  key: string;
  name: string;
  lat: number;
  lon: number;
  state: string;
}

const STATIONS: StationDef[] = [
  { key: "Delhi", name: "Delhi (Palam DWR)", lat: 28.5665, lon: 77.1031, state: "Delhi NCR" },
  { key: "Jaipur", name: "Jaipur DWR", lat: 26.82, lon: 75.80, state: "Rajasthan" },
  { key: "Mumbai", name: "Mumbai (Colaba)", lat: 18.90, lon: 72.81, state: "Maharashtra" },
  { key: "Kolkata", name: "Kolkata DWR", lat: 22.65, lon: 88.45, state: "West Bengal" },
  { key: "Chennai", name: "Chennai DWR", lat: 13.08, lon: 80.29, state: "Tamil Nadu" },
  { key: "Cherrapunji", name: "Cherrapunji DWR", lat: 25.29, lon: 91.73, state: "Meghalaya" },
];

const FRAMES = [
  "-60m",
  "-45m",
  "-30m",
  "-15m",
  "Live",
];

/** Map reflectivity intensity to a color */
function intensityColor(intensity: number): string {
  if (intensity > 55) return "#ff2020"; // Red — severe
  if (intensity > 40) return "#FFBE00"; // Yellow — heavy
  if (intensity > 25) return "#8ED329"; // Green — moderate
  if (intensity > 15) return "#00DDE5"; // Cyan — light
  return "rgba(255,255,255,0.15)"; // Faint — clear
}

/** Map intensity to a blur amount */
function intensityBlur(intensity: number): string {
  if (intensity > 50) return "blur-sm";
  if (intensity > 30) return "blur-md";
  return "blur-lg";
}

export default function RadarPage() {
  const [selectedStation, setSelectedStation] = useState<StationDef>(STATIONS[0]);
  const [radarData, setRadarData] = useState<RadarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [frameIndex, setFrameIndex] = useState(0);
  const [lastUpdated, setLastUpdated] = useState("");

  const fetchRadar = useCallback(async (stationKey: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await WeatherAPI.getRadarData(stationKey);
      setRadarData(data);
      setLastUpdated(data.timestamp);
    } catch (err: any) {
      console.warn("Radar API failed:", err);
      setError("Radar data unavailable. Using fallback.");
      // Generate minimal fallback points around the station
      const stn = STATIONS.find((s) => s.key === stationKey) || STATIONS[0];
      setRadarData({
        station: stn.name,
        lat: stn.lat,
        lon: stn.lon,
        timestamp: new Date().toLocaleTimeString(),
        range_km: 250,
        reflectivity_points: [
          { lat: stn.lat + 0.5, lon: stn.lon - 0.3, intensity: 30, level: "Moderate" },
          { lat: stn.lat - 0.8, lon: stn.lon + 0.6, intensity: 45, level: "Heavy" },
        ],
        active_warnings: ["Radar data estimated — backend unavailable"],
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRadar(selectedStation.key);
  }, [selectedStation, fetchRadar]);

  // Time-lapse animation
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setFrameIndex((prev) => (prev + 1) % FRAMES.length);
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  /** Convert lat/lon offset from station center to CSS position (percentage) */
  const pointToPosition = (lat: number, lon: number): { top: string; left: string } => {
    const stationLat = radarData?.lat ?? selectedStation.lat;
    const stationLon = radarData?.lon ?? selectedStation.lon;
    const rangeKm = radarData?.range_km ?? 250;
    const latRange = rangeKm / 111; // ~111 km per degree
    const lonRange = rangeKm / (111 * Math.cos((stationLat * Math.PI) / 180));

    const latPct = ((stationLat - lat) / latRange) * 40 + 50; // 50% = center
    const lonPct = ((lon - stationLon) / lonRange) * 40 + 50;

    return { top: `${Math.max(5, Math.min(95, latPct))}%`, left: `${Math.max(5, Math.min(95, lonPct))}%` };
  };

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
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                layer.id === "reflectivity"
                  ? "bg-[#00DDE5] text-[#06345C] shadow-lg scale-105"
                  : "glass-button text-white/80 hover:text-white"
              }`}
            >
              {layer.label}
            </button>
          ))}
        </div>

        {/* Radar Display */}
        <div className="glass-card rounded-3xl p-4 border border-white/20 shadow-2xl space-y-3 relative overflow-hidden">
          {/* Station Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#00DDE5] animate-pulse" />
              <h3 className="font-extrabold text-sm text-white">{selectedStation.name}</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-green-500/20 text-[#8ED329] font-bold px-2 py-0.5 rounded-full">
                Live
              </span>
              <button
                onClick={() => fetchRadar(selectedStation.key)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 transition"
                title="Refresh radar data"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Radar Display */}
          <div className="relative w-full aspect-square rounded-2xl bg-[#031d36] border border-white/15 overflow-hidden flex items-center justify-center shadow-inner">
            {/* Concentric range rings */}
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

            {/* Radar sweep animation */}
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,transparent_300deg,rgba(0,221,229,0.35)_360deg)] animate-spin-slow origin-center pointer-events-none" />

            {/* DYNAMIC weather echo clusters — rendered from API data */}
            {radarData?.reflectivity_points.map((point, i) => {
              const pos = pointToPosition(point.lat, point.lon);
              const size = Math.max(24, Math.min(64, point.intensity * 1.1));
              return (
                <div
                  key={i}
                  className={`absolute rounded-full transition-all duration-700 ${intensityBlur(point.intensity)}`}
                  style={{
                    top: pos.top,
                    left: pos.left,
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: intensityColor(point.intensity),
                    opacity: 0.5 + (point.intensity / 100) * 0.4,
                    transform: "translate(-50%, -50%)",
                    animation: `pulse ${2 + (i % 3)}s ease-in-out infinite`,
                  }}
                  title={`${point.level} (${point.intensity} dBZ)`}
                />
              );
            })}

            {/* Center radar transmitter */}
            <div className="w-3 h-3 rounded-full bg-[#00DDE5] ring-4 ring-[#00DDE5]/30 z-10" />

            {/* Time badge */}
            <div className="absolute top-3 left-3 bg-black/60 px-2.5 py-1 rounded-xl text-[10px] font-mono text-white border border-white/15">
              {FRAMES[frameIndex]} ({lastUpdated || "loading..."})
            </div>

            <div className="absolute bottom-3 right-3 bg-black/60 px-2 py-0.5 rounded-lg text-[9px] font-mono text-white/70">
              Range: {radarData?.range_km ?? 250} km
            </div>

            {/* Point count */}
            <div className="absolute top-3 right-3 bg-black/60 px-2 py-0.5 rounded-lg text-[9px] font-mono text-white/70">
              {radarData?.reflectivity_points.length ?? 0} echoes
            </div>
          </div>

          {/* Playback controls */}
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
                  onClick={() => { setIsPlaying(false); setFrameIndex(i); }}
                  className={`flex-1 h-2 rounded-full transition-all ${frameIndex === i ? "bg-[#00DDE5] scale-y-125" : "bg-white/20"}`}
                />
              ))}
            </div>
          </div>

          {/* dBZ Scale */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[9px] text-white/60 font-bold">
              <span>Light (15 dBZ)</span>
              <span>Moderate (35 dBZ)</span>
              <span>Severe / Hail (&gt; 55 dBZ)</span>
            </div>
            <div className="h-2 rounded-full bg-gradient-to-r from-[#00DDE5] via-[#8ED329] via-[#FFBE00] to-[#ff2020]" />
          </div>

          {/* Warnings */}
          {radarData?.active_warnings && radarData.active_warnings.length > 0 && (
            <div className="bg-[#FFBE00]/10 border border-[#FFBE00]/30 rounded-2xl p-3 space-y-1">
              {radarData.active_warnings.map((warn, i) => (
                <div key={i} className="flex items-start gap-2 text-[10px] text-[#FFBE00]">
                  <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                  <span>{warn}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Station Switcher */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-white/80 uppercase tracking-wider block px-1">
            Select Radar Station
          </span>
          <div className="grid grid-cols-2 gap-2">
            {STATIONS.map((station) => (
              <button
                key={station.key}
                onClick={() => setSelectedStation(station)}
                className={`p-3 rounded-2xl text-left border transition-all ${
                  selectedStation.key === station.key
                    ? "bg-white text-[#06345C] border-white shadow-xl scale-[1.02]"
                    : "glass-card text-white hover:bg-white/15 border-white/15"
                }`}
              >
                <span className="text-xs font-bold block leading-snug truncate">{station.name}</span>
                <span className={`text-[10px] block mt-0.5 ${selectedStation.key === station.key ? "text-gray-600" : "text-white/60"}`}>
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
