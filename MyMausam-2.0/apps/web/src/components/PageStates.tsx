"use client";

import React from "react";
import { RefreshCw, AlertTriangle, Inbox } from "lucide-react";

/** Animated loading skeleton cards */
export function LoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card rounded-3xl p-5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-white/10 rounded-full w-1/3" />
            <div className="h-5 bg-white/10 rounded-full w-16" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="h-16 bg-white/5 rounded-2xl" />
            <div className="h-16 bg-white/5 rounded-2xl" />
          </div>
          <div className="h-10 bg-white/5 rounded-xl" />
        </div>
      ))}
    </div>
  );
}

/** Error state with retry button */
export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="glass-card rounded-3xl p-8 border border-[#FF2020]/20 text-center space-y-4">
      <AlertTriangle className="w-10 h-10 mx-auto text-[#FF2020]" />
      <div>
        <h3 className="font-extrabold text-white text-sm">Something went wrong</h3>
        <p className="text-xs text-white/60 mt-1">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2.5 rounded-2xl bg-[#FF2020]/20 text-[#FF2020] font-bold text-xs flex items-center gap-2 mx-auto active:scale-95 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry
        </button>
      )}
    </div>
  );
}

/** Empty state when no data available */
export function EmptyState({
  message,
  icon,
}: {
  message: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="glass-card rounded-3xl p-8 border border-white/10 text-center space-y-3">
      {icon || <Inbox className="w-10 h-10 mx-auto text-white/30" />}
      <p className="text-xs text-white/50">{message}</p>
    </div>
  );
}
