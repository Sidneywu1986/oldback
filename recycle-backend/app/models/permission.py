from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Permission(Base):
    __tablename__ = "permissions"

    id = Column(Integer, primary_key=True, index=True)
    perm_name = Column(String(50), nullable=False)
    perm_code = Column(String(100), nullable=False, unique=True)
    perm_type = Column(String(20), default="menu")  # menu/button/api
    parent_id = Column(Integer, ForeignKey("permissions.id"), nullable=True)
    sort_order = Column(Integer, default=0)
    create_time = Column(DateTime, default=datetime.utcnow)
    is_deleted = Column(Integer, default=0, nullable=False)

    roles = relationship("Role", secondary="role_permissions", back_populates="permissions")
    parent = relationship("Permission", remote_side=[id], backref="children")
