from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.core.dependencies import get_current_active_user
from app.services.promotion_service import PromotionService, ACTIVITY_TYPE_LABELS, STATUS_LABELS, TAG_TYPE_LABELS
from app.schemas.promotion import (
    PromotionActivityCreate,
    PromotionActivityUpdate,
    PromotionActivityResponse,
    UserTagCreate,
    UserTagUpdate,
    UserTagResponse,
    UserTagAssign,
    UserActivityResponse,
    ActivityStatsResponse
)

router = APIRouter(tags=["促销活动"])


@router.post("/promotions/activities", response_model=PromotionActivityResponse)
def create_activity(
    data: PromotionActivityCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    activity = PromotionService.create_activity(db, data)
    return _build_activity_response(activity)


@router.get("/promotions/activities", response_model=List[PromotionActivityResponse])
def get_activities(
    status: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    activities = PromotionService.get_activities(db, status)
    return [_build_activity_response(activity) for activity in activities]


@router.get("/promotions/activities/{activity_id}", response_model=PromotionActivityResponse)
def get_activity(
    activity_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    activity = PromotionService.get_activity(db, activity_id)
    if not activity:
        raise HTTPException(status_code=404, detail="活动不存在")
    return _build_activity_response(activity)


@router.put("/promotions/activities/{activity_id}", response_model=PromotionActivityResponse)
def update_activity(
    activity_id: int,
    data: PromotionActivityUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    activity = PromotionService.update_activity(db, activity_id, data)
    if not activity:
        raise HTTPException(status_code=404, detail="活动不存在")
    return _build_activity_response(activity)


@router.delete("/promotions/activities/{activity_id}")
def delete_activity(
    activity_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    success = PromotionService.delete_activity(db, activity_id)
    if not success:
        raise HTTPException(status_code=404, detail="活动不存在")
    return {"message": "删除成功"}


@router.post("/promotions/activities/{activity_id}/status")
def update_activity_status(
    activity_id: int,
    status: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    activity = PromotionService.update_activity_status(db, activity_id, status)
    if not activity:
        raise HTTPException(status_code=404, detail="活动不存在")
    return _build_activity_response(activity)


@router.get("/promotions/activities/{activity_id}/stats", response_model=ActivityStatsResponse)
def get_activity_stats(
    activity_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    activity = PromotionService.get_activity(db, activity_id)
    if not activity:
        raise HTTPException(status_code=404, detail="活动不存在")
    return PromotionService.get_activity_stats(db, activity_id)


@router.post("/promotions/tags", response_model=UserTagResponse)
def create_tag(
    data: UserTagCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    tag = PromotionService.create_tag(db, data)
    return _build_tag_response(tag)


@router.get("/promotions/tags", response_model=List[UserTagResponse])
def get_tags(
    tag_type: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    tags = PromotionService.get_tags(db, tag_type)
    return [_build_tag_response(tag) for tag in tags]


@router.get("/promotions/tags/{tag_id}", response_model=UserTagResponse)
def get_tag(
    tag_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    tag = PromotionService.get_tag(db, tag_id)
    if not tag:
        raise HTTPException(status_code=404, detail="标签不存在")
    return _build_tag_response(tag)


@router.put("/promotions/tags/{tag_id}", response_model=UserTagResponse)
def update_tag(
    tag_id: int,
    data: UserTagUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    tag = PromotionService.update_tag(db, tag_id, data)
    if not tag:
        raise HTTPException(status_code=404, detail="标签不存在")
    return _build_tag_response(tag)


@router.delete("/promotions/tags/{tag_id}")
def delete_tag(
    tag_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    success = PromotionService.delete_tag(db, tag_id)
    if not success:
        raise HTTPException(status_code=404, detail="标签不存在")
    return {"message": "删除成功"}


@router.post("/promotions/users/{user_id}/tags")
def assign_tags_to_user(
    user_id: int,
    data: UserTagAssign,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    success = PromotionService.assign_tags_to_user(db, user_id, data.tag_ids)
    if not success:
        raise HTTPException(status_code=400, detail="标签分配失败")
    return {"message": "标签分配成功"}


@router.get("/promotions/users/{user_id}/tags", response_model=List[UserTagResponse])
def get_user_tags(
    user_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    tags = PromotionService.get_user_tags(db, user_id)
    return [_build_tag_response(tag) for tag in tags]


@router.get("/promotions/user-activities", response_model=List[UserActivityResponse])
def get_user_activities(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    activities = PromotionService.get_user_activities(db, current_user.id)
    return [_build_user_activity_response(activity) for activity in activities]


@router.post("/promotions/activities/{activity_id}/participate")
def participate_activity(
    activity_id: int,
    order_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    activity = PromotionService.get_activity(db, activity_id)
    if not activity:
        raise HTTPException(status_code=404, detail="活动不存在")
    
    PromotionService.record_participation(db, activity_id, current_user.id, order_id)
    return {"message": "参与成功"}


def _build_activity_response(activity):
    return {
        "id": activity.id,
        "name": activity.name,
        "description": activity.description,
        "activity_type": activity.activity_type,
        "activity_type_label": ACTIVITY_TYPE_LABELS.get(activity.activity_type, activity.activity_type),
        "rules": activity.rules,
        "status": activity.status,
        "status_label": STATUS_LABELS.get(activity.status, "未知"),
        "priority": activity.priority,
        "start_time": activity.start_time,
        "end_time": activity.end_time,
        "created_at": activity.created_at,
        "updated_at": activity.updated_at
    }


def _build_tag_response(tag):
    return {
        "id": tag.id,
        "name": tag.name,
        "tag_type": tag.tag_type,
        "tag_type_label": TAG_TYPE_LABELS.get(tag.tag_type, tag.tag_type),
        "value": tag.value,
        "description": tag.description,
        "created_at": tag.created_at
    }


def _build_user_activity_response(activity):
    now = activity.start_time.replace(tzinfo=None) if activity.start_time else None
    end = activity.end_time.replace(tzinfo=None) if activity.end_time else None
    
    return {
        "id": activity.id,
        "name": activity.name,
        "description": activity.description,
        "activity_type": activity.activity_type,
        "activity_type_label": ACTIVITY_TYPE_LABELS.get(activity.activity_type, activity.activity_type),
        "rules": activity.rules,
        "start_time": activity.start_time,
        "end_time": activity.end_time,
        "is_active": True
    }