from models.base import Base
from sqlalchemy import Column, Integer, String, BigInteger, ForeignKey, Boolean


class BankDetailModel(Base):
    __tablename__ = "bank_details"

    id = Column(Integer, primary_key=True, autoincrement=True)
    bank_name = Column(String(100), nullable=True)
    ifsc_code = Column(String(100), nullable=True)
    acc_no = Column(BigInteger, nullable=True)
    upi_id = Column(String(100), nullable=True)
    qrcode_image = Column(String, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    is_master = Column(Boolean, default=False)

