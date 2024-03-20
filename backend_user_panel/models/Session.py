from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP, text, Boolean

from models.base import Base


class Session(Base):
    __tablename__ = "sessions"
    id = Column(Integer, primary_key=True, autoincrement=True)
    token = Column(String, unique=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    status = Column(Boolean, nullable=False, default=True)
    created_at = Column(TIMESTAMP(timezone=True),
                        nullable=True, server_default=text('now()'))
