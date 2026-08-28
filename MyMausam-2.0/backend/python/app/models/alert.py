from dataclasses import dataclass
from typing import Optional

@dataclass
class WeatherAlertModel:
    id: Optional[int]
    location_name: str
    alert_type: str
    severity: str
    description: str
    date_of_issue: str
    valid_upto: str
    status_text: str
    is_active: bool = True
