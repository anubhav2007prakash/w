"use client";

import React, { useState, useEffect } from "react";
import {
  Menu,
  Search,
  MapPin,
  Compass,
  Volume2,
  VolumeX,
  ChevronLeft,
  Navigation,
  UserCircle,
  LogIn,
} from "lucide-react";
import { useWeather } from "@/context/WeatherContext";
import { useAuth } from "@/context/AuthContext";
import { UserAvatar } from "@/components/UserAvatar";
import { useRouter } from "next/navigation";

interface HeaderProps {
  showBack?: boolean;
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ showBack, title, subtitle }) => {
  const [mounted, setMounted] = useState(false);
  const {
    activeLocation,
    activeDate,
    toggleDrawer,
    openSearch,
    isSpeaking,
    speakWeatherForecast,
    stopSpeaking,
    detectUserLocation,
  } = useWeather();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render a placeholder on server / during hydration to avoid mismatch
  if (!mounted) {
    return (
      <header className="px-4 pt-3 pb-2 flex items-center justify-between sticky top-0 z-30 bg-[#0055A6]/70 backdrop-blur-md border-b border-white/10 select-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 animate-pulse" />
          <div>
            <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
            <div className="h-3 w-16 bg-white/10 rounded animate-pulse mt-1" />
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-9 h-9 rounded-2xl bg-white/10 animate-pulse" />
          <div className="w-9 h-9 rounded-2xl bg-white/10 animate-pulse" />
          <div className="w-9 h-9 rounded-2xl bg-white/10 animate-pulse" />
        </div>
      </header>
    );
  }

  const handleProfileClick = () => {
    if (isAuthenticated) {
      router.push("/profile");
    } else {
      openAuthModal("signin");
    }
  };

  if (showBack) {
    return (
      <header className="px-4 py-3 bg-[#0055A6]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between border-b border-white/10 select-none">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-2xl glass-button flex items-center justify-center text-white active:scale-95 transition"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-black text-white leading-none">{title || "IMD Mausam"}</h1>
            {subtitle && (
              <span className="text-[11px] text-white/70 block leading-none mt-1">{subtitle}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleProfileClick}
            className="w-9 h-9 flex items-center justify-center transition active:scale-95"
            title={isAuthenticated ? `Profile (${user?.name})` : "Sign In / Register"}
            aria-label="User Profile"
          >
            {isAuthenticated ? (
              <UserAvatar user={user} size="sm" ringColor="ring-[#00DDE5]/50" />
            ) : (
              <div className="w-9 h-9 rounded-2xl glass-button flex items-center justify-center text-white/80 hover:text-white">
                <LogIn className="w-4 h-4" />
              </div>
            )}
          </button>
          <button
            onClick={openSearch}
            className="w-9 h-9 rounded-2xl glass-button flex items-center justify-center text-white active:scale-95 transition"
            aria-label="Search City"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className="px-4 pt-3 pb-2 flex items-center justify-between sticky top-0 z-30 bg-[#0055A6]/70 backdrop-blur-md border-b border-white/10 select-none">
      {/* Left Menu & Location */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleDrawer}
          className="w-10 h-10 rounded-2xl glass-button flex items-center justify-center text-white active:scale-95 transition"
          aria-label="Open Navigation Drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <button
            onClick={openSearch}
            className="flex items-center gap-1.5 text-left group transition-all"
          >
            <MapPin className="w-4 h-4 text-[#FFBE00] shrink-0" />
            <h1 className="text-base font-black text-white leading-tight group-hover:underline flex items-center gap-1">
              <span className="truncate max-w-[150px] sm:max-w-[190px]">{activeLocation}</span>
            </h1>
          </button>
          <p className="text-[11px] text-white/75 leading-none mt-0.5">{activeDate}</p>
        </div>
      </div>

      {/* Right Controls (GPS + Search + TTS Audio Broadcast + User Auth) */}
      <div className="flex items-center gap-1.5">
        {/* GPS Current Location Detector */}
        <button
          onClick={detectUserLocation}
          title="Detect Current GPS Location"
          className="w-9 h-9 rounded-2xl glass-button flex items-center justify-center text-white/90 hover:text-white active:scale-95 transition"
          aria-label="GPS Detect"
        >
          <Navigation className="w-4 h-4 text-[#00DDE5]" />
        </button>

        {/* TTS Audio Broadcast */}
        <button
          onClick={isSpeaking ? stopSpeaking : speakWeatherForecast}
          title={isSpeaking ? "Stop Audio Broadcast" : "Listen to Weather Broadcast"}
          className={`w-9 h-9 rounded-2xl glass-button flex items-center justify-center transition active:scale-95 ${
            isSpeaking ? "bg-[#FFBE00] text-[#06345C] ring-2 ring-yellow-400/50 animate-pulse" : "text-white"
          }`}
          aria-label="Audio Forecast"
        >
          {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#FFBE00]" />}
        </button>

        {/* Search Modal Trigger */}
        <button
          onClick={openSearch}
          title="Search Cities across India"
          className="w-9 h-9 rounded-2xl glass-button flex items-center justify-center text-white active:scale-95 transition"
          aria-label="Search Locations"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* User Auth Profile / Login Button */}
        <button
          onClick={handleProfileClick}
          title={isAuthenticated ? `Profile (${user?.name})` : "Sign In / Register"}
          className="w-9 h-9 flex items-center justify-center transition active:scale-95"
          aria-label="User Profile or Login"
        >
          {isAuthenticated ? (
            <UserAvatar user={user} size="sm" ringColor="ring-[#00DDE5]/50" />
          ) : (
            <div className="w-9 h-9 rounded-2xl glass-button flex items-center justify-center text-white/90 hover:text-white">
              <LogIn className="w-4 h-4" />
            </div>
          )}
        </button>
      </div>
    </header>
  );
};
