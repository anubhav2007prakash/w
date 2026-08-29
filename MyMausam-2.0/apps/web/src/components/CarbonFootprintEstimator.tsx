"use client";

import React, { useState, useMemo } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  Car,
  Bus,
  Bike,
  Home,
  UtensilsCrossed,
  Zap,
  TreePine,
  Leaf,
  Info,
} from "lucide-react";

const EMISSION_FACTORS: Record<string, Record<string, { factor: number; icon: any; label: string; labelHi: string; unit?: string }>> = {
  transport: {
    car_gasoline: { factor: 0.241, icon: Car, label: "Car (Gasoline)", labelHi: "कार (पेट्रोल)" },
    car_diesel: { factor: 0.27, icon: Car, label: "Car (Diesel)", labelHi: "कार (डीज़ल)" },
    car_electric: { factor: 0.05, icon: Car, label: "Electric Car", labelHi: "इलेक्ट्रिक कार" },
    bus: { factor: 0.089, icon: Bus, label: "Bus", labelHi: "बस" },
    metro: { factor: 0.035, icon: Bus, label: "Metro/Train", labelHi: "मेट्रो/ट्रेन" },
    bike: { factor: 0.16, icon: Bike, label: "Motorbike", labelHi: "बाइक" },
    cycle: { factor: 0, icon: Bike, label: "Cycle/Walk", labelHi: "साइकिल/पैदल" },
  },
  energy: {
    electricity: { factor: 0.82, icon: Zap, unit: "kWh", label: "Electricity", labelHi: "बिजली" },
    lpg_cooking: { factor: 0.194, icon: Home, unit: "kg", label: "LPG Cooking", labelHi: "LPG खाना" },
  },
  food: {
    vegetarian: { factor: 1.7, icon: TreePine, label: "Vegetarian Meal", labelHi: "शाकाहारी भोजन" },
    non_vegetarian: { factor: 6.1, icon: UtensilsCrossed, label: "Non-Veg Meal", labelHi: "मांसाहारी भोजन" },
    vegan: { factor: 0.9, icon: Leaf, label: "Vegan Meal", labelHi: "वीगन भोजन" },
  },
};

const DAILY_TIPS = [
  { text: "Try carpooling — cuts transport emissions by 50%", textHi: "कारपूलिंग करें — परिवहन उत्सर्जन 50% कम" },
  { text: "Use public transport for commutes under 15km", textHi: "15km से कम दूरी के लिए पब्लिक ट्रांसपोर्ट" },
  { text: "Switch to LED bulbs — saves 75% energy", textHi: "LED बल्ब लगाएं — 75% ऊर्जा बचत" },
  { text: "Eat one plant-based meal daily to halve food emissions", textHi: "रोज़ एक शाकाहारी भोजन करें" },
  { text: "Reduce AC to 24°C — saves 0.4 kg CO₂/day", textHi: "AC 24°C पर रखें — 0.4 kg CO₂/दिन बचें" },
  { text: "Unplug devices when not in use — standby power adds up", textHi: "उपकरण अनप्लग करें — स्टैंडबाई पावर बर्बाद" },
  { text: "Walk or cycle for trips under 2km", textHi: "2km से कम दूरी पैदल या साइकिल से जाएं" },
];

function getRating(co2: number): { level: "good" | "ok" | "bad"; color: string; label: string; labelHi: string } {
  if (co2 < 5) return { level: "good", color: "#22c55e", label: "Low Impact", labelHi: "कम प्रभाव" };
  if (co2 < 15) return { level: "ok", color: "#FFBE00", label: "Moderate", labelHi: "मध्यम" };
  return { level: "bad", color: "#ef4444", label: "High Impact", labelHi: "अधिक प्रभाव" };
}

interface ActivityInput {
  category: "transport" | "energy" | "food";
  type: string;
  value: number;
}

export function CarbonFootprintEstimator() {
  const { locale } = useLanguage();
  const isHi = locale === "hi";

  const [activities, setActivities] = useState<ActivityInput[]>([
    { category: "transport", type: "car_gasoline", value: 0 },
    { category: "energy", type: "electricity", value: 0 },
    { category: "food", type: "vegetarian", value: 0 },
  ]);

  const [expandedCat, setExpandedCat] = useState<string | null>("transport");

  const totalEmissions = useMemo(() => {
    return activities.reduce((sum, a) => {
      const catFactors = EMISSION_FACTORS[a.category];
      const entry = catFactors[a.type as keyof typeof catFactors];
      return sum + (entry ? a.value * entry.factor : 0);
    }, 0);
  }, [activities]);

  const rating = getRating(totalEmissions);
  const tip = DAILY_TIPS[Math.floor(Date.now() / 86400000) % DAILY_TIPS.length];

  const updateActivity = (category: string, type: string, value: number) => {
    setActivities((prev) => {
      const existing = prev.find((a) => a.category === category && a.type === type);
      if (existing) {
        return prev.map((a) => (a === existing ? { ...a, value } : a));
      }
      return [...prev, { category: category as any, type, value }];
    });
  };

  const renderCategory = (
    catKey: "transport" | "energy" | "food",
    emoji: string,
    label: string
  ) => {
    const factors = EMISSION_FACTORS[catKey];
    const isExpanded = expandedCat === catKey;
    const catTotal = activities
      .filter((a) => a.category === catKey)
      .reduce((sum, a) => {
        const entry = factors[a.type as keyof typeof factors];
        return sum + (entry ? a.value * entry.factor : 0);
      }, 0);

    return (
      <div key={catKey} className="rounded-2xl border border-white/10 overflow-hidden">
        <button
          onClick={() => setExpandedCat(isExpanded ? null : catKey)}
          className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{emoji}</span>
            <span className="text-xs font-bold text-white">{label}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-white/60">
              {catTotal.toFixed(1)} kg CO₂
            </span>
            <span
              className={`text-xs transition-transform ${isExpanded ? "rotate-180" : ""}`}
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              ▼
            </span>
          </div>
        </button>
        {isExpanded && (
          <div className="px-3 pb-3 space-y-2">
            {Object.entries(factors).map(([key, entry]) => {
              const act = activities.find((a) => a.category === catKey && a.type === key);
              const val = act?.value || 0;
              return (
                <div key={key} className="flex items-center gap-2">
                  <div className="flex-1">
                    <span className="text-[10px] text-white/70 block">
                      {isHi && "labelHi" in entry ? (entry as any).labelHi : entry.label}
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={val || ""}
                      onChange={(e) =>
                        updateActivity(catKey, key, parseFloat(e.target.value) || 0)
                      }
                      placeholder="0"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[11px] text-white placeholder-white/30 focus:border-[#00DDE5] focus:outline-none mt-0.5"
                    />
                    {catKey === "transport" && (
                      <span className="text-[9px] text-white/40">km/day</span>
                    )}
                    {catKey === "energy" && (
                      <span className="text-[9px] text-white/40">{entry.unit}/day</span>
                    )}
                    {catKey === "food" && (
                      <span className="text-[9px] text-white/40">meals/day</span>
                    )}
                  </div>
                  <div className="text-right min-w-[48px]">
                    <span className="text-[10px] font-mono text-[#FFBE00]">
                      {(val * entry.factor).toFixed(2)}
                    </span>
                    <span className="text-[9px] text-white/40 block">kg</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-[#8ED329]/20 flex items-center justify-center">
          <Leaf className="w-4 h-4 text-[#8ED329]" />
        </div>
        <div>
          <h3 className="text-xs font-black text-white">
            {isHi ? "कार्बन फुटप्रिंट" : "Carbon Footprint"}
          </h3>
          <p className="text-[9px] text-white/50">
            {isHi ? "दैनिक गतिविधियों से CO₂ अनुमान" : "Estimate CO₂ from daily activities"}
          </p>
        </div>
      </div>

      {/* Total Emission + Rating */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
        <div>
          <div className="text-2xl font-black font-mono" style={{ color: rating.color }}>
            {totalEmissions.toFixed(1)}
          </div>
          <div className="text-[10px] text-white/50">kg CO₂e/day</div>
        </div>
        <div className="text-right">
          <div
            className="text-xs font-black px-2.5 py-1 rounded-full"
            style={{ background: `${rating.color}22`, color: rating.color }}
          >
            {isHi ? rating.labelHi : rating.label}
          </div>
          <div className="text-[9px] text-white/40 mt-1">
            {isHi ? "भारतीय औसत: ~18 kg" : "India avg: ~18 kg"}
          </div>
        </div>
      </div>

      {/* Category Inputs */}
      {renderCategory("transport", "🚗", isHi ? "परिवहन" : "Transport")}
      {renderCategory("energy", "⚡", isHi ? "ऊर्जा" : "Energy")}
      {renderCategory("food", "🍽️", isHi ? "भोजन" : "Food")}

      {/* Daily Tip */}
      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-[#00DDE5]/10 border border-[#00DDE5]/20">
        <Info className="w-3.5 h-3.5 text-[#00DDE5] mt-0.5 shrink-0" />
        <span className="text-[10px] text-white/70 leading-relaxed">
          💡 {isHi ? tip.textHi : tip.text}
        </span>
      </div>

      {/* Comparison Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[9px] text-white/50">
          <span>{isHi ? "आपका प्रभाव" : "Your Impact"}</span>
          <span>{isHi ? "भारतीय औसत" : "India Average"}</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min((totalEmissions / 18) * 100, 100)}%`,
              background: rating.color,
            }}
          />
        </div>
      </div>
    </div>
  );
}
