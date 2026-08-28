"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Users, Camera, Send, CheckCircle2, AlertTriangle, MapPin } from "lucide-react";
import { useWeather } from "@/context/WeatherContext";

export default function CrowdSourcePage() {
  const { activeLocation } = useWeather();
  const [selectedCondition, setSelectedCondition] = useState("Clear");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDescription("");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="Citizen Weather Spotter" subtitle="IMD Crowdsourced Ground Truth Verification" />

      <div className="p-4 space-y-4">
        {/* Banner */}
        <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-xl space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#8ED329]/20 flex items-center justify-center text-[#8ED329]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-white text-base leading-none">
                Submit Ground Weather Report
              </h2>
              <p className="text-xs text-white/70 mt-1">
                Your report assists IMD meteorologists in model ground validation.
              </p>
            </div>
          </div>
        </div>

        {submitted ? (
          <div className="glass-card rounded-3xl p-6 border border-green-500/30 text-center space-y-2 animate-scale-up">
            <CheckCircle2 className="w-12 h-12 text-[#8ED329] mx-auto" />
            <h3 className="font-bold text-white text-base">Report Submitted!</h3>
            <p className="text-xs text-white/70">
              Thank you for contributing to national weather intelligence. +25 spotter points awarded.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-5 border border-white/20 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white">Current Location</label>
              <div className="bg-white/10 p-3 rounded-2xl text-xs text-white flex items-center gap-2 border border-white/10">
                <MapPin className="w-4 h-4 text-[#FFBE00]" />
                <span>{activeLocation}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white">Observed Weather Condition</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {["Clear", "Cloudy", "Drizzle", "Heavy Rain", "Hailstorm", "Dense Fog"].map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setSelectedCondition(c)}
                    className={`p-2.5 rounded-xl border transition-all ${
                      selectedCondition === c
                        ? "bg-[#00DDE5] text-[#06345C] font-bold border-transparent shadow-md"
                        : "bg-white/5 text-white/80 hover:bg-white/10 border-white/10"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white">Additional Notes / Waterlogging Depth</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="E.g., 5 inches waterlogging under bypass bridge, hail pellets approx 1cm..."
                rows={3}
                className="w-full bg-white/10 border border-white/15 rounded-2xl p-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#00DDE5]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#8ED329] hover:bg-[#7ec224] active:scale-[0.98] text-[#06345C] font-black rounded-2xl text-xs transition shadow-lg flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Spotter Report</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
