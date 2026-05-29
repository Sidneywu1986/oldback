from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.base import BaseResponse
from app.schemas.rbac import PermissionCreate, PermissionOut
from app.services.permission_service import list_permissions, create_permission, delete_permission

router = APIRouter(prefix="/api/v1/permissions", tags=["权限管理"])


@router.get("", response_model=BaseResponse[list[PermissionOut]])
def get_permissions(db: Session = Depends(get_db)):
    return BaseResponse(data=list_permissions(db))


@router.post("", response_model=BaseResponse[PermissionOut])
def post_permission(req: PermissionCreate, db: Session = Depends(get_db)):
    return BaseResponse(data=create_permission(db, req))


@router.delete("/{perm_id}")
def del_permission(perm_id: int, db: Session = Depends(get_db)):
    delete_permission(db, perm_id)
    return BaseResponse(message="已删除")
