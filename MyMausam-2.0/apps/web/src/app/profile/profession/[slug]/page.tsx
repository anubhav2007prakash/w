"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Thermometer,
  Zap,
  Activity,
  Users,
  Leaf,
  Eye,
  Cloud,
  Target,
  Gauge,
  FlaskConical,
  FileText,
  UserCheck,
  MapPin,
  Calendar,
  Wind,
  RefreshCw,
  Navigation,
  Star,
  TrendingUp,
  Clock,
} from "lucide-react";

const PROFESSION_DATA: Record<
  string,
  {
    title: string;
    subtitle: string;
    badge?: string;
    bgColor: string;
    metrics: {
      icon: React.ReactNode;
      label: string;
      value: string;
      subtext?: string;
      color?: string;
    }[];
    section?: {
      title: string;
      items?: { icon: React.ReactNode; label: string; value: string }[];
      bullets?: string[];
      activity?: { icon: React.ReactNode; text: string; time: string }[];
    };
    extra?: {
      label: string;
      value: string;
    }[];
  }
> = {
  marathoner: {
    title: "Marathoner Outdoor",
    subtitle: "Profession Detail",
    bgColor: "from-[#1a3a5c] via-[#0d2847] to-[#0a1e3a]",
    metrics: [
      {
        icon: <Thermometer className="w-7 h-7 text-white" />,
        label: "Feels Like",
        value: "88°F",
        subtext: "Real: 82°F • Humidity 62%",
        color: "bg-white/10",
      },
      {
        icon: <Zap className="w-7 h-7 text-yellow-400" />,
        label: "Lightning Risk",
        value: "Moderate",
        subtext: "Storm cells 12mi NW\n— 35% in 30min",
        color: "bg-white/10",
      },
    ],
    section: {
      title: "Outdoor Activity Recommendation",
      items: [
        {
          icon: <Activity className="w-8 h-8 text-[#00DDE5]" />,
          label: "Caution advised.",
          value:
            "Elevated lightning risk nearby.\nConsider postponing run or stay near shelter.",
        },
      ],
    },
    extra: [{ label: "Advice", value: "Stay Alert" }],
  },
  parent: {
    title: "Parent Family",
    subtitle: "Profession Detail",
    bgColor: "from-[#0d2847] via-[#0a1e3a] to-[#061a2e]",
    metrics: [
      {
        icon: <Star className="w-6 h-6 text-[#00DDE5]" />,
        label: "Simple",
        value: "12",
        subtext: "Tasks Done",
        color: "bg-[#00DDE5]/10",
      },
      {
        icon: <Cloud className="w-6 h-6 text-blue-300" />,
        label: "Weather",
        value: "72°F",
        subtext: "Partly Sunny",
        color: "bg-blue-500/10",
      },
      {
        icon: <Users className="w-6 h-6 text-[#00DDE5]" />,
        label: "Kids",
        value: "3",
        subtext: "Profiles Active",
        color: "bg-[#00DDE5]/10",
      },
      {
        icon: <Leaf className="w-6 h-6 text-green-400" />,
        label: "Outdoor",
        value: "5h 20m",
        subtext: "Time Outside",
        color: "bg-green-500/10",
      },
    ],
    section: {
      title: "Profession Detail",
      items: [
        { icon: <UserCheck className="w-5 h-5 text-white/60" />, label: "Role:", value: "Family Coordinator" },
        { icon: <Leaf className="w-5 h-5 text-white/60" />, label: "Focus:", value: "Childcare & Outreach Programs" },
      ],
    },
    extra: [{ label: "Status:", value: "Active" }],
  },
  pilot: {
    title: "Aircraft Pilot",
    subtitle: "Profession Detail",
    bgColor: "from-[#0a1628] via-[#0d2847] to-[#061a2e]",
    metrics: [
      {
        icon: <Eye className="w-7 h-7 text-[#00DDE5]" />,
        label: "Visibility",
        value: "10 km",
        subtext: "Clear — Excellent",
        color: "bg-white/10",
      },
      {
        icon: <Cloud className="w-7 h-7 text-blue-300" />,
        label: "Cloud Ceiling",
        value: "2,500 ft",
        subtext: "BKN at 2500ft",
        color: "bg-white/10",
      },
    ],
    section: {
      title: "Key Responsibilities",
      bullets: [
        "Monitor flight conditions and weather patterns",
        "Communicate with ATC and flight crew",
        "Manage flight safety and protocols",
      ],
    },
  },
  scientist: {
    title: "Scientist Researcher",
    subtitle: "Profession Detail",
    bgColor: "from-[#e8f0f8] via-[#d4e6f5] to-[#c0daf0]",
    metrics: [
      {
        icon: <Target className="w-7 h-7 text-[#0a3d6b]" />,
        label: "Radar",
        value: "85%",
        subtext: "Accuracy",
        color: "bg-white/60",
      },
      {
        icon: <Cloud className="w-7 h-7 text-[#0a3d6b]" />,
        label: "Climate",
        value: "22°C",
        subtext: "Avg Temp",
        color: "bg-white/60",
      },
      {
        icon: <Gauge className="w-7 h-7 text-[#0a3d6b]" />,
        label: "Pressure",
        value: "1013 hPa",
        subtext: "Sea Level",
        color: "bg-white/60",
      },
    ],
    section: {
      title: "Recent Activity",
      activity: [
        {
          icon: <FlaskConical className="w-6 h-6 text-[#0a3d6b]" />,
          text: "Reviewed atmospheric model update",
          time: "Today • 10:32 AM",
        },
        {
          icon: <FileText className="w-6 h-6 text-[#0a3d6b]" />,
          text: "Published climate forecast report",
          time: "Yesterday • 4:10 PM",
        },
      ],
    },
  },
  mausam: {
    title: "Mausam Mitra",
    subtitle: "Profession Detail",
    badge: "Agricultural Professional",
    bgColor: "from-[#e8f4f8] via-[#d4ecf5] to-[#c0e4f0]",
    metrics: [
      {
        icon: <Users className="w-6 h-6 text-[#0a3d6b]" />,
        label: "Community Reports",
        value: "124",
        subtext: "+12 this month ↗",
        color: "bg-white/60",
      },
      {
        icon: <ShieldIcon className="w-6 h-6 text-[#0a3d6b]" />,
        label: "Citizen Score",
        value: "87/100",
        subtext: "Excellent • Top 15%",
        color: "bg-white/60",
      },
    ],
    section: {
      title: "Details",
      items: [
        { icon: <UserCheck className="w-5 h-5 text-[#0a3d6b]" />, label: "Role", value: "Crop Advisor & Weather Volunteer" },
        { icon: <MapPin className="w-5 h-5 text-[#0a3d6b]" />, label: "Location", value: "Pune, Maharashtra • Rural Zone" },
        { icon: <Calendar className="w-5 h-5 text-[#0a3d6b]" />, label: "Active Since", value: "Jan 2023 • 2 years 8 months" },
      ],
    },
  },
  cyclone: {
    title: "Cyclone Hunter",
    subtitle: "Profession Detail",
    bgColor: "from-[#0a1628] via-[#0d2040] to-[#061a2e]",
    metrics: [
      {
        icon: <Wind className="w-7 h-7 text-[#00DDE5]" />,
        label: "Wind Speed",
        value: "85km/h",
        color: "bg-white/10",
      },
      {
        icon: <Gauge className="w-7 h-7 text-[#00DDE5]" />,
        label: "Pressure",
        value: "975 hPa",
        color: "bg-white/10",
      },
      {
        icon: <Target className="w-7 h-7 text-[#00DDE5]" />,
        label: "Eye Distance",
        value: "240km",
        color: "bg-white/10",
      },
      {
        icon: <RefreshCw className="w-7 h-7 text-[#00DDE5]" />,
        label: "Category 1",
        value: "Live Radar",
        subtext: "LIVE",
        color: "bg-white/10",
      },
    ],
    section: {
      title: "Current Tracking • Atlantic Basin",
      items: [],
    },
    extra: [{ label: "", value: "Storm moving NW at 18km/h • Next update in 12min" }],
  },
  doctor: {
    title: "Doctor Health",
    subtitle: "Profession Detail",
    bgColor: "from-[#e8f4f8] via-[#d4ecf5] to-[#c0e4f0]",
    metrics: [
      {
        icon: <Activity className="w-7 h-7 text-[#0a3d6b]" />,
        label: "AQI",
        value: "142",
        subtext: "Unhealthy for Sensitive",
        color: "bg-white/60",
      },
      {
        icon: <Thermometer className="w-7 h-7 text-orange-500" />,
        label: "UV Index",
        value: "6",
        subtext: "High",
        color: "bg-white/60",
      },
      {
        icon: <Leaf className="w-7 h-7 text-green-600" />,
        label: "Pollen",
        value: "High",
        subtext: "Tree & Grass",
        color: "bg-white/60",
      },
      {
        icon: <Thermometer className="w-7 h-7 text-red-500" />,
        label: "Temperature",
        value: "31°C",
        subtext: "Feels like 34°C",
        color: "bg-white/60",
      },
    ],
    section: {
      title: "Health Advisory",
      bullets: [
        "Wear mask if sensitive to air quality",
        "Stay hydrated in high UV conditions",
        "Limit outdoor exposure during peak hours",
      ],
    },
  },
  farmer: {
    title: "Farmer Kisan",
    subtitle: "Profession Detail",
    badge: "Agricultural Professional",
    bgColor: "from-[#e8f4f0] via-[#d4ecd8] to-[#c0e4d0]",
    metrics: [
      {
        icon: <Cloud className="w-7 h-7 text-[#0a3d6b]" />,
        label: "Rainfall",
        value: "12mm",
        subtext: "Last 24h",
        color: "bg-white/60",
      },
      {
        icon: <DropletIcon />,
        label: "Soil Moisture",
        value: "68%",
        subtext: "Optimal",
        color: "bg-white/60",
      },
      {
        icon: <Thermometer className="w-7 h-7 text-orange-500" />,
        label: "Temperature",
        value: "28°C",
        subtext: "Day / 22°C Night",
        color: "bg-white/60",
      },
    ],
    section: {
      title: "Crop Advisory",
      bullets: [
        "Good conditions for wheat sowing",
        "Irrigation recommended in 2 days",
        "Monitor for pest activity",
      ],
    },
  },
};

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function DropletIcon() {
  return (
    <svg className="w-7 h-7 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  );
}

export default function ProfessionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const slug = React.use(params).slug;
  const data = PROFESSION_DATA[slug];

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d2847] to-[#061a2e] flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-lg font-bold">Profession not found</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-6 py-2 bg-[#FFBE00] text-[#06345C] rounded-xl font-bold text-sm"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isLightBg = data.bgColor.includes("e8") || data.bgColor.includes("d4");
  const textColor = isLightBg ? "text-[#0a1e3a]" : "text-white";
  const subtextColor = isLightBg ? "text-[#0a3d6b]/70" : "text-white/60";
  const cardBg = isLightBg
    ? "bg-white/70 border-[#0a3d6b]/15 backdrop-blur-xl"
    : "bg-white/10 border-white/15 backdrop-blur-xl";
  const metricBg = isLightBg ? "bg-white/60 border-white/40" : "bg-white/10 border-white/15";

  return (
    <div
      className={`min-h-screen bg-gradient-to-b ${data.bgColor} pb-24 select-none`}
    >
      {/* Header */}
      <div className="relative px-4 pt-14 pb-6">
        <button
          onClick={() => router.back()}
          className="absolute left-4 top-12 w-10 h-10 rounded-full bg-white/15 border border-white/20 flex items-center justify-center backdrop-blur-md"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className={`text-3xl font-black ${textColor} ml-14`}>
          {data.title}
        </h1>
        <p className={`text-sm ${subtextColor} ml-14 mt-1`}>{data.subtitle}</p>
        {data.badge && (
          <span className="inline-flex items-center gap-1.5 ml-14 mt-2 px-3 py-1.5 rounded-full bg-[#00DDE5]/15 text-[#0a3d6b] text-xs font-bold border border-[#00DDE5]/20">
            🧑‍🌾 {data.badge}
          </span>
        )}
      </div>

      <div className="px-4 space-y-4 max-w-[440px] mx-auto">
        {/* Metrics */}
        <div className={`${cardBg} rounded-3xl p-4 border`}>
          <h2
            className={`text-lg font-black ${textColor} mb-3 flex items-center gap-2`}
          >
            <Navigation className="w-5 h-5" />
            Metrics
          </h2>
          <div
            className={`grid gap-3 ${
              data.metrics.length === 3
                ? "grid-cols-3"
                : "grid-cols-2"
            }`}
          >
            {data.metrics.map((m, i) => (
              <div
                key={i}
                className={`${metricBg} rounded-2xl p-4 border text-center flex flex-col items-center gap-1`}
              >
                {m.icon}
                <span className={`text-xs font-bold ${subtextColor} mt-1`}>
                  {m.label}
                </span>
                <span
                  className={`text-2xl font-black ${
                    m.label.includes("Lightning") || m.label.includes("Risk")
                      ? "text-orange-400"
                      : m.label.includes("Live Radar")
                      ? "text-cyan-400"
                      : textColor
                  }`}
                >
                  {m.value}
                </span>
                {m.subtext && (
                  <span
                    className={`text-[10px] ${subtextColor} whitespace-pre-line text-center leading-tight mt-0.5 ${
                      m.label.includes("Live Radar") ? "text-[#8ED329] font-bold" : ""
                    }`}
                  >
                    {m.subtext}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section */}
        {data.section && (
          <div className={`${cardBg} rounded-3xl p-4 border`}>
            <h2 className={`text-lg font-black ${textColor} mb-3`}>
              {data.section.title}
            </h2>

            {data.section.items && data.section.items.length > 0 && (
              <div className="space-y-3">
                {data.section.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">{item.icon}</div>
                    <div>
                      <span className={`text-sm font-bold ${textColor} block`}>
                        {item.label}
                      </span>
                      <span className={`text-xs ${subtextColor} whitespace-pre-line`}>
                        {item.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {data.section.bullets && (
              <ul className="space-y-2">
                {data.section.bullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className={`text-[#00DDE5] mt-0.5`}>•</span>
                    <span className={`text-sm ${textColor}`}>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}

            {data.section.activity && (
              <div className="space-y-3">
                {data.section.activity.map((act, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">{act.icon}</div>
                    <div>
                      <span className={`text-sm font-bold ${textColor} block`}>
                        {act.text}
                      </span>
                      <span className={`text-xs ${subtextColor}`}>{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Extra Info (e.g., Advice badge or tracking info) */}
        {data.extra && data.extra.length > 0 && (
          <div className={`${cardBg} rounded-3xl p-4 border`}>
            {data.extra.map((e, i) => (
              <div key={i} className="flex items-center gap-2">
                {e.label && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      isLightBg
                        ? "bg-[#FFBE00]/20 text-[#0a3d6b]"
                        : "bg-[#FFBE00]/20 text-[#FFBE00]"
                    }`}
                  >
                    {e.label}: {e.value}
                  </span>
                )}
                {!e.label && (
                  <span className={`text-xs ${subtextColor}`}>{e.value}</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Cyclone Hunter special: Radar visualization placeholder */}
        {slug === "cyclone" && (
          <div className={`${cardBg} rounded-3xl p-4 border`}>
            <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-[#0a1e3a] to-[#061a2e] border border-white/10 flex items-center justify-center">
              {/* Radar circles */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 rounded-full border border-[#00DDE5]/20 absolute" />
                <div className="w-28 h-28 rounded-full border border-[#00DDE5]/30 absolute" />
                <div className="w-16 h-16 rounded-full border border-[#00DDE5]/40 absolute" />
                {/* Cyclone icon */}
                <div className="w-10 h-10 rounded-full bg-[#00DDE5]/20 flex items-center justify-center animate-spin" style={{ animationDuration: "3s" }}>
                  <RefreshCw className="w-6 h-6 text-[#00DDE5]" />
                </div>
              </div>
              {/* Map outline hint */}
              <div className="absolute bottom-2 right-3 text-[10px] text-white/20 font-bold">
                Atlantic Basin
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
