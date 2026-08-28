import os
from typing import List
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "MyMausam 2.0"
    API_V1_STR: str = "/api"
    ENV: str = os.getenv("ENV", "development")
    PORT: int = int(os.getenv("PORT", 8000))
    CORS_ORIGINS: List[str] = ["*"]
    MAUSAM_DB_PATH: str = os.getenv("MAUSAM_DB_PATH", os.path.join(os.path.dirname(os.path.dirname(__file__)), "mausam.db"))
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "mymausam_secret_key_2026")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

settings = Settings()
