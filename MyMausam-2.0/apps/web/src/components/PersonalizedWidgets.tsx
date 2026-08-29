"use client";

import { usePersonalization } from "@/context/PersonalizationContext";
import { useWeather } from "@/context/WeatherContext";
import { Info, ThumbsUp, ThumbsDown, EyeOff } from "lucide-react";
import { useState } from "react";

interface WidgetCard {
  id: string;
  category: string;
  title: string;
  value: string;
  subtitle: string;
  color: string;
}

function buildWidgets(weather: any): WidgetCard[] {
  if (!weather) return [];
  const w = weather;
  const cards: WidgetCard[] = [
    { id: "feels-like", category: "temperature", title: "Feels Like", value: `${w.feels_like?.toFixed(1)}°C`, subtitle: "Real temperature", color: "#FF7400" },
    { id: "humidity-card", category: "humidity", title: "Humidity", value: `${w.humidity}%`, subtitle: w.humidity > 70 ? "Very humid" : "Comfortable", color: "#00DDE5" },
    { id: "uv-card", category: "uv_index", title: "UV Index", value: w.uv_index?.toFixed(1) ?? "—", subtitle: w.uv_index >= 8 ? "Very High — protect skin" : w.uv_index >= 5 ? "Moderate — wear sunscreen" : "Low — safe", color: "#FFBE00" },
    { id: "visibility-card", category: "visibility", title: "Visibility", value: `${w.visibility_km?.toFixed(1)} km`, subtitle: w.visibility_km < 3 ? "Reduced — drive carefully" : "Clear", color: "#8ED329" },
    { id: "wind-card", category: "wind", title: "Wind", value: `${w.wind_speed?.toFixed(1)} km/h`, subtitle: `${w.wind_direction}`, color: "#0055A6" },
    { id: "pressure-card", category: "pressure", title: "Pressure", value: `${w.pressure_hpa?.toFixed(0)} hPa`, subtitle: w.pressure_hpa > 1013 ? "High" : "Low", color: "#9b59b6" },
    { id: "aqi-card", category: "air_quality", title: "AQI", value: `${w.aqi?.aqi ?? "—"}`, subtitle: w.aqi?.status ?? "Unknown", color: w.aqi?.color ?? "#8ED329" },
    { id: "sunrise-card", category: "sunrise", title: "Sunrise", value: w.sunrise ?? "—", subtitle: `Sunset: ${w.sunset ?? "—"}`, color: "#FFBE00" },
  ];
  return cards;
}

export function PersonalizedWidgets() {
  const { getRelevanceScore, explainRecommendation, feedback, submitFeedback, hideRecommendation, isHidden } = usePersonalization();
  const { currentWeather } = useWeather();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const widgets = buildWidgets(currentWeather)
    .map((w) => ({ ...w, relevance: getRelevanceScore(w.category) }))
    .sort((a, b) => b.relevance - a.relevance)
    .filter((w) => !isHidden(w.id));

  if (widgets.length === 0) return null;

  return (
    <div className="px-4 space-y-2">
      <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">Weather Details</h3>
      <div className="grid grid-cols-2 gap-2">
        {widgets.map((widget) => {
          const fb = feedback.find((f) => f.id === widget.id);
          return (
            <div key={widget.id} className="bg-white/5 rounded-xl p-3 border border-white/10 relative group">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-white/40 font-medium">{widget.title}</span>
                <button onClick={() => setExpandedId(expandedId === widget.id ? null : widget.id)} className="opacity-0 group-hover:opacity-100 text-white/30 transition-opacity">
                  <Info size={10} />
                </button>
              </div>
              <div className="text-lg font-bold" style={{ color: widget.color }}>{widget.value}</div>
              <div className="text-[10px] text-white/40 mt-0.5">{widget.subtitle}</div>
              {expandedId === widget.id && (
                <div className="mt-2 pt-2 border-t border-white/5 space-y-1">
                  <p className="text-[10px] text-white/30 italic">{explainRecommendation(widget.category)}</p>
                  <div className="flex items-center gap-1">
                    <button onClick={() => submitFeedback(widget.id, "up")} className={`p-1 rounded text-[10px] ${fb?.rating === "up" ? "text-emerald-400" : "text-white/20"}`}><ThumbsUp size={10} /></button>
                    <button onClick={() => submitFeedback(widget.id, "down")} className={`p-1 rounded text-[10px] ${fb?.rating === "down" ? "text-red-400" : "text-white/20"}`}><ThumbsDown size={10} /></button>
                    <button onClick={() => hideRecommendation(widget.id)} className="p-1 rounded text-[10px] text-white/20"><EyeOff size={10} /></button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
