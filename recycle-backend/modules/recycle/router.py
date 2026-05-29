from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.base import BaseResponse
from app.schemas.recycle import RecycleCreate, RecycleAuditAction, RecyclePointsAward, RecycleOut
from app.services.recycle_service import (
    list_recycles,
    get_recycle,
    create_recycle,
    audit_recycle,
    confirm_recycle,
    dispose_recycle,
    award_points,
    get_recycle_audits,
)

router = APIRouter(prefix="/api/v1/recycle", tags=["回收管理"])


@router.get("", response_model=BaseResponse)
def list_recycle(
    page: int = 1, page_size: int = 20,
    status: int = None, keyword: str = "", master_id: int = None,
    db: Session = Depends(get_db)
):
    return BaseResponse(data=list_recycles(db, page=page, page_size=page_size, status=status, keyword=keyword, master_id=master_id))


@router.get("/{recycle_id}", response_model=BaseResponse)
def get_recycle_detail(recycle_id: int, db: Session = Depends(get_db)):
    return BaseResponse(data=get_recycle(db, recycle_id))


@router.post("", response_model=BaseResponse)
def create_recycle_route(req: RecycleCreate, db: Session = Depends(get_db)):
    return BaseResponse(data=create_recycle(db, req))


@router.put("/{recycle_id}/audit", response_model=BaseResponse)
def audit_recycle_route(recycle_id: int, req: RecycleAuditAction, db: Session = Depends(get_db)):
    return BaseResponse(data=audit_recycle(db, recycle_id, req))


@router.put("/{recycle_id}/confirm", response_model=BaseResponse)
def confirm_recycle_route(recycle_id: int, db: Session = Depends(get_db)):
    return BaseResponse(data=confirm_recycle(db, recycle_id))


@router.put("/{recycle_id}/dispose", response_model=BaseResponse)
def dispose_recycle_route(recycle_id: int, db: Session = Depends(get_db)):
    return BaseResponse(data=dispose_recycle(db, recycle_id))


@router.put("/{recycle_id}/points/award", response_model=BaseResponse)
def award_points_route(recycle_id: int, req: RecyclePointsAward, db: Session = Depends(get_db)):
    return BaseResponse(data=award_points(db, recycle_id, req))


@router.get("/{recycle_id}/audits")
def get_recycle_audit_list(recycle_id: int, db: Session = Depends(get_db)):
    return BaseResponse(data=get_recycle_audits(db, recycle_id))
