import hashlib
import hmac
import time
from typing import Dict, Any
from app.core.config import settings

def generate_session_token(user_id: str) -> str:
    timestamp = str(int(time.time()))
    raw = f"{user_id}:{timestamp}:{settings.JWT_SECRET_KEY}".encode("utf-8")
    signature = hashlib.sha256(raw).hexdigest()
    return f"{user_id}.{timestamp}.{signature}"

def verify_session_token(token: str) -> bool:
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return False
        user_id, timestamp, signature = parts
        raw = f"{user_id}:{timestamp}:{settings.JWT_SECRET_KEY}".encode("utf-8")
        expected = hashlib.sha256(raw).hexdigest()
        return hmac.compare_digest(signature, expected)
    except Exception:
        return False
