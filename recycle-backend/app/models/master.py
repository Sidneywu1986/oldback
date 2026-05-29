from sqlalchemy import Column, Integer, String, DateTime, Text, DECIMAL, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Master(Base):
    __tablename__ = "masters"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    phone = Column(String(20), nullable=False)
    id_card = Column(String(18))
    avatar = Column(String(255))
    dept_id = Column(Integer, ForeignKey("departments.id"))
    level = Column(String(20), default="初级")  # 初级/中级/高级/专家
    skill_tags = Column(String(255))  # JSON-like: ["空调","冰箱"]
    service_area = Column(String(255))
    credit_score = Column(Integer, default=100)
    recycle_count = Column(Integer, default=0)
    points_balance = Column(Integer, default=0)
    status = Column(Integer, default=0)  # 0=待审核 1=正常 2=冻结 3=清退
    join_date = Column(DateTime)
    create_time = Column(DateTime, default=datetime.utcnow)
    update_time = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_deleted = Column(Integer, default=0, nullable=False)

    department = relationship("Department")
    recycle_orders = relationship("RecycleOrder", back_populates="master")
    fund_account = relationship("FundAccount", back_populates="master", uselist=False)
