
from enum import Enum 
from models.base import Base
from sqlalchemy.sql.expression import text


from sqlalchemy import TIMESTAMP, Column, Double, ForeignKey, Integer, String, Boolean


class RateType(str, Enum):
    Sharing = "Sharing"
    Purchase = "Purchase"

class PanelStatus(str, Enum):
    Pending= "Pending"
    Approved = "Approved"
    Rejected = "Rejected"

class UserPanelModel(Base):
    
    __tablename__ = "user_panels"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    panel_id = Column(Integer, ForeignKey("panel_lists.id",ondelete="CASCADE"), nullable=False)
    username = Column(String, nullable=False)
    password = Column(String, nullable=False)
    cal_amount = Column(Integer, nullable=False)
    bank_image_url = Column(String, nullable=True) #Payment Screenshot Url
    status = Column(String, nullable=False)
    isdeleted = Column(Boolean,default=False)
    created_at = Column(TIMESTAMP(timezone=True),
                        nullable=True, server_default=text('now()'))


    