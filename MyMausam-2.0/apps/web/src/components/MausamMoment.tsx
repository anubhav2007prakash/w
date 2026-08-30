"use client";

import React from "react";
import { useWeather } from "@/context/WeatherContext";
import { usePersonalization } from "@/context/PersonalizationContext";
import { Sparkles } from "lucide-react";
import { getMausamMoment, Persona } from "@/lib/personalization-engine";

/**
 * MausamMoment — A prominent, persona-aware weather insight card.
 *
 * Placed near the top of the homepage, it shows a concise, actionable
 * message tailored to the user's selected persona and current weather.
 */

/** Map PersonalizationContext's ActivityMode to our Persona type */
function modeToPersona(mode: string): Persona {
  switch (mode) {
    case "agriculture":
    case "gardening":
      return "farmer";
    case "fitness":
      return "fitness";
    case "commuter":
      return "commuter";
    case "travel":
      return "traveler";
    case "beach":
      return "beach";
    case "family":
      return "family";
    case "event_planner":
      return "event_planner";
    default:
      return "health";
  }
}

export function MausamMoment() {
  const { currentWeather } = useWeather();
  const { activeMode } = usePersonalization();
  const persona = modeToPersona(activeMode);
  const moment = getMausamMoment(persona, currentWeather);

  return (
    <div className="mx-4 my-2 rounded-2xl overflow-hidden border border-white/15 bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-md shadow-lg">
      <div className="px-4 py-3.5 flex items-start gap-3">
        {/* Emoji indicator */}
        <div className="text-2xl mt-0.5 shrink-0">{moment.emoji}</div>

        <div className="flex-1 min-w-0">
          {/* Label */}
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3 h-3 text-[#FFBE00]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFBE00]">
              Mausam Moment
            </span>
          </div>

          {/* Message */}
          <p className="text-xs text-white/90 leading-relaxed">
            {moment.message}
          </p>
        </div>
      </div>
    </div>
  );
}
