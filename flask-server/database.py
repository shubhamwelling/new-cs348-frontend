import sqlite3
from sqlalchemy import create_engine

try:
    sqlite3.connect("test.db")
    print("SQLite connection worked!")
except Exception as e:
    print(f"SQLite Connection error: {e}")


try:
    engine = create_engine("sqlite:///test.db")
    engine.connect()
    print("SQLAlchemy connected to the SQLite DB!")
except Exception as e:
    print(f"SQLAlchemy Connection Error: {e}")
