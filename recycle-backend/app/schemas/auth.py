from pydantic import BaseModel
from typing import Optional

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    token: str
    user: dict

class UserInfo(BaseModel):
    id: int
    username: str
    real_name: Optional[str] = None
    avatar: Optional[str] = None
    roles: list = []
    permissions: list = []
    is_super: int = 0
