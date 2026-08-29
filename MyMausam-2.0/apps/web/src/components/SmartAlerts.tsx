"use client";

import { useWeather } from "@/context/WeatherContext";
import { usePersonalization, type RecommendationFeedback } from "@/context/PersonalizationContext";
import { AlertTriangle, ThumbsUp, ThumbsDown, EyeOff, Info } from "lucide-react";
import { useState } from "react";

interface Alert {
  id: string;
  type: string;
  icon: string;
  title: string;
  message: string;
  severity: "low" | "moderate" | "high" | "extreme";
  color: string;
}

function generateAlerts(weather: any): Alert[] {
  if (!weather) return [];
  const alerts: Alert[] = [];
  const temp = weather.temperature ?? 34;
  const humidity = weather.humidity ?? 40;
  const wind = weather.wind_speed ?? 10;
  const uv = weather.uv_index ?? 5;
  const visibility = weather.visibility_km ?? 10;
  const condition = (weather.condition ?? "").toLowerCase();

  // Heat risk
  const heatIndex = temp + 0.5 * humidity - 10;
  if (heatIndex > 40) {
    alerts.push({ id: "heat-extreme", type: "heat", icon: "🌡️", title: "Extreme Heat Alert", message: `Heat index ${heatIndex.toFixed(0)}°C. Avoid outdoor activity 12-3 PM. Stay hydrated.`, severity: "extreme", color: "#FF4444" });
  } else if (heatIndex > 35) {
    alerts.push({ id: "heat-high", type: "heat", icon: "🌡️", title: "Heat Advisory", message: `Heat index ${heatIndex.toFixed(0)}°C. Limit prolonged outdoor exposure.`, severity: "high", color: "#FF7400" });
  }

  // UV risk
  if (uv >= 11) {
    alerts.push({ id: "uv-extreme", type: "uv", icon: "☀️", title: "Extreme UV Alert", message: "UV Index very high. SPF 50+ required. Avoid midday sun.", severity: "extreme", color: "#FF4444" });
  } else if (uv >= 8) {
    alerts.push({ id: "uv-high", type: "uv", icon: "☀️", title: "High UV Warning", message: "UV Index high. Wear sunscreen and sunglasses.", severity: "high", color: "#FF7400" });
  }

  // Rain risk
  if (condition.includes("rain") || condition.includes("drizzle") || condition.includes("shower")) {
    const isHeavy = condition.includes("heavy") || condition.includes("torrential");
    alerts.push({
      id: isHeavy ? "rain-heavy" : "rain-light",
      type: "rain",
      icon: "🌧️",
      title: isHeavy ? "Heavy Rain Alert" : "Rain Expected",
      message: isHeavy ? "Heavy rainfall. Avoid travel. Watch for waterlogging." : "Light rain. Carry an umbrella.",
      severity: isHeavy ? "high" : "moderate",
      color: isHeavy ? "#FF7400" : "#FFBE00",
    });
  }

  // Wind risk
  if (wind > 40) {
    alerts.push({ id: "wind-extreme", type: "wind", icon: "💨", title: "High Wind Warning", message: `Wind ${wind.toFixed(0)} km/h. Secure loose objects. Avoid open areas.`, severity: "extreme", color: "#FF4444" });
  } else if (wind > 25) {
    alerts.push({ id: "wind-moderate", type: "wind", icon: "💨", title: "Wind Advisory", message: `Gusty winds ${wind.toFixed(0)} km/h. Drive carefully.`, severity: "moderate", color: "#FFBE00" });
  }

  // Fog/visibility
  if (visibility < 1) {
    alerts.push({ id: "fog-severe", type: "fog", icon: "🌫️", title: "Dense Fog Alert", message: `Visibility ${visibility.toFixed(1)} km. Avoid driving. Use fog lights.`, severity: "extreme", color: "#FF4444" });
  } else if (visibility < 3) {
    alerts.push({ id: "fog-moderate", type: "fog", icon: "🌫️", title: "Fog Advisory", message: `Reduced visibility ${visibility.toFixed(1)} km. Drive slowly.`, severity: "moderate", color: "#FFBE00" });
  }

  // Thunderstorm
  if (condition.includes("thunder") || condition.includes("lightning")) {
    alerts.push({ id: "thunder", type: "thunder", icon: "⛈️", title: "Thunderstorm Alert", message: "Seek shelter immediately. Avoid open fields and tall trees.", severity: "high", color: "#FF7400" });
  }

  // Cyclone
  if (condition.includes("cyclone") || condition.includes("hurricane") || condition.includes("typhoon")) {
    alerts.push({ id: "cyclone", type: "cyclone", icon: "🌀", title: "Cyclone Warning", message: "Severe cyclonic activity. Stay indoors. Follow IMD directives.", severity: "extreme", color: "#FF4444" });
  }

  return alerts;
}

export function SmartAlerts() {
  const { currentWeather } = useWeather();
  const { isHidden, hideRecommendation, submitFeedback, feedback } = usePersonalization();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const alerts = generateAlerts(currentWeather).filter((a) => !isHidden(a.id));

  if (alerts.length === 0) return null;

  const getFb = (id: string): RecommendationFeedback | undefined => feedback.find((f) => f.id === id);

  return (
    <div className="px-4 space-y-2">
      <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">Active Alerts</h3>
      {alerts.map((alert) => {
        const fb = getFb(alert.id);
        return (
          <div key={alert.id} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
            <div className="flex items-center gap-3 p-3">
              <span className="text-xl">{alert.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: alert.color }}>{alert.title}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase" style={{ backgroundColor: alert.color + "20", color: alert.color }}>
                    {alert.severity}
                  </span>
                </div>
                <p className="text-xs text-white/60 mt-0.5">{alert.message}</p>
              </div>
              <button onClick={() => setExpandedId(expandedId === alert.id ? null : alert.id)} className="text-white/30 hover:text-white/60">
                <Info size={14} />
              </button>
            </div>
            {expandedId === alert.id && (
              <div className="px-3 pb-3 flex items-center gap-2 border-t border-white/5 pt-2">
                <button
                  onClick={() => submitFeedback(alert.id, "up")}
                  className={`p-1.5 rounded-lg text-xs ${fb?.rating === "up" ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-white/40"}`}
                >
                  <ThumbsUp size={12} />
                </button>
                <button
                  onClick={() => submitFeedback(alert.id, "down")}
                  className={`p-1.5 rounded-lg text-xs ${fb?.rating === "down" ? "bg-red-500/20 text-red-400" : "bg-white/5 text-white/40"}`}
                >
                  <ThumbsDown size={12} />
                </button>
                <button
                  onClick={() => hideRecommendation(alert.id)}
                  className="p-1.5 rounded-lg text-xs bg-white/5 text-white/40 hover:bg-white/10"
                >
                  <EyeOff size={12} />
                </button>
                <span className="text-[10px] text-white/30 ml-auto">Show less like this</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
