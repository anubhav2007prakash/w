"use client";

import React from "react";
import { Sun, Snowflake, AlertTriangle, ShieldCheck, TrendingUp } from "lucide-react";
import { CurrentWeather } from "@/types/weather";
import { useLanguage } from "@/i18n/LanguageContext";

interface LifestyleIndexProps {
  weather: CurrentWeather;
}

interface IndexCard {
  title: string;
  value: string;
  label: string;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
  advice: string;
  barPercent: number;
}

function computeHeatstrokeRisk(temp: number, humidity: number): IndexCard {
  // Heat Index calculation (simplified Steadman formula)
  const heatIndex =
    -8.785 +
    1.611 * temp +
    2.339 * humidity -
    0.1461 * temp * humidity -
    0.0068 * temp * temp -
    0.0548 * humidity * humidity +
    0.0012 * temp * temp * humidity +
    0.0008 * temp * humidity * humidity -
    0.0000025 * temp * temp * humidity * humidity;

  const risk = Math.min(Math.max(heatIndex, temp), 55);

  if (risk < 27) {
    return {
      title: "lifestyle.heatstroke",
      value: `${risk.toFixed(0)}`,
      label: "lifestyle.safe",
      color: "#8ED329",
      bgColor: "rgba(142,211,41,0.15)",
      icon: <ShieldCheck className="w-5 h-5 text-[#8ED329]" />,
      advice: "lifestyle.heatstroke_safe",
      barPercent: Math.min((risk / 55) * 100, 100),
    };
  }
  if (risk < 32) {
    return {
      title: "lifestyle.heatstroke",
      value: `${risk.toFixed(0)}`,
      label: "lifestyle.moderate",
      color: "#FFBE00",
      bgColor: "rgba(255,190,0,0.15)",
      icon: <AlertTriangle className="w-5 h-5 text-[#FFBE00]" />,
      advice: "lifestyle.heatstroke_moderate",
      barPercent: Math.min((risk / 55) * 100, 100),
    };
  }
  return {
    title: "lifestyle.heatstroke",
    value: `${risk.toFixed(0)}`,
    label: "lifestyle.danger",
    color: "#FF4444",
    bgColor: "rgba(255,68,68,0.15)",
    icon: <AlertTriangle className="w-5 h-5 text-[#FF4444]" />,
    advice: "lifestyle.heatstroke_danger",
    barPercent: Math.min((risk / 55) * 100, 100),
  };
}

function computeUVIndex(uv: number): IndexCard {
  if (uv < 3) {
    return {
      title: "lifestyle.uv_exposure",
      value: `${uv.toFixed(1)}`,
      label: "lifestyle.low",
      color: "#8ED329",
      bgColor: "rgba(142,211,41,0.15)",
      icon: <Sun className="w-5 h-5 text-[#8ED329]" />,
      advice: "lifestyle.uv_low",
      barPercent: Math.min((uv / 11) * 100, 100),
    };
  }
  if (uv < 6) {
    return {
      title: "lifestyle.uv_exposure",
      value: `${uv.toFixed(1)}`,
      label: "lifestyle.moderate",
      color: "#FFBE00",
      bgColor: "rgba(255,190,0,0.15)",
      icon: <Sun className="w-5 h-5 text-[#FFBE00]" />,
      advice: "lifestyle.uv_moderate",
      barPercent: Math.min((uv / 11) * 100, 100),
    };
  }
  return {
    title: "lifestyle.uv_exposure",
    value: `${uv.toFixed(1)}`,
    label: "lifestyle.very_high",
    color: "#FF4444",
    bgColor: "rgba(255,68,68,0.15)",
    icon: <Sun className="w-5 h-5 text-[#FF4444]" />,
    advice: "lifestyle.uv_high",
    barPercent: Math.min((uv / 11) * 100, 100),
  };
}

function computeACUsageIndex(temp: number, humidity: number): IndexCard {
  // AC usage index: 0-100 scale based on cooling degree days
  const comfort = 24; // optimal indoor temp
  const coolingNeed = Math.max(0, temp - comfort + (humidity > 60 ? (humidity - 60) * 0.1 : 0));
  const index = Math.min(coolingNeed * 5, 100);

  if (index < 30) {
    return {
      title: "lifestyle.ac_usage",
      value: `${index.toFixed(0)}`,
      label: "lifestyle.fan_ok",
      color: "#8ED329",
      bgColor: "rgba(142,211,41,0.15)",
      icon: <Snowflake className="w-5 h-5 text-[#8ED329]" />,
      advice: "lifestyle.ac_fan",
      barPercent: index,
    };
  }
  if (index < 65) {
    return {
      title: "lifestyle.ac_usage",
      value: `${index.toFixed(0)}`,
      label: "lifestyle.ac_recommended",
      color: "#FFBE00",
      bgColor: "rgba(255,190,0,0.15)",
      icon: <Snowflake className="w-5 h-5 text-[#FFBE00]" />,
      advice: "lifestyle.ac_moderate",
      barPercent: index,
    };
  }
  return {
    title: "lifestyle.ac_usage",
    value: `${index.toFixed(0)}`,
    label: "lifestyle.heavy_ac",
    color: "#FF4444",
    bgColor: "rgba(255,68,68,0.15)",
    icon: <Snowflake className="w-5 h-5 text-[#FF4444]" />,
    advice: "lifestyle.ac_heavy",
    barPercent: index,
  };
}

export const LifestyleIndex: React.FC<LifestyleIndexProps> = ({ weather }) => {
  const { t } = useLanguage();
  const temp = weather.temperature;
  const humidity = weather.humidity;
  const uv = weather.uv_index ?? 7.2;

  const cards = [
    computeHeatstrokeRisk(temp, humidity),
    computeUVIndex(uv),
    computeACUsageIndex(temp, humidity),
  ];

  return (
    <section className="px-4 select-none">
      <div className="glass-card rounded-3xl p-4 border border-white/20 shadow-xl space-y-3">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FFBE00]/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#FFBE00]" />
            </div>
            <h3 className="text-[11px] font-black text-white uppercase tracking-widest">
              {t("lifestyle.title")}
            </h3>
          </div>
          <span className="text-[9px] text-white/50 font-bold">
            {t("lifestyle.weather_affects")}
          </span>
        </div>

        {/* Index Cards Grid */}
        <div className="space-y-2">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white/5 p-3 rounded-2xl border border-white/5 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: card.bgColor }}
                  >
                    {card.icon}
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-white block leading-tight">
                      {t(card.title)}
                    </span>
                    <span className="text-[9px] text-white/50 block leading-tight">
                      {t(card.advice)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className="text-lg font-black block leading-none"
                    style={{ color: card.color }}
                  >
                    {card.value}
                  </span>
                  <span
                    className="text-[9px] font-bold block"
                    style={{ color: card.color }}
                  >
                    {t(card.label)}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${card.barPercent}%`,
                    backgroundColor: card.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
