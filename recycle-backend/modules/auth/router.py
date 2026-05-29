from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_active_user
from app.schemas.base import BaseResponse
from app.schemas.auth import LoginRequest, LoginResponse
from app.services.auth_service import authenticate_user, change_password
from app.services.log_service import LoginLogService
from app.schemas.log import LoginLogCreate

router = APIRouter(prefix="/api/v1/auth", tags=["认证"])


def get_client_ip(request: Request) -> str:
    """获取客户端 IP 地址"""
    x_forwarded_for = request.headers.get("X-Forwarded-For")
    if x_forwarded_for:
        return x_forwarded_for.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


@router.post("/login", response_model=BaseResponse[LoginResponse])
def login(req: LoginRequest, db: Session = Depends(get_db), request: Request = None):
    ip_address = get_client_ip(request) if request else None
    user_agent = request.headers.get("User-Agent") if request else None
    
    try:
        result = authenticate_user(db, req.username, req.password)
        LoginLogService.create_login_log(db, LoginLogCreate(
            user_id=result["user"]["id"],
            username=req.username,
            ip_address=ip_address,
            user_agent=user_agent,
            status=1
        ))
        return BaseResponse(data=result)
    except HTTPException as e:
        LoginLogService.create_login_log(db, LoginLogCreate(
            username=req.username,
            ip_address=ip_address,
            user_agent=user_agent,
            status=0,
            error_msg=e.detail
        ))
        raise


@router.get("/me", response_model=BaseResponse)
def get_me(current_user = Depends(get_current_active_user)):
    return BaseResponse(data={
        "id": current_user.id,
        "username": current_user.username,
        "real_name": current_user.real_name,
        "phone": current_user.phone,
        "avatar": current_user.avatar,
        "roles": [{"id": r.id, "name": r.role_name, "code": r.role_code} for r in current_user.roles],
        "is_super": current_user.is_super,
    })
