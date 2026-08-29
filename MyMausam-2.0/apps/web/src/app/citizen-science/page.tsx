"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { useWeather } from "@/context/WeatherContext";
import {
  Users,
  Camera,
  Cloud,
  CloudRain,
  CloudLightning,
  Sun,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  CheckCircle2,
  Send,
  Award,
  TrendingUp,
} from "lucide-react";

interface CloudReport {
  id: string;
  reporter: string;
  location: string;
  time: string;
  cloudType: string;
  confidence: number;
  verified: boolean;
}

const RECENT_REPORTS: CloudReport[] = [
  { id: "CSR-4521", reporter: "Anil K.", location: "Pune", time: "14:32 IST", cloudType: "Cumulonimbus (Cb)", confidence: 92, verified: true },
  { id: "CSR-4520", reporter: "Priya M.", location: "Chennai", time: "13:15 IST", cloudType: "Cumulus congestus", confidence: 85, verified: true },
  { id: "CSR-4519", reporter: "Rahul S.", location: "Delhi", time: "12:48 IST", cloudType: "Stratocumulus (Sc)", confidence: 78, verified: false },
  { id: "CSR-4518", reporter: "Meera D.", location: "Mumbai", time: "11:22 IST", cloudType: "Altocumulus (Ac)", confidence: 88, verified: true },
  { id: "CSR-4517", reporter: "Vikram J.", location: "Kolkata", time: "10:55 IST", cloudType: "Nimbostratus (Ns)", confidence: 90, verified: true },
  { id: "CSR-4516", reporter: "Sunita R.", location: "Jaipur", time: "09:30 IST", cloudType: "Cirrus (Ci)", confidence: 95, verified: true },
];

const CLOUD_TYPES = [
  { name: "Cumulus", icon: "☁️", description: "Fair weather puffy clouds", altitude: "Low (0–2 km)" },
  { name: "Cumulonimbus", icon: "⛈️", description: "Thunderstorm tower cloud", altitude: "Low–High (0–12 km)" },
  { name: "Stratus", icon: "🌫️", description: "Grey uniform layer", altitude: "Low (0–2 km)" },
  { name: "Cirrus", icon: "🌤️", description: "Thin wispy ice crystals", altitude: "High (6–12 km)" },
  { name: "Nimbostratus", icon: "🌧️", description: "Dark rain-bearing layer", altitude: "Low–Mid (0–4 km)" },
  { name: "Altocumulus", icon: "⛅", description: "White/grey patchy layers", altitude: "Mid (2–6 km)" },
];

const STATS = {
  totalObservers: 12847,
  reportsThisWeek: 1432,
  verifiedToday: 186,
  accuracyRate: 89,
};

export default function CitizenSciencePage() {
  const { activeLocation } = useWeather();
  const [selectedCloud, setSelectedCloud] = useState<string | null>(null);
  const [showSubmit, setShowSubmit] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="Citizen Science & Cloud" subtitle="IMD SkyWatcher Cloud Observation Network" />

      <div className="p-4 space-y-4">
        {/* Stats Banner */}
        <div className="glass-card rounded-3xl p-4.5 border border-white/20 shadow-xl space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#8ED329] to-[#00DDE5] p-[2px]">
              <div className="w-full h-full bg-[#062b4c] rounded-2xl flex items-center justify-center text-[#8ED329]">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="font-extrabold text-white text-base leading-none">
                SkyWatcher Network
              </h2>
              <p className="text-xs text-white/70 mt-1">
                Crowdsourced cloud & weather observations
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
            <div className="bg-white/5 p-2 rounded-xl border border-white/5">
              <Users className="w-3.5 h-3.5 mx-auto text-[#00DDE5] mb-0.5" />
              <span className="text-[8px] text-white/50 block">Observers</span>
              <strong className="text-white text-xs block">{STATS.totalObservers.toLocaleString()}</strong>
            </div>
            <div className="bg-white/5 p-2 rounded-xl border border-white/5">
              <Camera className="w-3.5 h-3.5 mx-auto text-[#FFBE00] mb-0.5" />
              <span className="text-[8px] text-white/50 block">Reports/Week</span>
              <strong className="text-white text-xs block">{STATS.reportsThisWeek.toLocaleString()}</strong>
            </div>
            <div className="bg-white/5 p-2 rounded-xl border border-white/5">
              <CheckCircle2 className="w-3.5 h-3.5 mx-auto text-[#8ED329] mb-0.5" />
              <span className="text-[8px] text-white/50 block">Verified Today</span>
              <strong className="text-white text-xs block">{STATS.verifiedToday}</strong>
            </div>
            <div className="bg-white/5 p-2 rounded-xl border border-white/5">
              <TrendingUp className="w-3.5 h-3.5 mx-auto text-[#00BFFF] mb-0.5" />
              <span className="text-[8px] text-white/50 block">Accuracy</span>
              <strong className="text-white text-xs block">{STATS.accuracyRate}%</strong>
            </div>
          </div>
        </div>

        {/* Submit Report Button */}
        <button
          onClick={() => setShowSubmit(!showSubmit)}
          className="w-full p-4 rounded-3xl bg-gradient-to-r from-[#8ED329] to-[#00DDE5] text-black font-extrabold text-xs shadow-xl flex items-center justify-between active:scale-[0.98] transition"
        >
          <div className="flex items-center gap-2.5">
            <Camera className="w-5 h-5 fill-black" />
            <div className="text-left">
              <span className="text-sm font-black block leading-none">Submit Cloud Observation</span>
              <span className="text-[10px] opacity-80 block mt-0.5">Report what you see in the sky</span>
            </div>
          </div>
          <span className="bg-black/20 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase">
            {showSubmit ? "Close" : "Open"}
          </span>
        </button>

        {/* Submit Form */}
        {showSubmit && (
          <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-3 animate-fade-in">
            <h3 className="font-extrabold text-sm text-white">Quick Cloud Report</h3>

            <div className="grid grid-cols-3 gap-2">
              {CLOUD_TYPES.map((cloud) => (
                <button
                  key={cloud.name}
                  onClick={() => setSelectedCloud(selectedCloud === cloud.name ? null : cloud.name)}
                  className={`p-3 rounded-2xl text-center transition-all border ${
                    selectedCloud === cloud.name
                      ? "bg-[#00DDE5]/20 border-[#00DDE5] scale-105"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <span className="text-2xl block">{cloud.icon}</span>
                  <span className="text-[9px] font-bold text-white block mt-1">{cloud.name}</span>
                  <span className="text-[8px] text-white/50 block">{cloud.altitude}</span>
                </button>
              ))}
            </div>

            {selectedCloud && (
              <button className="w-full py-3 rounded-2xl bg-[#00DDE5] text-[#06345C] font-extrabold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition">
                <Send className="w-4 h-4" />
                Submit {selectedCloud} Report
              </button>
            )}
          </div>
        )}

        {/* Cloud Field Guide */}
        <div className="glass-card rounded-3xl p-5 border border-white/20 space-y-3">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Cloud className="w-4 h-4 text-[#00DDE5]" />
            <span>Cloud Identification Guide</span>
          </h3>

          <div className="space-y-2">
            {CLOUD_TYPES.map((cloud) => (
              <div key={cloud.name} className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                <span className="text-2xl shrink-0">{cloud.icon}</span>
                <div className="flex-1">
                  <span className="text-xs font-bold text-white block">{cloud.name}</span>
                  <span className="text-[10px] text-white/60 block">{cloud.description}</span>
                </div>
                <span className="text-[9px] text-white/40 shrink-0">{cloud.altitude}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="glass-card rounded-3xl p-5 border border-white/20 space-y-3">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-[#FFBE00]" />
            <span>Recent Observations</span>
          </h3>

          <div className="space-y-2">
            {RECENT_REPORTS.map((report) => (
              <div key={report.id} className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{report.cloudType}</span>
                    {report.verified && (
                      <CheckCircle2 className="w-3 h-3 text-[#8ED329]" />
                    )}
                  </div>
                  <span className="text-[10px] text-white/50 block">
                    by {report.reporter} • {report.location} • {report.time}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-white/40 block">Confidence</span>
                  <span className="text-xs font-black text-[#00DDE5]">{report.confidence}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
