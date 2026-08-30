"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { useWeather } from "@/context/WeatherContext";
import {
  ShieldCheck,
  Bell,
  X,
  Clock,
  AlertTriangle,
  CloudRain,
  Droplets,
  Wind,
  MapPin,
} from "lucide-react";
import { NotificationItem } from "@/types/weather";
import { WeatherAPI } from "@/lib/api";

interface AlertCard {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  severity: "severe" | "high" | "moderate" | "low" | "info";
  timeLabel: string;
  timeValue: string;
  icon: string;
  borderColor: string;
  bgColor: string;
  iconBg: string;
}

const DEFAULT_ALERTS: AlertCard[] = [
  {
    id: 1,
    title: "Heavy Storm Warning",
    subtitle: "3:30–4:30PM • Severe",
    description: "Seek shelter immediately. Strong winds up to 60 km/h expected with heavy thunderstorm and lightning.",
    severity: "severe",
    timeLabel: "Now",
    timeValue: "3:30 PM - 4:30 PM",
    icon: "⚠️",
    borderColor: "#FF2020",
    bgColor: "rgba(255,32,32,0.08)",
    iconBg: "rgba(255,32,32,0.2)",
  },
  {
    id: 2,
    title: "Heavy Rainfall Alert",
    subtitle: "80% chance • Now - 5:45PM",
    description: "Heavy rain expected. Roads may be waterlogged. Carry umbrella.",
    severity: "high",
    timeLabel: "Ongoing",
    timeValue: "Updated 3:22 PM",
    icon: "🌧️",
    borderColor: "#FF6B35",
    bgColor: "rgba(255,107,53,0.08)",
    iconBg: "rgba(255,107,53,0.2)",
  },
  {
    id: 3,
    title: "High Humidity",
    subtitle: "All day • 92% RH",
    description: "Humidity high. Feels warmer than 34°C. Stay hydrated.",
    severity: "moderate",
    timeLabel: "All day",
    timeValue: "Started 9:00 AM",
    icon: "💧",
    borderColor: "#FFBE00",
    bgColor: "rgba(255,190,0,0.08)",
    iconBg: "rgba(255,190,0,0.2)",
  },
  {
    id: 4,
    title: "Air Quality • Moderate",
    subtitle: "AQI 156 • Moderate",
    description: "Moderate air quality. Sensitive individuals may experience discomfort.",
    severity: "info",
    timeLabel: "Updated",
    timeValue: "2:12 PM",
    icon: "🌬️",
    borderColor: "#00DDE5",
    bgColor: "rgba(0,221,229,0.08)",
    iconBg: "rgba(0,221,229,0.2)",
  },
];

export default function NotificationsPage() {
  const { activeLocation } = useWeather();
  const [dismissedIds, setDismissedIds] = useState<Set<number>>(new Set());
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const list = await WeatherAPI.getNotifications();
        setNotifications(list);
      } catch (err) {
        console.warn("Notifications fallback:", err);
      }
    }
    loadNotifications();
  }, []);

  const visibleAlerts = DEFAULT_ALERTS.filter((a) => !dismissedIds.has(a.id));
  const activeCount = visibleAlerts.length;

  const handleDismiss = (id: number) => {
    setDismissedIds((prev) => new Set(prev).add(id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d2847] to-[#061a2e] pb-24 select-none">
      <Header showBack={true} title="Stormy Sunday" subtitle={`${activeLocation}, India • Sunday, 24 Nov`} />

      <div className="p-4 space-y-4 max-w-[480px] mx-auto">
        {/* Alerts Header */}
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-black text-white">Alerts</h2>
          {activeCount > 0 && (
            <span className="px-3 py-1.5 rounded-full bg-[#FFBE00]/15 border border-[#FFBE00]/30 text-[11px] font-bold text-[#FFBE00] flex items-center gap-1.5">
              <span className="text-base">🔔</span>
              {activeCount} Active
            </span>
          )}
        </div>

        {/* Alert Cards */}
        <div className="space-y-3">
          {visibleAlerts.map((alert) => (
            <div
              key={alert.id}
              className="rounded-2xl p-4 border border-white/10 backdrop-blur-xl relative overflow-hidden transition-all"
              style={{
                borderLeftWidth: "4px",
                borderLeftColor: alert.borderColor,
                backgroundColor: alert.bgColor,
              }}
            >
              {/* Dismiss button */}
              <button
                onClick={() => handleDismiss(alert.id)}
                className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[10px] font-bold text-white/70 flex items-center gap-1 transition"
              >
                <X className="w-3 h-3" />
                Dismiss
              </button>

              <div className="flex gap-3">
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                  style={{ backgroundColor: alert.iconBg }}
                >
                  {alert.icon}
                </div>

                {/* Content */}
                <div className="flex-1 pr-16">
                  <h3 className="text-sm font-black text-white leading-tight">{alert.title}</h3>
                  <p className="text-[11px] font-bold mt-0.5" style={{ color: alert.borderColor }}>
                    {alert.subtitle}
                  </p>
                  <p className="text-[12px] text-white/75 mt-1.5 leading-relaxed">
                    {alert.description}
                  </p>

                  {/* Time info */}
                  <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-white/50">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{alert.timeLabel} • {alert.timeValue}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {visibleAlerts.length === 0 && (
          <div className="text-center py-12 space-y-3">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto">
              <Bell className="w-8 h-8 text-white/40" />
            </div>
            <h3 className="text-lg font-bold text-white/70">No Active Alerts</h3>
            <p className="text-xs text-white/50">All clear. Weather conditions are normal.</p>
          </div>
        )}
      </div>
    </div>
  );
}
