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


# 7. User Settings
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
