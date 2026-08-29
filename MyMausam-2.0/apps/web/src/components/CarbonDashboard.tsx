"use client";

import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  Leaf,
  Trophy,
  TrendingDown,
  Award,
  Recycle,
  Sun,
  Lightbulb,
  BarChart3,
  ChevronRight,
} from "lucide-react";

const GREEN_TIPS = [
  {
    category: "solar",
    icon: Sun,
    title: "Install Rooftop Solar",
    titleHi: "छत पर सोलर लगाएं",
    desc: "Save 2.5 tonnes CO₂/year with a 3kW system",
    descHi: "3kW सिस्टम से साल में 2.5 टन CO₂ बचाएं",
    saving: 2.5,
    roi: "5-7 years",
    color: "#FFBE00",
  },
  {
    category: "led",
    icon: Lightbulb,
    title: "LED Upgrade All Rooms",
    titleHi: "सभी कमरों में LED",
    desc: "Replace 10 bulbs — save 400 kWh/year",
    descHi: "10 बल्ब बदलें — साल में 400 kWh बचत",
    saving: 0.33,
    roi: "6 months",
    color: "#8ED329",
  },
  {
    category: "smart_ac",
    icon: Recycle,
    title: "Smart AC Scheduling",
    titleHi: "स्मार्ट AC शेड्यूलिंग",
    desc: "Timer-based cooling saves 15% energy",
    descHi: "टाइमर से कूलिंग में 15% बचत",
    saving: 0.8,
    roi: "Immediate",
    color: "#38bdf8",
  },
  {
    category: "ev",
    icon: Leaf,
    title: "Switch to EV/CNG",
    titleHi: "EV/CNG अपनाएं",
    desc: "Reduce transport emissions by 60%",
    descHi: "परिवहन उत्सर्जन 60% कम करें",
    saving: 3.2,
    roi: "2-3 years",
    color: "#22c55e",
  },
];

const MOCK_LEADERBOARD = [
  { rank: 1, name: "IIT Delhi Green Wing", score: 94, reduction: "32%", avatar: "🏛️" },
  { rank: 2, name: "BITS Pilani Campus", score: 89, reduction: "28%", avatar: "🏫" },
  { rank: 3, name: "NIT Trichy Block A", score: 85, reduction: "25%", avatar: "🏗️" },
  { rank: 4, name: "Your Building", score: 78, reduction: "18%", avatar: "🏢" },
  { rank: 5, name: "VIT Chennai Zone B", score: 72, reduction: "15%", avatar: "🎓" },
];

export function CarbonDashboard() {
  const { locale } = useLanguage();
  const isHi = locale === "hi";

  const [showAllTips, setShowAllTips] = useState(false);
  const greenScore = 78;
  const tipsToShow = showAllTips ? GREEN_TIPS : GREEN_TIPS.slice(0, 3);

  const scoreColor =
    greenScore >= 80 ? "#22c55e" : greenScore >= 60 ? "#FFBE00" : "#ef4444";

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-[#22c55e]/20 flex items-center justify-center">
          <Leaf className="w-4 h-4 text-[#22c55e]" />
        </div>
        <div>
          <h3 className="text-xs font-black text-white">
            {isHi ? "कार्बन डैशबोर्ड" : "Carbon Dashboard"}
          </h3>
          <p className="text-[9px] text-white/50">
            {isHi ? "ग्रीन स्कोर, लीडरबोर्ड और सुझाव" : "Green score, leaderboard & sustainability tips"}
          </p>
        </div>
      </div>

      {/* Green Score Ring */}
      <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/10">
        <div className="relative w-16 h-16 shrink-0">
          <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke={scoreColor}
              strokeWidth="3"
              strokeDasharray={`${greenScore} 100`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-black" style={{ color: scoreColor }}>
              {greenScore}
            </span>
            <span className="text-[7px] text-white/50">/100</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="text-sm font-black text-white">
            {isHi ? "ग्रीन इंडेक्स" : "Green Index"}
          </div>
          <div className="text-[10px] text-white/50 mt-0.5">
            {greenScore >= 80
              ? isHi
                ? "🏆 उत्कृष्ट — आपकी बिल्डिंग एनर्जी एफिशिएंट है!"
                : "🏆 Excellent — your building is energy efficient!"
              : greenScore >= 60
              ? isHi
                ? "👍 अच्छा — कुछ सुधार संभव है"
                : "👍 Good — some improvements possible"
              : isHi
              ? "⚠️ सुधार ज़रूरी — ऊर्जा बचत उपाय अपनाएं"
              : "⚠️ Needs improvement — adopt energy saving measures"}
          </div>
          <div className="flex gap-1 mt-1.5">
            {["solar", "led", "ac", "ev"].map((cat, i) => (
              <span
                key={cat}
                className="text-[8px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/60"
              >
                {["☀️", "💡", "❄️", "🚗"][i]}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* De-carbonizer Tips */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-white/70">
            {isHi ? "डी-कार्बोनाइज़र सुझाव" : "De-carbonizer Tips"}
          </span>
          {GREEN_TIPS.length > 3 && (
            <button
              onClick={() => setShowAllTips(!showAllTips)}
              className="text-[9px] text-[#00DDE5] font-bold flex items-center gap-0.5"
            >
              {showAllTips ? (isHi ? "कम दिखाएं" : "Show less") : (isHi ? "सभी देखें" : "See all")}
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
        {tipsToShow.map((tip) => {
          const Icon = tip.icon;
          return (
            <div
              key={tip.category}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${tip.color}22` }}
              >
                <Icon className="w-4 h-4" style={{ color: tip.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold text-white">
                  {isHi ? tip.titleHi : tip.title}
                </div>
                <div className="text-[9px] text-white/50">
                  {isHi ? tip.descHi : tip.desc}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[10px] font-black text-[#22c55e]">
                  -{tip.saving}t
                </div>
                <div className="text-[8px] text-white/40">CO₂/yr</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Eco-Leaderboard */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-[#FFBE00]" />
          <span className="text-[10px] font-bold text-white/70">
            {isHi ? "इको-लीडरबोर्ड" : "Eco-Leaderboard"}
          </span>
        </div>
        <div className="space-y-1">
          {MOCK_LEADERBOARD.map((entry) => {
            const isYou = entry.name === "Your Building";
            return (
              <div
                key={entry.rank}
                className={`flex items-center gap-2 p-2 rounded-xl transition-all ${
                  isYou
                    ? "bg-[#FFBE00]/10 border border-[#FFBE00]/30"
                    : "bg-white/[0.03] border border-white/5"
                }`}
              >
                <span className="text-[10px] font-black text-white/40 w-4 text-center">
                  {entry.rank <= 3 ? ["🥇", "🥈", "🥉"][entry.rank - 1] : `#${entry.rank}`}
                </span>
                <span className="text-base">{entry.avatar}</span>
                <div className="flex-1 min-w-0">
                  <div className={`text-[10px] font-bold ${isYou ? "text-[#FFBE00]" : "text-white"}`}>
                    {isYou ? (isHi ? "🏢 आपकी बिल्डिंग" : entry.name) : entry.name}
                  </div>
                  <div className="text-[8px] text-white/40">
                    {isHi ? "कटौती" : "Reduced"}: {entry.reduction}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black" style={{ color: scoreColor }}>
                    {entry.score}
                  </div>
                  <div className="text-[8px] text-white/40">pts</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 rounded-xl bg-white/5 text-center">
          <TrendingDown className="w-3.5 h-3.5 mx-auto text-[#22c55e] mb-0.5" />
          <div className="text-xs font-black text-[#22c55e]">-18%</div>
          <div className="text-[8px] text-white/50">{isHi ? "मासिक" : "Monthly"}</div>
        </div>
        <div className="p-2 rounded-xl bg-white/5 text-center">
          <Award className="w-3.5 h-3.5 mx-auto text-[#FFBE00] mb-0.5" />
          <div className="text-xs font-black text-white">#4</div>
          <div className="text-[8px] text-white/50">{isHi ? "रैंक" : "Rank"}</div>
        </div>
        <div className="p-2 rounded-xl bg-white/5 text-center">
          <BarChart3 className="w-3.5 h-3.5 mx-auto text-[#a78bfa] mb-0.5" />
          <div className="text-xs font-black text-[#a78bfa]">₹2.4k</div>
          <div className="text-[8px] text-white/50">{isHi ? "बचत/माह" : "Saved/mo"}</div>
        </div>
      </div>
    </div>
  );
}
