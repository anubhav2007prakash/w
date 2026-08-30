"use client";

import React, { useState, useMemo, useCallback } from "react";
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
  Activity,
  MapPin,
} from "lucide-react";
import { useWeather } from "@/context/WeatherContext";
import { useAuth } from "@/context/AuthContext";
import { usePersonalization } from "@/context/PersonalizationContext";
import { UserAvatar } from "@/components/UserAvatar";
import { AvatarPickerModal } from "@/components/AvatarPickerModal";
import { MausamMitraModal } from "@/components/MausamMitraModal";
import { FeedbackRatingModal } from "@/components/FeedbackRatingModal";
import { getGeographicContext, GeographicContext } from "@/lib/geographic-context";

// ─── Types ──────────────────────────────────────────────────────

interface DrawerItemDef {
  icon: React.ReactNode;
  label: string;
  path?: string;
  actionId?: string;
  action?: () => void;
  /** Personas that see this item. Empty = never show (must be explicitly universal) */
  personas?: string[];
  /** Geographic conditions required. Empty = no geo requirement */
  geo?: string[];
  /** If true, item always shows regardless of persona/geo */
  universal?: boolean;
}

interface CategoryDef {
  id: string;
  label: string;
  icon: React.ReactNode;
  items: DrawerItemDef[];
  /** Category-level persona filter. If set, category only shows for these personas */
  personas?: string[];
  /** If true, category always shows (Account) */
  universal?: boolean;
}

// ─── Eligibility Engine ─────────────────────────────────────────

function isGeoMatch(geoTags: string[], ctx: GeographicContext | null): boolean {
  if (!geoTags.length) return true; // No geo requirement = always matches
  if (!ctx) return false;
  for (const tag of geoTags) {
    if (tag === "coastal" && ctx.coastal_status) return true;
    if (tag === "cyclone" && ctx.cyclone_exposure) return true;
    if (tag === "flood" && ctx.flood_exposure) return true;
    if (tag === "fog" && ctx.fog_prone) return true;
    if (tag === "frost" && ctx.frost_prone) return true;
    if (tag === "mountain" && ctx.mountain_region) return true;
    if (tag === "snow" && ctx.snow_prone) return true;
    if (tag === "heat" && ctx.heat_exposure) return true;
    if (tag === "desert" && ctx.desert_region) return true;
  }
  return false;
}

function isItemEligible(
  item: DrawerItemDef,
  persona: string,
  geo: GeographicContext | null
): boolean {
  // Universal items always show
  if (item.universal) return true;

  // Items with NO persona AND NO geo tags are hidden by default
  // (they were the "shown to everyone" problem)
  if (!item.personas?.length && !item.geo?.length) return false;

  // Check persona match
  const personaMatch = !item.personas?.length || item.personas.includes(persona);

  // Check geo match
  const geoMatch = isGeoMatch(item.geo || [], geo);

  // Both must match if both are specified
  if (item.personas?.length && item.geo?.length) {
    return personaMatch && geoMatch;
  }
  // If only persona specified, just check persona
  if (item.personas?.length) return personaMatch;
  // If only geo specified, just check geo
  if (item.geo?.length) return geoMatch;

  return false;
}

function filterCategories(
  categories: CategoryDef[],
  persona: string,
  geo: GeographicContext | null
): CategoryDef[] {
  return categories
    .map((cat) => {
      // Universal categories always show
      if (cat.universal) return cat;

      // Category-level persona filter
      if (cat.personas?.length && !cat.personas.includes(persona)) {
        return { ...cat, items: [] };
      }

      // Filter items
      const eligibleItems = cat.items.filter((item) =>
        isItemEligible(item, persona, geo)
      );

      return { ...cat, items: eligibleItems };
    })
    .filter((cat) => cat.items.length > 0 || cat.universal);
}

// ─── Category Definitions ───────────────────────────────────────

function buildCategories(): CategoryDef[] {
  return [
    {
      id: "alerts",
      label: "Alerts & Hazards",
      icon: <AlertTriangle className="w-4 h-4" />,
      personas: ["health", "fitness", "farmer", "commuter", "traveler", "family", "beach", "event_planner"],
      items: [
        {
          icon: <HeartPulse className="w-5 h-5 text-[#f472b6]" />,
          label: "Bio-Meteorology & Health",
          path: "/health-index",
          personas: ["health"],
        },
        {
          icon: <Thermometer className="w-5 h-5 text-red-400" />,
          label: "Heat Wave & Cold Wave Alerts",
          path: "/heatwave",
          personas: ["health", "farmer", "commuter"],
          geo: ["heat", "frost"],
        },
        {
          icon: <Droplets className="w-5 h-5 text-[#00DDE5]" />,
          label: "Urban Flood Nowcast",
          path: "/flood",
          personas: ["commuter", "family"],
          geo: ["flood"],
        },
        {
          icon: <Zap className="w-5 h-5 text-[#FFBE00]" />,
          label: "Lightning Proximity Alarm",
          path: "/lightning-alarm",
          personas: ["health", "fitness", "farmer", "family"],
        },
        {
          icon: <Compass className="w-5 h-5 text-[#0055A6]" />,
          label: "Cyclone Tracking",
          path: "/cyclone",
          personas: ["traveler", "family", "farmer", "beach"],
          geo: ["cyclone", "coastal"],
        },
        {
          icon: <CloudRain className="w-5 h-5 text-[#0055A6]" />,
          label: "Rain Alert Nowcast",
          path: "/rain-alert",
          personas: ["farmer", "commuter", "family", "event_planner"],
        },
      ],
    },
    {
      id: "forecasts",
      label: "Forecasts & Climate",
      icon: <CloudLightning className="w-4 h-4" />,
      personas: ["health", "fitness", "farmer", "commuter", "traveler", "family", "beach", "event_planner"],
      items: [
        {
          icon: <Eye className="w-5 h-5 text-blue-300" />,
          label: "Winter Fog & Visibility",
          path: "/winter-fog",
          personas: ["commuter", "traveler", "family"],
          geo: ["fog"],
        },
        {
          icon: <TrendingUp className="w-5 h-5 text-[#8ED329]" />,
          label: "Seasonal Climate Outlook",
          path: "/seasonal-outlook",
          personas: ["farmer", "event_planner"],
        },
        {
          icon: <CloudRain className="w-5 h-5 text-[#0055A6]" />,
          label: "All-India Monsoon Tracker",
          path: "/monsoon-tracker",
          personas: ["farmer"],
        },
        {
          icon: <Mountain className="w-5 h-5 text-slate-400" />,
          label: "Mountain & Himalayan Weather",
          path: "/mountain-weather",
          personas: ["traveler", "commuter"],
          geo: ["mountain", "snow"],
        },
      ],
    },
    {
      id: "radar",
      label: "Radar & Nowcast",
      icon: <Satellite className="w-4 h-4" />,
      personas: ["commuter", "traveler", "farmer", "family"],
      items: [
        {
          icon: <Radio className="w-5 h-5 text-[#0055A6]" />,
          label: "Doppler Radar Map",
          path: "/radar",
          personas: ["commuter", "traveler", "farmer", "family"],
        },
        {
          icon: <Navigation className="w-5 h-5 text-[#0055A6]" />,
          label: "Highway Route Weather",
          path: "/route-navigator",
          personas: ["commuter", "traveler"],
        },
      ],
    },
    {
      id: "specialised",
      label: "Specialised Services",
      icon: <BarChart2 className="w-4 h-4" />,
      personas: ["health", "fitness", "traveler", "beach", "commuter", "event_planner"],
      items: [
        {
          icon: <Wind className="w-5 h-5 text-[#00DDE5]" />,
          label: "Air Quality Deep-Dive (SAFAR)",
          path: "/air-quality",
          personas: ["health", "fitness", "commuter"],
        },
        {
          icon: <Waves className="w-5 h-5 text-[#00DDE5]" />,
          label: "Marine & Coastal (INCOIS)",
          path: "/marine",
          personas: ["beach", "traveler"],
          geo: ["coastal"],
        },
        {
          icon: <Plane className="w-5 h-5 text-[#0055A6]" />,
          label: "Aviation METAR/TAF",
          path: "/aviation",
          personas: ["traveler"],
        },
      ],
    },
    {
      id: "agri",
      label: "Agri & Renewable Energy",
      icon: <Leaf className="w-4 h-4" />,
      personas: ["farmer"],
      items: [
        {
          icon: <Sprout className="w-5 h-5 text-green-500" />,
          label: "Agromet & Crop Disease",
          path: "/agromet",
          personas: ["farmer"],
        },
        {
          icon: <Sun className="w-5 h-5 text-yellow-400" />,
          label: "Solar Yield Estimator",
          path: "/solar-estimator",
          personas: ["farmer", "event_planner"],
        },
      ],
    },
    {
      id: "community",
      label: "Community & Planning",
      icon: <Users className="w-4 h-4" />,
      personas: ["event_planner", "fitness", "family", "traveler"],
      items: [
        {
          icon: <Trophy className="w-5 h-5 text-[#8ED329]" />,
          label: "Citizen Science & Clouds",
          path: "/citizen-leaderboard",
          personas: ["health", "fitness"],
        },
        {
          icon: <CalendarCheck className="w-5 h-5 text-[#0055A6]" />,
          label: "Activity & Event Planner",
          path: "/activity-planner",
          personas: ["event_planner", "fitness", "family"],
        },
      ],
    },
    {
      id: "energy",
      label: "Energy & Carbon",
      icon: <Zap className="w-4 h-4" />,
      personas: ["fitness", "event_planner", "farmer"],
      items: [
        {
          icon: <Zap className="w-5 h-5 text-[#FFBE00]" />,
          label: "Weather × Energy Correlation",
          path: "/energy/weather-correlation",
          personas: ["event_planner"],
        },
        {
          icon: <Droplets className="w-5 h-5 text-[#38bdf8]" />,
          label: "Flood Impact on Energy Grid",
          path: "/energy/flood-impact",
          personas: ["commuter"],
          geo: ["flood"],
        },
        {
          icon: <Leaf className="w-5 h-5 text-[#22c55e]" />,
          label: "Daily Carbon Footprint",
          path: "/energy/carbon-footprint",
          personas: ["fitness", "commuter"],
        },
        {
          icon: <Activity className="w-5 h-5 text-[#a78bfa]" />,
          label: "Carbon Dashboard & Leaderboard",
          path: "/energy/carbon-dashboard",
          personas: ["fitness"],
        },
        {
          icon: <Sun className="w-5 h-5 text-[#FFBE00]" />,
          label: "Climate-Energy Trends",
          path: "/energy/climate-trends",
          personas: ["farmer", "event_planner"],
        },
      ],
    },
    {
      id: "account",
      label: "My Account & Profile",
      icon: <UserCircle className="w-4 h-4" />,
      universal: true,
      items: [
        { icon: <UserCircle className="w-5 h-5 text-[#0055A6]" />, label: "My Profile & Persona", path: "/profile", universal: true },
        { icon: <Sparkles className="w-5 h-5 text-[#00DDE5]" />, label: "Personalization Settings", path: "/personalization", universal: true },
        { icon: <Heart className="w-5 h-5 text-rose-400" />, label: "Saved Favourites", path: "/favourites", universal: true },
        { icon: <Bell className="w-5 h-5 text-gray-500" />, label: "Weather Warnings Feed", path: "/notifications", universal: true },
        { icon: <Settings className="w-5 h-5 text-gray-500" />, label: "Settings & Units", path: "/settings", universal: true },
        { icon: <Star className="w-5 h-5 text-[#FFBE00]" />, label: "Rate & Feedback", actionId: "rate", universal: true },
        { icon: <Share2 className="w-5 h-5 text-[#00DDE5]" />, label: "Share App", actionId: "share", universal: true },
        { icon: <HelpCircle className="w-5 h-5 text-gray-500" />, label: "IMD Meteorological FAQ", path: "/faq", universal: true },
      ],
    },
  ];
}

// ─── Main SideDrawer ────────────────────────────────────────────

export const SideDrawer: React.FC = () => {
  const { isDrawerOpen, closeDrawer, activeLat, activeLon, activeLocation, activePersona } = useWeather();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const { userLocation } = usePersonalization();
  const router = useRouter();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showRatingModal, setShowRatingModal] = useState<boolean>(false);
  const [showMausamMitra, setShowMausamMitra] = useState<boolean>(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState<boolean>(false);
  const [avatarPickerTab, setAvatarPickerTab] = useState<"presets" | "camera" | "upload">("presets");
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const persona = activePersona || "health";

  // Geographic context from user location
  const geoContext = useMemo(() => {
    const lat = userLocation?.lat ?? activeLat;
    const lon = userLocation?.lon ?? activeLon;
    if (lat == null || lon == null) return null;
    try {
      return getGeographicContext(lat, lon, userLocation?.name ?? activeLocation);
    } catch {
      return null;
    }
  }, [userLocation?.lat, userLocation?.lon, activeLat, activeLon, activeLocation]);

  // ── TWO-LEVEL FILTERING ──
  // Level 1: Filter items by persona + geography
  // Level 2: Remove categories with zero eligible items
  const categories = useMemo(() => {
    const allCats = buildCategories();
    return filterCategories(allCats, persona, geoContext);
  }, [persona, geoContext]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleNavigate = (path: string) => {
    closeDrawer();
    router.push(path);
  };

  const handleItemAction = (actionId: string) => {
    if (actionId === "rate") {
      closeDrawer();
      setShowRatingModal(true);
      return;
    }
    if (actionId === "share") {
      void handleShare();
    }
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

  const personaDisplayName = useMemo(() => {
    const names: Record<string, string> = {
      health: "Health & Wellness",
      fitness: "Outdoor Fitness",
      beach: "Beach & Marine",
      traveler: "Traveler",
      family: "Family",
      farmer: "Kisan Mitra",
      commuter: "Commuter",
      event_planner: "Event Planner",
    };
    return names[persona] || "Weather Enthusiast";
  }, [persona]);

  return (
    <>
      <MausamMitraModal isOpen={showMausamMitra} onClose={() => setShowMausamMitra(false)} />
      <FeedbackRatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmitted={() => showToast("Thank you for your feedback!")}
      />
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

      {/* Backdrop */}
      {isDrawerOpen && (
        <div onClick={closeDrawer} className="fixed inset-0 z-40 bg-black/60 transition-opacity backdrop-blur-xs" />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[74%] max-w-[310px] bg-[#0a1628]/95 backdrop-blur-xl text-white shadow-2xl rounded-r-3xl flex flex-col transition-transform duration-300 ease-out overflow-y-auto border-r border-white/10 ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-4 bg-white/5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div
              onClick={() => {
                if (isAuthenticated) setShowAvatarPicker(true);
                else { closeDrawer(); openAuthModal("signin"); }
              }}
              className="cursor-pointer group"
              title={isAuthenticated ? "Change Avatar & PFP" : "Sign In"}
            >
              <UserAvatar user={user} size="lg" showEditBadge={isAuthenticated} className="group-hover:scale-105 transition" />
            </div>
            <div className="flex-1 truncate">
              <div className="flex items-center gap-1.5">
                <h2 className="text-[15px] font-bold text-white leading-tight truncate">
                  {isAuthenticated && user ? user.name : "Guest Citizen"}
                </h2>
                {isAuthenticated && <ShieldCheck className="w-3.5 h-3.5 text-[#0055A6] shrink-0" />}
              </div>
              <p className="text-[11px] text-white/50 truncate">
                {isAuthenticated && user ? user.email : "IMD National Citizen Services"}
              </p>
            </div>
            <button onClick={closeDrawer} aria-label="Close Drawer" className="p-1.5 text-white/40 hover:text-white rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile pill */}
          <div className="mt-3">
            {isAuthenticated && user ? (
              <div className="flex items-center justify-between bg-white/5 rounded-xl px-2.5 py-1.5 border border-white/10 text-[11px]">
                <span className="font-semibold text-[#00DDE5] flex items-center gap-1 truncate">
                  <span className="w-2 h-2 rounded-full bg-[#8ED329]" />
                  {personaDisplayName}
                </span>
                <button onClick={() => handleNavigate("/profile")} className="font-bold text-[#FFBE00] hover:underline">Manage ›</button>
              </div>
            ) : (
              <div className="flex gap-1.5">
                <button onClick={() => { closeDrawer(); openAuthModal("signin"); }} className="flex-1 py-1.5 rounded-xl bg-[#FFBE00] text-[#06345C] font-bold text-[11px] hover:bg-[#e6ac00] transition shadow-xs flex items-center justify-center gap-1">
                  <LogIn className="w-3 h-3" /> Sign In
                </button>
                <button onClick={() => { closeDrawer(); openAuthModal("signup"); }} className="flex-1 py-1.5 rounded-xl bg-white/10 text-white font-bold text-[11px] hover:bg-white/15 transition flex items-center justify-center gap-1">
                  <UserPlus className="w-3 h-3" /> Register
                </button>
              </div>
            )}
          </div>

          {/* Geographic context */}
          {geoContext && geoContext.latitude !== 0 && (
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-white/40">
              <MapPin className="w-3 h-3" />
              <span className="truncate">
                {geoContext.city || activeLocation}
                {geoContext.coastal_status && " • Coastal"}
                {geoContext.mountain_region && " • Mountain"}
                {geoContext.fog_prone && " • Fog zone"}
                {geoContext.cyclone_exposure && " • Cyclone coast"}
              </span>
            </div>
          )}
        </div>

        {/* Mausam Mitra AI */}
        <button onClick={handleOpenAI} className="w-full px-4 py-2.5 flex items-center justify-between text-left bg-[#FFBE00]/10 hover:bg-[#FFBE00]/15 transition-colors border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="p-1.5 rounded-xl bg-[#FFBE00] text-[#06345C]"><Bot className="w-4 h-4" /></span>
            <div>
              <span className="text-[14px] font-bold text-[#FFBE00] block leading-none">Mausam Mitra AI</span>
              <span className="text-[10px] text-white/50 block leading-none mt-1">AI Weather Assistant • Online</span>
            </div>
          </div>
          <Sparkles className="w-4 h-4 text-[#FFBE00]" />
        </button>

        {/* Filtered Categories */}
        <div className="py-1 flex-1">
          {categories.map((cat) => (
            <CategoryAccordion
              key={cat.id}
              category={cat}
              isOpen={openCategory === cat.id || (!openCategory && cat.id === categories[0]?.id)}
              onToggle={() => toggleCategory(cat.id)}
              onNavigate={handleNavigate}
              onAction={handleItemAction}
              persona={persona}
              geoContext={geoContext}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-white/5 border-t border-white/10">
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              type="button"
              onClick={() => handleItemAction("rate")}
              className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-[11px] font-semibold text-white"
            >
              <Star className="w-3.5 h-3.5 text-[#FFBE00]" />
              Rate & Feedback
            </button>
            <button
              type="button"
              onClick={() => handleItemAction("share")}
              className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-[11px] font-semibold text-white"
            >
              <Share2 className="w-3.5 h-3.5 text-[#00DDE5]" />
              Share App
            </button>
          </div>
          <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold text-center">IMD MAUSAM V2.0 • SIH 26076</p>
        </div>
      </aside>
    </>
  );
};

// ─── CategoryAccordion ──────────────────────────────────────────

interface CategoryAccordionProps {
  category: CategoryDef;
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: (path: string) => void;
  onAction: (actionId: string) => void;
  persona: string;
  geoContext: GeographicContext | null;
}

const CategoryAccordion: React.FC<CategoryAccordionProps> = ({
  category,
  isOpen,
  onToggle,
  onNavigate,
  onAction,
  persona,
  geoContext,
}) => {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={onToggle}
        className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors ${
          isOpen ? "bg-white/5" : "hover:bg-white/5"
        }`}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5">
          <span className={`p-1.5 rounded-lg transition-colors ${
            isOpen ? "bg-[#FFBE00] text-[#06345C]" : "bg-white/10 text-white/50"
          }`}>
            {category.icon}
          </span>
          <span className={`text-[13px] font-semibold transition-colors ${
            isOpen ? "text-[#FFBE00]" : "text-white/80"
          }`}>
            {category.label}
          </span>
        </div>
        <div className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </button>        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
      }`}>
        <div className="bg-white/5 pb-1">
          {category.items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (item.actionId) onAction(item.actionId);
                else if (item.action) item.action();
                else if (item.path) onNavigate(item.path);
              }}
              className="w-full pl-10 pr-4 py-2.5 flex items-center gap-3 text-left hover:bg-white/5 active:bg-white/10 transition-colors"
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="text-[12.5px] font-medium text-white/80">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
