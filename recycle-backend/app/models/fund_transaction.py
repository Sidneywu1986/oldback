from sqlalchemy import Column, Integer, String, DateTime, DECIMAL, Text, ForeignKey
from datetime import datetime
from app.core.database import Base

class FundTransaction(Base):
    __tablename__ = "fund_transactions"

    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("fund_accounts.id"))
    master_id = Column(Integer, ForeignKey("masters.id"), nullable=False)
    txn_type = Column(String(20), nullable=False)  # recycle_reward/withdraw/award/deduct/exchange
    amount = Column(DECIMAL(10, 2), nullable=False)
    balance_after = Column(DECIMAL(10, 2), nullable=False)
    related_order_no = Column(String(32))
    remark = Column(Text)
    status = Column(Integer, default=1)  # 0=失败 1=成功 2=处理中
    create_time = Column(DateTime, default=datetime.utcnow)
    is_deleted = Column(Integer, default=0, nullable=False)
