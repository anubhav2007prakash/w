"use client";

import React from "react";
import { UserCircle, Camera, ShieldCheck } from "lucide-react";
import { getAvatarById } from "@/lib/avatars";
import { UserProfile } from "@/types/auth";

export interface UserAvatarProps {
  user?: UserProfile | null;
  avatarUrl?: string;
  avatarId?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  showEditBadge?: boolean;
  showVerifiedBadge?: boolean;
  onClick?: () => void;
  className?: string;
  ringColor?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  avatarUrl,
  avatarId,
  name,
  size = "md",
  showEditBadge = false,
  showVerifiedBadge = false,
  onClick,
  className = "",
  ringColor,
}) => {
  const finalUrl = avatarUrl !== undefined ? avatarUrl : user?.avatarUrl;
  const finalAvatarId = avatarId !== undefined ? avatarId : user?.avatarId;
  const finalName = name || user?.name || "Citizen";
  const isVerified = user?.isVerified || showVerifiedBadge;

  const preset = getAvatarById(finalAvatarId);

  // Size configurations
  const sizeMap = {
    xs: {
      container: "w-6 h-6 text-xs",
      icon: "w-4 h-4",
      emoji: "text-xs",
      badge: "w-2.5 h-2.5 -bottom-0.5 -right-0.5 p-0.5",
    },
    sm: {
      container: "w-8 h-8 text-xs",
      icon: "w-5 h-5",
      emoji: "text-sm",
      badge: "w-3.5 h-3.5 -bottom-0.5 -right-0.5 p-0.5",
    },
    md: {
      container: "w-10 h-10 text-sm",
      icon: "w-6 h-6",
      emoji: "text-base",
      badge: "w-4 h-4 -bottom-1 -right-1 p-0.5",
    },
    lg: {
      container: "w-12 h-12 text-base",
      icon: "w-8 h-8",
      emoji: "text-xl",
      badge: "w-4 h-4 -bottom-1 -right-1 p-0.5",
    },
    xl: {
      container: "w-16 h-16 text-lg",
      icon: "w-10 h-10",
      emoji: "text-2xl",
      badge: "w-5 h-5 -bottom-1 -right-1 p-1",
    },
    "2xl": {
      container: "w-20 h-20 text-xl",
      icon: "w-12 h-12",
      emoji: "text-3xl",
      badge: "w-6 h-6 bottom-0 right-0 p-1",
    },
    "3xl": {
      container: "w-24 h-24 text-2xl",
      icon: "w-14 h-14",
      emoji: "text-4xl",
      badge: "w-7 h-7 bottom-0.5 right-0.5 p-1.5",
    },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // Fallback initial
  const getInitials = (str: string) => {
    const parts = str.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.slice(0, 2).toUpperCase() || "IM";
  };

  return (
    <div
      onClick={onClick}
      className={`relative shrink-0 rounded-2xl flex items-center justify-center select-none ${
        onClick ? "cursor-pointer active:scale-95 transition-transform" : ""
      } ${className}`}
    >
      {/* 1. Custom Image / PFP Photo */}
      {finalUrl ? (
        <div
          className={`${currentSize.container} rounded-2xl overflow-hidden shadow-md ring-2 ${
            ringColor || "ring-white/30"
          } bg-[#06345C]`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={finalUrl}
            alt={finalName}
            className="w-full h-full object-cover"
          />
        </div>
      ) : preset ? (
        /* 2. Preset Avatar (Emoji + Dynamic Gradient) */
        <div
          className={`${currentSize.container} rounded-2xl bg-gradient-to-tr ${preset.bgGradient} flex items-center justify-center shadow-md ring-2 ${
            ringColor || "ring-white/30"
          }`}
        >
          <span className={`${currentSize.emoji} drop-shadow-sm`}>
            {preset.emoji}
          </span>
        </div>
      ) : (
        /* 3. Default Initial / Icon Fallback */
        <div
          className={`${currentSize.container} rounded-2xl bg-gradient-to-tr from-[#0055A6] to-[#00DDE5] p-0.5 shadow-md ring-2 ${
            ringColor || "ring-white/20"
          }`}
        >
          <div className="w-full h-full bg-[#06345C] rounded-2xl flex items-center justify-center text-white font-bold">
            {finalName ? (
              <span>{getInitials(finalName)}</span>
            ) : (
              <UserCircle className={currentSize.icon} />
            )}
          </div>
        </div>
      )}

      {/* Edit Badge Overlay */}
      {showEditBadge && (
        <div
          className={`absolute ${currentSize.badge} rounded-full bg-[#00DDE5] text-[#06345C] flex items-center justify-center shadow-lg border border-white`}
          title="Change Avatar & Photo"
        >
          <Camera className="w-full h-full" />
        </div>
      )}

      {/* Verified Shield Badge */}
      {!showEditBadge && isVerified && size !== "xs" && (
        <div
          className={`absolute ${currentSize.badge} rounded-full bg-[#8ED329] text-[#06345C] flex items-center justify-center shadow-md border border-white`}
          title="Verified Citizen Profile"
        >
          <ShieldCheck className="w-full h-full stroke-[3]" />
        </div>
      )}
    </div>
  );
};
