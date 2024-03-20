from enum import Enum
from models.base import Base

from sqlalchemy import BigInteger, Column, Integer, String

class Role(str, Enum):
    Admin = "Admin"
    User = "User"


class User(Base):
    # 49cad598778864f2b5db3b03217c299d
    
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    mobile = Column(BigInteger, unique=True)
    name = Column(String(100), nullable=False)
    password_hash = Column(String, nullable=False)
    # created_at = Column(DateTime, default=func.now())
    role = Column(String, nullable=False)
    
    
