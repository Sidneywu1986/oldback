from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from datetime import datetime
from app.core.database import Base

class FormData(Base):
    __tablename__ = "form_data"

    id = Column(Integer, primary_key=True, index=True)
    form_id = Column(Integer, ForeignKey("form_definitions.id"), nullable=False)
    data_json = Column(Text, nullable=False)
    submitter_id = Column(Integer, ForeignKey("users.id"))
    submitter_name = Column(String(50))
    create_time = Column(DateTime, default=datetime.utcnow)
    is_deleted = Column(Integer, default=0, nullable=False)
