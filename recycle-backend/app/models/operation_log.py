from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base


class OperationLog(Base):
    __tablename__ = "operation_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    username = Column(String(50), nullable=False)
    module = Column(String(50))  # 操作模块：recycle, user, role, fund 等
    operation = Column(String(50))  # 操作类型：add, edit, delete, audit, view 等
    target_id = Column(Integer)  # 操作目标ID
    target_name = Column(String(255))  # 操作目标名称
    before_data = Column(Text)  # 操作前数据（JSON）
    after_data = Column(Text)  # 操作后数据（JSON）
    ip_address = Column(String(50))
    user_agent = Column(String(500))
    operation_time = Column(DateTime, default=datetime.utcnow)
    status = Column(Integer, default=1)  # 0=失败 1=成功
    error_msg = Column(String(255))
    is_deleted = Column(Integer, default=0, nullable=False)
    
    user = relationship("User", backref="operation_logs")