from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.core.database import Base

class PartsCategory(Base):
    __tablename__ = "parts_categories"

    id = Column(Integer, primary_key=True, index=True)
    category_name = Column(String(100), nullable=False)
    unit = Column(String(20))
    default_points = Column(Integer, default=0)
    disposal_type = Column(String(50), default="翻新")  # 翻新/拆解/环保处理
    status = Column(Integer, default=1)  # 0=停用 1=启用
    create_time = Column(DateTime, default=datetime.utcnow)
    update_time = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_deleted = Column(Integer, default=0, nullable=False)
