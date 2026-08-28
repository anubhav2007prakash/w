import sqlite3
import os
from contextlib import contextmanager
from typing import Generator, Any, Dict, List

DB_PATH = os.environ.get(
    "MAUSAM_DB_PATH",
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "mausam.db")
)

def dict_factory(cursor: sqlite3.Cursor, row: tuple) -> Dict[str, Any]:
    fields = [col[0] for col in cursor.description]
    return {key: value for key, value in zip(fields, row)}

@contextmanager
def get_db() -> Generator[sqlite3.Connection, None, None]:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = dict_factory
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

def query_all(sql: str, params: tuple = ()) -> List[Dict[str, Any]]:
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(sql, params)
        return cursor.fetchall()

def query_one(sql: str, params: tuple = ()) -> Dict[str, Any] | None:
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(sql, params)
        return cursor.fetchone()

def execute_write(sql: str, params: tuple = ()) -> int:
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(sql, params)
        return cursor.lastrowid
