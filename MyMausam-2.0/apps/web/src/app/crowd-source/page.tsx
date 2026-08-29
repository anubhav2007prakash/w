"use client";

import React, { useState, useRef } from "react";
import { Header } from "@/components/Header";
import {
  Users,
  Camera,
  Send,
  CheckCircle2,
  MapPin,
  CloudRain,
  Sun,
  Cloud,
  CloudLightning,
  Snowflake,
  CloudFog,
  ThumbsUp,
  Clock,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { useWeather } from "@/context/WeatherContext";
import { useLanguage } from "@/i18n/LanguageContext";

interface CrowdReport {
  id: string;
  location: string;
  condition: string;
  emoji: string;
  photo?: string;
  timestamp: string;
  reporter: string;
  upvotes: number;
}

const QUICK_CONDITIONS = [
  { key: "sunny", emoji: "☀️", icon: Sun, color: "#FFBE00", label: "Sunny" },
  { key: "cloudy", emoji: "☁️", icon: Cloud, color: "#94a3b8", label: "Cloudy" },
  { key: "drizzle", emoji: "🌦️", icon: CloudRain, color: "#38bdf8", label: "Drizzle" },
  { key: "heavy_rain", emoji: "🌧️", icon: CloudRain, color: "#0055A6", label: "Heavy Rain" },
  { key: "thunderstorm", emoji: "⛈️", icon: CloudLightning, color: "#a78bfa", label: "Thunderstorm" },
  { key: "hail", emoji: "🧊", icon: Snowflake, color: "#00DDE5", label: "Hailstorm" },
  { key: "fog", emoji: "🌫️", icon: CloudFog, color: "#cbd5e1", label: "Dense Fog" },
  { key: "hot", emoji: "🔥", icon: Sun, color: "#FF7400", label: "Extreme Heat" },
];

// Demo feed data
const DEMO_FEED: CrowdReport[] = [
  {
    id: "1",
    location: "Sector 62, Noida",
    condition: "heavy_rain",
    emoji: "🌧️",
    timestamp: "3 mins ago",
    reporter: "Ravi K.",
    upvotes: 12,
  },
  {
    id: "2",
    location: "Connaught Place, Delhi",
    condition: "cloudy",
    emoji: "☁️",
    timestamp: "8 mins ago",
    reporter: "Priya M.",
    upvotes: 7,
  },
  {
    id: "3",
    location: "MG Road, Bengaluru",
    condition: "sunny",
    emoji: "☀️",
    timestamp: "15 mins ago",
    reporter: "Arun S.",
    upvotes: 23,
  },
  {
    id: "4",
    location: "Marine Drive, Mumbai",
    condition: "drizzle",
    emoji: "🌦️",
    timestamp: "22 mins ago",
    reporter: "Neha P.",
    upvotes: 18,
  },
];

export default function CrowdSourcePage() {
  const { activeLocation } = useWeather();
  const { t } = useLanguage();
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [reports, setReports] = useState<CrowdReport[]>(DEMO_FEED);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleQuickTap = (condition: string) => {
    setSelectedCondition(condition);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCondition) return;

    const cond = QUICK_CONDITIONS.find((c) => c.key === selectedCondition);
    const newReport: CrowdReport = {
      id: Date.now().toString(),
      location: activeLocation,
      condition: selectedCondition,
      emoji: cond?.emoji || "🌤️",
      photo: photoPreview || undefined,
      timestamp: "Just now",
      reporter: "You",
      upvotes: 0,
    };

    setReports((prev) => [newReport, ...prev]);
    setSubmitted(true);
    setSelectedCondition(null);
    setDescription("");
    setPhotoPreview(null);

    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleUpvote = (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header
        showBack={true}
        title={t("crowd.title")}
        subtitle={t("crowd.subtitle")}
      />

      <div className="p-4 space-y-4">
        {/* Quick Tap Banner */}
        <div className="glass-card rounded-3xl p-4 border border-white/20 shadow-xl space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#8ED329]/20 flex items-center justify-center text-[#8ED329]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-white text-sm leading-none">
                {t("crowd.quick_report")}
              </h2>
              <p className="text-[11px] text-white/70 mt-0.5">
                {t("crowd.quick_report_sub")}
              </p>
            </div>
          </div>

          {/* Quick Tap Grid */}
          <div className="grid grid-cols-4 gap-2">
            {QUICK_CONDITIONS.map((cond) => {
              const isSelected = selectedCondition === cond.key;
              return (
                <button
                  key={cond.key}
                  type="button"
                  onClick={() => handleQuickTap(cond.key)}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-2xl border transition-all ${
                    isSelected
                      ? "bg-white/20 border-[#00DDE5] scale-105 shadow-lg"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <span className="text-xl">{cond.emoji}</span>
                  <span className="text-[9px] font-bold text-white/80 leading-tight text-center">
                    {cond.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Success Banner */}
        {submitted && (
          <div className="glass-card rounded-3xl p-5 border border-green-500/30 text-center space-y-2 animate-scale-up">
            <CheckCircle2 className="w-12 h-12 text-[#8ED329] mx-auto" />
            <h3 className="font-bold text-white text-base">
              {t("crowd.report_submitted")}
            </h3>
            <p className="text-xs text-white/70">
              {t("crowd.thanks_spotter")}
            </p>
          </div>
        )}

        {/* Detailed Report Form */}
        {selectedCondition && !submitted && (
          <form
            onSubmit={handleSubmit}
            className="glass-card rounded-3xl p-4 border border-white/20 space-y-3 animate-fade-in"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">
                {t("crowd.confirm_report")}
              </span>
              <button
                type="button"
                onClick={() => setSelectedCondition(null)}
                className="text-white/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Location */}
            <div className="bg-white/10 p-3 rounded-2xl text-xs text-white flex items-center gap-2 border border-white/10">
              <MapPin className="w-4 h-4 text-[#FFBE00] shrink-0" />
              <span>{activeLocation}</span>
            </div>

            {/* Description */}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("crowd.optional_notes")}
              rows={2}
              className="w-full bg-white/10 border border-white/15 rounded-2xl p-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#00DDE5]"
            />

            {/* Photo Upload */}
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl px-3 py-2 text-[11px] text-white/80 transition"
              >
                <Camera className="w-4 h-4 text-[#00DDE5]" />
                {t("crowd.add_photo")}
              </button>
              {photoPreview && (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-12 h-12 rounded-xl object-cover border border-white/20"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotoPreview(null)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#8ED329] hover:bg-[#7ec224] active:scale-[0.98] text-[#06345C] font-black rounded-2xl text-xs transition shadow-lg flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {t("crowd.submit_report")}
            </button>
          </form>
        )}

        {/* Live Feed */}
        <div className="glass-card rounded-3xl p-4 border border-white/20 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#8ED329] animate-pulse" />
              {t("crowd.live_feed")}
            </h3>
            <span className="text-[9px] text-white/50 font-bold">
              {reports.length} {t("crowd.reports")}
            </span>
          </div>

          <div className="space-y-2">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white/5 p-3 rounded-2xl border border-white/5 flex items-center gap-3"
              >
                <span className="text-2xl shrink-0">{report.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-white truncate">
                      {report.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] text-white/50 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {report.timestamp}
                    </span>
                    <span className="text-[9px] text-white/50">
                      • {report.reporter}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleUpvote(report.id)}
                  className="flex items-center gap-1 bg-white/10 hover:bg-white/15 rounded-full px-2.5 py-1 transition"
                >
                  <ThumbsUp className="w-3 h-3 text-[#00DDE5]" />
                  <span className="text-[10px] font-bold text-white/80">
                    {report.upvotes}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
