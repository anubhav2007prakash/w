"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Bell, ShieldAlert, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { NotificationItem } from "@/types/weather";
import { WeatherAPI } from "@/lib/api";

export default function NotificationsPage() {
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

  const defaultNotifications: NotificationItem[] = [
    {
      id: 1,
      title: "Yellow Heat Warning • North-West Plains",
      description: "Day maximum temperatures likely to rise by 2–3°C over parts of Rajasthan, UP and Delhi NCR. High humidity in afternoon.",
      category: "Heat Wave",
      severity: "Moderate",
      area: "Delhi NCR, UP, Haryana",
      timestamp: "35 mins ago",
      is_read: false,
    },
    {
      id: 2,
      title: "Lightning Strike Activity Alert",
      description: "Convective cloud formation detected over South-East UP. Lightning risk elevated for farmers working in open fields.",
      category: "Lightning",
      severity: "Warning",
      area: "Eastern Uttar Pradesh",
      timestamp: "2 hours ago",
      is_read: false,
    },
    {
      id: 3,
      title: "All-India Monsoon Normal Progress Bulletin",
      description: "Southwest Monsoon has covered 100% of Indian landmass. Active rainfall spells over Central and Western Ghat regions.",
      category: "Monsoon",
      severity: "Advisory",
      area: "National",
      timestamp: "5 hours ago",
      is_read: true,
    },
  ];

  const items = notifications.length > 0 ? notifications : defaultNotifications;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="Weather Warnings Feed" subtitle="National Early Warning Dispatches" />

      <div className="p-4 space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="glass-card rounded-3xl p-4.5 border border-white/15 shadow-md space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#FFBE00] shrink-0" />
                <h3 className="font-extrabold text-white text-sm leading-tight">{item.title}</h3>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-yellow-500/20 text-[#FFBE00] shrink-0">
                {item.severity}
              </span>
            </div>

            <p className="text-xs text-white/80 leading-relaxed">{item.description}</p>

            <div className="flex items-center justify-between text-[10px] text-white/50 pt-1 border-t border-white/10">
              <span>{item.area}</span>
              <span>{item.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
