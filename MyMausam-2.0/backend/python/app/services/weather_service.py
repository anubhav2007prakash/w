import datetime
import random
from typing import List, Dict, Any

CITIES_DATA = {
    "Ghaziabad": {"district": "Ghaziabad", "state": "Uttar Pradesh", "lat": 28.6692, "lon": 77.4538, "temp": 28.5, "cond": "Partly Cloudy", "icon": "cloud-sun"},
    "Delhi": {"district": "New Delhi", "state": "Delhi", "lat": 28.6139, "lon": 77.2090, "temp": 29.2, "cond": "Hazy Sunshine", "icon": "sun"},
    "Noida": {"district": "Gautam Buddha Nagar", "state": "Uttar Pradesh", "lat": 28.5355, "lon": 77.3910, "temp": 28.8, "cond": "Mostly Sunny", "icon": "sun"},
    "Mumbai": {"district": "Mumbai City", "state": "Maharashtra", "lat": 19.0760, "lon": 72.8777, "temp": 31.0, "cond": "Humid & Breezy", "icon": "wind"},
    "Bengaluru": {"district": "Bengaluru Urban", "state": "Karnataka", "lat": 12.9716, "lon": 77.5946, "temp": 24.5, "cond": "Pleasant Breeze", "icon": "cloud"},
    "Kolkata": {"district": "Kolkata", "state": "West Bengal", "lat": 22.5726, "lon": 88.3639, "temp": 30.1, "cond": "Scattered Clouds", "icon": "cloud-sun"},
    "Chennai": {"district": "Chennai", "state": "Tamil Nadu", "lat": 13.0827, "lon": 80.2707, "temp": 32.4, "cond": "Warm & Humid", "icon": "sun"},
    "Jaipur": {"district": "Jaipur", "state": "Rajasthan", "lat": 26.9124, "lon": 75.7873, "temp": 33.0, "cond": "Sunny", "icon": "sun"},
    "Hyderabad": {"district": "Hyderabad", "state": "Telangana", "lat": 17.3850, "lon": 78.4867, "temp": 27.8, "cond": "Partly Cloudy", "icon": "cloud-sun"},
    "Shimla": {"district": "Shimla", "state": "Himachal Pradesh", "lat": 31.1048, "lon": 77.1734, "temp": 16.2, "cond": "Cool & Clear", "icon": "cloud"},
}

def get_current_weather(location_name: str = "Ghaziabad") -> Dict[str, Any]:
    matched_key = None
    for k in CITIES_DATA:
        if k.lower() == location_name.lower():
            matched_key = k
            break
    
    city = CITIES_DATA.get(matched_key or "Ghaziabad", CITIES_DATA["Ghaziabad"])
    now = datetime.datetime.now()
    
    return {
        "location": matched_key or location_name,
        "district": city["district"],
        "state": city["state"],
        "date_str": now.strftime("%A, %d %B %Y"),
        "updated_at": now.strftime("%I:%M %p"),
        "temperature": city["temp"],
        "feels_like": round(city["temp"] + 1.5, 1),
        "maximum": round(city["temp"] + 4.0, 1),
        "minimum": round(city["temp"] - 5.0, 1),
        "humidity": 68,
        "wind_speed": 12.5,
        "wind_direction": "ENE",
        "wind_direction_deg": 65,
        "condition": city["cond"],
        "icon": city["icon"],
        "aqi": {
            "aqi": 142,
            "status": "Moderate",
            "color": "#FFBE00",
            "source": "CPCB / IMD Telemetry",
            "pm25": 58.2,
            "pm10": 112.4,
            "no2": 24.1,
            "so2": 11.8,
            "co": 0.8,
            "o3": 32.0,
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
    now = datetime.datetime.now()
    days_data = [
        ("Today", "Sunny Intervals", "sun", 23.0, 32.5, 65, 10),
        ("Tomorrow", "Passing Showers", "cloud-rain", 22.5, 30.0, 75, 55),
        ("Day 3", "Thunderstorm Watch", "cloud-lightning", 21.0, 28.5, 82, 70),
        ("Day 4", "Partly Cloudy", "cloud-sun", 22.0, 31.0, 70, 25),
        ("Day 5", "Clear & Breezy", "sun", 23.5, 33.0, 60, 5),
        ("Day 6", "Sunny", "sun", 24.0, 34.0, 55, 0),
        ("Day 7", "Scattered Clouds", "cloud", 23.0, 32.0, 62, 15),
    ]
    
    results = []
    for i, (label, cond, icon, min_t, max_t, hum, rain) in enumerate(days_data):
        day_date = now + datetime.timedelta(days=i)
        results.append({
            "date_str": day_date.strftime("%A, %d %B %Y"),
            "date_short": day_date.strftime("%d %b"),
            "day_name": "Today" if i == 0 else ("Tomorrow" if i == 1 else day_date.strftime("%A")),
            "condition": cond,
            "icon": icon,
            "min_temp": min_t,
            "max_temp": max_t,
            "humidity": hum,
            "rain_probability": rain,
            "wind_speed": 12.0,
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
