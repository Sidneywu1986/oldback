from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

class RecycleCreate(BaseModel):
    master_id: int
    parts_name: str
    parts_type: Optional[str] = None
    device_type: Optional[str] = None
    fault_desc: Optional[str] = None
    old_parts_img: Optional[str] = None
    new_parts_img: Optional[str] = None
    work_img: Optional[str] = None
    user_keep: int = 0
    lat: Optional[float] = None
    lng: Optional[float] = None
    address: Optional[str] = None

class RecycleAuditAction(BaseModel):
    action: str  # pass/reject/return/confirm/dispose
    comment: Optional[str] = None

class RecyclePointsAward(BaseModel):
    points: int

class RecycleOut(BaseModel):
    id: int
    order_no: str
    master_id: int
    master_name: Optional[str] = None
    parts_name: str
    parts_type: Optional[str]
    device_type: Optional[str]
    fault_desc: Optional[str]
    old_parts_img: Optional[str]
    new_parts_img: Optional[str]
    work_img: Optional[str]
    status: int
    status_label: Optional[str] = None
    user_keep: int
    reject_reason: Optional[str]
    points: int
    point_status: int
    amount: Decimal
    amount_status: int
    lat: Optional[float] = None
    lng: Optional[float] = None
    address: Optional[str] = None
    create_time: datetime
    update_time: datetime
    class Config:
        from_attributes = True
