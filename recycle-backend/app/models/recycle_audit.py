from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class RecycleAudit(Base):
    __tablename__ = "recycle_audits"

    id = Column(Integer, primary_key=True, index=True)
    recycle_id = Column(Integer, ForeignKey("recycle_orders.id"), nullable=False)
    auditor_id = Column(Integer, ForeignKey("users.id"))
    auditor_name = Column(String(50))
    action = Column(String(20), nullable=False)  # pass/reject/return/confirm/dispose
    comment = Column(Text)
    create_time = Column(DateTime, default=datetime.utcnow)
    is_deleted = Column(Integer, default=0, nullable=False)

    recycle_order = relationship("RecycleOrder", back_populates="audit_records")
