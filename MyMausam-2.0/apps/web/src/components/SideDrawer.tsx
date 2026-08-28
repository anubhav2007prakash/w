"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserCircle,
  Sprout,
  Plane,
  Compass,
  Zap,
  Radio,
  CloudRain,
  Navigation,
  Heart,
  Bell,
  Share2,
  Star,
  HelpCircle,
  Settings,
  X,
  CheckCircle,
  Bot,
  CalendarCheck,
  Sun,
  Sparkles,
  HeartPulse,
  Waves,
  Trophy,
  Thermometer,
  Droplets,
  Eye,
  TrendingUp,
  Wind,
  Mountain,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  CloudLightning,
  BarChart2,
  Satellite,
  Users,
  Leaf,
  LogIn,
  LogOut,
  UserPlus,
  ShieldCheck,
  Camera,
  Smile,
} from "lucide-react";
import { useWeather } from "@/context/WeatherContext";
import { useAuth } from "@/context/AuthContext";
import { UserAvatar } from "@/components/UserAvatar";
import { AvatarPickerModal } from "@/components/AvatarPickerModal";
import { MausamMitraModal } from "@/components/MausamMitraModal";

/* ─────────────────────────────────────────────
   Category data definition
───────────────────────────────────────────── */
interface DrawerItemDef {
  icon: React.ReactNode;
  label: string;
  path?: string;
  action?: () => void;
}

interface CategoryDef {
  id: string;
  label: string;
  icon: React.ReactNode;
  accent: string; // tailwind bg class for header strip
  items: DrawerItemDef[];
}

/* ─────────────────────────────────────────────
   Main SideDrawer
───────────────────────────────────────────── */
export const SideDrawer: React.FC = () => {
  const { isDrawerOpen, closeDrawer } = useWeather();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const router = useRouter();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showRatingModal, setShowRatingModal] = useState<boolean>(false);
  const [showMausamMitra, setShowMausamMitra] = useState<boolean>(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState<boolean>(false);
  const [avatarPickerTab, setAvatarPickerTab] = useState<"presets" | "camera" | "upload">("presets");
  const [rating, setRating] = useState<number>(5);
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleNavigate = (path: string) => {
    closeDrawer();
    router.push(path);
  };

  const handleOpenAI = () => {
    closeDrawer();
    setShowMausamMitra(true);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "IMD Mausam 2.0 Weather App",
          text: "Check current weather, radar, AI farming advisories and rain alerts on IMD Mausam 2.0.",
          url: window.location.origin,
        });
      } catch (err) {}
    } else {
      navigator.clipboard?.writeText(window.location.origin);
      showToast("Link copied to clipboard!");
    }
  };

  const toggleCategory = (id: string) =>
    setOpenCategory((prev) => (prev === id ? null : id));

  /* ── category definitions ── */
  const categories: CategoryDef[] = [
    {
      id: "alerts",
      label: "Alerts & Hazards",
      icon: <AlertTriangle className="w-4 h-4" />,
      accent: "bg-red-50 border-red-100",
      items: [
        {
          icon: <HeartPulse className="w-5 h-5 text-[#f472b6]" />,
          label: "Bio-Meteorology & Health",
          path: "/health-index",
        },
        {
          icon: <Thermometer className="w-5 h-5 text-red-400" />,
          label: "Heat Wave & Cold Wave Alerts",
          path: "/heatwave",
        },
        {
          icon: <Droplets className="w-5 h-5 text-[#00DDE5]" />,
          label: "Urban Flood Nowcast",
          path: "/flood",
        },
        {
          icon: <Zap className="w-5 h-5 text-[#FFBE00]" />,
          label: "Lightning Proximity Alarm",
          path: "/lightning-alarm",
        },
        {
          icon: <Compass className="w-5 h-5 text-[#0055A6]" />,
          label: "Cyclone Tracking",
          path: "/cyclone",
        },
        {
          icon: <CloudRain className="w-5 h-5 text-[#0055A6]" />,
          label: "Rain Alert Nowcast",
          path: "/rain-alert",
        },
      ],
    },
    {
      id: "forecasts",
      label: "Forecasts & Climate",
      icon: <CloudLightning className="w-4 h-4" />,
      accent: "bg-blue-50 border-blue-100",
      items: [
        {
          icon: <Eye className="w-5 h-5 text-blue-300" />,
          label: "Winter Fog & Visibility",
          path: "/winter-fog",
        },
        {
          icon: <TrendingUp className="w-5 h-5 text-[#8ED329]" />,
          label: "Seasonal Climate Outlook",
          path: "/seasonal-outlook",
        },
        {
          icon: <CloudRain className="w-5 h-5 text-[#0055A6]" />,
          label: "All-India Monsoon Tracker",
          path: "/monsoon-tracker",
        },
        {
          icon: <Mountain className="w-5 h-5 text-slate-400" />,
          label: "Mountain & Himalayan Weather",
          path: "/mountain-weather",
        },
      ],
    },
    {
      id: "radar",
      label: "Radar & Nowcast",
      icon: <Satellite className="w-4 h-4" />,
      accent: "bg-cyan-50 border-cyan-100",
      items: [
        {
          icon: <Radio className="w-5 h-5 text-[#0055A6]" />,
          label: "Doppler Radar Map",
          path: "/radar",
        },
        {
          icon: <Navigation className="w-5 h-5 text-[#0055A6]" />,
          label: "Highway Route Weather",
          path: "/route-navigator",
        },
      ],
    },
    {
      id: "specialised",
      label: "Specialised Services",
      icon: <BarChart2 className="w-4 h-4" />,
      accent: "bg-indigo-50 border-indigo-100",
      items: [
        {
          icon: <Wind className="w-5 h-5 text-[#00DDE5]" />,
          label: "Air Quality Deep-Dive (SAFAR)",
          path: "/air-quality",
        },
        {
          icon: <Waves className="w-5 h-5 text-[#00DDE5]" />,
          label: "Marine & Coastal (INCOIS)",
          path: "/marine",
        },
        {
          icon: <Plane className="w-5 h-5 text-[#0055A6]" />,
          label: "Aviation METAR/TAF",
          path: "/aviation",
        },
      ],
    },
    {
      id: "agri",
      label: "Agri & Renewable Energy",
      icon: <Leaf className="w-4 h-4" />,
      accent: "bg-green-50 border-green-100",
      items: [
        {
          icon: <Sprout className="w-5 h-5 text-green-500" />,
          label: "Agromet & Crop Disease",
          path: "/agromet",
        },
        {
          icon: <Sun className="w-5 h-5 text-yellow-400" />,
          label: "Solar Yield Estimator",
          path: "/solar-estimator",
        },
      ],
    },
    {
      id: "community",
      label: "Community & Planning",
      icon: <Users className="w-4 h-4" />,
      accent: "bg-purple-50 border-purple-100",
      items: [
        {
          icon: <Trophy className="w-5 h-5 text-[#8ED329]" />,
          label: "Citizen Science & Clouds",
          path: "/citizen-leaderboard",
        },
        {
          icon: <CalendarCheck className="w-5 h-5 text-[#0055A6]" />,
          label: "Activity & Event Planner",
          path: "/activity-planner",
        },
      ],
    },
    {
      id: "account",
      label: "My Account & Profile",
      icon: <UserCircle className="w-4 h-4" />,
      accent: "bg-gray-50 border-gray-100",
      items: [
        {
          icon: <UserCircle className="w-5 h-5 text-[#0055A6]" />,
          label: "My Profile & Persona",
          path: "/profile",
        },
        {
          icon: <Camera className="w-5 h-5 text-[#00DDE5]" />,
          label: "Take Live Selfie / PFP",
          action: () => {
            if (isAuthenticated) {
              setAvatarPickerTab("camera");
              setShowAvatarPicker(true);
            } else {
              closeDrawer();
              openAuthModal("signin");
            }
          },
        },
        {
          icon: <Smile className="w-5 h-5 text-[#FFBE00]" />,
          label: "Choose Preset Avatar",
          action: () => {
            if (isAuthenticated) {
              setAvatarPickerTab("presets");
              setShowAvatarPicker(true);
            } else {
              closeDrawer();
              openAuthModal("signin");
            }
          },
        },
        ...(isAuthenticated
          ? [
              {
                icon: <LogOut className="w-5 h-5 text-red-500" />,
                label: "Sign Out",
                action: () => {
                  logout();
                  showToast("Signed out from account");
                },
              },
            ]
          : [
              {
                icon: <LogIn className="w-5 h-5 text-blue-600" />,
                label: "Sign In / Login",
                action: () => {
                  closeDrawer();
                  openAuthModal("signin");
                },
              },
              {
                icon: <UserPlus className="w-5 h-5 text-emerald-600" />,
                label: "Register / Sign Up",
                action: () => {
                  closeDrawer();
                  openAuthModal("signup");
                },
              },
            ]),
        {
          icon: <Heart className="w-5 h-5 text-rose-400" />,
          label: "Saved Favourites",
          path: "/favourites",
        },
        {
          icon: <Bell className="w-5 h-5 text-gray-500" />,
          label: "Weather Warnings Feed",
          path: "/notifications",
        },
        {
          icon: <Share2 className="w-5 h-5 text-gray-500" />,
          label: "Share Mausam 2.0",
          action: handleShare,
        },
        {
          icon: <Star className="w-5 h-5 text-yellow-400" />,
          label: "Rate App",
          action: () => setShowRatingModal(true),
        },
        {
          icon: <HelpCircle className="w-5 h-5 text-gray-500" />,
          label: "IMD Meteorological FAQ",
          path: "/faq",
        },
        {
          icon: <Settings className="w-5 h-5 text-gray-500" />,
          label: "Settings & Units",
          path: "/settings",
        },
      ],
    },
  ];

  return (
    <>
      <MausamMitraModal isOpen={showMausamMitra} onClose={() => setShowMausamMitra(false)} />
      <AvatarPickerModal
        isOpen={showAvatarPicker}
        onClose={() => setShowAvatarPicker(false)}
        initialTab={avatarPickerTab}
      />

      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#06345C] text-white px-4 py-2 rounded-xl text-sm shadow-xl flex items-center gap-2 border border-white/20 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-[#8ED329]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-gray-900 w-full max-w-xs rounded-3xl p-5 shadow-2xl animate-scale-up">
            <h3 className="text-lg font-bold text-[#0055A6]">Rate IMD Mausam 2.0</h3>
            <p className="text-xs text-gray-600 mt-1">
              How would you rate your weather forecast experience?
            </p>
            <div className="flex justify-center gap-2 my-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-yellow-400 hover:scale-110 transition active:scale-95"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating ? "fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowRatingModal(false)}
                className="px-3 py-1.5 text-xs text-gray-600 font-medium hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowRatingModal(false);
                  showToast("Thank you for your feedback!");
                }}
                className="px-4 py-1.5 text-xs bg-[#0055A6] text-white font-medium rounded-lg hover:bg-[#004586]"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isDrawerOpen && (
        <div
          onClick={closeDrawer}
          className="fixed inset-0 z-40 bg-black/60 transition-opacity backdrop-blur-xs"
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[74%] max-w-[310px] bg-white text-gray-800 shadow-2xl rounded-r-3xl flex flex-col transition-transform duration-300 ease-out overflow-y-auto ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-b from-blue-100/70 to-white border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div
              onClick={() => {
                if (isAuthenticated) setShowAvatarPicker(true);
                else {
                  closeDrawer();
                  openAuthModal("signin");
                }
              }}
              className="cursor-pointer group"
              title={isAuthenticated ? "Change Avatar & PFP" : "Sign In"}
            >
              <UserAvatar
                user={user}
                size="lg"
                showEditBadge={isAuthenticated}
                className="group-hover:scale-105 transition"
              />
            </div>

            <div className="flex-1 truncate">
              <div className="flex items-center gap-1.5">
                <h2 className="text-[15px] font-bold text-gray-900 leading-tight truncate">
                  {isAuthenticated && user ? user.name : "Guest Citizen"}
                </h2>
                {isAuthenticated && <ShieldCheck className="w-3.5 h-3.5 text-[#0055A6] shrink-0" />}
              </div>
              <p className="text-[11px] text-gray-500 truncate">
                {isAuthenticated && user ? user.email : "IMD National Citizen Services"}
              </p>
            </div>

            <button
              onClick={closeDrawer}
              aria-label="Close Drawer"
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Profile/Login CTA pill */}
          <div className="mt-3">
            {isAuthenticated && user ? (
              <div className="flex items-center justify-between bg-blue-50/80 rounded-xl px-2.5 py-1.5 border border-blue-100 text-[11px]">
                <span className="font-semibold text-[#0055A6] flex items-center gap-1 truncate">
                  <span className="w-2 h-2 rounded-full bg-[#8ED329]" />
                  {user.badge || user.persona.toUpperCase()}
                </span>
                <button
                  onClick={() => handleNavigate("/profile")}
                  className="font-bold text-[#0055A6] hover:underline"
                >
                  Manage ›
                </button>
              </div>
            ) : (
              <div className="flex gap-1.5">
                <button
                  onClick={() => {
                    closeDrawer();
                    openAuthModal("signin");
                  }}
                  className="flex-1 py-1.5 rounded-xl bg-[#0055A6] text-white font-bold text-[11px] hover:bg-[#004586] transition shadow-xs flex items-center justify-center gap-1"
                >
                  <LogIn className="w-3 h-3" />
                  Sign In
                </button>
                <button
                  onClick={() => {
                    closeDrawer();
                    openAuthModal("signup");
                  }}
                  className="flex-1 py-1.5 rounded-xl bg-gray-100 text-gray-800 font-bold text-[11px] hover:bg-gray-200 transition flex items-center justify-center gap-1"
                >
                  <UserPlus className="w-3 h-3" />
                  Register
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mausam Mitra AI — pinned hero button */}
        <button
          onClick={handleOpenAI}
          className="w-full px-4 py-2.5 flex items-center justify-between text-left bg-blue-50/80 hover:bg-blue-100 transition-colors border-b border-blue-100"
        >
          <div className="flex items-center gap-3">
            <span className="p-1.5 rounded-xl bg-[#0055A6] text-white">
              <Bot className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[14px] font-bold text-[#0055A6] block leading-none">
                Mausam Mitra AI
              </span>
              <span className="text-[10px] text-gray-500 block leading-none mt-1">
                Voice Weather Copilot
              </span>
            </div>
          </div>
          <Sparkles className="w-4 h-4 text-[#FFBE00]" />
        </button>

        {/* Category Accordions */}
        <div className="py-1 flex-1">
          {categories.map((cat) => (
            <CategoryAccordion
              key={cat.id}
              category={cat}
              isOpen={openCategory === cat.id}
              onToggle={() => toggleCategory(cat.id)}
              onNavigate={handleNavigate}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
            IMD Mausam v2.0 • SIH 26076
          </p>
        </div>
      </aside>
    </>
  );
};

/* ─────────────────────────────────────────────
   CategoryAccordion sub-component
───────────────────────────────────────────── */
interface CategoryAccordionProps {
  category: CategoryDef;
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: (path: string) => void;
}

const CategoryAccordion: React.FC<CategoryAccordionProps> = ({
  category,
  isOpen,
  onToggle,
  onNavigate,
}) => {
  return (
    <div className="border-b border-gray-100 last:border-0">
      {/* Category header — click to expand/collapse */}
      <button
        onClick={onToggle}
        className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors ${
          isOpen ? "bg-blue-50/70" : "hover:bg-gray-50"
        }`}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5">
          <span
            className={`p-1.5 rounded-lg transition-colors ${
              isOpen
                ? "bg-[#0055A6] text-white"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {category.icon}
          </span>
          <span
            className={`text-[13px] font-semibold transition-colors ${
              isOpen ? "text-[#0055A6]" : "text-gray-700"
            }`}
          >
            {category.label}
          </span>
        </div>
        <div className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </button>

      {/* Dropdown items */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-gray-50/60 pb-1">
          {category.items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (item.action) item.action();
                else if (item.path) onNavigate(item.path);
              }}
              className="w-full pl-10 pr-4 py-2.5 flex items-center gap-3 text-left hover:bg-blue-50/70 active:bg-blue-100/60 transition-colors"
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="text-[12.5px] font-medium text-gray-700">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   (Legacy DrawerItem kept for any external use)
───────────────────────────────────────────── */
interface DrawerItemProps {
  icon: React.ReactNode;
  label: string;
  extra?: React.ReactNode;
  onClick: () => void;
}

const DrawerItem: React.FC<DrawerItemProps> = ({ icon, label, extra, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full px-4 py-2 flex items-center justify-between text-left text-gray-700 hover:bg-blue-50/60 active:bg-blue-100/70 transition-colors"
    >
      <div className="flex items-center gap-3.5">
        <span className="shrink-0">{icon}</span>
        <span className="text-[13px] font-medium text-gray-800">{label}</span>
      </div>
      {extra && <div>{extra}</div>}
    </button>
  );
};
