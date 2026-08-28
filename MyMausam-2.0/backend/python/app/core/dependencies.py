from typing import Generator
import sqlite3
from app.database import get_db

def get_database_connection() -> Generator[sqlite3.Connection, None, None]:
    with get_db() as conn:
        yield conn
