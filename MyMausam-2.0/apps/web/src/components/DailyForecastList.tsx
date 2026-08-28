"use client";

import React from "react";
import {
  Calendar,
  CloudSun,
  Sun,
  CloudRain,
  CloudLightning,
  ChevronRight,
  Droplets,
  Radio,
} from "lucide-react";
import { DailyForecastItem } from "@/types/weather";
import { useWeather } from "@/context/WeatherContext";
import { useRouter } from "next/navigation";

interface DailyForecastListProps {
  forecasts: DailyForecastItem[];
}

export const DailyForecastList: React.FC<DailyForecastListProps> = ({ forecasts }) => {
  const { formatTemp } = useWeather();
  const router = useRouter();

  const getDayIcon = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes("rain")) return <CloudRain className="w-5 h-5 text-[#00DDE5]" />;
    if (c.includes("thunder")) return <CloudLightning className="w-5 h-5 text-[#FFBE00]" />;
    if (c.includes("cloud")) return <CloudSun className="w-5 h-5 text-[#FFBE00]" />;
    return <Sun className="w-5 h-5 text-[#FFBE00]" />;
  };

  const defaultForecasts: DailyForecastItem[] = [
    { date_str: "2026-08-27", date_short: "27 Aug", day_name: "Today", condition: "Partly Cloudy", icon: "cloud-sun", min_temp: 25.9, max_temp: 35.8, rain_probability: 10, humidity: 38 },
    { date_str: "2026-08-28", date_short: "28 Aug", day_name: "Fri", condition: "Overcast", icon: "cloud", min_temp: 26.2, max_temp: 34.5, rain_probability: 25, humidity: 45 },
    { date_str: "2026-08-29", date_short: "29 Aug", day_name: "Sat", condition: "Light Rain", icon: "cloud-rain", min_temp: 24.8, max_temp: 32.1, rain_probability: 65, humidity: 62 },
    { date_str: "2026-08-30", date_short: "30 Aug", day_name: "Sun", condition: "Thunderstorm", icon: "cloud-lightning", min_temp: 23.5, max_temp: 30.8, rain_probability: 80, humidity: 75 },
    { date_str: "2026-08-31", date_short: "31 Aug", day_name: "Mon", condition: "Scattered Rain", icon: "cloud-rain", min_temp: 24.2, max_temp: 31.5, rain_probability: 45, humidity: 60 },
    { date_str: "2026-09-01", date_short: "01 Sep", day_name: "Tue", condition: "Partly Cloudy", icon: "cloud-sun", min_temp: 25.0, max_temp: 33.2, rain_probability: 20, humidity: 50 },
    { date_str: "2026-09-02", date_short: "02 Sep", day_name: "Wed", condition: "Sunny", icon: "sun", min_temp: 25.5, max_temp: 34.8, rain_probability: 10, humidity: 42 },
  ];

  const items = forecasts && forecasts.length > 0 ? forecasts : defaultForecasts;

  return (
    <section className="px-4 py-2 select-none space-y-3">
      {/* Doppler Radar Quick Action Link */}
      <button
        onClick={() => router.push("/radar")}
        className="w-full p-4 rounded-3xl bg-gradient-to-r from-[#0055A6] to-[#062b4c] border border-white/20 shadow-xl flex items-center justify-between hover:border-white/40 active:scale-[0.98] transition group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#00DDE5]/20 flex items-center justify-center text-[#00DDE5] shadow-inner group-hover:rotate-12 transition">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div className="text-left">
            <span className="text-sm font-black text-white block leading-tight">
              Interactive Doppler Weather Radar
            </span>
            <span className="text-[11px] text-white/70 block leading-tight mt-0.5">
              Live Cloud Reflectivity & INSAT-3D Satellite
            </span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-white/60 group-hover:translate-x-1 transition" />
      </button>

      {/* 7-Day Matrix Card */}
      <div className="glass-card rounded-3xl p-4.5 border border-white/20 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#00DDE5]" />
            <h3 className="font-extrabold text-sm text-white">7-Day Meteorological Outlook</h3>
          </div>
          <button
            onClick={() => router.push("/forecast")}
            className="text-[11px] font-bold text-[#00DDE5] hover:underline flex items-center gap-0.5"
          >
            <span>Full Matrix</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 7-Day Rows */}
        <div className="space-y-1.5">
          {items.map((item, idx) => (
            <div
              key={idx}
              onClick={() => router.push(`/forecast?day=${idx}`)}
              className="p-2.5 rounded-2xl hover:bg-white/10 active:scale-[0.99] transition flex items-center justify-between gap-3 text-xs border border-white/5 cursor-pointer"
            >
              {/* Left Day & Icon */}
              <div className="flex items-center gap-2.5 w-28">
                {getDayIcon(item.condition)}
                <div>
                  <span className="font-bold text-white block leading-tight">{item.day_name}</span>
                  <span className="text-[10px] text-white/60 block leading-tight mt-0.2">
                    {item.date_short}
                  </span>
                </div>
              </div>

              {/* Middle Rain probability chip */}
              <div className="flex-1 text-center">
                {item.rain_probability && item.rain_probability > 0 ? (
                  <span className="inline-flex items-center gap-1 text-[10px] text-[#00DDE5] font-bold bg-[#00DDE5]/10 px-2 py-0.5 rounded-full">
                    <Droplets className="w-2.5 h-2.5" />
                    <span>{item.rain_probability}%</span>
                  </span>
                ) : (
                  <span className="text-[10px] text-white/40">Dry</span>
                )}
              </div>

              {/* Right Min - Max temp bar */}
              <div className="flex items-center gap-2 w-28 justify-end">
                <span className="text-white/60 text-[11px]">{formatTemp(item.min_temp)}</span>
                <div className="w-10 h-1.5 rounded-full bg-white/15 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#00DDE5] to-[#FFBE00]"
                    style={{ width: `${Math.min(((item.max_temp - 20) / 25) * 100, 100)}%` }}
                  />
                </div>
                <span className="font-black text-white text-[11px]">{formatTemp(item.max_temp)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
