# User Flows — MyMausam 2.0

## Flow 1: New User — First Launch
1. User opens app → Location permission prompt.
2. GPS resolves city → `WeatherContext` fetches live data.
3. Home dashboard renders with current temperature, AQI, and active alerts.
4. Persona Selector modal appears → user selects "Health & Allergy Sensitive".
5. Recommendations widget updates with persona-specific advice.

## Flow 2: Farmer — Agromet Advisory Check
1. User selects **Farmer** persona from persona strip.
2. Navigates to `/agromet`.
3. Crop-specific forecast and pesticide spraying windows are displayed.
4. User taps "Share Advisory" → system share sheet opens.

## Flow 3: Radar & Rain Nowcast
1. User opens `/radar`.
2. Doppler composite overlaid on Leaflet India map.
3. User taps `/rain-alert` tab → 2-hour precipitation probability chart.
4. Rain expected → red badge displayed on home screen widget.

## Flow 4: Solar PV Estimation
1. User navigates to `/solar-estimator`.
2. Enters rooftop area (sq. ft.) and selects city from dropdown.
3. ML model returns daily kWh yield, monthly INR savings, CO₂ offset.
4. User downloads PDF estimate.

## Flow 5: WeatherGPT Chat
1. User opens `/chat`.
2. Types: "Is tomorrow suitable for a marathon in Delhi?"
3. MausamMitra responds with persona-aware answer citing AQI, temp, and UV index.
4. User switches to voice mode → Web Speech API reads response aloud.

## Flow 6: Crowdsource Report
1. User observes unexpected hailstorm.
2. Opens `/crowd-source` → taps "Report Incident".
3. Selects type (Hail), adds GPS location and photo.
4. Report uploaded to Firestore → visible to nearby users in 30 seconds.
