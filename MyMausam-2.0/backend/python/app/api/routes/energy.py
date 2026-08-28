from fastapi import APIRouter
from app.services.energy_service import get_energy_optimization_metrics

router = APIRouter(prefix="/energy", tags=["energy"])

@router.get("/optimization")
def get_energy_data():
    return get_energy_optimization_metrics()
