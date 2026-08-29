"use client";

import { usePersonalization } from "@/context/PersonalizationContext";
import { useWeather } from "@/context/WeatherContext";
import { ThumbsUp, ThumbsDown, EyeOff, Clock, Dumbbell, Car, Plane, Users, Sprout, Waves, CalendarCheck, MapPin } from "lucide-react";

interface TimelineItem {
  id: string;
  time: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: string;
  relevance: number;
}

function buildTimeline(mode: string, weather: any): TimelineItem[] {
  const temp = weather?.temperature ?? 34;
  const humidity = weather?.humidity ?? 40;
  const wind = weather?.wind_speed ?? 10;
  const uv = weather?.uv_index ?? 5;
  const visibility = weather?.visibility_km ?? 10;
  const sunrise = weather?.sunrise ?? "05:54 AM";
  const sunset = weather?.sunset ?? "06:51 PM";
  const items: TimelineItem[] = [];

  if (mode === "fitness" || mode === "default") {
    items.push(
      { id: "run-morning", time: "05:30 AM", icon: <Dumbbell size={16} />, title: "Morning Run Window", description: temp < 30 ? "Ideal temperature for outdoor running" : "Hot — run early before 7 AM", relevance: temp < 30 ? 95 : 80 },
      { id: "hydration", time: "Now", icon: <Dumbbell size={16} />, title: "Hydration Reminder", description: `Drink ${(humidity < 50 ? 500 : 350)}ml water before next activity`, relevance: 70 },
    );
  }

  if (mode === "commuter" || mode === "default") {
    items.push(
      { id: "commute", time: "08:15 AM", icon: <Car size={16} />, title: "Best Departure Time", description: visibility > 3 ? "Clear roads, low traffic window" : `Fog advisory — visibility ${visibility.toFixed(1)}km`, relevance: visibility > 3 ? 90 : 75 },
    );
  }

  if (mode === "travel" || mode === "default") {
    items.push(
      { id: "sightseeing", time: "06:00 PM", icon: <Plane size={16} />, title: "Golden Hour Photography", description: "Best lighting for photos. Temperature drops to comfortable levels.", relevance: 75 },
      { id: "packing", time: "Now", icon: <MapPin size={16} />, title: "Packing Suggestion", description: uv > 7 ? "Pack sunscreen SPF 30+, sunglasses, hat" : "Light layers, umbrella just in case", relevance: 65 },
    );
  }

  if (mode === "family" || mode === "default") {
    items.push(
      { id: "school-safety", time: "03:30 PM", icon: <Users size={16} />, title: "School Pickup Window", description: "Check if UV is safe for kids outdoors. Apply sunscreen before play.", relevance: 70 },
    );
  }

  if (mode === "agriculture" || mode === "default") {
    items.push(
      { id: "spray", time: "06:00 AM", icon: <Sprout size={16} />, title: "Spray Window Opens", description: humidity < 70 ? "Low wind, good conditions for foliar spray" : "High humidity — delay spraying", relevance: humidity < 70 ? 85 : 60 },
      { id: "irrigation", time: "05:30 PM", icon: <Sprout size={16} />, title: "Irrigation Window", description: "Evening watering reduces evaporation loss", relevance: 65 },
    );
  }

  if (mode === "beach") {
    items.push(
      { id: "tide-high", time: "09:45 AM", icon: <Waves size={16} />, title: "High Tide", description: "2.8m — avoid rocky areas. Great for wave photography.", relevance: 80 },
      { id: "tide-low", time: "03:30 PM", icon: <Waves size={16} />, title: "Low Tide", description: "0.7m — safe for tide pool exploration and shell collecting.", relevance: 70 },
    );
  }

  if (mode === "event_planner") {
    items.push(
      { id: "setup", time: "04:00 PM", icon: <CalendarCheck size={16} />, title: "Setup Window", description: wind < 15 ? "Low wind — safe for canopies and lighting rigs" : "Gusty — secure all structures", relevance: 85 },
      { id: "golden-reception", time: "06:30 PM", icon: <CalendarCheck size={16} />, title: "Reception Start", description: "Pleasant temperature, natural lighting for outdoor ceremony", relevance: 80 },
    );
  }

  // Sort by relevance
  items.sort((a, b) => b.relevance - a.relevance);
  return items.slice(0, 6);
}

export function TodayForYou() {
  const { activeMode, feedback, submitFeedback, hideRecommendation, isHidden, explainRecommendation } = usePersonalization();
  const { currentWeather } = useWeather();

  const items = buildTimeline(activeMode, currentWeather).filter((i) => !isHidden(i.id));

  if (items.length === 0) return null;

  return (
    <div className="px-4 space-y-2">
      <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">Today for You</h3>
      <div className="space-y-2">
        {items.map((item) => {
          const fb = feedback.find((f) => f.id === item.id);
          return (
            <div key={item.id} className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="flex items-start gap-3">
                <div className="text-[#00DDE5] mt-0.5">{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-white/40 font-mono">{item.time}</span>
                    <span className="text-sm font-bold text-white">{item.title}</span>
                  </div>
                  <p className="text-xs text-white/60 mt-0.5">{item.description}</p>
                  <p className="text-[10px] text-white/30 mt-1 italic">{explainRecommendation(item.id)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => submitFeedback(item.id, "up")} className={`p-1 rounded ${fb?.rating === "up" ? "text-emerald-400" : "text-white/20"}`}><ThumbsUp size={12} /></button>
                  <button onClick={() => submitFeedback(item.id, "down")} className={`p-1 rounded ${fb?.rating === "down" ? "text-red-400" : "text-white/20"}`}><ThumbsDown size={12} /></button>
                  <button onClick={() => hideRecommendation(item.id)} className="p-1 rounded text-white/20 hover:text-white/40"><EyeOff size={12} /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
