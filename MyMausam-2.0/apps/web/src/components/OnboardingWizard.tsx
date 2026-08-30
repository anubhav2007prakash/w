"use client";

import { useState } from "react";
import {
  User, Heart, Dumbbell, Car, Plane, Users, Sprout, TreePine, Waves, CalendarCheck,
  MapPin, Accessibility, ChevronRight, ChevronLeft, Check, Sparkles, Navigation, Search,
} from "lucide-react";
import { usePersonalization, type ActivityMode, type UserInterests, type SavedLocation, type AccessibilitySettings, type UserLocation } from "@/context/PersonalizationContext";
import { useWeather } from "@/context/WeatherContext";
import { WeatherAPI } from "@/lib/api";

const STEPS = ["welcome", "location", "interests", "mode", "locations", "accessibility", "done"] as const;

const INTEREST_OPTIONS: { key: keyof UserInterests; icon: React.ReactNode; label: string }[] = [
  { key: "weather_alerts", icon: <Sparkles size={20} />, label: "Weather Alerts" },
  { key: "uv_index", icon: <Sparkles size={20} />, label: "UV Index" },
  { key: "air_quality", icon: <Sparkles size={20} />, label: "Air Quality" },
  { key: "fitness", icon: <Dumbbell size={20} />, label: "Fitness & Running" },
  { key: "agriculture", icon: <Sprout size={20} />, label: "Agriculture" },
  { key: "travel", icon: <Plane size={20} />, label: "Travel" },
  { key: "events", icon: <CalendarCheck size={20} />, label: "Events & Weddings" },
  { key: "marine", icon: <Waves size={20} />, label: "Beach & Marine" },
  { key: "energy", icon: <Sparkles size={20} />, label: "Energy & Carbon" },
  { key: "carbon", icon: <Sparkles size={20} />, label: "Carbon Footprint" },
];

const MODE_OPTIONS: { mode: ActivityMode; icon: React.ReactNode; label: string; desc: string }[] = [
  { mode: "fitness", icon: <Dumbbell size={22} />, label: "Fitness Mode", desc: "Best running times, hydration, heat stress" },
  { mode: "commuter", icon: <Car size={22} />, label: "Commuter Mode", desc: "Departure times, road visibility, fog alerts" },
  { mode: "travel", icon: <Plane size={22} />, label: "Travel Mode", desc: "Packing tips, sightseeing, flight weather" },
  { mode: "family", icon: <Users size={22} />, label: "Family Mode", desc: "School safety, UV for kids, hydration" },
  { mode: "agriculture", icon: <Sprout size={22} />, label: "Agriculture Mode", desc: "Spray windows, irrigation, frost alerts" },
  { mode: "gardening", icon: <TreePine size={22} />, label: "Gardening Mode", desc: "Soil moisture, planting, watering schedule" },
  { mode: "beach", icon: <Waves size={22} />, label: "Beach Mode", desc: "Tides, wave height, coastal safety" },
  { mode: "event_planner", icon: <CalendarCheck size={22} />, label: "Event Planner Mode", desc: "Outdoor feasibility, wind, rain windows" },
];

const LOCATION_LABELS = ["home", "work", "school", "other"] as const;

export function OnboardingWizard() {
  const { completeOnboarding, setUserName, toggleInterest, interests, setActiveMode, addSavedLocation, toggleAccessibility, setUserLocation } = usePersonalization();
  const { setLocation: setWeatherLocation, detectUserLocation } = useWeather();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<UserInterests>({ ...interests });
  const [selectedMode, setSelectedMode] = useState<ActivityMode>("default");
  const [locations, setLocations] = useState<SavedLocation[]>([]);
  const [locName, setLocName] = useState("");
  const [locLabel, setLocLabel] = useState<"home" | "work" | "school" | "other">("home");
  const [access, setAccess] = useState<AccessibilitySettings>({ largeText: false, highContrast: false, colorblindMode: false });

  // Location step state
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const [locationSearchResults, setLocationSearchResults] = useState<any[]>([]);
  const [locationSearching, setLocationSearching] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationChosen, setLocationChosen] = useState<{ name: string; lat: number; lon: number; district?: string; state?: string } | null>(null);

  const stepKey = STEPS[step];

  const toggleInt = (key: keyof UserInterests) => {
    setSelectedInterests((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const addLocation = () => {
    if (!locName.trim()) return;
    setLocations((prev) => [...prev, { id: Date.now().toString(), name: locName.trim(), label: locLabel }]);
    setLocName("");
  };

  // GPS location detection
  const handleUseCurrentLocation = () => {
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        // Try to resolve a name from coordinates using reverse lookup or fallback
        try {
          const results = await WeatherAPI.searchLocations(`${lat.toFixed(2)} ${lon.toFixed(2)}`);
          if (results && results.length > 0) {
            const best = results[0];
            setLocationChosen({ name: best.name, lat, lon, district: best.district, state: best.state });
          } else {
            setLocationChosen({ name: `GPS Location (${lat.toFixed(2)}, ${lon.toFixed(2)})`, lat, lon });
          }
        } catch {
          setLocationChosen({ name: `GPS Location (${lat.toFixed(2)}, ${lon.toFixed(2)})`, lat, lon });
        }
      },
      (err) => {
        if (err.code === 1) {
          setLocationError("Location permission denied. Please search for your location instead.");
        } else {
          setLocationError("Could not detect location. Please search for your location instead.");
        }
      }
    );
  };

  // Location search
  const handleSearchLocation = async (query: string) => {
    setLocationSearchQuery(query);
    if (query.length < 2) {
      setLocationSearchResults([]);
      return;
    }
    setLocationSearching(true);
    try {
      const results = await WeatherAPI.searchLocations(query);
      setLocationSearchResults(results || []);
    } catch {
      setLocationSearchResults([]);
    } finally {
      setLocationSearching(false);
    }
  };

  const handleSelectSearchResult = (result: any) => {
    setLocationChosen({
      name: result.name,
      lat: result.latitude,
      lon: result.longitude,
      district: result.district,
      state: result.state,
    });
    setLocationSearchQuery(result.name);
    setLocationSearchResults([]);
  };

  const finish = () => {
    setUserName(name);

    // Set user location with coordinates
    if (locationChosen) {
      const userLoc: UserLocation = {
        name: locationChosen.name,
        lat: locationChosen.lat,
        lon: locationChosen.lon,
        district: locationChosen.district,
        state: locationChosen.state,
        source: "gps",
      };
      setUserLocation(userLoc);
      setWeatherLocation(locationChosen.name, locationChosen.lat, locationChosen.lon);
    }

    Object.keys(selectedInterests).forEach((k) => {
      if (selectedInterests[k as keyof UserInterests] !== interests[k as keyof UserInterests]) {
        toggleInterest(k as keyof UserInterests);
      }
    });
    if (selectedMode !== "default") setActiveMode(selectedMode);
    locations.forEach(addSavedLocation);
    Object.keys(access).forEach((k) => {
      if (access[k as keyof AccessibilitySettings] !== false) toggleAccessibility(k as keyof AccessibilitySettings);
    });
    completeOnboarding();
  };

  return (
    <div className="fixed inset-0 z-[300] bg-[#021a32] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="flex gap-1.5 mb-6">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? "bg-[#00DDE5]" : "bg-white/20"}`} />
          ))}
        </div>

        {/* Step: Welcome */}
        {stepKey === "welcome" && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-[#00DDE5]/20 rounded-2xl flex items-center justify-center mx-auto">
              <Sparkles size={36} className="text-[#00DDE5]" />
            </div>
            <h1 className="text-2xl font-bold">Welcome to Mausam 2.0</h1>
            <p className="text-white/60">Let&apos;s personalize your weather experience. It takes less than a minute.</p>
            <input
              type="text"
              placeholder="What&apos;s your name?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#00DDE5]"
            />
          </div>
        )}

        {/* Step: Location */}
        {stepKey === "location" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Where are you?</h2>
            <p className="text-white/60 text-sm">We&apos;ll use this to personalize weather for your exact location</p>

            {!locationChosen ? (
              <>
                {/* GPS Button */}
                <button
                  onClick={handleUseCurrentLocation}
                  className="w-full flex items-center gap-3 p-4 rounded-xl bg-[#00DDE5]/10 border border-[#00DDE5]/30 text-[#00DDE5] hover:bg-[#00DDE5]/20 transition"
                >
                  <Navigation size={22} />
                  <div className="text-left">
                    <div className="text-sm font-bold">Use Current Location</div>
                    <div className="text-xs text-[#00DDE5]/60">GPS will detect your exact position</div>
                  </div>
                </button>

                <div className="text-center text-white/40 text-xs">— or search —</div>

                {/* Search Input */}
                <div className="relative">
                  <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-3 py-2.5">
                    <Search size={16} className="text-white/40" />
                    <input
                      type="text"
                      placeholder="Search city, district, or state"
                      value={locationSearchQuery}
                      onChange={(e) => handleSearchLocation(e.target.value)}
                      className="flex-1 bg-transparent text-white text-sm placeholder:text-white/40 focus:outline-none"
                    />
                    {locationSearching && <span className="text-xs text-white/40">...</span>}
                  </div>
                  {locationSearchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-[#0a2a4a] border border-white/20 rounded-xl max-h-48 overflow-y-auto">
                      {locationSearchResults.map((r: any, i: number) => (
                        <button
                          key={i}
                          onClick={() => handleSelectSearchResult(r)}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-white/10 transition"
                        >
                          <MapPin size={14} className="text-[#00DDE5] shrink-0" />
                          <div>
                            <div className="text-sm text-white">{r.name}</div>
                            <div className="text-xs text-white/40">{r.district}, {r.state}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {locationError && (
                  <p className="text-xs text-red-400/80">{locationError}</p>
                )}
              </>
            ) : (
              /* Location Confirmed */
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto">
                  <MapPin size={28} className="text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{locationChosen.name}</h3>
                  {locationChosen.district && (
                    <p className="text-sm text-white/60">{locationChosen.district}, {locationChosen.state}</p>
                  )}
                  <p className="text-xs text-white/40 mt-1">
                    {locationChosen.lat.toFixed(4)}°N, {locationChosen.lon.toFixed(4)}°E
                  </p>
                </div>
                <button
                  onClick={() => { setLocationChosen(null); setLocationSearchQuery(""); }}
                  className="text-xs text-white/40 hover:text-white/60 underline"
                >
                  Change location
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step: Interests */}
        {stepKey === "interests" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">What interests you?</h2>
            <p className="text-white/60 text-sm">Select all that apply</p>
            <div className="grid grid-cols-2 gap-2">
              {INTEREST_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => toggleInt(opt.key)}
                  className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium transition-all ${
                    selectedInterests[opt.key]
                      ? "bg-[#00DDE5]/20 border border-[#00DDE5] text-[#00DDE5]"
                      : "bg-white/5 border border-white/10 text-white/60"
                  }`}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step: Mode */}
        {stepKey === "mode" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Choose your mode</h2>
            <p className="text-white/60 text-sm">You can switch anytime from settings</p>
            <div className="space-y-2">
              {MODE_OPTIONS.map((opt) => (
                <button
                  key={opt.mode}
                  onClick={() => setSelectedMode(opt.mode)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                    selectedMode === opt.mode
                      ? "bg-[#00DDE5]/20 border border-[#00DDE5]"
                      : "bg-white/5 border border-white/10"
                  }`}
                >
                  <span className={selectedMode === opt.mode ? "text-[#00DDE5]" : "text-white/40"}>{opt.icon}</span>
                  <div>
                    <div className={`text-sm font-medium ${selectedMode === opt.mode ? "text-[#00DDE5]" : "text-white"}`}>{opt.label}</div>
                    <div className="text-xs text-white/40">{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step: Locations */}
        {stepKey === "locations" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Set your locations</h2>
            <p className="text-white/60 text-sm">Add home, work, or school for personalized alerts</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Location name"
                value={locName}
                onChange={(e) => setLocName(e.target.value)}
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-[#00DDE5]"
              />
              <select
                value={locLabel}
                onChange={(e) => setLocLabel(e.target.value as any)}
                className="bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-white text-sm"
              >
                {LOCATION_LABELS.map((l) => (
                  <option key={l} value={l} className="bg-[#021a32]">{l}</option>
                ))}
              </select>
              <button onClick={addLocation} className="bg-[#00DDE5] text-black px-4 py-2.5 rounded-xl text-sm font-medium">
                Add
              </button>
            </div>
            {locations.length > 0 && (
              <div className="space-y-2 mt-3">
                {locations.map((loc) => (
                  <div key={loc.id} className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
                    <MapPin size={14} className="text-[#00DDE5]" />
                    <span className="text-sm text-white flex-1">{loc.name}</span>
                    <span className="text-xs text-white/40 bg-white/10 px-2 py-0.5 rounded-full">{loc.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step: Accessibility */}
        {stepKey === "accessibility" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Accessibility</h2>
            <p className="text-white/60 text-sm">Customize the app for your needs</p>
            {([
              { key: "largeText" as const, label: "Large Text Mode", desc: "Bigger fonts throughout the app" },
              { key: "highContrast" as const, label: "High Contrast", desc: "Enhanced contrast for better readability" },
              { key: "colorblindMode" as const, label: "Colorblind Friendly", desc: "Use patterns + labels instead of colors alone" },
            ]).map((opt) => (
              <button
                key={opt.key}
                onClick={() => setAccess((p) => ({ ...p, [opt.key]: !p[opt.key] }))}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                  access[opt.key] ? "bg-[#00DDE5]/20 border border-[#00DDE5]" : "bg-white/5 border border-white/10"
                }`}
              >
                <Accessibility size={20} className={access[opt.key] ? "text-[#00DDE5]" : "text-white/40"} />
                <div>
                  <div className={`text-sm font-medium ${access[opt.key] ? "text-[#00DDE5]" : "text-white"}`}>{opt.label}</div>
                  <div className="text-xs text-white/40">{opt.desc}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step: Done */}
        {stepKey === "done" && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto">
              <Check size={36} className="text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold">You&apos;re all set!</h1>
            <p className="text-white/60">Your personalized weather experience is ready. You can change anything in Settings.</p>
            {locationChosen && (
              <p className="text-xs text-white/40">📍 {locationChosen.name}</p>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1 bg-white/10 text-white px-4 py-3 rounded-xl text-sm font-medium"
            >
              <ChevronLeft size={16} /> Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={stepKey === "location" && !locationChosen}
              className={`flex-1 flex items-center justify-center gap-1 px-4 py-3 rounded-xl text-sm font-bold transition ${
                stepKey === "location" && !locationChosen
                  ? "bg-white/10 text-white/30 cursor-not-allowed"
                  : "bg-[#00DDE5] text-black hover:bg-[#00b8c9]"
              }`}
            >
              {step === STEPS.length - 2 ? "Get Started" : "Continue"} <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={finish}
              className="flex-1 flex items-center justify-center gap-1 bg-[#00DDE5] text-black px-4 py-3 rounded-xl text-sm font-bold"
            >
              Let&apos;s Go! <Sparkles size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
