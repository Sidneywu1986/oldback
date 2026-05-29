from sqlalchemy import Column, Integer, String, DateTime, JSON, ForeignKey, Float, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base


class PromotionActivity(Base):
    __tablename__ = "promotion_activities"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(String(500))
    activity_type = Column(String(50), nullable=False)
    rules = Column(JSON)
    status = Column(Integer, nullable=False, default=0)
    priority = Column(Integer, default=1)
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    applicable_tags = Column(JSON)
    exclude_tags = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_deleted = Column(Integer, default=0, nullable=False)
    
    participants = relationship("PromotionParticipant", back_populates="activity")


class UserTag(Base):
    __tablename__ = "user_tags"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    tag_type = Column(String(50), nullable=False)
    value = Column(String(100))
    description = Column(String(200))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_deleted = Column(Integer, default=0, nullable=False)


class UserTagRelation(Base):
    __tablename__ = "user_tag_relations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    tag_id = Column(Integer, ForeignKey("user_tags.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    is_deleted = Column(Integer, default=0, nullable=False)
    
    user = relationship("User", backref="tag_relations")
    tag = relationship("UserTag", backref="user_relations")


class PromotionParticipant(Base):
    __tablename__ = "promotion_participants"
    
    id = Column(Integer, primary_key=True, index=True)
    activity_id = Column(Integer, ForeignKey("promotion_activities.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    order_id = Column(Integer, ForeignKey("recycle_orders.id"))
    used_amount = Column(Float, default=0)
    used_points = Column(Integer, default=0)
    status = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_deleted = Column(Integer, default=0, nullable=False)
    
    activity = relationship("PromotionActivity", back_populates="participants")
    user = relationship("User", backref="promotion_participants")
    order = relationship("RecycleOrder", backref="promotion_participants")