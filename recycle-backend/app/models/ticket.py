from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from datetime import datetime
from app.core.database import Base

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    template_id = Column(Integer, ForeignKey("ticket_templates.id"), nullable=False)
    ticket_no = Column(String(32), unique=True, nullable=False)
    title = Column(String(200), nullable=False)
    data_json = Column(Text)
    current_node = Column(String(50))
    status = Column(Integer, default=0)  # 0=待处理 1=处理中 2=已完成 3=已关闭
    creator_id = Column(Integer, ForeignKey("users.id"))
    creator_name = Column(String(50))
    assignee_id = Column(Integer, ForeignKey("users.id"))
    assignee_name = Column(String(50))
    create_time = Column(DateTime, default=datetime.utcnow)
    update_time = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_deleted = Column(Integer, default=0, nullable=False)
