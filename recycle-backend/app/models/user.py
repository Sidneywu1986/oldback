from sqlalchemy import Column, Integer, String, DateTime, JSON, ForeignKey, Table, event
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base
from app.core.security import get_password_hash

user_roles = Table(
    "user_roles",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("role_id", Integer, ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True),
)

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    real_name = Column(String(50))
    phone = Column(String(20))
    email = Column(String(100))
    avatar = Column(String(255))
    dept_id = Column(Integer, ForeignKey("departments.id"))
    is_super = Column(Integer, default=0)  # 0=普通 1=超级管理员
    status = Column(Integer, default=1)  # 0=禁用 1=启用
    last_login = Column(DateTime)
    create_time = Column(DateTime, default=datetime.utcnow)
    update_time = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_deleted = Column(Integer, default=0, nullable=False)
    
    roles = relationship("Role", secondary=user_roles, back_populates="users")
    department = relationship("Department", back_populates="users", foreign_keys=[dept_id])

@event.listens_for(User, "before_insert")
def hash_password_before_insert(mapper, connection, target):
    if target.password_hash and not target.password_hash.startswith("$"):
        target.password_hash = get_password_hash(target.password_hash)
