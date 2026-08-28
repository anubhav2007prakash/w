"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading meteorological telemetry...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-3 select-none">
      <div className="w-12 h-12 rounded-full border-3 border-white/20 border-t-[#00DDE5] animate-spin flex items-center justify-center">
        <Sparkles className="w-4 h-4 text-[#FFBE00] animate-pulse" />
      </div>
      <p className="text-xs text-white/75 font-medium">{message}</p>
    </div>
  );
};
