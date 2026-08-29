"use client";

import React, { useState } from "react";
import { useWeather } from "@/context/WeatherContext";
import { usePersonalization } from "@/context/PersonalizationContext";
import {
  Sprout,
  Activity,
  HeartPulse,
  FlaskConical,
  Plane,
  CloudSun,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { getPersonalizedDashboard, PERSONA_CONFIG, Persona } from "@/lib/personalization-engine";

/**
 * PersonalizedDashboard — Persona-specific weather cards.
 *
 * Shows a priority-ranked set of weather cards tailored to the user's
 * selected persona. Falls back to "general" persona by default.
 * Existing features (radar, alerts, forecast, AQI, etc.) remain untouched.
 */

const PERSONA_ICONS: Record<Persona, React.ElementType> = {
  farmer: Sprout,
  fitness: Activity,
  health: HeartPulse,
  researcher: FlaskConical,
  traveller: Plane,
  general: CloudSun,
};

/** Map PersonalizationContext's ActivityMode to our Persona type */
function modeToPersona(mode: string): Persona {
  switch (mode) {
    case "agriculture":
    case "gardening":
      return "farmer";
    case "fitness":
      return "fitness";
    case "commuter":
      return "traveller";
    case "travel":
      return "traveller";
    case "beach":
      return "traveller";
    case "family":
      return "general";
    case "event_planner":
      return "general";
    default:
      return "general";
  }
}

export function PersonalizedDashboard() {
  const { currentWeather } = useWeather();
  const { activeMode, setActiveMode } = usePersonalization();
  const [expanded, setExpanded] = useState(false);
  const persona = modeToPersona(activeMode);
  const cards = getPersonalizedDashboard(persona, currentWeather);
  const config = PERSONA_CONFIG[persona];
  const Icon = PERSONA_ICONS[persona];

  // Show top 4 cards by default, all when expanded
  const displayCards = expanded ? cards : cards.slice(0, 4);

  return (
    <div className="mx-4 my-2 glass-panel rounded-2xl p-4 border border-white/15 bg-white/10 backdrop-blur-md shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="p-1.5 rounded-lg"
            style={{ backgroundColor: `${config.color}30`, color: config.color }}
          >
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white/70">
              Your Dashboard
            </h2>
            <p className="text-sm font-bold text-white">
              {config.emoji} {config.label}
            </p>
          </div>
        </div>
        {cards.length > 4 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 transition"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Quick Persona Switcher */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-3">
        {(Object.keys(PERSONA_CONFIG) as Persona[]).map((p) => {
          const pc = PERSONA_CONFIG[p];
          const isActive = persona === p;
          return (
            <button
              key={p}
              onClick={() => {
                // Map our persona back to ActivityMode for the existing context
                const modeMap: Record<Persona, string> = {
                  farmer: "agriculture",
                  fitness: "fitness",
                  health: "default",
                  researcher: "default",
                  traveller: "travel",
                  general: "default",
                };
                setActiveMode(modeMap[p] as any);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 transition-all ${
                isActive
                  ? "text-slate-900 shadow-md scale-105"
                  : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
              }`}
              style={isActive ? { backgroundColor: pc.color } : undefined}
            >
              <span>{pc.emoji}</span>
              <span className="hidden sm:inline">{pc.label}</span>
            </button>
          );
        })}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 gap-2">
        {displayCards.map((card) => (
          <div
            key={card.id}
            className="bg-black/20 rounded-xl p-3 border border-white/5 flex flex-col justify-between"
          >
            <span className="text-[10px] text-white/50 font-medium">{card.title}</span>
            <div className="flex items-end justify-between mt-1">
              <span className="text-base font-bold" style={{ color: card.color }}>
                {card.value}
              </span>
            </div>
            <span className="text-[10px] text-white/40 mt-0.5 leading-tight">{card.subtitle}</span>
          </div>
        ))}
      </div>

      {/* "Show All" link */}
      {!expanded && cards.length > 4 && (
        <button
          onClick={() => setExpanded(true)}
          className="w-full mt-2.5 text-center text-[10px] text-[#00DDE5] hover:underline font-bold"
        >
          Show all {cards.length} cards
        </button>
      )}
    </div>
  );
}
