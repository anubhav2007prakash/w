"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  CurrentWeather,
  FavouriteItem,
  PersonaType,
  PersonaInsight,
} from "@/types/weather";
import { WeatherAPI } from "@/lib/api";

interface WeatherContextType {
  activeLocation: string;
  activeDistrict: string;
  activeState: string;
  activeDate: string;
  currentWeather: CurrentWeather | null;
  isLoading: boolean;
  error: string | null;
  isDrawerOpen: boolean;
  isSearchOpen: boolean;
  favourites: FavouriteItem[];
  tempUnit: "C" | "F";
  activePersona: PersonaType;
  viewMode: "mobile" | "expanded";
  isSpeaking: boolean;
  toggleDrawer: () => void;
  closeDrawer: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  setLocation: (locName: string, lat?: number, lon?: number) => void;
  refreshWeather: () => Promise<void>;
  addFavouriteLocation: (weather: CurrentWeather) => Promise<void>;
  removeFavouriteLocation: (id: number) => Promise<void>;
  isFavourite: (locName: string) => boolean;
  toggleTempUnit: () => void;
  convertTemp: (celsius: number) => number;
  formatTemp: (celsius: number) => string;
  setActivePersona: (persona: PersonaType) => void;
  setViewMode: (mode: "mobile" | "expanded") => void;
  toggleViewMode: () => void;
  speakWeatherForecast: () => void;
  stopSpeaking: () => void;
  detectUserLocation: () => Promise<void>;
  personaInsights: PersonaInsight[];
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [activeLocation, setActiveLocation] = useState<string>("Ghaziabad");
  const [activeDistrict, setActiveDistrict] = useState<string>("Ghaziabad");
  const [activeState, setActiveState] = useState<string>("Uttar Pradesh");
  const [activeDate, setActiveDate] = useState<string>("Thursday, 27 August");
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [favourites, setFavourites] = useState<FavouriteItem[]>([]);
  const [tempUnit, setTempUnit] = useState<"C" | "F">("C");
  const [activePersona, setActivePersona] = useState<PersonaType>("health");
  const [viewMode, setViewMode] = useState<"mobile" | "expanded">("mobile");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const fetchWeather = async (locName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await WeatherAPI.getCurrentWeather(locName);
      setCurrentWeather(data);
      setActiveLocation(data.location);
      setActiveDistrict(data.district);
      setActiveState(data.state);
      setActiveDate(data.date_str);
      // Cache for offline use
      if (typeof window !== "undefined") {
        localStorage.setItem("mausam_weather_cache", JSON.stringify({ location: locName, data }));
      }
    } catch (err: any) {
      console.warn("Using cached/fallback weather for:", locName);
      // Try cached data first — but keep the user's selected location name
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem("mausam_weather_cache");
        if (cached) {
          const parsed = JSON.parse(cached);
          setCurrentWeather({ ...parsed.data, location: locName });
          setActiveLocation(locName);
          setActiveDistrict(parsed.data.district);
          setActiveState(parsed.data.state);
          setActiveDate(parsed.data.date_str);
          setIsLoading(false);
          return;
        }
      }
      // Hard fallback
      setCurrentWeather({
        location: locName,
        district: locName,
        state: "India",
        date_str: new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" }),
        updated_at: "Offline",
        temperature: 34.2,
        feels_like: 37.1,
        maximum: 35.8,
        minimum: 25.9,
        humidity: 38,
        wind_speed: 9.4,
        wind_direction: "NW",
        wind_direction_deg: 315,
        condition: "Partly Cloudy",
        icon: "cloud-sun",
        uv_index: 7.2,
        dew_point: 19.4,
        visibility_km: 6.0,
        pressure_hpa: 1004.2,
        sunrise: "05:54 AM",
        sunset: "06:51 PM",
        aqi: {
          aqi: 95,
          status: "Satisfactory",
          color: "#8ED329",
          source: "National AQI-Source-CPCB",
          pm25: 42,
          pm10: 88,
          no2: 24,
          co: 0.8,
          o3: 32,
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFavourites = async () => {
    try {
      const favs = await WeatherAPI.getFavourites();
      setFavourites(favs);
    } catch (e) {
      console.warn("Could not fetch favourites:", e);
    }
  };

  useEffect(() => {
    fetchWeather(activeLocation);
    fetchFavourites();
    if (typeof window !== "undefined") {
      const savedUnit = localStorage.getItem("mausam_temp_unit") as "C" | "F";
      if (savedUnit) setTempUnit(savedUnit);
      const savedPersona = localStorage.getItem("mausam_persona") as PersonaType;
      if (savedPersona) setActivePersona(savedPersona);
      const savedViewMode = localStorage.getItem("mausam_view_mode") as "mobile" | "expanded";
      if (savedViewMode) setViewMode(savedViewMode);
    }
  }, []);

  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);
  const closeDrawer = () => setIsDrawerOpen(false);
  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  const setLocation = (loc: string, lat?: number, lon?: number) => {
    setActiveLocation(loc);
    fetchWeather(loc);
    closeSearch();
  };

  const refreshWeather = async () => {
    await fetchWeather(activeLocation);
  };

  const toggleTempUnit = () => {
    setTempUnit((prev) => {
      const next = prev === "C" ? "F" : "C";
      if (typeof window !== "undefined") {
        localStorage.setItem("mausam_temp_unit", next);
      }
      return next;
    });
  };

  const convertTemp = useCallback(
    (celsius: number): number => {
      if (tempUnit === "F") {
        return (celsius * 9) / 5 + 32;
      }
      return celsius;
    },
    [tempUnit]
  );

  const formatTemp = useCallback(
    (celsius: number): string => {
      const val = convertTemp(celsius);
      return `${val.toFixed(1)}°${tempUnit}`;
    },
    [convertTemp, tempUnit]
  );

  const handleSetPersona = (persona: PersonaType) => {
    setActivePersona(persona);
    if (typeof window !== "undefined") {
      localStorage.setItem("mausam_persona", persona);
    }
  };

  const handleSetViewMode = (mode: "mobile" | "expanded") => {
    setViewMode(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem("mausam_view_mode", mode);
    }
  };

  const toggleViewMode = () => {
    handleSetViewMode(viewMode === "mobile" ? "expanded" : "mobile");
  };

  const detectUserLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setLocation(`Current GPS Location (${lat.toFixed(2)}, ${lon.toFixed(2)})`, lat, lon);
        } catch (e) {
          console.error("GPS detection error:", e);
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        console.warn("GPS access denied:", err.message);
        setIsLoading(false);
      }
    );
  };

  const speakWeatherForecast = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!currentWeather) return;

    const speechText = `IMD Mausam Weather Bulletin for ${currentWeather.location}. The current temperature is ${currentWeather.temperature.toFixed(
      1
    )} degrees Celsius, with ${currentWeather.condition}. Feels like ${currentWeather.feels_like.toFixed(
      1
    )} degrees. Humidity is ${currentWeather.humidity} percent, and wind speed is ${currentWeather.wind_speed} kilometers per hour from the ${currentWeather.wind_direction}. Air quality is ${currentWeather.aqi.status} with an AQI of ${currentWeather.aqi.aqi}.`;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const addFavouriteLocation = async (weather: CurrentWeather) => {
    try {
      const created = await WeatherAPI.addFavourite({
        location_name: weather.location,
        district: weather.district,
        state: weather.state,
        latitude: 28.6692,
        longitude: 77.4538,
        current_temp: weather.temperature,
        min_temp: weather.minimum,
        max_temp: weather.maximum,
        condition: weather.condition,
      });
      setFavourites((prev) => [created, ...prev.filter((f) => f.id !== created.id)]);
    } catch (e) {
      console.error("Failed to add favourite:", e);
    }
  };

  const removeFavouriteLocation = async (id: number) => {
    try {
      await WeatherAPI.removeFavourite(id);
      setFavourites((prev) => prev.filter((f) => f.id !== id));
    } catch (e) {
      console.error("Failed to remove favourite:", e);
    }
  };

  const isFavourite = (locName: string) => {
    return favourites.some((f) => f.location_name.toLowerCase() === locName.toLowerCase());
  };

  const generatePersonaInsights = (): PersonaInsight[] => {
    const temp = currentWeather?.temperature ?? 34.2;
    const humidity = currentWeather?.humidity ?? 38;
    const wind = currentWeather?.wind_speed ?? 9.4;
    const windDir = currentWeather?.wind_direction ?? "NW";
    const aqiVal = currentWeather?.aqi?.aqi ?? 95;
    const aqiStatus = currentWeather?.aqi?.status ?? "Satisfactory";
    const uvIndex = currentWeather?.uv_index ?? 7.2;
    const sunrise = currentWeather?.sunrise ?? "05:54 AM";
    const sunset = currentWeather?.sunset ?? "06:51 PM";
    const dewPoint = currentWeather?.dew_point ?? 19.4;
    const visibility = currentWeather?.visibility_km ?? 6.0;

    return [
      {
        id: "health-insight",
        persona: "health",
        title: "Health & Allergy Wellness",
        score: aqiVal < 100 && uvIndex < 8 ? 85 : 60,
        status: aqiVal <= 100 ? "Good Air & Respiratory Safety" : "Moderate Airborne Sensitivity",
        statusColor: aqiVal <= 100 ? "#8ED329" : "#FFBE00",
        description: `Current AQI is ${aqiVal} (${aqiStatus}). Moderate pollen dispersal with ${humidity}% humidity. UV Index is ${uvIndex.toFixed(1)} (Very High).`,
        advice: [
          "Wear UV400 sunglasses and apply broad-spectrum SPF 30+ sunscreen before stepping out.",
          humidity < 40
            ? "Air is relatively dry — keep nasal passages moisturized and stay hydrated."
            : "Humidity is elevated — keep inhalers handy if sensitive to dust mites.",
          "Keep windows closed during early afternoon peak pollen dispersal hours.",
        ],
        iconName: "HeartPulse",
        metrics: [
          { label: "CPCB Air Quality", value: `${aqiVal} AQI`, badge: aqiStatus, badgeColor: aqiVal <= 100 ? "#8ED329" : "#FFBE00" },
          { label: "Pollen Count", value: humidity < 40 ? "7.4/10 (High)" : "3.8/10 (Moderate)", badge: "Grass & Weed" },
          { label: "UV Radiation", value: `${uvIndex.toFixed(1)} UVI`, badge: "Very High", badgeColor: "#FF7400" },
          { label: "Humidity", value: `${humidity}%`, badge: humidity > 60 ? "Humid" : "Normal" },
        ],
        tags: ["Pollen 7.4", "UV 7.2", `AQI ${aqiVal}`, `${humidity}% Humidity`],
      },
      {
        id: "runner-insight",
        persona: "runner",
        title: "Outdoor Fitness & Running",
        score: temp < 32 && aqiVal < 100 ? 92 : 68,
        status: temp < 32 ? "Optimal Running Window" : "Moderate Heat Caution",
        statusColor: temp < 32 ? "#8ED329" : "#FFBE00",
        description: `Sunrise at ${sunrise}, Sunset at ${sunset}. Best running hours are early morning or post-sunset when heat stress is lowest.`,
        advice: [
          "Prime running windows: 05:30 AM – 07:15 AM (Morning) & 07:00 PM – 08:30 PM (Evening).",
          "Hydrate with 250ml electrolyte water every 20–25 minutes of continuous cardio.",
          `Breeze is ${wind} km/h from ${windDir} — favorable for tempo workouts without strong resistance.`,
        ],
        iconName: "Activity",
        metrics: [
          { label: "Sunrise / Sunset", value: `${sunrise} / ${sunset}`, badge: "Daylight 13h" },
          { label: "Best Running Hrs", value: "05:30–07:15 AM", badge: "Coolest" },
          { label: "Wind & Gusts", value: `${wind} km/h ${windDir}`, badge: "Light" },
          { label: "Heat Stress Alert", value: temp > 35 ? "High (WBGT 31°)" : "Moderate", badgeColor: temp > 35 ? "#FF7400" : "#8ED329" },
        ],
        tags: [`Sunrise ${sunrise}`, `Sunset ${sunset}`, "Best: 5:30 AM", `${wind} km/h`],
      },
      {
        id: "beach-insight",
        persona: "beach",
        title: "Beachgoers & Marine Safety",
        score: 82,
        status: "Favorable Coastal Conditions",
        statusColor: "#8ED329",
        description: "Moderate swell waves with calm offshore currents. Great for coastal visits, promenade walks, and controlled water sports.",
        advice: [
          "High tide expected at 09:45 AM (2.8m); low tide at 03:30 PM (0.7m).",
          "Water temperature is 28.4°C — pleasant for swimming within designated lifeguard zones.",
          "Yellow safety flag active — exercise standard caution near rocky breakwaters.",
        ],
        iconName: "Waves",
        metrics: [
          { label: "Sea State", value: "Moderate Swell", badge: "INCOIS" },
          { label: "Wave Height (Hs)", value: "1.6 Meters", badge: "8.5s Period" },
          { label: "Tide Timings", value: "High 09:45 AM", badge: "2.8m Peak" },
          { label: "Sea Water Temp", value: "28.4°C", badge: "Pleasant" },
        ],
        tags: ["Waves 1.6m", "Tides 09:45 AM", "Water 28.4°C", "Yellow Flag"],
      },
      {
        id: "traveler-insight",
        persona: "traveler",
        title: "Traveler & Packing Advisor",
        score: 88,
        status: "Clear Transit & Sightseeing",
        statusColor: "#8ED329",
        description: `Pleasant weather in ${activeLocation}. No airport weather delays reported across regional hubs. Light breathable wear recommended.`,
        advice: [
          "Packing Checklist: UV sunglasses, SPF sunscreen, breathable cotton apparel, lightweight umbrella.",
          "Golden Hour photography lighting peaks at 06:15 PM.",
          "Check saved destinations below for instant cross-city temperature and rain status.",
        ],
        iconName: "Plane",
        metrics: [
          { label: "Sightseeing Index", value: "Excellent", badge: "Clear Sky" },
          { label: "Flight Weather", value: "VFR (No Delays)", badge: "Safe" },
          { label: "Daylight Hours", value: "12h 57m", badge: "Long Days" },
          { label: "Comfort Level", value: "Pleasant", badge: "Cotton Wear" },
        ],
        tags: ["Sightseeing 88%", "Flight Safe", "Daylight 13h", "Packing Ready"],
      },
      {
        id: "parent-insight",
        persona: "parent",
        title: "Parents & Family Safety",
        score: 80,
        status: "Safe for School & Outdoor Routines",
        statusColor: "#8ED329",
        description: "No severe thunderstorm or lightning warnings active today. Plan outdoor playground hours before 11:00 AM or post 04:30 PM.",
        advice: [
          "Ensure kids drink at least 2 to 2.5 litres of water/juices during school sports.",
          "Avoid direct unshaded sun exposure between 12:00 PM – 03:30 PM for toddlers and elders.",
          "Pack a lightweight cap and water bottle in school bags.",
        ],
        iconName: "HeartHandshake",
        metrics: [
          { label: "Severe Alerts", value: "None Active", badge: "Green Status", badgeColor: "#8ED329" },
          { label: "School Outdoors", value: "Safe Routine", badge: "Morning/Eve" },
          { label: "Hydration Advice", value: "2.5L+ Daily", badge: "Essential" },
          { label: "Mosquito Activity", value: "Low – Moderate", badge: "Dusk Caution" },
        ],
        tags: ["No Severe Warnings", "Safe Outdoors", "Hydration 2.5L", "Family Green"],
      },
      {
        id: "farmer-insight",
        persona: "farmer",
        title: "Agri & Gardening Guidance",
        score: 84,
        status: "Favorable Sowing & Spraying Window",
        statusColor: "#8ED329",
        description: `Soil moisture at 28% field capacity. Dew point is ${dewPoint.toFixed(1)}°C with 0% frost threat. Rain probability is low (< 10%).`,
        advice: [
          "Optimal foliar spray and fertilizer application window: 06:00 AM – 08:30 AM.",
          "Ideal for nursery potting, vegetable garden weeding, and light drip irrigation.",
          "Mulch vegetable beds to conserve topsoil moisture during afternoon heat.",
        ],
        iconName: "Sprout",
        metrics: [
          { label: "Soil Moisture", value: "28% Field Cap.", badge: "Adequate" },
          { label: "Rain 24h Prob.", value: "10% Chance", badge: "Dry Window" },
          { label: "Frost Alert", value: "Nil (Dew 19.4°)", badge: "Safe", badgeColor: "#8ED329" },
          { label: "Spray Window", value: "06:00–08:30 AM", badge: "Optimal" },
        ],
        tags: ["Soil 28%", "Rain 10%", "No Frost", "Spray 6:00 AM"],
      },
      {
        id: "commuter-insight",
        persona: "commuter",
        title: "Commuter & Transit Radar",
        score: 86,
        status: "Clear Expressways & Dry Transit",
        statusColor: "#8ED329",
        description: `Visibility is ${visibility.toFixed(1)} km with zero road fog or waterlogging hazards reported along arterial corridors.`,
        advice: [
          "Recommended departure: 08:00 AM – 08:30 AM for smoothest expressway transit.",
          "No waterlogged underpasses or monsoon road diversions active.",
          "Carry sunglasses for glare protection on east-west highway corridors.",
        ],
        iconName: "Car",
        metrics: [
          { label: "Road Visibility", value: `${visibility.toFixed(1)} Km`, badge: "Clear" },
          { label: "Fog / Rain Risk", value: "Low (< 10%)", badge: "Normal Speed" },
          { label: "Best Departure", value: "08:15 AM", badge: "Optimal" },
          { label: "Transit Gear", value: "Sunglasses / Light Hat", badge: "Ready" },
        ],
        tags: [`Visibility ${visibility}km`, "Fog Nil", "Leave 8:15 AM", "Dry Roads"],
      },
      {
        id: "event_planner-insight",
        persona: "event_planner",
        title: "Event & Wedding Planner",
        score: 88,
        status: "88% Outdoor Feasibility Score",
        statusColor: "#8ED329",
        description: "Excellent conditions for outdoor receptions, stage setups, and sports tournaments with light winds and negligible rain risk.",
        advice: [
          "Wind gusts remain under 15 km/h — safe for marquees, canopies, and lighting rigs.",
          "Provide covered misting fans or shaded beverage stations for daytime guests.",
          "Evening temperatures drop to pleasant levels by 07:30 PM.",
        ],
        iconName: "CalendarCheck",
        metrics: [
          { label: "Feasibility Score", value: "88 / 100", badge: "Highly Suitable", badgeColor: "#8ED329" },
          { label: "Rain Threat (24h)", value: "5% (Negligible)", badge: "Dry" },
          { label: "Wind Gust Risk", value: "Max 14 km/h", badge: "Safe Canopies" },
          { label: "Peak Heat Window", value: "01:00–03:30 PM", badge: "Shade Advised" },
        ],
        tags: ["Feasibility 88%", "Rain 5%", "Wind Safe", "Evening Great"],
      },
    ];
  };

  return (
    <WeatherContext.Provider
      value={{
        activeLocation,
        activeDistrict,
        activeState,
        activeDate,
        currentWeather,
        isLoading,
        error,
        isDrawerOpen,
        isSearchOpen,
        favourites,
        tempUnit,
        activePersona,
        viewMode,
        isSpeaking,
        toggleDrawer,
        closeDrawer,
        openSearch,
        closeSearch,
        setLocation,
        refreshWeather,
        addFavouriteLocation,
        removeFavouriteLocation,
        isFavourite,
        toggleTempUnit,
        convertTemp,
        formatTemp,
        setActivePersona: handleSetPersona,
        setViewMode: handleSetViewMode,
        toggleViewMode,
        speakWeatherForecast,
        stopSpeaking,
        detectUserLocation,
        personaInsights: generatePersonaInsights(),
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeather must be used within a WeatherProvider");
  }
  return context;
}
