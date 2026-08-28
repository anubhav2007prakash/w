"use client";

import React from "react";
import { useWeather } from "@/context/WeatherContext";
import { PersonaType } from "@/types/weather";
import {
  HeartPulse,
  Activity,
  Waves,
  Plane,
  HeartHandshake,
  Sprout,
  Car,
  CalendarCheck,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface PersonaConfig {
  key: PersonaType;
  label: string;
  icon: React.ElementType;
}

const PERSONA_TABS: PersonaConfig[] = [
  { key: "health", label: "Health", icon: HeartPulse },
  { key: "runner", label: "Fitness", icon: Activity },
  { key: "farmer", label: "Farmer", icon: Sprout },
  { key: "commuter", label: "Commuter", icon: Car },
  { key: "traveler", label: "Traveler", icon: Plane },
  { key: "parent", label: "Family", icon: HeartHandshake },
  { key: "beach", label: "Marine", icon: Waves },
  { key: "event_planner", label: "Events", icon: CalendarCheck },
];

export function PersonaEngine() {
  const { activePersona, setActivePersona, personaInsights } = useWeather();

  const currentInsight =
    personaInsights.find((p) => p.persona === activePersona) || personaInsights[0];

  return (
    <div className="mx-4 my-3 glass-panel rounded-2xl p-4 border border-white/15 bg-white/10 backdrop-blur-md shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-400/20 text-amber-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white/70">
              AI Personalized Telemetry
            </h2>
            <p className="text-sm font-bold text-white">IMD Smart Life Insights</p>
          </div>
        </div>
        {currentInsight && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-xs font-semibold text-white/90">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: currentInsight.statusColor || "#8ED329" }}
            />
            Score: {currentInsight.score}/100
          </div>
        )}
      </div>

      {/* Persona Horizontal Scroll Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {PERSONA_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activePersona === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActivePersona(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-amber-400 text-slate-900 font-bold shadow-md scale-105"
                  : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-slate-900" : "text-white/70"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Insight Card */}
      {currentInsight && (
        <div className="mt-3 bg-white/5 rounded-xl p-3.5 border border-white/10">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                {currentInsight.title}
              </h3>
              <p
                className="text-xs font-medium mt-0.5"
                style={{ color: currentInsight.statusColor || "#8ED329" }}
              >
                {currentInsight.status}
              </p>
            </div>
            <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/15 text-white/80 uppercase tracking-wider">
              {currentInsight.persona}
            </div>
          </div>

          <p className="text-xs text-white/80 mt-2 leading-relaxed">
            {currentInsight.description}
          </p>

          {/* Metrics Grid */}
          {currentInsight.metrics && currentInsight.metrics.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-3">
              {currentInsight.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="bg-black/20 rounded-lg p-2 flex flex-col justify-between border border-white/5"
                >
                  <span className="text-[10px] text-white/60 font-medium">{m.label}</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-bold text-white">{m.value}</span>
                    {m.badge && (
                      <span
                        className="text-[9px] px-1.5 py-0.5 rounded font-semibold text-slate-950"
                        style={{
                          backgroundColor: m.badgeColor || "#FFBE00",
                        }}
                      >
                        {m.badge}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Advice List */}
          {currentInsight.advice && currentInsight.advice.length > 0 && (
            <div className="mt-3 space-y-1.5 pt-2 border-t border-white/10">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-white/60">
                Actionable Recommendations
              </span>
              {currentInsight.advice.map((adv, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-white/90">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span className="leading-snug">{adv}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tags */}
          {currentInsight.tags && currentInsight.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-white/10">
              {currentInsight.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-white/70 font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
