from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class ChatbotQueryRequest(BaseModel):
    query: str
    location: Optional[str] = "Ghaziabad"
    language: Optional[str] = "English"
    persona: Optional[str] = "health"

class ChatbotQueryResponse(BaseModel):
    answer: str
    voice_summary: str
    action_links: Optional[List[Dict[str, str]]] = None
