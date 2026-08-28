from typing import List, Dict, Any
from app.database import query_all, execute_write

def get_active_alerts(location: str = None) -> List[Dict[str, Any]]:
    if location:
        return query_all("SELECT * FROM weather_alerts WHERE is_active = 1 AND location_name LIKE ?", (f"%{location}%",))
    return query_all("SELECT * FROM weather_alerts WHERE is_active = 1")

def deactivate_alert(alert_id: int) -> bool:
    execute_write("UPDATE weather_alerts SET is_active = 0, status_text = 'Resolved' WHERE id = ?", (alert_id,))
    return True
