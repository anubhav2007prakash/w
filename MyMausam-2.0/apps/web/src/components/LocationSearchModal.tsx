"use client";

import React, { useState, useEffect } from "react";
import { Search, MapPin, X, Navigation, History, Star, Building2 } from "lucide-react";
import { useWeather } from "@/context/WeatherContext";
import { LocationItem } from "@/types/weather";
import { WeatherAPI } from "@/lib/api";

const TOP_METRO_HUBS = [
  "New Delhi",
  "Mumbai",
  "Bengaluru",
  "Kolkata",
  "Chennai",
  "Hyderabad",
  "Jaipur",
  "Pune",
  "Ahmedabad",
  "Chandigarh",
];

export const LocationSearchModal: React.FC = () => {
  const { isSearchOpen, closeSearch, setLocation, detectUserLocation } = useWeather();
  const [searchQuery, setSearchQuery] = useState("");
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<LocationItem[]>([]);

  useEffect(() => {
    async function loadAllLocations() {
      try {
        const list = await WeatherAPI.getLocations();
        setLocations(list);
        setFilteredLocations(list);
      } catch (err) {
        console.warn("Location list fallback:", err);
      }
    }
    if (isSearchOpen) {
      loadAllLocations();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredLocations(locations);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredLocations(
        locations.filter(
          (loc) =>
            loc.name.toLowerCase().includes(q) ||
            loc.district.toLowerCase().includes(q) ||
            loc.state.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, locations]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 select-none">
      <div className="bg-gradient-to-b from-[#0055A6] via-[#00488f] to-[#062b4c] text-white w-full max-w-[440px] h-[80vh] max-h-[620px] rounded-3xl shadow-2xl border border-white/20 flex flex-col overflow-hidden animate-scale-up">
        {/* Search Header */}
        <div className="p-4 bg-black/20 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#FFBE00]" />
            <h2 className="font-extrabold text-sm text-white">Select City or District</h2>
          </div>
          <button
            onClick={closeSearch}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-3.5 bg-black/15 border-b border-white/10 flex items-center gap-2 shrink-0">
          <div className="flex-1 bg-white/10 border border-white/15 rounded-2xl px-3 py-2.5 flex items-center gap-2">
            <Search className="w-4 h-4 text-white/60 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city, district or state..."
              autoFocus
              className="flex-1 bg-transparent text-xs text-white placeholder-white/50 focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-white/60 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => {
              detectUserLocation();
              closeSearch();
            }}
            title="Use current GPS location"
            className="w-10 h-10 rounded-2xl bg-[#00DDE5] hover:bg-[#00c5cc] active:scale-95 text-[#06345C] font-bold flex items-center justify-center transition shrink-0 shadow-lg"
          >
            <Navigation className="w-4 h-4" />
          </button>
        </div>

        {/* Top Metro Hub Quick Chips */}
        <div className="p-3 bg-white/5 border-b border-white/10 shrink-0 space-y-1.5">
          <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider block">
            Top Indian Metro Hubs
          </span>
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
            {TOP_METRO_HUBS.map((metro) => (
              <button
                key={metro}
                onClick={() => setLocation(metro)}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white text-[11px] font-medium shrink-0 border border-white/10 transition"
              >
                {metro}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 p-2 overflow-y-auto space-y-1">
          {filteredLocations.length > 0 ? (
            filteredLocations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setLocation(loc.name, loc.latitude, loc.longitude)}
                className="w-full p-2.5 rounded-2xl hover:bg-white/10 active:scale-[0.99] text-left transition flex items-center justify-between gap-2 border border-white/5"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#00DDE5] shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-white block leading-tight">{loc.name}</span>
                    <span className="text-[10px] text-white/60 block leading-tight mt-0.5">
                      {loc.district}, {loc.state}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-white/40 font-mono">
                  {loc.latitude.toFixed(2)}°, {loc.longitude.toFixed(2)}°
                </span>
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-white/60 text-xs">
              No matching locations found for "{searchQuery}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
