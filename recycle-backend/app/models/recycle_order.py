from sqlalchemy import Column, Integer, String, DateTime, Text, DECIMAL, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class RecycleOrder(Base):
    __tablename__ = "recycle_orders"

    id = Column(Integer, primary_key=True, index=True)
    order_no = Column(String(32), unique=True, nullable=False, index=True)
    master_id = Column(Integer, ForeignKey("masters.id"), nullable=False)
    parts_name = Column(String(100), nullable=False)
    parts_type = Column(String(50))
    device_type = Column(String(50))
    fault_desc = Column(Text)
    old_parts_img = Column(String(255))
    new_parts_img = Column(String(255))
    work_img = Column(String(255))
    status = Column(Integer, default=0)  # 0=待审核 1=审核通过 2=审核驳回 3=已入库 4=已处置 5=待重传 6=已关闭 7=积分已发放
    user_keep = Column(Integer, default=0)  # 0=平台回收 1=用户自留
    workflow_instance_id = Column(Integer, ForeignKey("workflow_instances.id"), nullable=True)
    reject_reason = Column(Text)
    points = Column(Integer, default=0)
    point_status = Column(Integer, default=0)  # 0=未发放 1=已发放 2=冻结
    amount = Column(DECIMAL(10, 2), default=0)
    amount_status = Column(Integer, default=0)
    lat = Column(DECIMAL(10, 6), nullable=True)
    lng = Column(DECIMAL(10, 6), nullable=True)
    address = Column(String(255), nullable=True)
    create_time = Column(DateTime, default=datetime.utcnow)
    update_time = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_deleted = Column(Integer, default=0, nullable=False)

    master = relationship("Master", back_populates="recycle_orders")
    audit_records = relationship("RecycleAudit", back_populates="recycle_order", order_by="RecycleAudit.create_time.desc()")
