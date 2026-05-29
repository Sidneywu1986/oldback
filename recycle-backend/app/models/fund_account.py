from sqlalchemy import Column, Integer, String, DateTime, DECIMAL, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class FundAccount(Base):
    __tablename__ = "fund_accounts"

    id = Column(Integer, primary_key=True, index=True)
    master_id = Column(Integer, ForeignKey("masters.id"), unique=True, nullable=False)
    balance = Column(DECIMAL(10, 2), default=0)
    frozen_amount = Column(DECIMAL(10, 2), default=0)
    total_income = Column(DECIMAL(10, 2), default=0)
    total_outcome = Column(DECIMAL(10, 2), default=0)
    status = Column(Integer, default=1)  # 0=冻结 1=正常
    create_time = Column(DateTime, default=datetime.utcnow)
    update_time = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_deleted = Column(Integer, default=0, nullable=False)

    master = relationship("Master", back_populates="fund_account")
