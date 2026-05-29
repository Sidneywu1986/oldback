from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MasterCreate(BaseModel):
    name: str
    phone: str
    id_card: Optional[str] = None
    dept_id: Optional[int] = None
    level: str = "初级"
    skill_tags: Optional[str] = None
    service_area: Optional[str] = None

class MasterUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    dept_id: Optional[int] = None
    level: Optional[str] = None
    skill_tags: Optional[str] = None
    service_area: Optional[str] = None
    status: Optional[int] = None

class MasterOut(BaseModel):
    id: int
    name: str
    phone: str
    id_card: Optional[str]
    avatar: Optional[str]
    dept_id: Optional[int]
    dept_name: Optional[str] = None
    level: str
    skill_tags: Optional[str]
    service_area: Optional[str]
    credit_score: int
    recycle_count: int
    points_balance: int
    status: int
    join_date: Optional[datetime]
    create_time: datetime
    class Config:
        from_attributes = True
