from typing import List, Optional
from pydantic import BaseModel

class RecommendationItemSchema(BaseModel):
    id: str
    persona: str
    title: str
    description: str
    impact_score: int
    category: str
    action_url: Optional[str] = None
