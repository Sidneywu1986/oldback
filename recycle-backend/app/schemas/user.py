from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    password: str
    real_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    dept_id: Optional[int] = None
    role_ids: List[int] = []
    status: int = 1

class UserUpdate(BaseModel):
    real_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    dept_id: Optional[int] = None
    role_ids: Optional[List[int]] = None
    status: Optional[int] = None

class UserOut(BaseModel):
    id: int
    username: str
    real_name: Optional[str]
    phone: Optional[str]
    email: Optional[str]
    dept_id: Optional[int]
    dept_name: Optional[str] = None
    is_super: int
    status: int
    last_login: Optional[datetime]
    create_time: datetime

    class Config:
        from_attributes = True
