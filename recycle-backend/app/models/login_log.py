from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base


class LoginLog(Base):
    __tablename__ = "login_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    username = Column(String(50), nullable=False)
    ip_address = Column(String(50))
    user_agent = Column(String(500))
    login_time = Column(DateTime, default=datetime.utcnow)
    status = Column(Integer, nullable=False)  # 0=失败 1=成功
    error_msg = Column(String(255))
    is_deleted = Column(Integer, default=0, nullable=False)
    
    user = relationship("User", backref="login_logs")