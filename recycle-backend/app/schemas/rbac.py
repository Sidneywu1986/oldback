from pydantic import BaseModel, field_validator
from typing import Optional, List
from datetime import datetime

class RoleCreate(BaseModel):
    role_name: str
    role_code: str
    description: Optional[str] = None
    data_scope: str = "self"
    status: int = 1

class RoleUpdate(BaseModel):
    role_name: Optional[str] = None
    description: Optional[str] = None
    data_scope: Optional[str] = None
    status: Optional[int] = None

class RoleOut(BaseModel):
    id: int
    role_name: str
    role_code: str
    description: Optional[str]
    data_scope: str
    status: int
    create_time: datetime
    class Config:
        from_attributes = True

class PermissionCreate(BaseModel):
    perm_name: str
    perm_code: str
    perm_type: str = "menu"
    parent_id: Optional[int] = None
    sort_order: int = 0

class PermissionOut(BaseModel):
    id: int
    perm_name: str
    perm_code: str
    perm_type: str
    parent_id: Optional[int]
    sort_order: int
    create_time: datetime
    children: List['PermissionOut'] = []
    class Config:
        from_attributes = True

class MenuCreate(BaseModel):
    menu_name: str
    menu_code: Optional[str] = None
    icon: Optional[str] = None
    path: Optional[str] = None
    component: Optional[str] = None
    parent_id: Optional[int] = None
    sort_order: int = 0
    permission_code: Optional[str] = None
    status: int = 1

class MenuOut(BaseModel):
    id: int
    menu_name: str
    menu_code: Optional[str]
    icon: Optional[str]
    path: Optional[str]
    component: Optional[str]
    parent_id: Optional[int]
    sort_order: int
    permission_code: Optional[str]
    status: int
    children: List['MenuOut'] = []
    class Config:
        from_attributes = True

class DepartmentCreate(BaseModel):
    dept_name: str
    parent_id: Optional[int] = None
    leader_id: Optional[int] = None
    sort_order: int = 0
    status: int = 1

class DepartmentOut(BaseModel):
    id: int
    dept_name: str
    parent_id: Optional[int]
    leader_id: Optional[int]
    leader_name: Optional[str] = None
    sort_order: int
    status: int
    children: List['DepartmentOut'] = []

    @field_validator('children', mode='before')
    @classmethod
    def default_children(cls, v):
        return v if v is not None else []

    class Config:
        from_attributes = True
