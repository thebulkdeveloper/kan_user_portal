from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from services.config import settings
from urllib.parse import quote_plus

# DB_CONN = "sqlite:///database.db"

# Replace by actual sql database credemtial in .env file



DB_CONN = f"postgresql://{settings.database_username}:{quote_plus(settings.database_password)}@{settings.database_hostname}/{settings.database_name}"



engine = create_engine(DB_CONN, echo=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()