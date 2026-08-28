from typing import Optional
from pydantic import BaseModel

class WeatherAlertSchema(BaseModel):
    id: Optional[int] = None
    location_name: str
    alert_type: str
    severity: str
    description: str
    date_of_issue: str
    valid_upto: str
    status_text: str
    color: Optional[str] = None
    is_active: bool = True
