from fastapi import APIRouter, Query
from app.services.solar_service import estimate_rooftop_solar

router = APIRouter(prefix="/solar", tags=["solar"])

@router.get("/estimate")
def get_solar_estimate(area_sqft: float = Query(250.0), location: str = Query("Delhi")):
    return estimate_rooftop_solar(area_sqft, location)
