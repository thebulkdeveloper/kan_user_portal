from models.base import Base
from sqlalchemy.sql.expression import text

from sqlalchemy import TIMESTAMP, Column, Double, ForeignKey, Integer, String, Boolean, Enum


class Passbook(Base):
    __tablename__ = "passbook"

    id = Column(Integer, primary_key=True, autoincrement=True)
    amount = Column(Integer, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # fk
    panel_id = Column(Integer, ForeignKey("user_panels.id", ondelete="CASCADE"))  # fk
    approved_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    transaction_id = Column(String, nullable=True)
    delivered = Column(Boolean, default=False)
    transaction_type = Column(Enum("Deposit", "Withdraw", name="transaction_type"))
    screenshot = Column(String, nullable=True, default=None)
    is_rejected = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP(timezone=True),
                        nullable=True, server_default=text('now()'))
    is_deleted = Column(Boolean, default=False)
    # approved_at = Column(TIMESTAMP(timezone=True), nullable=True)
