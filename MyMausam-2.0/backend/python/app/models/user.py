from dataclasses import dataclass
from typing import Optional

@dataclass
class UserModel:
    id: str
    name: str
    email: Optional[str]
    role: str = "citizen"
    persona: str = "health"
    language: str = "English"
