from sqlalchemy import Column, Integer, String, DateTime, Text
from datetime import datetime
from app.core.database import Base

class WorkflowDef(Base):
    __tablename__ = "workflow_defs"

    id = Column(Integer, primary_key=True, index=True)
    workflow_name = Column(String(100), nullable=False)
    workflow_key = Column(String(50), unique=True, nullable=False)
    version = Column(Integer, default=1)
    status = Column(Integer, default=1)  # 0=停用 1=启用
    config_json = Column(Text)  # JSON: nodes and edges
    create_time = Column(DateTime, default=datetime.utcnow)
    update_time = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_deleted = Column(Integer, default=0, nullable=False)
