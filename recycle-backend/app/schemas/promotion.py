from enum import Enum
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List, Dict, Any


class ActivityType(str, Enum):
    DISCOUNT = "discount"
    FULL_REDUCTION = "full_reduction"
    POINTS_DOUBLE = "points_double"
    NEW_USER_GIFT = "new_user_gift"


class PromotionActivityCreate(BaseModel):
    name: str = Field(..., max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    activity_type: str
    rules: Dict[str, Any]
    priority: Optional[int] = 1
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    applicable_tags: Optional[List[int]] = None
    exclude_tags: Optional[List[int]] = None


class PromotionActivityUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    rules: Optional[Dict[str, Any]] = None
    priority: Optional[int] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    applicable_tags: Optional[List[int]] = None
    exclude_tags: Optional[List[int]] = None


class PromotionActivityResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    activity_type: str
    activity_type_label: str
    rules: Dict[str, Any]
    status: int
    status_label: str
    priority: int
    start_time: Optional[datetime]
    end_time: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    
    model_config = {"from_attributes": True}


class UserTagCreate(BaseModel):
    name: str = Field(..., max_length=50)
    tag_type: str = Field(..., max_length=50)
    value: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = Field(None, max_length=200)


class UserTagUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=50)
    tag_type: Optional[str] = Field(None, max_length=50)
    value: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = Field(None, max_length=200)


class UserTagResponse(BaseModel):
    id: int
    name: str
    tag_type: str
    tag_type_label: str
    value: Optional[str]
    description: Optional[str]
    created_at: datetime
    
    model_config = {"from_attributes": True}


class UserTagAssign(BaseModel):
    tag_ids: List[int]


class UserActivityResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    activity_type: str
    activity_type_label: str
    rules: Dict[str, Any]
    start_time: Optional[datetime]
    end_time: Optional[datetime]
    is_active: bool
    
    model_config = {"from_attributes": True}


class ActivityStatsResponse(BaseModel):
    activity_id: int
    total_participants: int
    total_orders: int
    total_discount: float
    total_points: int
    conversion_rate: float