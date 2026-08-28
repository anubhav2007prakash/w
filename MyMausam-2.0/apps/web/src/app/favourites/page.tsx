"use client";

import React from "react";
import { Header } from "@/components/Header";
import { useWeather } from "@/context/WeatherContext";
import { Heart, MapPin, Trash2, Plus, Building2, Sun } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FavouritesPage() {
  const { favourites, removeFavouriteLocation, setLocation, openSearch, formatTemp } = useWeather();
  const router = useRouter();

  const defaultCities = [
    { id: 1, location_name: "New Delhi", district: "New Delhi", state: "Delhi", current_temp: 34.5, condition: "Partly Cloudy" },
    { id: 2, location_name: "Mumbai", district: "Mumbai City", state: "Maharashtra", current_temp: 31.0, condition: "Passing Clouds" },
    { id: 3, location_name: "Jaipur", district: "Jaipur", state: "Rajasthan", current_temp: 36.2, condition: "Sunny" },
    { id: 4, location_name: "Shimla", district: "Shimla", state: "Himachal Pradesh", current_temp: 18.5, condition: "Pleasant" },
  ];

  const displayList = favourites.length > 0 ? favourites : defaultCities;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] pb-24 select-none">
      <Header showBack={true} title="Saved Favourites" subtitle="Quick City Access & Comparisons" />

      <div className="p-4 space-y-4">
        {/* Add city button */}
        <button
          onClick={openSearch}
          className="w-full py-3.5 px-4 bg-white/10 hover:bg-white/20 active:scale-[0.98] border border-white/20 rounded-3xl flex items-center justify-center gap-2 text-white font-bold text-xs shadow-lg transition"
        >
          <Plus className="w-4 h-4 text-[#00DDE5]" />
          <span>Add Location to Favourites</span>
        </button>

        {/* List of saved cities */}
        <div className="space-y-2.5">
          {displayList.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-3xl p-4 border border-white/15 shadow-md flex items-center justify-between gap-3"
            >
              <button
                onClick={() => {
                  setLocation(item.location_name);
                  router.push("/");
                }}
                className="flex items-center gap-3 text-left flex-1"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#00DDE5]/20 flex items-center justify-center text-[#00DDE5] shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-sm leading-tight">{item.location_name}</h3>
                  <span className="text-[10px] text-white/60 block mt-0.5">
                    {item.district}, {item.state}
                  </span>
                </div>
              </button>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-lg font-black text-white block leading-tight">
                    {formatTemp(item.current_temp)}
                  </span>
                  <span className="text-[10px] text-[#8ED329] font-medium block">
                    {item.condition}
                  </span>
                </div>

                <button
                  onClick={() => removeFavouriteLocation(item.id)}
                  className="p-2 text-white/40 hover:text-red-400 transition"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
