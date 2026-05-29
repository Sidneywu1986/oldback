from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from datetime import datetime
from app.core.database import Base

class PointsRecord(Base):
    __tablename__ = "points_records"

    id = Column(Integer, primary_key=True, index=True)
    master_id = Column(Integer, ForeignKey("masters.id"), nullable=False)
    recycle_id = Column(Integer, ForeignKey("recycle_orders.id"), nullable=True)
    points_type = Column(String(20), nullable=False)  # recycle/bonus/penalty/exchange
    points_amount = Column(Integer, nullable=False)
    balance_after = Column(Integer, nullable=False)
    related_order_no = Column(String(32))
    remark = Column(Text)
    create_time = Column(DateTime, default=datetime.utcnow)
    is_deleted = Column(Integer, default=0, nullable=False)
