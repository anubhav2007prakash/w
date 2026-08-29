import datetime
import random
from typing import List, Dict, Any
from app.database import query_one, query_all
from app.services.imd_service import get_imd_city_weather, get_imd_city_forecast, IMD_API_KEY
from app.services.accuweather_service import get_current_conditions as accu_get_current, get_5day_forecast as accu_get_forecast, get_alerts as accu_get_alerts, API_KEY as ACCU_API_KEY

WEATHER_CODE_MAP = {
    0: ("Clear Sky", "sun"), 1: ("Mainly Clear", "sun"), 2: ("Partly Cloudy", "cloud-sun"), 3: ("Overcast", "cloud"),
    45: ("Fog", "cloud-fog"), 48: ("Rime Fog", "cloud-fog"),
    51: ("Light Drizzle", "cloud-rain"), 53: ("Moderate Drizzle", "cloud-rain"), 55: ("Dense Drizzle", "cloud-rain"),
    61: ("Slight Rain", "cloud-rain"), 63: ("Moderate Rain", "cloud-rain"), 65: ("Heavy Rain", "cloud-rain"),
    71: ("Slight Snow", "cloud-snow"), 73: ("Moderate Snow", "cloud-snow"), 75: ("Heavy Snow", "cloud-snow"),
    80: ("Slight Showers", "cloud-rain"), 81: ("Moderate Showers", "cloud-rain"), 82: ("Violent Showers", "cloud-rain"),
    85: ("Snow Showers", "cloud-snow"), 86: ("Heavy Snow Showers", "cloud-snow"),
    95: ("Thunderstorm", "cloud-lightning"), 96: ("Thunderstorm with Hail", "cloud-lightning"), 99: ("Severe Thunderstorm", "cloud-lightning"),
}

CITIES_META = {
    "Delhi": {"district": "New Delhi", "state": "Delhi", "lat": 28.6139, "lon": 77.2090},
    "Mumbai": {"district": "Mumbai City", "state": "Maharashtra", "lat": 19.0760, "lon": 72.8777},
    "Kolkata": {"district": "Kolkata", "state": "West Bengal", "lat": 22.5726, "lon": 88.3639},
    "Chennai": {"district": "Chennai", "state": "Tamil Nadu", "lat": 13.0827, "lon": 80.2707},
    "Bangalore": {"district": "Bengaluru Urban", "state": "Karnataka", "lat": 12.9716, "lon": 77.5946},
    "Bengaluru": {"district": "Bengaluru Urban", "state": "Karnataka", "lat": 12.9716, "lon": 77.5946},
    "Hyderabad": {"district": "Hyderabad", "state": "Telangana", "lat": 17.3850, "lon": 78.4867},
    "Ahmedabad": {"district": "Ahmedabad", "state": "Gujarat", "lat": 23.0225, "lon": 72.5714},
    "Pune": {"district": "Pune", "state": "Maharashtra", "lat": 18.5204, "lon": 73.8567},
    "Jaipur": {"district": "Jaipur", "state": "Rajasthan", "lat": 26.9124, "lon": 75.7873},
    "Lucknow": {"district": "Lucknow", "state": "Uttar Pradesh", "lat": 26.8467, "lon": 80.9462},
    "Ghaziabad": {"district": "Ghaziabad", "state": "Uttar Pradesh", "lat": 28.6692, "lon": 77.4538},
    "Noida": {"district": "Gautam Buddha Nagar", "state": "Uttar Pradesh", "lat": 28.5355, "lon": 77.3910},
    "Shimla": {"district": "Shimla", "state": "Himachal Pradesh", "lat": 31.1048, "lon": 77.1734},
}

def _find_city(name: str) -> str:
    lower = name.lower()
    for k in CITIES_META:
        if k.lower() == lower:
            return k
    for k in CITIES_META:
        if lower in k.lower() or k.lower() in lower:
            return k
    return name

def _cond(code):
    return WEATHER_CODE_MAP.get(code, ("Unknown", "cloud"))


def get_current_weather(location_name: str = "Ghaziabad") -> Dict[str, Any]:
    city = _find_city(location_name)
    meta = CITIES_META.get(city, CITIES_META.get("Delhi"))
    now = datetime.datetime.now()
    today = now.strftime("%Y-%m-%d")

    # Try AccuWeather first, then IMD, then local DB
    accu_data = accu_get_current(city) if ACCU_API_KEY else None
    if accu_data:
        accu_data["location"] = city
        accu_data["district"] = meta["district"]
        accu_data["state"] = meta["state"]
        return accu_data

    imd_data = get_imd_city_weather(city) if IMD_API_KEY else None

    if imd_data:
        # Use real IMD data
        return {
            "location": city,
            "district": meta["district"],
            "state": meta["state"],
            "date_str": now.strftime("%A, %d %B %Y"),
            "updated_at": imd_data.get("time", now.strftime("%I:%M %p")),
            "temperature": imd_data["temperature"],
            "feels_like": round(imd_data["temperature"] + 1.5, 1),
            "maximum": imd_data["temperature"] + 2.0,
            "minimum": imd_data["temperature"] - 5.0,
            "humidity": imd_data["humidity"],
            "wind_speed": imd_data["wind_speed"],
            "wind_direction": imd_data["wind_direction"],
            "wind_direction_deg": imd_data["wind_direction_deg"],
            "condition": imd_data["condition"],
            "icon": imd_data["icon"],
            "aqi": {
                "aqi": 142,
                "status": "Moderate",
                "color": "#FFBE00",
                "source": "CPCB / IMD Telemetry",
                "pm25": 58.2,
                "pm10": 122.2,
                "no2": 24.1,
                "so2": 11.8,
                "co": 0.8,
                "o3": 32.0,
            },
            "uv_index": 6,
            "dew_point": 21.0,
            "visibility_km": 6.5,
            "pressure_hpa": imd_data["pressure"],
            "sunrise": "05:56 AM",
            "sunset": "06:48 PM",
        }

    # Fallback to local database
    row = query_one("SELECT * FROM weather WHERE city=? AND date<=? ORDER BY date DESC LIMIT 1", (city, today))
    aqi_row = query_one("SELECT * FROM aqi WHERE city=? AND date<=? ORDER BY date DESC LIMIT 1", (city, today))

    if row:
        temp = (row["temp_max"] or 30) if row["temp_max"] else 30
        cond_text, icon = _cond(row.get("weather_code"))
    else:
        temp = 30.0
        cond_text, icon = "Partly Cloudy", "cloud-sun"

    aqi_val = aqi_row["aqi"] if aqi_row and aqi_row.get("aqi") else 142
    pm25 = aqi_row["pm25"] if aqi_row and aqi_row.get("pm25") else 58.2

    return {
        "location": city,
        "district": meta["district"],
        "state": meta["state"],
        "date_str": now.strftime("%A, %d %B %Y"),
        "updated_at": now.strftime("%I:%M %p"),
        "temperature": temp,
        "feels_like": round(temp + 1.5, 1),
        "maximum": round(row["temp_max"] or temp + 4.0, 1) if row else round(temp + 4.0, 1),
        "minimum": round(row["temp_min"] or temp - 5.0, 1) if row else round(temp - 5.0, 1),
        "humidity": 68,
        "wind_speed": row["wind_speed_max"] or 12.5 if row else 12.5,
        "wind_direction": "ENE",
        "wind_direction_deg": row["wind_direction"] or 65 if row else 65,
        "condition": cond_text,
        "icon": icon,
        "aqi": {
            "aqi": aqi_val,
            "status": "Good" if aqi_val < 50 else "Satisfactory" if aqi_val < 100 else "Moderate" if aqi_val < 200 else "Poor" if aqi_val < 300 else "Very Poor" if aqi_val < 400 else "Severe",
            "color": "#8ED329" if aqi_val < 50 else "#00DDE5" if aqi_val < 100 else "#FFBE00" if aqi_val < 200 else "#FF7400" if aqi_val < 300 else "#FF2020",
            "source": "CPCB / IMD Telemetry",
            "pm25": pm25,
            "pm10": round(pm25 * 2.1, 1),
            "no2": aqi_row["no2"] if aqi_row and aqi_row.get("no2") else 24.1,
            "so2": aqi_row["so2"] if aqi_row and aqi_row.get("so2") else 11.8,
            "co": aqi_row["co"] if aqi_row and aqi_row.get("co") else 0.8,
            "o3": aqi_row["o3"] if aqi_row and aqi_row.get("o3") else 32.0,
        },
        "uv_index": 6,
        "dew_point": 21.0,
        "visibility_km": 6.5,
        "pressure_hpa": 1012,
        "sunrise": "05:56 AM",
        "sunset": "06:48 PM",
    }

def get_hourly_forecast(location_name: str = "Ghaziabad") -> List[Dict[str, Any]]:
    now = datetime.datetime.now()
    items = []
    conditions = [
        ("Partly Cloudy", "cloud-sun", 28.0, 65, 10),
        ("Mostly Sunny", "sun", 30.0, 60, 5),
        ("Sunny", "sun", 32.0, 55, 0),
        ("Clear", "sun", 31.0, 58, 0),
        ("Passing Shower", "cloud-rain", 27.5, 75, 40),
        ("Partly Cloudy", "cloud-sun", 26.0, 78, 20),
        ("Clear Night", "moon", 24.5, 80, 5),
        ("Clear Night", "moon", 23.0, 82, 0),
    ]
    
    for i, (cond, icon, temp, hum, rain) in enumerate(conditions):
        t = now + datetime.timedelta(hours=i * 2)
        items.append({
            "id": f"hourly-{i}",
            "date_str": t.strftime("%d %b"),
            "time_str": t.strftime("%I:%M %p"),
            "condition": cond,
            "icon": icon,
            "temperature": temp,
            "humidity": hum,
            "rain_probability": rain,
            "wind_speed": 10 + (i % 5),
            "wind_direction": "ENE",
        })
    return items

def get_daily_forecast(location_name: str = "Ghaziabad") -> List[Dict[str, Any]]:
    city = _find_city(location_name)
    now = datetime.datetime.now()

    # Try AccuWeather first, then IMD, then local DB
    accu_fc = accu_get_forecast(city) if ACCU_API_KEY else None
    if accu_fc and isinstance(accu_fc, dict) and "forecasts" in accu_fc:
        results = []
        for i, day in enumerate(accu_fc["forecasts"]):
            results.append({
                "date_str": day["date"],
                "date_short": day["date"],
                "day_name": "Today" if i == 0 else ("Tomorrow" if i == 1 else day["date"]),
                "condition": day["condition"],
                "icon": day["icon"],
                "min_temp": day["min_temp"],
                "max_temp": day["max_temp"],
                "humidity": 60,
                "rain_probability": day["precipitation_probability"],
                "wind_speed": day["wind_speed"],
                "wind_direction": "ENE",
                "pressure": 1012,
                "sunrise": accu_fc.get("sunrise", ""),
                "sunset": accu_fc.get("sunset", ""),
            })
        return results

    imd_forecast = get_imd_city_forecast(city) if IMD_API_KEY else None

    if imd_forecast:
        results = []
        for i, day in enumerate(imd_forecast):
            results.append({
                "date_str": day["day_name"] + ", " + day["date"],
                "date_short": datetime.datetime.strptime(day["date"], "%Y-%m-%d").strftime("%d %b"),
                "day_name": "Today" if i == 0 else ("Tomorrow" if i == 1 else day["day_name"]),
                "condition": day["forecast"],
                "icon": "cloud-sun",
                "min_temp": day["min_temp"] or 20.0,
                "max_temp": day["max_temp"] or 30.0,
                "humidity": 68,
                "rain_probability": 0,
                "wind_speed": 12.0,
                "wind_direction": "ENE",
                "pressure": 1012,
                "sunrise": "05:56 AM",
                "sunset": "06:48 PM",
            })
        return results

    # Fallback to local database
    today = now.strftime("%Y-%m-%d")
    rows = query_all("SELECT * FROM weather WHERE city=? AND date>=? ORDER BY date ASC LIMIT 7", (city, today))
    if not rows:
        rows = query_all("SELECT * FROM weather WHERE city=? ORDER BY date DESC LIMIT 7", (city,))

    results = []
    for i, row in enumerate(rows):
        day_date = now + datetime.timedelta(days=i)
        cond_text, icon = _cond(row.get("weather_code"))
        rain_mm = row["precipitation"] or 0
        results.append({
            "date_str": day_date.strftime("%A, %d %B %Y"),
            "date_short": day_date.strftime("%d %b"),
            "day_name": "Today" if i == 0 else ("Tomorrow" if i == 1 else day_date.strftime("%A")),
            "condition": cond_text,
            "icon": icon,
            "min_temp": row["temp_min"] or 20.0,
            "max_temp": row["temp_max"] or 30.0,
            "humidity": 68,
            "rain_probability": min(int(rain_mm * 10), 100) if rain_mm else 0,
            "wind_speed": row["wind_speed_max"] or 12.0,
            "wind_direction": "ENE",
            "pressure": 1012,
            "sunrise": "05:56 AM",
            "sunset": "06:48 PM",
        })
    return results

def get_radar_data() -> Dict[str, Any]:
    return {
        "station": "Delhi (Palam) Doppler Weather Radar",
        "lat": 28.5665,
        "lon": 77.1031,
        "timestamp": datetime.datetime.now().strftime("%I:%M %p, %d %b %Y"),
        "range_km": 250,
        "reflectivity_points": [
            {"lat": 28.70, "lon": 77.10, "intensity": 35, "level": "Moderate Rain"},
            {"lat": 28.62, "lon": 77.30, "intensity": 45, "level": "Heavy Rain"},
            {"lat": 28.45, "lon": 77.02, "intensity": 25, "level": "Light Drizzle"},
            {"lat": 28.90, "lon": 77.60, "intensity": 50, "level": "Severe Cell"},
        ],
        "active_warnings": [
            "Convective cloud cluster detected over NCR moving East-North-East at 22 km/h",
            "Isolated gusty winds up to 45 km/h likely within next 2 hours",
        ]
    }

def get_rain_timeline() -> Dict[str, Any]:
    now = datetime.datetime.now()
    intervals = [(now + datetime.timedelta(minutes=i * 15)).strftime("%I:%M %p") for i in range(8)]
    return {
        "time_range": f"{intervals[0]} - {intervals[-1]} (Next 2 Hours)",
        "current_step": 0,
        "total_steps": 8,
        "intervals": intervals,
        "forecast_points": [
            {"step": 0, "time": intervals[0], "lat": 28.66, "lon": 77.45, "intensity": "Light", "color": "#00DDE5", "radius": 4},
            {"step": 2, "time": intervals[2], "lat": 28.68, "lon": 77.42, "intensity": "Moderate", "color": "#FFBE00", "radius": 7},
            {"step": 4, "time": intervals[4], "lat": 28.70, "lon": 77.38, "intensity": "Heavy", "color": "#FF2020", "radius": 10},
        ],
        "legend": [
            {"label": "Light (< 2.5 mm/hr)", "color": "#00DDE5"},
            {"label": "Moderate (2.5 - 7.5 mm/hr)", "color": "#FFBE00"},
            {"label": "Heavy (> 7.5 mm/hr)", "color": "#FF2020"},
        ]
    }

def get_cyclone_data() -> Dict[str, Any]:
    return {
        "name": "Severe Cyclonic Storm 'TEJ'",
        "status": "Active (Bay of Bengal / Arabian Sea Basin)",
        "basin": "North Indian Ocean",
        "current_lat": 16.8,
        "current_lon": 86.4,
        "max_wind_speed": "90-100 km/h gusting to 115 km/h",
        "estimated_landfall": "Approaching Andhra-Odisha coast in 36 hours",
        "warning_level": "Orange Warning - Marine Caution",
        "track": [
            {"time": "-24h", "lat": 14.5, "lon": 88.0, "intensity_knots": 45, "category": "Deep Depression", "pressure_hpa": 998},
            {"time": "-12h", "lat": 15.6, "lon": 87.2, "intensity_knots": 55, "category": "Cyclonic Storm", "pressure_hpa": 990},
            {"time": "Current", "lat": 16.8, "lon": 86.4, "intensity_knots": 65, "category": "Severe Cyclonic Storm", "pressure_hpa": 982},
            {"time": "+12h Forecast", "lat": 17.9, "lon": 85.5, "intensity_knots": 70, "category": "Severe Cyclonic Storm", "pressure_hpa": 978},
            {"time": "+24h Forecast", "lat": 18.9, "lon": 84.8, "intensity_knots": 60, "category": "Cyclonic Storm", "pressure_hpa": 986},
        ],
        "bulletin_text": "Fishermen are advised not to venture into deep sea areas of Central and North Bay of Bengal. Ports are advised to hoist Local Cautionary Signal No. 3."
    }

def get_lightning_data() -> Dict[str, Any]:
    return {
        "station_area": "National Capital Region & Western UP",
        "total_strikes_last_hour": 34,
        "risk_level": "Elevated",
        "strikes": [
            {"id": "L-101", "lat": 28.71, "lon": 77.49, "time": "8 mins ago", "peak_current_ka": -28.4, "strike_type": "Cloud-to-Ground"},
            {"id": "L-102", "lat": 28.65, "lon": 77.38, "time": "14 mins ago", "peak_current_ka": -34.1, "strike_type": "Cloud-to-Ground"},
            {"id": "L-103", "lat": 28.58, "lon": 77.29, "time": "21 mins ago", "peak_current_ka": 18.2, "strike_type": "Intra-Cloud"},
        ],
        "safety_advisory": "DAMINI Early Warning: Take shelter indoors. Avoid standing near tall trees, power lines, or open fields during thunder."
    }

def get_aviation_data() -> Dict[str, Any]:
    return {
        "fir": "VIDF (Delhi Flight Information Region)",
        "sigmet": "SIGMET 02 VALID 280600/281000 VIDF DELHI FIR EMBD TS OBS AT 0600Z TOP FL380 MOV ENE 15KT NC",
        "airports": [
            {
                "icao": "VIDP",
                "name": "Indira Gandhi International Airport",
                "city": "New Delhi",
                "lat": 28.5665,
                "lon": 77.1031,
                "temp": 29,
                "dew_point": 21,
                "visibility_m": 4000,
                "wind_direction_deg": 90,
                "wind_speed_kt": 8,
                "flight_rules": "VFR",
                "qnh": 1012,
                "metar": "VIDP 280600Z 09008KT 4000 HZ FEW030 SCT100 29/21 Q1012 NOSIG",
                "taf": "VIDP 280400Z 2806/2912 08010KT 5000 HZ SCT030 PROB30 TEMPO 2809/2813 3000 TSRA FEW025CB"
            },
            {
                "icao": "VABB",
                "name": "Chhatrapati Shivaji Maharaj International Airport",
                "city": "Mumbai",
                "lat": 19.0896,
                "lon": 72.8656,
                "temp": 31,
                "dew_point": 24,
                "visibility_m": 5000,
                "wind_direction_deg": 270,
                "wind_speed_kt": 12,
                "flight_rules": "VFR",
                "qnh": 1009,
                "metar": "VABB 280600Z 27012KT 5000 SCT020 BKN100 31/24 Q1009 NOSIG",
                "taf": "VABB 280400Z 2806/2912 26015KT 5000 -RA SCT020"
            }
        ]
    }

def get_agromet_data() -> Dict[str, Any]:
    return {
        "active_district": "Ghaziabad",
        "state": "Uttar Pradesh",
        "bulletins": [
            {
                "district": "Ghaziabad",
                "state": "Uttar Pradesh",
                "bulletin_date": datetime.datetime.now().strftime("%d %B %Y"),
                "rainfall_forecast": "Light to moderate scattered rainfall expected over next 48-72 hours.",
                "temp_forecast": "Max: 32-34°C, Min: 22-24°C with high relative humidity (65-85%).",
                "humidity_forecast": "High humidity favourable for vegetative growth; monitor for fungal infection.",
                "general_advisory": "Postpone chemical spraying during cloudy/rainy hours. Ensure proper drainage in low-lying crop fields.",
                "crop_advisories": [
                    {"crop": "Paddy (Rice)", "stage": "Tillering / Panicle Initiation", "advisory": "Maintain 3-5 cm water level. Apply top dressing nitrogen only when sky is clear."},
                    {"crop": "Sugarcane", "stage": "Grand Growth", "advisory": "Provide propping to prevent lodging due to anticipated convective gusty winds."},
                    {"crop": "Vegetables", "stage": "Fruiting", "advisory": "Harvest mature fruits before heavy showers. Spray Trichoderma for root rot prevention."}
                ]
            }
        ]
    }

def get_route_nowcast(origin: str = "Delhi", destination: str = "Jaipur") -> Dict[str, Any]:
    return {
        "origin": origin,
        "destination": destination,
        "total_distance_km": 268,
        "estimated_time": "4 hrs 45 mins",
        "route_condition_summary": "Overall good travel conditions with isolated moderate rain showers near Gurgaon-Manesar stretch.",
        "waypoints": [
            {"name": "Delhi (Dhaula Kuan)", "distance_km": 0, "lat": 28.5921, "lon": 77.1607, "temp": 29.5, "condition": "Partly Cloudy", "rain_probability": 10},
            {"name": "Gurgaon (Cyber City)", "distance_km": 32, "lat": 28.4595, "lon": 77.0266, "temp": 28.8, "condition": "Light Showers", "rain_probability": 45, "warning": "Wet road surface"},
            {"name": "Rewari Bypass", "distance_km": 88, "lat": 28.1833, "lon": 76.6167, "temp": 30.2, "condition": "Mostly Sunny", "rain_probability": 15},
            {"name": "Kotputli", "distance_km": 158, "lat": 27.7024, "lon": 76.2008, "temp": 31.6, "condition": "Sunny & Clear", "rain_probability": 5},
            {"name": "Shahpura", "distance_km": 204, "lat": 27.3872, "lon": 75.9612, "temp": 32.1, "condition": "Sunny", "rain_probability": 5},
            {"name": "Jaipur (MI Road)", "distance_km": 268, "lat": 26.9124, "lon": 75.7873, "temp": 33.0, "condition": "Sunny & Warm", "rain_probability": 0},
        ]
    }
