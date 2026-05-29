from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.master import Master
from app.models.department import Department
from app.models.recycle_order import RecycleOrder
from app.models.fund_account import FundAccount
from app.schemas.master import MasterCreate, MasterUpdate, MasterOut
from app.schemas.base import PaginatedResponse
from datetime import datetime


def list_masters(
    db: Session,
    page: int = 1,
    page_size: int = 20,
    keyword: str = "",
    dept_id: int = None,
    level: str = None,
    status: int = None,
) -> PaginatedResponse[MasterOut]:
    query = db.query(Master)
    query = query.filter(Master.is_deleted == 0)
    if keyword:
        query = query.filter(Master.name.contains(keyword) | Master.phone.contains(keyword))
    if dept_id:
        query = query.filter(Master.dept_id == dept_id)
    if level:
        query = query.filter(Master.level == level)
    if status is not None:
        query = query.filter(Master.status == status)

    total = query.count()
    items = query.offset((page - 1) * page_size).limit(page_size).all()

    result = []
    for m in items:
        mo = MasterOut.model_validate(m)
        if m.dept_id:
            dept = db.query(Department).filter(Department.id == m.dept_id).first()
            mo.dept_name = dept.dept_name if dept else None
        result.append(mo)

    return PaginatedResponse(total=total, page=page, page_size=page_size, list=result)


def get_master(db: Session, master_id: int) -> MasterOut:
    master = db.query(Master).filter(Master.id == master_id).first()
    if not master:
        raise HTTPException(status_code=404, detail="师傅不存在")
    mo = MasterOut.model_validate(master)
    if master.dept_id:
        dept = db.query(Department).filter(Department.id == master.dept_id).first()
        mo.dept_name = dept.dept_name if dept else None
    return mo


def create_master(db: Session, req: MasterCreate) -> MasterOut:
    master = Master(**req.model_dump(), status=0, join_date=datetime.utcnow())
    db.add(master)
    db.commit()
    db.refresh(master)

    fund = FundAccount(master_id=master.id, balance=0, frozen_amount=0, total_income=0, total_outcome=0)
    db.add(fund)
    db.commit()

    return MasterOut.model_validate(master)


def update_master(db: Session, master_id: int, req: MasterUpdate) -> MasterOut:
    master = db.query(Master).filter(Master.id == master_id).first()
    if not master:
        raise HTTPException(status_code=404, detail="师傅不存在")
    for k, v in req.model_dump(exclude_unset=True).items():
        setattr(master, k, v)
    db.commit()
    db.refresh(master)
    return MasterOut.model_validate(master)


def freeze_master(db: Session, master_id: int):
    master = db.query(Master).filter(Master.id == master_id).first()
    if not master:
        raise HTTPException(status_code=404, detail="师傅不存在")
    master.status = 2
    db.commit()


def unfreeze_master(db: Session, master_id: int):
    master = db.query(Master).filter(Master.id == master_id).first()
    if not master:
        raise HTTPException(status_code=404, detail="师傅不存在")
    master.status = 1
    db.commit()


def update_master_level(db: Session, master_id: int, level: str):
    master = db.query(Master).filter(Master.id == master_id).first()
    if not master:
        raise HTTPException(status_code=404, detail="师傅不存在")
    master.level = level
    db.commit()


def get_master_recycles(db: Session, master_id: int):
    orders = db.query(RecycleOrder).filter(RecycleOrder.master_id == master_id).order_by(RecycleOrder.create_time.desc()).all()
    return [{
        "id": o.id, "order_no": o.order_no, "parts_name": o.parts_name,
        "status": o.status, "points": o.points, "create_time": o.create_time
    } for o in orders]
