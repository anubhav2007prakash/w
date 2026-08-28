from fastapi import APIRouter, Query
from typing import Optional
from app.services.alert_service import get_active_alerts

router = APIRouter(prefix="/alerts", tags=["alerts"])

@router.get("")
def list_alerts(location: Optional[str] = Query(None)):
    return get_active_alerts(location)
