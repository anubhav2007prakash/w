from fastapi import APIRouter, Query
from app.services.recommendation_service import get_recommendations_for_persona

router = APIRouter(prefix="/recommendations", tags=["recommendations"])

@router.get("")
def list_recommendations(persona: str = Query("health")):
    return get_recommendations_for_persona(persona)
