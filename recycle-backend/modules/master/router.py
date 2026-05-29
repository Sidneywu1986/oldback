from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_active_user
from app.schemas.base import BaseResponse, PaginatedResponse
from app.schemas.master import MasterCreate, MasterUpdate, MasterOut
from app.services.master_service import (
    list_masters as svc_list_masters,
    get_master as svc_get_master,
    create_master as svc_create_master,
    update_master as svc_update_master,
    freeze_master as svc_freeze_master,
    unfreeze_master as svc_unfreeze_master,
    update_master_level as svc_update_master_level,
    get_master_recycles as svc_get_master_recycles,
)
from app.models.master import Master

router = APIRouter(prefix="/api/v1/masters", tags=["师傅管理"])


@router.get("/me", response_model=BaseResponse)
def get_my_master(
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    master = db.query(Master).filter(Master.user_id == current_user.id, Master.is_deleted == 0).first()
    if not master:
        raise HTTPException(status_code=404, detail="未找到师傅信息")
    data = svc_get_master(db, master.id)
    return BaseResponse(data=data)


@router.get("", response_model=BaseResponse[PaginatedResponse[MasterOut]])
def list_masters(
    page: int = 1, page_size: int = 20,
    keyword: str = "", dept_id: int = None,
    level: str = None, status: int = None,
    db: Session = Depends(get_db)
):
    data = svc_list_masters(db, page=page, page_size=page_size, keyword=keyword, dept_id=dept_id, level=level, status=status)
    return BaseResponse(data=data)


@router.get("/{master_id}", response_model=BaseResponse[MasterOut])
def get_master(master_id: int, db: Session = Depends(get_db)):
    data = svc_get_master(db, master_id)
    return BaseResponse(data=data)


@router.post("", response_model=BaseResponse[MasterOut])
def create_master(req: MasterCreate, db: Session = Depends(get_db)):
    data = svc_create_master(db, req)
    return BaseResponse(data=data)


@router.put("/{master_id}", response_model=BaseResponse[MasterOut])
def update_master(master_id: int, req: MasterUpdate, db: Session = Depends(get_db)):
    data = svc_update_master(db, master_id, req)
    return BaseResponse(data=data)


@router.put("/{master_id}/freeze")
def freeze_master(master_id: int, db: Session = Depends(get_db)):
    svc_freeze_master(db, master_id)
    return BaseResponse(message="已冻结")


@router.put("/{master_id}/unfreeze")
def unfreeze_master(master_id: int, db: Session = Depends(get_db)):
    svc_unfreeze_master(db, master_id)
    return BaseResponse(message="已解冻")


@router.put("/{master_id}/level")
def update_master_level(master_id: int, level: str, db: Session = Depends(get_db)):
    svc_update_master_level(db, master_id, level)
    return BaseResponse(message="等级已更新")


@router.get("/{master_id}/recycles")
def get_master_recycles(master_id: int, db: Session = Depends(get_db)):
    data = svc_get_master_recycles(db, master_id)
    return BaseResponse(data=data)
