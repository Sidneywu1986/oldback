from functools import wraps
from typing import Optional
from datetime import datetime
from fastapi import Request
from sqlalchemy.orm import Session as SqlSession
import json

from app.models.user import User
from app.services.log_service import OperationLogService
from app.schemas.log import OperationLogCreate


def get_client_ip(request: Request) -> str:
    """获取客户端 IP 地址"""
    x_forwarded_for = request.headers.get("X-Forwarded-For")
    if x_forwarded_for:
        return x_forwarded_for.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def log_operation(module: str, operation: str):
    """
    操作日志装饰器
    :param module: 操作模块（如：recycle, user, role, fund 等）
    :param operation: 操作类型（如：add, edit, delete, audit, view 等）
    """
    def decorator(func):
        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            request = None
            db = None
            current_user = None
            
            for arg in args:
                if isinstance(arg, Request):
                    request = arg
                elif isinstance(arg, SqlSession):
                    db = arg
                elif isinstance(arg, User):
                    current_user = arg
            
            for key, value in kwargs.items():
                if isinstance(value, Request):
                    request = value
                elif isinstance(value, SqlSession):
                    db = value
                elif isinstance(value, User):
                    current_user = value
            
            ip_address = get_client_ip(request) if request else None
            user_agent = request.headers.get("User-Agent") if request else None
            
            user_id = current_user.id if current_user else None
            username = current_user.username if current_user else "system"
            
            before_data = None
            after_data = None
            target_id = None
            target_name = None
            status = 1
            error_msg = None
            
            try:
                result = await func(*args, **kwargs)
                
                if result is not None:
                    if hasattr(result, 'dict'):
                        result_dict = result.dict()
                        data = result_dict.get('data', result_dict)
                    elif isinstance(result, dict):
                        data = result.get('data', result)
                    else:
                        data = result
                    
                    if isinstance(data, dict):
                        target_id = data.get('id') or data.get('user_id')
                        target_name = data.get('name') or data.get('username') or data.get('real_name')
                    
                    after_data = json.dumps(data, ensure_ascii=False)[:5000]
                
                return result
            except Exception as e:
                status = 0
                error_msg = str(e)[:255]
                raise
            finally:
                if db is not None:
                    OperationLogService.create_operation_log(db, OperationLogCreate(
                        user_id=user_id,
                        username=username,
                        module=module,
                        operation=operation,
                        target_id=target_id,
                        target_name=target_name,
                        before_data=before_data,
                        after_data=after_data,
                        ip_address=ip_address,
                        user_agent=user_agent,
                        status=status,
                        error_msg=error_msg
                    ))
        
        @wraps(func)
        def sync_wrapper(*args, **kwargs):
            request = None
            db = None
            current_user = None
            
            for arg in args:
                if isinstance(arg, Request):
                    request = arg
                elif isinstance(arg, SqlSession):
                    db = arg
                elif isinstance(arg, User):
                    current_user = arg
            
            for key, value in kwargs.items():
                if isinstance(value, Request):
                    request = value
                elif isinstance(value, SqlSession):
                    db = value
                elif isinstance(value, User):
                    current_user = value
            
            ip_address = get_client_ip(request) if request else None
            user_agent = request.headers.get("User-Agent") if request else None
            
            user_id = current_user.id if current_user else None
            username = current_user.username if current_user else "system"
            
            before_data = None
            after_data = None
            target_id = None
            target_name = None
            status = 1
            error_msg = None
            
            try:
                result = func(*args, **kwargs)
                
                if result is not None:
                    if hasattr(result, 'dict'):
                        result_dict = result.dict()
                        data = result_dict.get('data', result_dict)
                    elif isinstance(result, dict):
                        data = result.get('data', result)
                    else:
                        data = result
                    
                    if isinstance(data, dict):
                        target_id = data.get('id') or data.get('user_id')
                        target_name = data.get('name') or data.get('username') or data.get('real_name')
                    
                    after_data = json.dumps(data, ensure_ascii=False)[:5000]
                
                return result
            except Exception as e:
                status = 0
                error_msg = str(e)[:255]
                raise
            finally:
                if db is not None:
                    OperationLogService.create_operation_log(db, OperationLogCreate(
                        user_id=user_id,
                        username=username,
                        module=module,
                        operation=operation,
                        target_id=target_id,
                        target_name=target_name,
                        before_data=before_data,
                        after_data=after_data,
                        ip_address=ip_address,
                        user_agent=user_agent,
                        status=status,
                        error_msg=error_msg
                    ))
        
        import asyncio
        if asyncio.iscoroutinefunction(func):
            return async_wrapper
        else:
            return sync_wrapper
    
    return decorator