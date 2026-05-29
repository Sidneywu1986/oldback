from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_active_user
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
from app.models.recycle_order import RecycleOrder
from app.models.master import Master

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


import math

@router.get("/orders/nearby", response_model=BaseResponse)
def get_nearby_orders(
    db: Session = Depends(get_db),
    latitude: float = None,
    longitude: float = None,
    radius: int = 5000,
    page: int = 1, page_size: int = 20
):
    """获取附近可抢订单，按距离排序"""
    query = db.query(RecycleOrder).filter(RecycleOrder.is_deleted == 0, RecycleOrder.status == 0)
    items = query.all()

    def haversine(lat1, lon1, lat2, lon2):
        R = 6371000
        phi1 = math.radians(lat1)
        phi2 = math.radians(lat2)
        dphi = math.radians(lat2 - lat1)
        dlambda = math.radians(lon2 - lon1)
        a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

    result = []
    for item in items:
        if item.lat is not None and item.lng is not None and latitude is not None and longitude is not None:
            distance = haversine(latitude, longitude, float(item.lat), float(item.lng))
            if distance <= radius:
                data = get_recycle(db, item.id)
                result.append({**data.model_dump(), "distance": round(distance / 1000, 2)})
        else:
            data = get_recycle(db, item.id)
            result.append({**data.model_dump(), "distance": None})

    result.sort(key=lambda x: x["distance"] if x["distance"] is not None else 99999)
    total = len(result)
    start = (page - 1) * page_size
    end = start + page_size
    return BaseResponse(data={"total": total, "list": result[start:end]})


@router.get("/orders/grab-stats", response_model=BaseResponse)
def get_grab_stats(
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """获取师傅抢单统计"""
    master = db.query(Master).filter(Master.user_id == current_user.id, Master.is_deleted == 0).first()
    if not master:
        raise HTTPException(status_code=404, detail="未找到师傅信息")
    total = db.query(RecycleOrder).filter(RecycleOrder.master_id == master.id, RecycleOrder.is_deleted == 0).count()
    pending = db.query(RecycleOrder).filter(RecycleOrder.master_id == master.id, RecycleOrder.status == 0, RecycleOrder.is_deleted == 0).count()
    done = db.query(RecycleOrder).filter(RecycleOrder.master_id == master.id, RecycleOrder.status.in_([3, 4, 7]), RecycleOrder.is_deleted == 0).count()
    return BaseResponse(data={"total": total, "pending": pending, "done": done})


@router.post("/orders/{order_id}/grab", response_model=BaseResponse)
def grab_order(
    order_id: int,
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """师傅抢单"""
    master = db.query(Master).filter(Master.user_id == current_user.id, Master.is_deleted == 0).first()
    if not master:
        raise HTTPException(status_code=404, detail="未找到师傅信息")
    order = db.query(RecycleOrder).filter(RecycleOrder.id == order_id, RecycleOrder.is_deleted == 0).first()
    if not order:
        raise HTTPException(status_code=404, detail="订单不存在")
    order.master_id = master.id
    db.commit()
    return BaseResponse(message="抢单成功")
