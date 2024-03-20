from sqlalchemy import TIMESTAMP, BigInteger, Column, ForeignKey, Integer, text
from models.base import Base


class Wallet(Base):
    __tablename__ = "wallet"

    id = Column(Integer, autoincrement=True, primary_key=True)
    balance = Column(BigInteger, default=0, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    created_at = Column(TIMESTAMP(timezone=True),
                        nullable=False, server_default=text('now()'))
    updated_at = Column(TIMESTAMP(timezone=True), nullable=True)
