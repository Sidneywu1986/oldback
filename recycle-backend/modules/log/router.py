from typing import Optional
from datetime import datetime
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.log_service import LoginLogService, OperationLogService
from app.schemas.log import (
    PaginatedLoginLogResponse, PaginatedOperationLogResponse,
    LoginLogResponse, OperationLogResponse
)

router = APIRouter()


@router.get("/login-logs", response_model=PaginatedLoginLogResponse, summary="查询登录日志")
def get_login_logs(
    username: Optional[str] = Query(None, description="用户名"),
    start_time: Optional[datetime] = Query(None, description="开始时间"),
    end_time: Optional[datetime] = Query(None, description="结束时间"),
    status: Optional[int] = Query(None, description="登录状态 0=失败 1=成功"),
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from app.schemas.log import LoginLogQuery
    query = LoginLogQuery(
        username=username,
        start_time=start_time,
        end_time=end_time,
        status=status,
        page=page,
        page_size=page_size
    )
    return LoginLogService.query_login_logs(db, query)


@router.get("/login-logs/{log_id}", response_model=LoginLogResponse, summary="获取登录日志详情")
def get_login_log(
    log_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    log = LoginLogService.get_login_log_by_id(db, log_id)
    if not log:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="登录日志不存在")
    return LoginLogResponse.from_orm(log)


@router.get("/operation-logs", response_model=PaginatedOperationLogResponse, summary="查询操作日志")
def get_operation_logs(
    username: Optional[str] = Query(None, description="用户名"),
    module: Optional[str] = Query(None, description="操作模块"),
    operation: Optional[str] = Query(None, description="操作类型"),
    start_time: Optional[datetime] = Query(None, description="开始时间"),
    end_time: Optional[datetime] = Query(None, description="结束时间"),
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from app.schemas.log import OperationLogQuery
    query = OperationLogQuery(
        username=username,
        module=module,
        operation=operation,
        start_time=start_time,
        end_time=end_time,
        page=page,
        page_size=page_size
    )
    return OperationLogService.query_operation_logs(db, query)


@router.get("/operation-logs/{log_id}", response_model=OperationLogResponse, summary="获取操作日志详情")
def get_operation_log(
    log_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    log = OperationLogService.get_operation_log_by_id(db, log_id)
    if not log:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="操作日志不存在")
    return OperationLogResponse.from_orm(log)