from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class WorkflowTask(Base):
    __tablename__ = "workflow_tasks"

    id = Column(Integer, primary_key=True, index=True)
    instance_id = Column(Integer, ForeignKey("workflow_instances.id"), nullable=False)
    node_name = Column(String(50), nullable=False)
    node_key = Column(String(50), nullable=False)
    assignee_type = Column(String(20), default="user")  # user/role/dept
    assignee_id = Column(Integer)
    assignee_name = Column(String(50))
    action = Column(String(20))  # submit/pass/reject/transfer
    comment = Column(Text)
    create_time = Column(DateTime, default=datetime.utcnow)
    is_deleted = Column(Integer, default=0, nullable=False)
    complete_time = Column(DateTime)

    instance = relationship("WorkflowInstance", back_populates="tasks")
