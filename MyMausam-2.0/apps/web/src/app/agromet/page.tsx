"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { useWeather } from "@/context/WeatherContext";
import {
  Sprout,
  Droplets,
  Bug,
  Thermometer,
  Wind,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Sparkles,
  CheckCircle,
  FileText,
} from "lucide-react";

interface CropDiseaseRisk {
  cropName: string;
  stage: string;
  diseaseName: string;
  pathogenType: "Fungal" | "Bacterial" | "Pest / Insect";
  riskLevel: "Low" | "Moderate" | "High";
  riskColor: string;
  humidityThreshold: string;
  managementAdvice: string;
}

const CROP_DISEASES: CropDiseaseRisk[] = [
  {
    cropName: "Wheat (गेहूं)",
    stage: "Grain Filling / Milking",
    diseaseName: "Yellow Rust (पीला रतुआ)",
    pathogenType: "Fungal",
    riskLevel: "Moderate",
    riskColor: "#FFBE00",
    humidityThreshold: "Favorable if RH > 75% & temp 10–20°C",
    managementAdvice: "Spray Propiconazole 25% EC @ 1ml/litre of water on appearance of initial yellow pustules.",
  },
  {
    cropName: "Mustard (सरसों)",
    stage: "Pod Formation",
    diseaseName: "Aphid / Mahu Infestation (माहू)",
    pathogenType: "Pest / Insect",
    riskLevel: "Low",
    riskColor: "#8ED329",
    humidityThreshold: "Clear skies and warmer days reduce aphid multiplication",
    managementAdvice: "Install yellow sticky traps @ 10 traps/acre. Spray Dimethoate 30% EC if population exceeds 15 aphids/plant.",
  },
  {
    cropName: "Tomato & Chilli",
    stage: "Flowering & Fruiting",
    diseaseName: "Early Blight (अगेती झुलसा)",
    pathogenType: "Fungal",
    riskLevel: "High",
    riskColor: "#FF2020",
    humidityThreshold: "High dew formation during early morning triggers fungal sporulation",
    managementAdvice: "Apply Mancozeb 75% WP @ 2.5g/litre. Maintain adequate soil drainage and avoid overhead sprinkler watering.",
  },
  {
    cropName: "Gram / Chickpea (चना)",
    stage: "Pod Development",
    diseaseName: "Pod Borer (फली छेदक)",
    pathogenType: "Pest / Insect",
    riskLevel: "Moderate",
    riskColor: "#FFBE00",
    humidityThreshold: "Rising daytime temperatures (> 32°C) accelerate larval activity",
    managementAdvice: "Install pheromone traps @ 5/acre. Spray Emamectin Benzoate 5% SG @ 0.4g/litre in early evening.",
  },
];

export default function AgrometPage() {
  const { currentWeather, activeLocation } = useWeather();
  const [selectedTab, setSelectedTab] = useState<"disease" | "spray" | "bulletin">("disease");

  const temp = currentWeather?.temperature ?? 34.2;
  const humidity = currentWeather?.humidity ?? 38;
  const wind = currentWeather?.wind_speed ?? 9.4;

  const isSafeToSpray = wind < 15 && temp < 36;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="Agromet & GKMS Advisory" subtitle="Gramin Krishi Mausam Seva Portal" />

      <div className="p-4 space-y-4">
        {/* Banner */}
        <div className="glass-card rounded-3xl p-4.5 border border-white/20 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#8ED329] to-[#00DDE5] p-[2px]">
              <div className="w-full h-full bg-[#062b4c] rounded-2xl flex items-center justify-center text-[#8ED329]">
                <Sprout className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="font-extrabold text-white text-base leading-none">
                Agro-Meteorological Advisory
              </h2>
              <p className="text-xs text-white/70 mt-1">
                GKMS District Research Telemetry ({activeLocation})
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="glass-panel p-1 rounded-2xl flex items-center gap-1 border border-white/20">
          <button
            onClick={() => setSelectedTab("disease")}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedTab === "disease"
                ? "bg-white text-[#06345C] shadow-md"
                : "text-white/70 hover:text-white"
            }`}
          >
            Disease Risks
          </button>
          <button
            onClick={() => setSelectedTab("spray")}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedTab === "spray"
                ? "bg-white text-[#06345C] shadow-md"
                : "text-white/70 hover:text-white"
            }`}
          >
            Spray Window
          </button>
          <button
            onClick={() => setSelectedTab("bulletin")}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedTab === "bulletin"
                ? "bg-white text-[#06345C] shadow-md"
                : "text-white/70 hover:text-white"
            }`}
          >
            District Bulletin
          </button>
        </div>

        {/* Tab 1: Crop Disease Predictor */}
        {selectedTab === "disease" && (
          <div className="space-y-3 animate-fade-in">
            {CROP_DISEASES.map((disease, idx) => (
              <div
                key={idx}
                className="glass-card rounded-3xl p-4.5 border border-white/15 shadow-md space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-white text-sm">{disease.cropName}</h3>
                    <span className="text-[10px] text-white/60 block mt-0.5">
                      Stage: {disease.stage}
                    </span>
                  </div>
                  <span
                    className="text-[10px] font-black px-2.5 py-0.5 rounded-full text-black"
                    style={{ backgroundColor: disease.riskColor }}
                  >
                    {disease.riskLevel} Risk
                  </span>
                </div>

                <div className="bg-black/20 p-2.5 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between items-center text-white">
                    <span className="font-bold text-[#00DDE5]">{disease.diseaseName}</span>
                    <span className="text-[10px] text-white/60">({disease.pathogenType})</span>
                  </div>
                  <p className="text-[11px] text-white/75">{disease.humidityThreshold}</p>
                </div>

                <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 space-y-1 text-xs">
                  <span className="text-[10px] font-bold text-[#8ED329] uppercase tracking-wider block">
                    Management Advisory
                  </span>
                  <p className="text-white/90 leading-relaxed text-[11px]">
                    {disease.managementAdvice}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Chemical Spray Window Calculator */}
        {selectedTab === "spray" && (
          <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#00DDE5]" />
                <h3 className="font-extrabold text-sm text-white">Foliar Spray & Herbicide Window</h3>
              </div>
              <span
                className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                  isSafeToSpray ? "bg-[#8ED329] text-black" : "bg-red-500 text-white"
                }`}
              >
                {isSafeToSpray ? "Optimal Window Open" : "Caution (Too Hot/Windy)"}
              </span>
            </div>

            <p className="text-xs text-white/80 leading-relaxed">
              Foliar pesticide and micronutrient spray efficacy depends heavily on wind drift (&lt; 15 km/h) and temperature to prevent droplet evaporation.
            </p>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-white/60 block">Current Wind</span>
                <span className="font-black text-white text-sm mt-0.5 block">{wind.toFixed(1)} km/h</span>
                <span className="text-[9px] text-[#8ED329]">&lt; 15 km/h Safe</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-white/60 block">Temperature</span>
                <span className="font-black text-white text-sm mt-0.5 block">{temp.toFixed(1)}°C</span>
                <span className="text-[9px] text-[#FFBE00]">Noon High</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-white/60 block">Rain 24h</span>
                <span className="font-black text-white text-sm mt-0.5 block">10%</span>
                <span className="text-[9px] text-[#8ED329]">Washout Nil</span>
              </div>
            </div>

            <div className="bg-black/25 p-3.5 rounded-2xl space-y-1.5 text-xs text-white/90">
              <span className="font-bold text-[#FFBE00] block text-[11px] uppercase tracking-wider">
                Recommended Spraying Hours Today:
              </span>
              <p>• <strong>Morning Window:</strong> 06:00 AM – 08:30 AM (Highest absorption rate)</p>
              <p>• <strong>Evening Window:</strong> 05:00 PM – 06:45 PM (Low thermal drift)</p>
            </div>
          </div>
        )}

        {/* Tab 3: Official GKMS Bulletin */}
        {selectedTab === "bulletin" && (
          <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#8ED329]" />
              <h3 className="font-extrabold text-sm text-white">Gramin Krishi Mausam Bulletin</h3>
            </div>

            <div className="text-xs text-white/85 leading-relaxed space-y-2">
              <p>
                <strong>District:</strong> {activeLocation}, Uttar Pradesh
              </p>
              <p>
                <strong>Weather Summary:</strong> Prevailing weather likely to remain dry with clear to partly cloudy skies. Maximum temperature between 34–36°C and minimum temperature between 25–27°C.
              </p>
              <p>
                <strong>General Advice for Farmers:</strong> Complete sowing of summer moong and urad. Apply light and frequent irrigation in standing vegetable crops during morning hours.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
