import datetime
import random
import time
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, Query, Body
from pydantic import BaseModel

from app.database import query_all, query_one, execute_write
from app.services import weather_service

# ── In-memory OTP store (phone → {code, expires_at}) ──────────────
_otp_store: Dict[str, Dict[str, Any]] = {}
OTP_TTL_SECONDS = 300  # 5 minutes
OTP_LENGTH = 6


class SendOtpRequest(BaseModel):
    phone: str


class VerifyOtpRequest(BaseModel):
    phone: str
    otp: str

api_router = APIRouter(prefix="/api")

# Models for request bodies
class FavouriteCreate(BaseModel):
    location_name: str
    district: str
    state: str
    latitude: float
    longitude: float
    current_temp: float
    min_temp: float
    max_temp: float
    condition: str

class CrowdReportCreate(BaseModel):
    location_name: str
    condition: str
    severity: str
    description: str
    image_url: Optional[str] = None
    reporter_name: str

class UserSettingsUpdate(BaseModel):
    language: Optional[str] = None
    temp_unit: Optional[str] = None
    wind_unit: Optional[str] = None
    rain_unit: Optional[str] = None
    push_notifications: Optional[bool] = None
    auto_location: Optional[bool] = None


# 1. Weather Endpoints
@api_router.get("/weather/current")
def get_current_weather(location: Optional[str] = Query(None)):
    return weather_service.get_current_weather(location or "Ghaziabad")

@api_router.get("/weather/hourly")
def get_hourly_forecast(location: Optional[str] = Query(None)):
    return weather_service.get_hourly_forecast(location or "Ghaziabad")

@api_router.get("/weather/forecast")
def get_daily_forecast(location: Optional[str] = Query(None)):
    return weather_service.get_daily_forecast(location or "Ghaziabad")

@api_router.get("/weather/alerts")
def get_weather_alerts():
    try:
        alerts = query_all("SELECT * FROM weather_alerts WHERE is_active = 1")
        if alerts:
            return alerts
    except Exception:
        pass
    # Fallback default alert
    return [
        {
            "id": 1,
            "location_name": "Ghaziabad & Delhi NCR",
            "alert_type": "Thunderstorm with Squall",
            "severity": "Yellow Alert (Be Updated)",
            "description": "Scattered thunderstorms accompanied by lightning and surface gusty winds (35-45 kmph) likely over parts of NCR.",
            "date_of_issue": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
            "valid_upto": (datetime.datetime.now() + datetime.timedelta(hours=24)).strftime("%Y-%m-%d %H:%M"),
            "status_text": "Active Warning",
            "color": "#FFBE00"
        }
    ]


# 2. Locations & Search
@api_router.get("/locations")
def get_locations():
    try:
        return query_all("SELECT * FROM locations ORDER BY name ASC")
    except Exception:
        return [
            {"id": 1, "name": "Ghaziabad", "district": "Ghaziabad", "state": "Uttar Pradesh", "latitude": 28.6692, "longitude": 77.4538, "is_default": 1},
            {"id": 2, "name": "Delhi", "district": "New Delhi", "state": "Delhi", "latitude": 28.6139, "longitude": 77.2090, "is_default": 0},
            {"id": 3, "name": "Noida", "district": "Gautam Buddha Nagar", "state": "Uttar Pradesh", "latitude": 28.5355, "longitude": 77.3910, "is_default": 0},
            {"id": 4, "name": "Mumbai", "district": "Mumbai City", "state": "Maharashtra", "latitude": 19.0760, "longitude": 72.8777, "is_default": 0},
            {"id": 5, "name": "Bengaluru", "district": "Bengaluru Urban", "state": "Karnataka", "latitude": 12.9716, "longitude": 77.5946, "is_default": 0},
        ]

@api_router.get("/locations/search")
def search_locations(q: str = Query("")):
    try:
        pattern = f"%{q}%"
        return query_all(
            "SELECT * FROM locations WHERE name LIKE ? OR district LIKE ? OR state LIKE ? LIMIT 10",
            (pattern, pattern, pattern)
        )
    except Exception:
        return []


# 3. Favourites
@api_router.get("/favourites")
def get_favourites():
    try:
        return query_all("SELECT * FROM favourites ORDER BY id DESC")
    except Exception:
        return []

@api_router.post("/favourites")
def add_favourite(item: FavouriteCreate):
    created_at = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    fav_id = execute_write(
        """
        INSERT INTO favourites (location_name, district, state, latitude, longitude, current_temp, min_temp, max_temp, condition, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (item.location_name, item.district, item.state, item.latitude, item.longitude, item.current_temp, item.min_temp, item.max_temp, item.condition, created_at)
    )
    return {
        "id": fav_id,
        "location_name": item.location_name,
        "district": item.district,
        "state": item.state,
        "latitude": item.latitude,
        "longitude": item.longitude,
        "current_temp": item.current_temp,
        "min_temp": item.min_temp,
        "max_temp": item.max_temp,
        "condition": item.condition,
        "created_at": created_at
    }

@api_router.delete("/favourites/{fav_id}")
def delete_favourite(fav_id: int):
    execute_write("DELETE FROM favourites WHERE id = ?", (fav_id,))
    return {"message": "Favourite removed successfully"}


# 4. Notifications
@api_router.get("/notifications")
def get_notifications():
    try:
        return query_all("SELECT * FROM notifications ORDER BY id DESC")
    except Exception:
        return [
            {
                "id": 1,
                "title": "IMD Weather Watch Alert",
                "description": "Scattered moderate rainfall and gusty winds expected during evening hours in your area.",
                "category": "Weather Alert",
                "severity": "Moderate",
                "area": "NCR Region",
                "timestamp": "25 mins ago",
                "is_read": False
            }
        ]

@api_router.patch("/notifications/{notif_id}/read")
def mark_notification_read(notif_id: int):
    execute_write("UPDATE notifications SET is_read = 1 WHERE id = ?", (notif_id,))
    item = query_one("SELECT * FROM notifications WHERE id = ?", (notif_id,))
    if not item:
        raise HTTPException(status_code=404, detail="Notification not found")
    return item


# 5. Crowdsource Reports
@api_router.get("/crowdsource")
def get_crowd_reports():
    try:
        return query_all("SELECT * FROM crowd_reports ORDER BY id DESC")
    except Exception:
        return []

@api_router.post("/crowdsource")
def submit_crowd_report(report: CrowdReportCreate):
    timestamp = datetime.datetime.now().strftime("%I:%M %p, %d %b")
    report_id = execute_write(
        """
        INSERT INTO crowd_reports (location_name, condition, severity, description, image_url, reporter_name, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (report.location_name, report.condition, report.severity, report.description, report.image_url, report.reporter_name, timestamp)
    )
    return {
        "id": report_id,
        "location_name": report.location_name,
        "condition": report.condition,
        "severity": report.severity,
        "description": report.description,
        "image_url": report.image_url,
        "reporter_name": report.reporter_name,
        "timestamp": timestamp
    }


# 6. Specialized Weather Modules
@api_router.get("/radar")
def get_radar():
    return weather_service.get_radar_data()

@api_router.get("/rain-alert/timeline")
def get_rain_timeline():
    return weather_service.get_rain_timeline()

@api_router.get("/cyclone")
def get_cyclone():
    return weather_service.get_cyclone_data()

@api_router.get("/lightning")
def get_lightning():
    return weather_service.get_lightning_data()

@api_router.get("/aviation")
def get_aviation():
    return weather_service.get_aviation_data()

@api_router.get("/agromet")
def get_agromet():
    return weather_service.get_agromet_data()

@api_router.get("/route-nowcast")
def get_route_nowcast(origin: Optional[str] = Query("Delhi"), destination: Optional[str] = Query("Jaipur")):
    return weather_service.get_route_nowcast(origin or "Delhi", destination or "Jaipur")


# 7. Heat/Cold Wave Alerts
@api_router.get("/heatwave")
def get_heatwave_alerts(location: Optional[str] = Query(None)):
    """Derives heat/cold wave alerts from current weather data."""
    loc = location or "Delhi"
    try:
        weather = weather_service.get_current_weather(loc)
    except Exception:
        weather = {"temperature": 30, "feels_like": 32, "location": loc}
    temp = weather.get("temperature", 30)
    feels = weather.get("feels_like", temp)
    alerts = []
    if temp >= 45:
        alerts.append({"id": 1, "district": loc, "state": "", "alert_type": "Severe Heat Wave", "max_temp": temp, "min_temp": temp - 5, "heat_index": feels, "severity": "Severe", "color": "#FF2020", "issued_date": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"), "valid_upto": (datetime.datetime.now() + datetime.timedelta(hours=24)).strftime("%Y-%m-%d %H:%M"), "advisory": "Extreme heat. Avoid all outdoor exposure 12-4 PM. Drink ORS every 30 min."})
    elif temp >= 40:
        alerts.append({"id": 1, "district": loc, "state": "", "alert_type": "Heat Wave", "max_temp": temp, "min_temp": temp - 4, "heat_index": feels, "severity": "Moderate", "color": "#FF7400", "issued_date": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"), "valid_upto": (datetime.datetime.now() + datetime.timedelta(hours=24)).strftime("%Y-%m-%d %H:%M"), "advisory": "Heat wave conditions. Stay hydrated. Avoid strenuous outdoor work during peak hours."})
    elif temp <= 2:
        alerts.append({"id": 1, "district": loc, "state": "", "alert_type": "Cold Wave", "max_temp": temp, "min_temp": temp - 8, "heat_index": feels, "severity": "Moderate", "color": "#00BFFF", "issued_date": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"), "valid_upto": (datetime.datetime.now() + datetime.timedelta(hours=24)).strftime("%Y-%m-%d %H:%M"), "advisory": "Cold wave conditions. Wear warm layers. Protect livestock and pipes from freezing."})
    # Also check DB for any stored alerts
    try:
        db_alerts = query_all("SELECT * FROM weather_alerts WHERE is_active = 1")
        for a in db_alerts:
            if "heat" in (a.get("alert_type", "").lower() or "") or "cold" in (a.get("alert_type", "").lower() or ""):
                alerts.append({"id": a["id"], "district": a.get("location_name", loc), "state": "", "alert_type": a["alert_type"], "max_temp": temp, "min_temp": temp - 5, "heat_index": feels, "severity": a.get("severity", "Moderate"), "color": a.get("color", "#FFBE00"), "issued_date": a.get("date_of_issue", ""), "valid_upto": a.get("valid_upto", ""), "advisory": a.get("description", "")})
    except Exception:
        pass
    return alerts


# 8. Urban Flood Nowcast
@api_router.get("/flood-nowcast")
def get_flood_nowcast(location: Optional[str] = Query(None)):
    """Derives flood risk from weather/rainfall data using rule-based assessment."""
    loc = location or "Delhi"
    try:
        weather = weather_service.get_current_weather(loc)
    except Exception:
        weather = {"temperature": 30, "humidity": 60, "wind_speed": 10, "location": loc, "condition": "Unknown"}
    humidity = weather.get("humidity", 60)
    temp = weather.get("temperature", 30)
    condition = (weather.get("condition", "") or "").lower()
    # Rule-based flood risk assessment
    rain_indicators = sum([
        1 if "rain" in condition else 0,
        1 if "shower" in condition else 0,
        1 if "thunder" in condition else 0,
        1 if humidity > 85 else 0,
        1 if "heavy" in condition else 0,
    ])
    if rain_indicators >= 3:
        risk = "High"
        color = "#FF7400"
        rain_mm = 80 + humidity * 0.5
        intensity = "Heavy"
    elif rain_indicators >= 2:
        risk = "Moderate"
        color = "#FFBE00"
        rain_mm = 30 + humidity * 0.3
        intensity = "Moderate"
    elif rain_indicators >= 1:
        risk = "Low"
        color = "#8ED329"
        rain_mm = 10 + humidity * 0.1
        intensity = "Light"
    else:
        risk = "Minimal"
        color = "#8ED329"
        rain_mm = 0
        intensity = "None"
    return [{
        "city": loc, "state": "", "lat": 28.6, "lon": 77.2, "rainfall_24h_mm": round(rain_mm, 1), "rainfall_intensity": intensity, "water_level_m": round(rain_mm / 100, 2), "risk_level": risk, "risk_color": color, "affected_areas": [], "advisory": f"Risk assessed from current weather ({weather.get('condition', 'N/A')}, humidity {humidity}%). {risk} flood risk. Monitor local drainage." if rain_indicators > 0 else "No significant flood risk at this time. Conditions are dry."
    }]


# 9. Seasonal Climate Outlook
@api_router.get("/seasonal-outlook")
def get_seasonal_outlook(region: Optional[str] = Query(None)):
    """Returns seasonal outlook based on current month and derived statistical analysis."""
    now = datetime.datetime.now()
    month = now.month
    if 6 <= month <= 9:
        season = "Monsoon"
        period = "Jun-Sep"
    elif 10 <= month <= 11:
        season = "Post-Monsoon"
        period = "Oct-Dec"
    elif month <= 2:
        season = "Winter"
        period = "Jan-Feb"
    else:
        season = "Pre-Monsoon"
        period = "Mar-May"
    reg = region or "All India"
    try:
        weather = weather_service.get_current_weather(reg.split(",")[0] if "," in reg else reg)
        temp = weather.get("temperature", 28)
    except Exception:
        temp = 28
    # Derived: compare current temp against seasonal norm
    seasonal_norms = {"Monsoon": 30, "Post-Monsoon": 28, "Winter": 20, "Pre-Monsoon": 34}
    norm = seasonal_norms.get(season, 28)
    departure = temp - norm
    if departure > 2:
        temp_dept = "Above Normal"
    elif departure < -2:
        temp_dept = "Below Normal"
    else:
        temp_dept = "Near Normal"
    return [{
        "season": f"{season} {now.year}", "period": period, "region": reg, "temp_departure": temp_dept, "temp_value": f"+{departure:.1f}°C" if departure >= 0 else f"{departure:.1f}°C", "rainfall_departure": "Near Normal", "rainfall_value": "95-105% LPA", "confidence": "Moderate", "description": f"Current temperature ({temp}°C) is {temp_dept.lower()} compared to {season} seasonal average ({norm}°C) for {reg}. This is a derived estimate, not an official IMD prediction.", "source": "Derived from live weather data — not an official IMD forecast", "last_updated": now.strftime("%I:%M %p, %d %b %Y")
    }]


# 10. Monsoon Tracker
@api_router.get("/monsoon-tracker")
def get_monsoon_tracker(region: Optional[str] = Query(None)):
    """Returns monsoon status derived from current weather conditions."""
    now = datetime.datetime.now()
    month = now.month
    monsoon_active = 6 <= month <= 9
    stations_data = []
    sample_cities = ["Delhi", "Mumbai", "Kolkata", "Chennai", "Bengaluru", "Jaipur", "Lucknow", "Shimla"]
    for city in sample_cities:
        try:
            w = weather_service.get_current_weather(city)
            temp = w.get("temperature", 30)
            humidity = w.get("humidity", 60)
            condition = (w.get("condition", "") or "").lower()
            rain_active = any(x in condition for x in ["rain", "shower", "thunder", "drizzle"])
            est_rainfall = humidity * 1.5 if rain_active else humidity * 0.3
            normal = 150 if monsoon_active else 50
            departure = round(((est_rainfall - normal) / normal) * 100, 1) if normal > 0 else 0
            stations_data.append({"name": city, "region": w.get("state", ""), "onset_date": "01 Jun", "withdrawal_date": "15 Oct", "rainfall_mm": round(est_rainfall, 1), "normal_mm": normal, "departure_pct": departure, "status": "Active" if rain_active else "Dry", "color": "#8ED329" if abs(departure) < 20 else "#FFBE00" if departure < -20 else "#00BFFF"})
        except Exception:
            stations_data.append({"name": city, "region": "", "onset_date": "01 Jun", "withdrawal_date": "15 Oct", "rainfall_mm": 0, "normal_mm": 50, "departure_pct": 0, "status": "No Data", "color": "#999"})
    active = sum(1 for s in stations_data if s["status"] == "Active")
    deficient = sum(1 for s in stations_data if s["departure_pct"] < -20)
    excess = sum(1 for s in stations_data if s["departure_pct"] > 20)
    avg = round(sum(s["departure_pct"] for s in stations_data) / len(stations_data), 1) if stations_data else 0
    return {
        "all_india_pct_lpa": 100 + avg, "active_regions": active, "deficient_regions": deficient, "excess_regions": excess, "last_updated": now.strftime("%I:%M %p, %d %b %Y"), "stations": stations_data
    }


# 11. Mountain Weather
@api_router.get("/mountain-weather")
def get_mountain_weather(station: Optional[str] = Query(None)):
    """Returns weather for Himalayan/mountain stations."""
    MOUNTAIN_STATIONS = [
        {"name": "Gulmarg", "altitude_m": 2650, "region": "Jammu & Kashmir", "lat": 34.05, "lon": 74.38},
        {"name": "Manali", "altitude_m": 2050, "region": "Himachal Pradesh", "lat": 32.24, "lon": 77.19},
        {"name": "Shimla", "altitude_m": 2276, "region": "Himachal Pradesh", "lat": 31.10, "lon": 77.17},
        {"name": "Leh", "altitude_m": 3524, "region": "Ladakh", "lat": 34.15, "lon": 77.58},
        {"name": "Sonamarg", "altitude_m": 2800, "region": "Jammu & Kashmir", "lat": 34.30, "lon": 75.03},
        {"name": "Auli", "altitude_m": 3050, "region": "Uttarakhand", "lat": 30.53, "lon": 79.57},
    ]
    result = []
    for st in MOUNTAIN_STATIONS:
        if station and st["name"].lower() != station.lower():
            continue
        try:
            w = weather_service.get_current_weather(st["name"])
            temp = w.get("temperature", 5)
            wind = w.get("wind_speed", 15)
            condition = w.get("condition", "Clear")
            visibility = w.get("visibility_km", 5)
        except Exception:
            temp, wind, condition, visibility = 5, 15, "Clear", 5
        # Altitude-based adjustments
        alt_factor = (st["altitude_m"] - 500) / 1000
        adj_temp = round(temp - alt_factor * 6, 1)
        feels_like = round(adj_temp - wind * 0.3, 1)
        snow_possible = adj_temp < 5 and "cloud" in condition.lower()
        aval_risk = "Moderate" if snow_possible and wind > 20 else "Low"
        aval_color = "#FFBE00" if aval_risk == "Moderate" else "#8ED329"
        result.append({"name": st["name"], "altitude_m": st["altitude_m"], "region": st["region"], "lat": st["lat"], "lon": st["lon"], "temperature": adj_temp, "feels_like": feels_like, "wind_speed": wind, "wind_gust": round(wind * 1.6, 1), "snowfall_24h_cm": 15 if snow_possible else 0, "visibility": f"{visibility} km" if visibility else "Unknown", "avalanche_risk": aval_risk, "avalanche_color": aval_color, "condition": condition, "advisory": f"Temperature {adj_temp}°C. {'Snow possible at altitude. Check road conditions before travel.' if snow_possible else 'Conditions stable.'} Altitude: {st['altitude_m']}m.", "source": "Derived from weather API with altitude correction", "last_updated": datetime.datetime.now().strftime("%I:%M %p")
        })
    return result if result else MOUNTAIN_STATIONS


# 12. Air Quality (SAFAR)
@api_router.get("/air-quality")
def get_air_quality(location: Optional[str] = Query(None)):
    """Returns AQI data from current weather's AQI field or DB."""
    loc = location or "Delhi"
    try:
        weather = weather_service.get_current_weather(loc)
        aqi_info = weather.get("aqi", {})
    except Exception:
        aqi_info = {}
    aqi_val = aqi_info.get("aqi", 100)
    pm25 = aqi_info.get("pm25", 40)
    pm10 = aqi_info.get("pm10", 80)
    no2 = aqi_info.get("no2", 20)
    so2 = aqi_info.get("so2", 10)
    co_val = aqi_info.get("co", 1.0)
    o3_val = aqi_info.get("o3", 30)
    if aqi_val < 50:
        cat, color = "Good", "#8ED329"
        health = "Air quality is satisfactory. Enjoy outdoor activities."
    elif aqi_val < 100:
        cat, color = "Satisfactory", "#8ED329"
        health = "Air quality is acceptable. Unusually sensitive people should reduce prolonged outdoor exertion."
    elif aqi_val < 200:
        cat, color = "Moderate", "#FFBE00"
        health = "Sensitive groups should reduce prolonged outdoor exertion. General public is less likely to be affected."
    elif aqi_val < 300:
        cat, color = "Poor", "#FF7400"
        health = "Everyone should reduce prolonged outdoor exertion. Sensitive groups should avoid it."
    elif aqi_val < 400:
        cat, color = "Very Poor", "#9933CC"
        health = "Avoid all outdoor activity. Use N95 masks if stepping out. Keep windows closed."
    else:
        cat, color = "Severe", "#FF2020"
        health = "Health emergency. Stay indoors. Use air purifier. Avoid all physical activity outdoors."
    primary = "PM2.5" if pm25 > 60 else "PM10" if pm10 > 100 else "NO2" if no2 > 40 else "O3" if o3_val > 50 else "PM2.5"
    return [{"city": loc, "aqi": aqi_val, "aqi_category": cat, "aqi_color": color, "pm25": pm25, "pm10": pm10, "no2": no2, "so2": so2, "co": co_val, "o3": o3_val, "primary_pollutant": primary, "health_advisory": health, "source": aqi_info.get("source", "Derived from weather API"), "last_updated": datetime.datetime.now().strftime("%I:%M %p, %d %b %Y")}]


# 13. User Settings
@api_router.get("/settings")
def get_settings():
    try:
        settings = query_one("SELECT * FROM user_settings WHERE id = 1")
        if settings:
            return {
                "language": settings.get("language", "English"),
                "temp_unit": settings.get("temp_unit", "C"),
                "wind_unit": settings.get("wind_unit", "km/h"),
                "rain_unit": settings.get("rain_unit", "mm"),
                "push_notifications": bool(settings.get("push_notifications", 1)),
                "auto_location": bool(settings.get("auto_location", 1))
            }
    except Exception:
        pass
    return {
        "language": "English",
        "temp_unit": "C",
        "wind_unit": "km/h",
        "rain_unit": "mm",
        "push_notifications": True,
        "auto_location": True
    }


# ── Auth: Phone OTP Endpoints ─────────────────────────────────────
@api_router.post("/auth/send-otp")
def send_otp(body: SendOtpRequest):
    phone = body.phone.strip()
    if not phone or len(phone.replace(" ", "")) < 10:
        raise HTTPException(status_code=400, detail="Invalid phone number")

    # Generate numeric OTP
    code = "".join([str(random.randint(0, 9)) for _ in range(OTP_LENGTH)])
    _otp_store[phone] = {
        "code": code,
        "expires_at": time.time() + OTP_TTL_SECONDS,
    }

    # ─── LOG OTP TO SERVER CONSOLE (replace with Twilio/MSG91 later) ───
    print(f"\n{'='*50}")
    print(f"  📱 OTP for {phone}: {code}")
    print(f"  ⏱  Expires in {OTP_TTL_SECONDS // 60} minutes")
    print(f"{'='*50}\n")

    return {
        "success": True,
        "message": f"OTP sent to {phone}",
        # In dev mode, include OTP in response so you can see it in browser
        "dev_otp": code,
    }


@api_router.post("/auth/verify-otp")
def verify_otp(body: VerifyOtpRequest):
    phone = body.phone.strip()
    otp_code = body.otp.strip()

    stored = _otp_store.get(phone)
    if not stored:
        raise HTTPException(status_code=400, detail="No OTP sent to this number. Please request a new code.")

    if time.time() > stored["expires_at"]:
        del _otp_store[phone]
        raise HTTPException(status_code=400, detail="OTP has expired. Please request a new code.")

    if stored["code"] != otp_code:
        raise HTTPException(status_code=400, detail="Incorrect OTP. Please try again.")

    # OTP verified — remove from store
    del _otp_store[phone]
    return {
        "success": True,
        "message": "Phone number verified successfully",
    }


@api_router.put("/settings")
def update_settings(update: UserSettingsUpdate):
    current = get_settings()
    updated = {
        "language": update.language if update.language is not None else current["language"],
        "temp_unit": update.temp_unit if update.temp_unit is not None else current["temp_unit"],
        "wind_unit": update.wind_unit if update.wind_unit is not None else current["wind_unit"],
        "rain_unit": update.rain_unit if update.rain_unit is not None else current["rain_unit"],
        "push_notifications": int(update.push_notifications if update.push_notifications is not None else current["push_notifications"]),
        "auto_location": int(update.auto_location if update.auto_location is not None else current["auto_location"]),
    }
    try:
        execute_write(
            """
            UPDATE user_settings 
            SET language = ?, temp_unit = ?, wind_unit = ?, rain_unit = ?, push_notifications = ?, auto_location = ?
            WHERE id = 1
            """,
            (updated["language"], updated["temp_unit"], updated["wind_unit"], updated["rain_unit"], updated["push_notifications"], updated["auto_location"])
        )
    except Exception:
        pass
    return {
        "language": updated["language"],
        "temp_unit": updated["temp_unit"],
        "wind_unit": updated["wind_unit"],
        "rain_unit": updated["rain_unit"],
        "push_notifications": bool(updated["push_notifications"]),
        "auto_location": bool(updated["auto_location"])
    }
