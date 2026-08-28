from typing import Optional
from pydantic import BaseModel

class UserProfileSchema(BaseModel):
    id: str
    name: str
    email: Optional[str] = None
    role: str = "citizen"
    persona: str = "health"
    language: str = "English"
    temp_unit: str = "C"
    wind_unit: str = "km/h"
    push_notifications: bool = True
    auto_location: bool = True
