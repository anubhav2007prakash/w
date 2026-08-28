"use client";

import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = "Unable to connect to IMD meteorological server.",
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-3 select-none">
      <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-400">
        <AlertCircle className="w-6 h-6" />
      </div>
      <p className="text-xs text-white/80 max-w-xs">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-white/15 hover:bg-white/25 active:scale-95 text-white text-xs font-bold rounded-xl border border-white/20 flex items-center gap-1.5 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
};
