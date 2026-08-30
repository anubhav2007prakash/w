# LOCATION-AWARE PERSONALIZATION ENGINE — AUDIT & GAP ANALYSIS

## MyMausam 2.0 — SIH PS 26076

---

# 1. EXISTING LOCATION HANDLING

## Current State

| Component | What Exists | What's Missing |
|-----------|------------|----------------|
| **WeatherContext** | Stores `activeLocation` (string name), `activeDistrict`, `activeState` | No lat/lon storage, no coordinates |
| **GPS Detection** | `detectUserLocation()` calls browser geolocation → fetches lat/lon | Lat/lon are DISCARDED — never stored or used |
| **Location API** | Backend `/api/locations/search?q=` returns name, district, state, latitude, longitude | Frontend never fetches or stores coordinates from search results |
| **SavedLocation type** | Has `lat?` and `lon?` optional fields | Fields are NEVER populated — always undefined |
| **Weather API calls** | All use location name string: `WeatherAPI.getCurrentWeather(location)` | Backend resolves name → weather server-side |
| **Favourite locations** | `addFavouriteLocation()` hardcodes `latitude: 28.6692, longitude: 77.4538` | Never uses actual coordinates |
| **Location persistence** | `activeLocation` saved in WeatherContext, weather cached in localStorage | No coordinate persistence |
| **Location change** | `setLocation(locName, lat?, lon?)` exists | lat/lon parameters are ignored |

## Key Finding

**The application currently has NO coordinate-aware location system.** All weather fetching uses city names. The backend resolves names to weather data internally. GPS coordinates are detected but immediately discarded.

---

# 2. EXISTING ONBOARDING / AUTHENTICATION

## Current Onboarding Flow (6 steps)

```
Welcome → Interests → Mode → Locations → Accessibility → Done
```

| Step | What Exists | What's Missing |
|------|------------|----------------|
| Welcome | Name input | No location request |
| Interests | 10 interest toggles | OK |
| Mode | 8 activity modes | OK |
| Locations | Manual text input + label selector | NO GPS, NO search autocomplete, NO coordinate storage |
| Accessibility | 3 options | OK |
| Done | Completion | No geographic context setup |

## Authentication

| Feature | Status |
|---------|--------|
| Phone OTP auth | ✅ Exists (`/api/auth/send-otp`, `/api/auth/verify-otp`) |
| User profile storage | ❌ No user profile in database — all localStorage |
| Auth state management | ✅ `AuthContext` with `isAuthenticated`, `user` |
| Profile page | Route exists `/profile` |

## Key Finding

**Onboarding has a location step but it's purely manual text input.** No GPS permission request, no search autocomplete, no coordinate capture. The user can type any city name but coordinates are never stored.

---

# 3. EXISTING USER / PROFILE SYSTEM

| Component | Status | Details |
|-----------|--------|---------|
| **PersonalizationContext** | ✅ Exists | Stores: name, mode, interests, savedLocations, accessibility, notifications |
| **SavedLocation type** | ✅ Exists | `id, name, label, lat?, lon?` — lat/lon never populated |
| **localStorage persistence** | ✅ Exists | `mausam_personalization_*` keys |
| **User database** | ❌ Does not exist | No user_id, no server-side user profile |
| **Persona persistence** | ✅ Exists | `mausam_persona` in localStorage via WeatherContext |

---

# 4. EXISTING PERSONALIZATION

| Component | Status | Details |
|-----------|--------|---------|
| **PersonaEngine component** | ✅ Exists | 8 persona tabs, insight cards, all module dashboards |
| **personalization-engine.ts** | ✅ Exists | Priority engine, comfort index, activity windows, packing, event, commute, recommendations |
| **RELEVANCE_MATRIX** | ✅ Exists | 8 personas × ~14 card categories — static weights |
| **scoreCard()** | ✅ Exists | Composite scoring: persona × urgency × time × data availability |
| **Smart Alert Override** | ✅ Exists | Severe alerts always on top |
| **Homepage section ordering** | ✅ Exists | Persona-adaptive ordering |
| **Feature Applicability** | ❌ Missing | No geographic gating of features |
| **Feature Registry** | ❌ Missing | No centralized feature metadata |

## Persona Type Discrepancy

| Location | Type | Values |
|----------|------|--------|
| `types/weather.ts` | `PersonaType` | health, **runner**, beach, traveler, **parent**, farmer, commuter, event_planner |
| `personalization-engine.ts` | `Persona` | health, **fitness**, beach, traveler, **family**, farmer, commuter, event_planner |

⚠️ **"runner" vs "fitness" and "parent" vs "family"** — The types are inconsistent. The PersonaEngine UI uses the engine types (fitness, family), but WeatherContext's `PersonaInsight[]` uses the old types (runner, parent).

---

# 5. EXISTING WEATHER APIs

## Backend API Endpoints (All available)

| Endpoint | Location Param | Coordinates Support | Used in Personalization |
|----------|---------------|--------------------|-----------------------|
| `/api/weather/current?location=` | ✅ Name | ❌ No | ✅ Yes |
| `/api/weather/hourly?location=` | ✅ Name | ❌ No | ✅ Yes |
| `/api/weather/forecast?location=` | ✅ Name | ❌ No | ✅ Yes |
| `/api/weather/alerts` | ❌ None | ❌ No | ✅ Yes |
| `/api/heatwave?location=` | ✅ Name | ❌ No | ❌ No |
| `/api/flood-nowcast?location=` | ✅ Name | ❌ No | ❌ No |
| `/api/seasonal-outlook?region=` | ✅ Region | ❌ No | ❌ No |
| `/api/monsoon-tracker?region=` | ✅ Region | ❌ No | ❌ No |
| `/api/mountain-weather?station=` | ✅ Station | ❌ No | ❌ No |
| `/api/air-quality?location=` | ✅ Name | ❌ No | ❌ No |
| `/api/radar?station=` | ✅ Station | ❌ No | ❌ No |
| `/api/route-nowcast?origin=&destination=` | ✅ Names | ❌ No | ✅ Yes |
| `/api/cyclone` | ❌ None | ❌ No | ❌ No |
| `/api/lightning` | ❌ None | ❌ No | ❌ No |
| `/api/aviation` | ❌ None | ❌ No | ❌ No |
| `/api/agromet` | ❌ None | ❌ No | ✅ Yes |
| `/api/locations/search?q=` | ✅ Query | ✅ Returns lat/lon | ❌ No (only for favorites) |

## Key Finding

**Backend has NO coordinate-based weather endpoints.** All weather APIs use city name strings. The `/api/locations/search` endpoint DOES return latitude/longitude for cities in the database, but the frontend never uses these coordinates for weather fetching.

**Backend resolution is handled internally** — `weather_service.get_current_weather("Delhi")` internally maps "Delhi" to weather data. This means the frontend CANNOT fetch weather by coordinates without backend changes.

---

# 6. EXISTING ALERT SYSTEM

| Component | Status |
|-----------|--------|
| SmartAlerts component | ✅ Exists — displays alerts from `/api/weather/alerts` |
| WeatherAlertCard | ✅ Exists — renders individual alerts |
| Alert severity detection | ✅ Exists — `hasSevereAlert()`, `getAlertSeverity()` in engine |
| Severe override | ✅ Exists — alerts always on top of homepage |
| Heat/Cold wave alerts | ✅ Backend exists but NOT used in personalization |
| Flood alerts | ✅ Backend exists but NOT used in personalization |
| Cyclone alerts | ✅ Backend exists but NOT used in personalization |
| Lightning alerts | ✅ Backend exists but NOT used in personalization |

---

# 7. EXISTING HOMEPAGE ARCHITECTURE

## Section Order (Priority-Based)

```
1. Header (GPS, Search, Profile, Voice)
2. Severe Weather Alerts (when active)
3. PersonaEngine (intelligence hub)
4. PersonalizedGreeting
5. MausamMoment
6. PersonalizedDashboard
7. WeatherHero
8. LifestyleIndex
9. SmartAlerts
10. TodayForYou
11. PersonalizedWidgets
12. AQICard
13. FeatureButtons
14. Non-severe Alerts (when no severe)
15. DailyForecastList
```

All 15 sections are ALWAYS rendered (no conditional visibility based on persona/geography).

---

# 8. EXISTING REUSABLE COMPONENTS

| Component | Reuse Potential |
|-----------|----------------|
| `OnboardingWizard` | ✅ Extend with GPS + search location step |
| `PersonalizationContext` | ✅ Add coordinate fields to SavedLocation, add user location |
| `WeatherContext` | ✅ Store coordinates, pass to geographic engine |
| `Header` | ✅ Has GPS detection + search already |
| `PersonaEngine` | ✅ Already displays all 8 persona modules |
| `personalization-engine.ts` | ✅ Extend with geographic context + feature applicability |
| `SavedLocation` type | ✅ Already has `lat?` and `lon?` fields |
| `WeatherAPI.searchLocations()` | ✅ Already exists |
| Backend `/api/locations/search` | ✅ Returns coordinates |

---

# 9. MISSING COMPONENTS FOR GEOGRAPHIC PERSONALIZATION

## Critical Missing Pieces

| # | Missing Component | Priority | Notes |
|---|------------------|----------|-------|
| 1 | **Geographic Context Engine** | 🔴 Critical | No lat/lon storage, no coastal detection, no climate classification |
| 2 | **Feature Applicability Engine** | 🔴 Critical | No geographic gating of features |
| 3 | **Feature Registry** | 🟡 High | No centralized feature metadata |
| 4 | **Coordinate Storage** | 🔴 Critical | GPS coords discarded, SavedLocation lat/lon never populated |
| 5 | **GPS Location Persistence** | 🔴 Critical | `detectUserLocation()` discards coordinates |
| 6 | **Location Search with Coordinates** | 🟡 High | Search exists but frontend doesn't capture coordinates |
| 7 | **Onboarding Location Step** | 🔴 Critical | No GPS request, no search autocomplete |
| 8 | **Destination vs Home Distinction** | 🟡 High | Traveler uses same location for all destinations |
| 9 | **Persona Type Alignment** | 🟡 Medium | "runner"/"parent" vs "fitness"/"family" discrepancy |

## Architecture Constraint

**The backend uses city names, not coordinates.** This means:
- We CANNOT fetch weather by lat/lon without backend changes
- We CAN determine geographic context (coastal, climate, terrain) from coordinates
- We CAN use coordinates to filter which features to show
- We CAN use coordinates to prioritize information

**Recommended approach: Build geographic context on the frontend using coordinates + heuristic algorithms, while keeping backend weather API calls using city names.**

---

# 10. RECOMMENDED IMPLEMENTATION PLAN

## Phase A — Personalization Foundation (Already Done ✅)

All 8 personas, priority engine, comfort index, activity windows, packing, event suitability, commute risk, recommendations — all implemented and tested.

## Phase B — Coordinate Storage & Location System

### B.1 Extend SavedLocation to Store Coordinates
**File:** `PersonalizationContext.tsx`
- Populate `lat` and `lon` from GPS or search results
- Store `userLocation` (home location with coordinates)
- Persist coordinates to localStorage

### B.2 Fix GPS Detection to Store Coordinates
**File:** `WeatherContext.tsx`
- `detectUserLocation()` → store lat/lon in PersonalizationContext
- `setLocation()` → fetch coordinates from backend search API

### B.3 Add Location Search with Coordinate Resolution
**File:** `Header.tsx` (or new SearchLocation component)
- When user searches a location, fetch coordinates from `/api/locations/search?q=`
- Store coordinates alongside location name

## Phase C — Geographic Context Engine

### C.1 Create Geographic Context Module
**File:** `lib/geographic-context.ts` (NEW)
- Input: lat/lon + location name
- Output: `GeographicContext` object with:
  - `coastal_status: boolean`
  - `distance_to_coast_km: number`
  - `climate_zone: string` (tropical, subtropical, arid, temperate, alpine)
  - `terrain_type: string` (plains, coastal, mountain, desert)
  - `frost_prone: boolean`
  - `cyclone_exposure: boolean`
  - `fog_prone: boolean`
  - `urban_status: boolean`

### C.2 Coastal Detection Algorithm
- Use a simplified approach: define known coastal boundary points or use a bounding box approach
- For India: check if lat/lon is within ~50km of coastline using simplified coordinates
- Reference: India's coastline can be approximated with key coastal city coordinates

### C.3 Climate Zone Classification
- Use latitude + elevation heuristic for India:
  - < 15°N: Tropical
  - 15-25°N: Subtropical
  - 25-35°N: Subtropical/Temperate
  - > 35°N: Alpine
  - Coastal: Maritime influence
  - Elevation > 2000m: Alpine/Mountain

## Phase D — Feature Applicability Engine

### D.1 Create Feature Registry
**File:** `lib/feature-registry.ts` (NEW)
- Each feature has metadata:
  - `supportedPersonas: Persona[]`
  - `geographicRequirements: GeographicRequirement[]`
  - `weatherRequirements: string[]`
  - `seasonalRequirements: string[]`

### D.2 Geographic Requirements
```typescript
interface GeographicRequirement {
  coastal?: boolean;       // requires coastal location
  mountainous?: boolean;   // requires mountain location
  frostProne?: boolean;    // requires frost-prone location
  cycloneProne?: boolean;  // requires cyclone-prone location
  fogProne?: boolean;      // requires fog-prone location
}
```

### D.3 Feature Visibility Logic
- For each feature, check: persona match AND geographic match
- If geographic requirements NOT met → hide feature from persona options
- If geographic requirements met but not currently relevant → lower priority
- If geographic requirements met AND currently relevant → high priority

## Phase E — Integrate Persona + Geography + Weather

### E.1 Update Personalization Engine
**File:** `lib/personalization-engine.ts`
- `scoreCard()` → add geographic context parameter
- `generateRecommendations()` → filter by geographic applicability
- Feature visibility based on geographic context

### E.2 Update PersonaEngine Component
**File:** `components/PersonaEngine.tsx`
- Pass geographic context to engine functions
- Conditionally show/hide modules based on applicability
- Show "Not applicable for your location" for irrelevant features

### E.3 Update Homepage
**File:** `app/page.tsx`
- Pass geographic context through
- Adaptive section visibility (some sections hidden when not relevant)

## Phase F — Onboarding Enhancement

### F.1 Add GPS Location Step
**File:** `components/OnboardingWizard.tsx`
- After "Welcome" step, add "Location" step
- Two options: "Use Current Location" (GPS) or "Search Location"
- Store coordinates + location name
- If GPS denied → fall back to search

## Phase G — Traveler Destination Context

### G.1 Separate Home vs Destination Context
**File:** `lib/geographic-context.ts`
- `getGeographicContext(lat, lon)` — works for ANY location
- Traveler destinations get their OWN geographic context
- Home location and destination location are independent

## Phase H — Testing

### Test Matrix
- All 10 PDR acceptance tests (§34)
- Regression: all 44 routes
- TypeScript: `tsc --noEmit`
- Build: `npm run build`

---

# 11. POTENTIAL REGRESSION RISKS

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Breaking WeatherContext by adding coordinate storage | Low | Add new fields, don't change existing |
| Breaking PersonalizationContext | Low | Extend SavedLocation type, add new context |
| Onboarding flow disruption | Medium | Add new step, keep all existing steps |
| Geographic context calculation errors | Medium | Wrap in try-catch, fallback to "unknown" |
| Feature visibility breaking existing UI | Medium | Default to "visible" when context unknown |
| Breaking existing persona modules | Low | Geographic context is additive, not replacement |
| Breaking backend API calls | Low | Still use city names for weather |
| Performance impact | Low | Geographic calculations are pure math, no API calls |

---

# 12. FILES TO BE CHANGED/CREATED

## New Files
| File | Purpose |
|------|---------|
| `lib/geographic-context.ts` | Geographic Context Engine |
| `lib/feature-registry.ts` | Feature Applicability Registry |

## Modified Files
| File | Changes |
|------|---------|
| `context/PersonalizationContext.tsx` | Add `userLocation` with coords, extend `SavedLocation` usage |
| `context/WeatherContext.tsx` | Store coordinates from GPS/search, pass to geographic engine |
| `components/OnboardingWizard.tsx` | Add GPS location step after Welcome |
| `components/Header.tsx` | Capture coordinates from search results |
| `components/PersonaEngine.tsx` | Pass geographic context, conditionally show modules |
| `lib/personalization-engine.ts` | Add geographic context to scoring, feature applicability |
| `app/page.tsx` | Thread geographic context through |

## Backend: ZERO CHANGES

---

# 13. ACCEPTANCE CRITERIA MAPPING

| PDR §34 Criterion | Implementation Phase | Status |
|-------------------|---------------------|--------|
| Location requested during onboarding | F | ❌ Not yet |
| Location obtained through GPS | B.2 | ❌ Not yet |
| Location can be searched manually | B.3 (partially exists) | 🟡 Partial |
| Location is persisted | B.1 | ❌ Not yet |
| Location can be changed | B.3 | 🟡 Partial |
| Geographic context is calculated | C | ❌ Not yet |
| Persona combined with geographic context | E | ❌ Not yet |
| Feature applicability calculated centrally | D | ❌ Not yet |
| Irrelevant modules hidden/deprioritized | D.3 + E | ❌ Not yet |
| Relevant modules prioritized | D.3 + E | ❌ Not yet |
| Current weather modifies relevance | E.1 | ❌ Not yet |
| Forecast modifies relevance | E.1 | ❌ Not yet |
| Season modifies relevance | C.3 | ❌ Not yet |
| Destination context independent from home | G.1 | ❌ Not yet |
| Severe alerts override normal personalization | ✅ Existing | ✅ Done |
| Existing UI remains intact | All phases | 🟡 To verify |
| Existing functionality remains intact | All phases | 🟡 To verify |
| No fake data | All phases | 🟡 To verify |
| Missing providers handled gracefully | All phases | 🟡 To verify |
| Application remains responsive | All phases | 🟡 To verify |
| Production build succeeds | H | 🟡 To verify |
| Existing routes continue working | H | 🟡 To verify |
| Existing APIs continue working | H | 🟡 To verify |

---

# 14. SUMMARY

## What Already Exists (Strong Foundation)
- ✅ 8 persona modules with full intelligence
- ✅ Priority engine with composite scoring
- ✅ Smart alert override
- ✅ Persona-adaptive homepage ordering
- ✅ All backend weather APIs (using city names)
- ✅ Location search API (returns coordinates)
- ✅ GPS detection (but discards coordinates)
- ✅ SavedLocation type (has lat/lon fields)

## What Must Be Built
- 🔴 Geographic Context Engine (lat/lon → coastal, climate, terrain)
- 🔴 Feature Applicability Engine (geographic gating)
- 🔴 Coordinate storage and persistence
- 🔴 GPS onboarding step
- 🔴 Location search with coordinate capture
- 🔴 Destination vs home distinction
- 🔴 Persona type alignment

## What Must NOT Change
- Backend API (zero changes)
- Existing 44 routes
- Existing UI design
- Existing persona modules
- Existing weather data flow
- Existing alert system
