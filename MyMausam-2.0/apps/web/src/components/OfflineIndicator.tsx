"use client";

import { useState, useEffect } from "react";
import { WifiOff, Wifi } from "lucide-react";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 3000);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!showBanner && isOnline) return null;

  return (
    <div
      className={`fixed top-0 left-1/2 -translate-x-1/2 z-[200] px-4 py-2 rounded-b-xl text-sm font-medium flex items-center gap-2 transition-all duration-300 max-w-[480px] w-full ${
        isOnline
          ? "bg-emerald-500/90 text-white translate-y-0"
          : "bg-amber-500/90 text-black translate-y-0"
      }`}
    >
      {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
      {isOnline ? "Back online — fetching latest data" : "You're offline — showing cached data"}
    </div>
  );
}
