from models.base import Base
from sqlalchemy.sql.expression import text


from sqlalchemy import TIMESTAMP, Column, Double, ForeignKey, Integer, String


class PanelModel(Base):
    
    __tablename__ = "panel_lists"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(100), nullable=False)
    exchange_url = Column(String, nullable=False)
    exchange_type = Column(String, nullable=False)
    amount = Column(Integer, nullable=False)
    imageurl = Column(String, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(TIMESTAMP(timezone=True),
                        nullable=False, server_default=text('now()'))
    