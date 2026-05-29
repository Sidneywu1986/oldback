from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from app.schemas.base import PaginatedResponse


class LoginLogCreate(BaseModel):
    user_id: Optional[int] = None
    username: str
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    status: int
    error_msg: Optional[str] = None


class LoginLogResponse(BaseModel):
    id: int
    user_id: Optional[int]
    username: str
    ip_address: Optional[str]
    user_agent: Optional[str]
    login_time: datetime
    status: int
    error_msg: Optional[str]

    model_config = {"from_attributes": True}


class LoginLogQuery(BaseModel):
    username: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    status: Optional[int] = None
    page: int = 1
    page_size: int = 20


class PaginatedLoginLogResponse(PaginatedResponse[LoginLogResponse]):
    pass


class OperationLogCreate(BaseModel):
    user_id: Optional[int] = None
    username: str
    module: Optional[str] = None
    operation: Optional[str] = None
    target_id: Optional[int] = None
    target_name: Optional[str] = None
    before_data: Optional[str] = None
    after_data: Optional[str] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    status: int = 1
    error_msg: Optional[str] = None


class OperationLogResponse(BaseModel):
    id: int
    user_id: Optional[int]
    username: str
    module: Optional[str]
    operation: Optional[str]
    target_id: Optional[int]
    target_name: Optional[str]
    before_data: Optional[str]
    after_data: Optional[str]
    ip_address: Optional[str]
    user_agent: Optional[str]
    operation_time: datetime
    status: int
    error_msg: Optional[str]

    model_config = {"from_attributes": True}


class OperationLogQuery(BaseModel):
    username: Optional[str] = None
    module: Optional[str] = None
    operation: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    page: int = 1
    page_size: int = 20


class PaginatedOperationLogResponse(PaginatedResponse[OperationLogResponse]):
    pass