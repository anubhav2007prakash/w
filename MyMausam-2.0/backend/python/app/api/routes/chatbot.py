from fastapi import APIRouter
from app.schemas.chatbot import ChatbotQueryRequest, ChatbotQueryResponse
from app.services.chatbot_service import process_weather_query

router = APIRouter(prefix="/chatbot", tags=["chatbot"])

@router.post("/query", response_model=ChatbotQueryResponse)
def query_weather_ai(req: ChatbotQueryRequest):
    return process_weather_query(req.query, req.location or "Ghaziabad", req.language or "English", req.persona or "health")
