from models.base import Base
from sqlalchemy.sql.expression import text

from sqlalchemy import TIMESTAMP, Column, ForeignKey, Integer, String, Enum, Boolean


class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, nullable=False)
    type = Column(Enum("Deposit", "Withdraw", "ACC_NEW", name="nt_types"))
    status = Column(Boolean, default=True)
    dismissed = Column(Boolean, default=False)
    user_panel_id = Column(Integer, ForeignKey("user_panels.id", ondelete="CASCADE"))
    created_at = Column(TIMESTAMP(timezone=True),
                        nullable=True, server_default=text('now()'))
