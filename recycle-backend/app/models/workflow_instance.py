from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class WorkflowInstance(Base):
    __tablename__ = "workflow_instances"

    id = Column(Integer, primary_key=True, index=True)
    workflow_id = Column(Integer, ForeignKey("workflow_defs.id"), nullable=False)
    business_key = Column(String(50))  # recycle_orders.id
    current_node = Column(String(50))
    status = Column(Integer, default=0)  # 0=运行中 1=已完成 2=已终止
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime)
    is_deleted = Column(Integer, default=0, nullable=False)

    tasks = relationship("WorkflowTask", back_populates="instance", order_by="WorkflowTask.create_time")
