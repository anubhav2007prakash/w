"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { useWeather } from "@/context/WeatherContext";
import {
  Wind,
  Eye,
  AlertTriangle,
  MapPin,
  Activity,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";

interface SAFARStation {
  city: string;
  aqi: number;
  aqiCategory: "Good" | "Satisfactory" | "Moderate" | "Poor" | "Very Poor" | "Severe";
  color: string;
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  co: number;
  o3: number;
  primaryPollutant: string;
  healthAdvisory: string;
}

const SAFAR_STATIONS: SAFARStation[] = [
  { city: "Delhi (ITO)", aqi: 342, aqiCategory: "Very Poor", color: "#9933CC", pm25: 210, pm10: 320, no2: 82, so2: 18, co: 3.2, o3: 45, primaryPollutant: "PM2.5", healthAdvisory: "Avoid outdoor activity. Sensitive groups must stay indoors. Use N95 masks if stepping out." },
  { city: "Mumbai (Bandra)", aqi: 128, aqiCategory: "Moderate", color: "#FFBE00", pm25: 55, pm10: 98, no2: 42, so2: 12, co: 1.4, o3: 52, primaryPollutant: "PM10", healthAdvisory: "Sensitive individuals reduce prolonged outdoor exertion. General public safe for normal activity." },
  { city: "Kolkata (Ballygunge)", aqi: 185, aqiCategory: "Poor", color: "#FF7400", pm25: 95, pm10: 160, no2: 58, so2: 15, co: 2.1, o3: 38, primaryPollutant: "PM2.5", healthAdvisory: "Reduce outdoor running. Asthmatics keep inhaler handy. Children limit playground time." },
  { city: "Chennai (T. Nagar)", aqi: 82, aqiCategory: "Satisfactory", color: "#8ED329", pm25: 32, pm10: 65, no2: 28, so2: 8, co: 0.8, o3: 60, primaryPollutant: "PM10", healthAdvisory: "Enjoy outdoor activities. Air quality comfortable for all groups." },
  { city: "Bengaluru (BTM)", aqi: 95, aqiCategory: "Satisfactory", color: "#8ED329", pm25: 38, pm10: 72, no2: 32, so2: 10, co: 1.0, o3: 55, primaryPollutant: "PM10", healthAdvisory: "Good air quality for outdoor exercise. Minimal health risk." },
  { city: "Hyderabad (Ameerpet)", aqi: 110, aqiCategory: "Moderate", color: "#FFBE00", pm25: 48, pm10: 88, no2: 38, so2: 11, co: 1.2, o3: 48, primaryPollutant: "PM2.5", healthAdvisory: "Sensitive groups consider reducing prolonged outdoor exertion." },
];

function getAQIBarWidth(aqi: number) {
  return Math.min((aqi / 500) * 100, 100);
}

export default function SAFARPage() {
  const { activeLocation } = useWeather();
  const [selectedCity, setSelectedCity] = useState(0);

  const sel = SAFAR_STATIONS[selectedCity];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="SAFAR — Air Quality" subtitle="System of Air Quality & Weather Forecasting Research" />

      <div className="p-4 space-y-4">
        {/* City Selector */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {SAFAR_STATIONS.map((station, idx) => (
            <button
              key={station.city}
              onClick={() => setSelectedCity(idx)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                selectedCity === idx
                  ? "bg-[#00DDE5] text-[#06345C] shadow-lg scale-105"
                  : "glass-button text-white/80 hover:text-white"
              }`}
            >
              {station.city.split("(")[0].trim()}
            </button>
          ))}
        </div>

        {/* AQI Hero */}
        <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#00DDE5]" />
                <h2 className="font-extrabold text-lg text-white leading-tight">{sel.city}</h2>
              </div>
              <span className="text-[10px] text-white/60 block mt-0.5 ml-6">Primary Pollutant: {sel.primaryPollutant}</span>
            </div>
            <span
              className="text-[10px] font-black px-2.5 py-1 rounded-xl text-white shrink-0 shadow-md"
              style={{ backgroundColor: sel.color }}
            >
              {sel.aqiCategory}
            </span>
          </div>

          {/* AQI Number */}
          <div className="text-center py-4">
            <span className="text-6xl font-black text-white block">{sel.aqi}</span>
            <span className="text-xs text-white/60 block mt-1">Air Quality Index (NAQI)</span>
          </div>

          {/* AQI Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-4 rounded-full overflow-hidden flex">
              <div className="h-full bg-[#8ED329] flex-1" />
              <div className="h-full bg-[#8ED329] flex-1" />
              <div className="h-full bg-[#FFBE00] flex-1" />
              <div className="h-full bg-[#FF7400] flex-1" />
              <div className="h-full bg-[#9933CC] flex-1" />
              <div className="h-full bg-[#FF2020] flex-1" />
            </div>
            <div className="relative h-1">
              <div
                className="absolute w-3 h-3 bg-white rounded-full border-2 shadow-lg -top-1 transition-all"
                style={{ left: `calc(${getAQIBarWidth(sel.aqi)}% - 6px)`, borderColor: sel.color }}
              />
            </div>
            <div className="flex justify-between text-[8px] text-white/40 font-bold">
              <span>0</span>
              <span>100</span>
              <span>200</span>
              <span>300</span>
              <span>400</span>
              <span>500</span>
            </div>
          </div>
        </div>

        {/* Pollutant Breakdown */}
        <div className="glass-card rounded-3xl p-5 border border-white/20 space-y-3">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#00DDE5]" />
            <span>Pollutant Concentrations</span>
          </h3>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            {[
              { name: "PM2.5", value: sel.pm25, unit: "µg/m³", limit: 60 },
              { name: "PM10", value: sel.pm10, unit: "µg/m³", limit: 100 },
              { name: "NO₂", value: sel.no2, unit: "µg/m³", limit: 80 },
              { name: "SO₂", value: sel.so2, unit: "µg/m³", limit: 80 },
              { name: "CO", value: sel.co, unit: "mg/m³", limit: 4 },
              { name: "O₃", value: sel.o3, unit: "µg/m³", limit: 100 },
            ].map((p) => (
              <div key={p.name} className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                <span className="text-[9px] text-white/60 block">{p.name}</span>
                <span className={`text-sm font-black block ${p.value > p.limit ? "text-[#FF2020]" : "text-white"}`}>
                  {p.value}
                </span>
                <span className="text-[8px] text-white/40">{p.unit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Health Advisory */}
        <div className="glass-card rounded-3xl p-5 border border-white/20 space-y-3">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#FFBE00]" />
            <span>Health Advisory ( SAFAR-IITM )</span>
          </h3>

          <div className="bg-black/20 p-3 rounded-xl text-xs text-white/90 leading-relaxed border border-white/5">
            {sel.healthAdvisory}
          </div>

          <div className="space-y-2 text-xs text-white/85">
            <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-[#8ED329] shrink-0 mt-0.5" />
              <span><strong>General Public (AQI 0–100):</strong> Enjoy outdoor activities. No health risk.</span>
            </div>
            <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-[#FFBE00] shrink-0 mt-0.5" />
              <span><strong>Sensitive Groups (AQI 101–200):</strong> Reduce prolonged outdoor exertion if experiencing symptoms.</span>
            </div>
            <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-[#FF7400] shrink-0 mt-0.5" />
              <span><strong>Everyone (AQI 201–300):</strong> Avoid outdoor activities. Wear N95 if going out.</span>
            </div>
            <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-[#FF2020] shrink-0 mt-0.5" />
              <span><strong>Health Alert (AQI 301+):</strong> Stay indoors. Keep windows closed. Use air purifier if available.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
