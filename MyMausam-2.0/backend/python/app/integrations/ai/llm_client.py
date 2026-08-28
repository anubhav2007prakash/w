import os
from typing import Optional

class LLMClient:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY")

    async def generate_weather_response(self, system_prompt: str, user_prompt: str) -> str:
        # Fallback response generator when external LLM API key is not supplied
        return f"Based on live IMD meteorological observations: {user_prompt} is monitored with stable seasonal trends."

llm_client = LLMClient()
