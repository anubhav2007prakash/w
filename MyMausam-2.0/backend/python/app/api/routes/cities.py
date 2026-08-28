from fastapi import APIRouter, Query
from app.database import query_all

router = APIRouter(prefix="/cities", tags=["cities"])

@router.get("")
def list_cities():
    return query_all("SELECT * FROM locations ORDER BY name ASC")

@router.get("/search")
def search_cities(q: str = Query("")):
    pattern = f"%{q}%"
    return query_all("SELECT * FROM locations WHERE name LIKE ? OR district LIKE ? LIMIT 10", (pattern, pattern))
