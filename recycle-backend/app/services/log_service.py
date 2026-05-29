from typing import Optional, Tuple
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import desc, and_

from app.models.login_log import LoginLog
from app.models.operation_log import OperationLog
from app.schemas.log import (
    LoginLogCreate, OperationLogCreate,
    LoginLogQuery, OperationLogQuery,
    PaginatedLoginLogResponse, PaginatedOperationLogResponse,
    LoginLogResponse, OperationLogResponse
)


class LoginLogService:
    @staticmethod
    def create_login_log(db: Session, data: LoginLogCreate) -> LoginLog:
        log = LoginLog(
            user_id=data.user_id,
            username=data.username,
            ip_address=data.ip_address,
            user_agent=data.user_agent[:500] if data.user_agent else None,
            status=data.status,
            error_msg=data.error_msg
        )
        db.add(log)
        db.commit()
        db.refresh(log)
        return log

    @staticmethod
    def query_login_logs(db: Session, query: LoginLogQuery) -> PaginatedLoginLogResponse:
        q = db.query(LoginLog)
        q = q.filter(LoginLog.is_deleted == 0)
        if query.username:
            q = q.filter(LoginLog.username.like(f"%{query.username}%"))
        if query.start_time:
            q = q.filter(LoginLog.login_time >= query.start_time)
        if query.end_time:
            q = q.filter(LoginLog.login_time <= query.end_time)
        if query.status is not None:
            q = q.filter(LoginLog.status == query.status)
        
        total = q.count()
        logs = q.order_by(desc(LoginLog.login_time))\
            .offset((query.page - 1) * query.page_size)\
            .limit(query.page_size)\
            .all()
        
        return PaginatedLoginLogResponse(
            total=total,
            page=query.page,
            page_size=query.page_size,
            list=[LoginLogResponse.from_orm(log) for log in logs]
        )

    @staticmethod
    def get_login_log_by_id(db: Session, log_id: int) -> Optional[LoginLog]:
        return db.query(LoginLog).filter(LoginLog.is_deleted == 0, LoginLog.id == log_id).first()


class OperationLogService:
    @staticmethod
    def create_operation_log(db: Session, data: OperationLogCreate) -> OperationLog:
        log = OperationLog(
            user_id=data.user_id,
            username=data.username,
            module=data.module,
            operation=data.operation,
            target_id=data.target_id,
            target_name=data.target_name,
            before_data=data.before_data,
            after_data=data.after_data,
            ip_address=data.ip_address,
            user_agent=data.user_agent[:500] if data.user_agent else None,
            status=data.status,
            error_msg=data.error_msg
        )
        db.add(log)
        db.commit()
        db.refresh(log)
        return log

    @staticmethod
    def query_operation_logs(db: Session, query: OperationLogQuery) -> PaginatedOperationLogResponse:
        q = db.query(OperationLog)
        q = q.filter(OperationLog.is_deleted == 0)
        if query.username:
            q = q.filter(OperationLog.username.like(f"%{query.username}%"))
        if query.module:
            q = q.filter(OperationLog.module == query.module)
        if query.operation:
            q = q.filter(OperationLog.operation == query.operation)
        if query.start_time:
            q = q.filter(OperationLog.operation_time >= query.start_time)
        if query.end_time:
            q = q.filter(OperationLog.operation_time <= query.end_time)
        
        total = q.count()
        logs = q.order_by(desc(OperationLog.operation_time))\
            .offset((query.page - 1) * query.page_size)\
            .limit(query.page_size)\
            .all()
        
        return PaginatedOperationLogResponse(
            total=total,
            page=query.page,
            page_size=query.page_size,
            list=[OperationLogResponse.from_orm(log) for log in logs]
        )

    @staticmethod
    def get_operation_log_by_id(db: Session, log_id: int) -> Optional[OperationLog]:
        return db.query(OperationLog).filter(OperationLog.is_deleted == 0, OperationLog.id == log_id).first()