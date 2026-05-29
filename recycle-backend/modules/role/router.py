from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.base import BaseResponse, PaginatedResponse
from app.schemas.rbac import RoleCreate, RoleUpdate, RoleOut
from app.services.role_service import (
    list_roles, create_role, update_role, delete_role,
    get_role_permissions, set_role_permissions
)

router = APIRouter(prefix="/api/v1/roles", tags=["角色管理"])


@router.get("", response_model=BaseResponse[PaginatedResponse[RoleOut]])
def get_roles(page: int = 1, page_size: int = 20, keyword: str = "", db: Session = Depends(get_db)):
    return BaseResponse(data=list_roles(db, page, page_size, keyword))


@router.post("", response_model=BaseResponse[RoleOut])
def post_role(req: RoleCreate, db: Session = Depends(get_db)):
    return BaseResponse(data=create_role(db, req))


@router.put("/{role_id}", response_model=BaseResponse[RoleOut])
def put_role(role_id: int, req: RoleUpdate, db: Session = Depends(get_db)):
    return BaseResponse(data=update_role(db, role_id, req))


@router.delete("/{role_id}")
def del_role(role_id: int, db: Session = Depends(get_db)):
    delete_role(db, role_id)
    return BaseResponse(message="已停用")


@router.get("/{role_id}/permissions")
def get_perms(role_id: int, db: Session = Depends(get_db)):
    return BaseResponse(data=get_role_permissions(db, role_id))


@router.post("/{role_id}/permissions")
def set_perms(role_id: int, perm_ids: List[int], db: Session = Depends(get_db)):
    set_role_permissions(db, role_id, perm_ids)
    return BaseResponse(message="权限设置成功")
