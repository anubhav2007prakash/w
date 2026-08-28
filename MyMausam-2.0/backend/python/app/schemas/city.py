from typing import Optional
from pydantic import BaseModel

class CitySchema(BaseModel):
    id: Optional[int] = None
    name: str
    district: str
    state: str
    latitude: float
    longitude: float
    is_default: bool = False
