from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Menu(Base):
    __tablename__ = "menus"

    id = Column(Integer, primary_key=True, index=True)
    menu_name = Column(String(50), nullable=False)
    menu_code = Column(String(50), unique=True)
    icon = Column(String(50))
    path = Column(String(200))
    component = Column(String(200))
    parent_id = Column(Integer, ForeignKey("menus.id"), nullable=True)
    sort_order = Column(Integer, default=0)
    permission_code = Column(String(100))
    status = Column(Integer, default=1)
    create_time = Column(DateTime, default=datetime.utcnow)
    is_deleted = Column(Integer, default=0, nullable=False)

    parent = relationship("Menu", remote_side=[id], backref="children")
