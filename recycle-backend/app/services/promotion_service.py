from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from typing import List, Dict, Any, Optional

from app.models.promotion import (
    PromotionActivity,
    UserTag,
    UserTagRelation,
    PromotionParticipant
)
from app.schemas.promotion import (
    PromotionActivityCreate,
    PromotionActivityUpdate,
    UserTagCreate,
    UserTagUpdate,
    ActivityStatsResponse
)


ACTIVITY_TYPE_LABELS = {
    "discount": "折扣活动",
    "full_reduction": "满减活动",
    "points_double": "积分加倍",
    "new_user_gift": "新人礼包"
}

STATUS_LABELS = {
    0: "待生效",
    1: "运行中",
    2: "已结束",
    3: "已禁用"
}

TAG_TYPE_LABELS = {
    "level": "等级",
    "region": "地域",
    "activity": "活跃度",
    "register_time": "注册时间"
}


class PromotionService:
    @staticmethod
    def create_activity(db: Session, data: PromotionActivityCreate) -> PromotionActivity:
        activity = PromotionActivity(
            name=data.name,
            description=data.description,
            activity_type=data.activity_type,
            rules=data.rules,
            priority=data.priority,
            start_time=data.start_time,
            end_time=data.end_time,
            applicable_tags=data.applicable_tags or [],
            exclude_tags=data.exclude_tags or [],
            status=0
        )
        
        now = datetime.utcnow()
        if activity.start_time and activity.start_time <= now:
            activity.status = 1
        
        db.add(activity)
        db.commit()
        db.refresh(activity)
        return activity

    @staticmethod
    def get_activity(db: Session, activity_id: int) -> Optional[PromotionActivity]:
        return db.query(PromotionActivity).filter(PromotionActivity.id == activity_id).first()

    @staticmethod
    def get_activities(db: Session, status: Optional[int] = None) -> List[PromotionActivity]:
        query = db.query(PromotionActivity)
        query = query.filter(PromotionActivity.is_deleted == 0)
        if status is not None:
            query = query.filter(PromotionActivity.status == status)
        return query.order_by(PromotionActivity.priority.desc(), PromotionActivity.created_at.desc()).all()

    @staticmethod
    def update_activity(db: Session, activity_id: int, data: PromotionActivityUpdate) -> Optional[PromotionActivity]:
        activity = PromotionService.get_activity(db, activity_id)
        if not activity:
            return None
        
        if data.name is not None:
            activity.name = data.name
        if data.description is not None:
            activity.description = data.description
        if data.rules is not None:
            activity.rules = data.rules
        if data.priority is not None:
            activity.priority = data.priority
        if data.start_time is not None:
            activity.start_time = data.start_time
        if data.end_time is not None:
            activity.end_time = data.end_time
        if data.applicable_tags is not None:
            activity.applicable_tags = data.applicable_tags
        if data.exclude_tags is not None:
            activity.exclude_tags = data.exclude_tags
        
        db.commit()
        db.refresh(activity)
        return activity

    @staticmethod
    def delete_activity(db: Session, activity_id: int) -> bool:
        activity = PromotionService.get_activity(db, activity_id)
        if not activity:
            return False
        
        activity.is_deleted = 1
        db.commit()
        return True

    @staticmethod
    def update_activity_status(db: Session, activity_id: int, status: int) -> Optional[PromotionActivity]:
        activity = PromotionService.get_activity(db, activity_id)
        if not activity:
            return None
        
        activity.status = status
        db.commit()
        db.refresh(activity)
        return activity

    @staticmethod
    def create_tag(db: Session, data: UserTagCreate) -> UserTag:
        tag = UserTag(
            name=data.name,
            tag_type=data.tag_type,
            value=data.value,
            description=data.description
        )
        db.add(tag)
        db.commit()
        db.refresh(tag)
        return tag

    @staticmethod
    def get_tag(db: Session, tag_id: int) -> Optional[UserTag]:
        return db.query(UserTag).filter(UserTag.id == tag_id).first()

    @staticmethod
    def get_tags(db: Session, tag_type: Optional[str] = None) -> List[UserTag]:
        query = db.query(UserTag)
        query = query.filter(UserTag.is_deleted == 0)
        if tag_type:
            query = query.filter(UserTag.tag_type == tag_type)
        return query.order_by(UserTag.created_at.desc()).all()

    @staticmethod
    def update_tag(db: Session, tag_id: int, data: UserTagUpdate) -> Optional[UserTag]:
        tag = PromotionService.get_tag(db, tag_id)
        if not tag:
            return None
        
        if data.name is not None:
            tag.name = data.name
        if data.tag_type is not None:
            tag.tag_type = data.tag_type
        if data.value is not None:
            tag.value = data.value
        if data.description is not None:
            tag.description = data.description
        
        db.commit()
        db.refresh(tag)
        return tag

    @staticmethod
    def delete_tag(db: Session, tag_id: int) -> bool:
        tag = PromotionService.get_tag(db, tag_id)
        if not tag:
            return False
        
        tag.is_deleted = 1
        db.commit()
        return True

    @staticmethod
    def assign_tags_to_user(db: Session, user_id: int, tag_ids: List[int]) -> bool:
        existing_relations = db.query(UserTagRelation).filter(UserTagRelation.user_id == user_id).all()
        existing_tag_ids = {rel.tag_id for rel in existing_relations}
        
        for tag_id in tag_ids:
            if tag_id not in existing_tag_ids:
                relation = UserTagRelation(user_id=user_id, tag_id=tag_id)
                db.add(relation)
        
        for rel in existing_relations:
            if rel.tag_id not in tag_ids:
                db.delete(rel)
        
        db.commit()
        return True

    @staticmethod
    def get_user_tags(db: Session, user_id: int) -> List[UserTag]:
        return db.query(UserTag).join(
            UserTagRelation, UserTag.id == UserTagRelation.tag_id
        ).filter(UserTagRelation.user_id == user_id).all()

    @staticmethod
    def get_user_activities(db: Session, user_id: int) -> List[PromotionActivity]:
        now = datetime.utcnow()
        
        user_tags = PromotionService.get_user_tags(db, user_id)
        user_tag_ids = {tag.id for tag in user_tags}
        
        query = db.query(PromotionActivity).filter(
            PromotionActivity.status == 1,
            PromotionActivity.start_time <= now,
            (PromotionActivity.end_time >= now) | (PromotionActivity.end_time.is_(None))
        )
        
        activities = query.all()
        matched_activities = []
        
        for activity in activities:
            applicable_tags = set(activity.applicable_tags or [])
            exclude_tags = set(activity.exclude_tags or [])
            
            if exclude_tags and user_tag_ids & exclude_tags:
                continue
            
            if not applicable_tags or user_tag_ids & applicable_tags:
                matched_activities.append(activity)
        
        return sorted(matched_activities, key=lambda x: x.priority, reverse=True)

    @staticmethod
    def record_participation(db: Session, activity_id: int, user_id: int, order_id: Optional[int] = None, 
                            used_amount: float = 0, used_points: int = 0) -> PromotionParticipant:
        participant = PromotionParticipant(
            activity_id=activity_id,
            user_id=user_id,
            order_id=order_id,
            used_amount=used_amount,
            used_points=used_points,
            status=1
        )
        db.add(participant)
        db.commit()
        db.refresh(participant)
        return participant

    @staticmethod
    def calculate_discount(activity: PromotionActivity, order_amount: float) -> float:
        rules = activity.rules or {}
        
        if activity.activity_type == "full_reduction":
            threshold = rules.get("threshold", 0)
            discount = rules.get("discount", 0)
            if order_amount >= threshold:
                return min(discount, order_amount)
            return 0
        
        elif activity.activity_type == "discount":
            rate = rules.get("rate", 1)
            return order_amount * (1 - rate)
        
        return 0

    @staticmethod
    def calculate_points_multiplier(activity: PromotionActivity) -> float:
        if activity.activity_type == "points_double":
            return activity.rules.get("multiplier", 1)
        return 1

    @staticmethod
    def get_activity_stats(db: Session, activity_id: int) -> ActivityStatsResponse:
        participants = db.query(PromotionParticipant).filter(
            PromotionParticipant.activity_id == activity_id
        )
        
        total_participants = participants.count()
        total_orders = participants.filter(PromotionParticipant.order_id.isnot(None)).count()
        total_discount = participants.with_entities(func.sum(PromotionParticipant.used_amount)).scalar() or 0
        total_points = participants.with_entities(func.sum(PromotionParticipant.used_points)).scalar() or 0
        
        conversion_rate = (total_orders / max(total_participants, 1)) * 100
        
        return ActivityStatsResponse(
            activity_id=activity_id,
            total_participants=total_participants,
            total_orders=total_orders,
            total_discount=total_discount,
            total_points=total_points,
            conversion_rate=round(conversion_rate, 2)
        )

    @staticmethod
    def sync_activity_status(db: Session):
        now = datetime.utcnow()
        
        db.query(PromotionActivity).filter(
            PromotionActivity.status == 0,
            PromotionActivity.start_time <= now
        ).update({"status": 1})
        
        db.query(PromotionActivity).filter(
            PromotionActivity.status == 1,
            PromotionActivity.end_time.isnot(None),
            PromotionActivity.end_time < now
        ).update({"status": 2})
        
        db.commit()