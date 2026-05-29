from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.recycle_order import RecycleOrder
from app.models.recycle_audit import RecycleAudit
from app.models.master import Master
from app.models.workflow_def import WorkflowDef
from app.models.workflow_instance import WorkflowInstance
from app.models.workflow_task import WorkflowTask
from app.schemas.base import PaginatedResponse
from app.schemas.recycle import RecycleCreate, RecycleAuditAction, RecyclePointsAward, RecycleOut
from app.services.promotion_service import PromotionService
from datetime import datetime
import random

STATUS_MAP = {0: "待审核", 1: "审核通过", 2: "审核驳回", 3: "已入库", 4: "已处置", 5: "待重传", 6: "已关闭", 7: "积分已发放"}


def gen_order_no() -> str:
    return f"R{datetime.now().strftime('%Y%m%d%H%M%S')}{random.randint(1000,9999)}"


def _build_recycle_out(db: Session, item: RecycleOrder) -> RecycleOut:
    """Convert a RecycleOrder ORM object to RecycleOut with status_label and master_name populated."""
    ri = RecycleOut.model_validate(item)
    ri.status_label = STATUS_MAP.get(item.status, "未知")
    if item.master_id:
        m = db.query(Master).filter(Master.id == item.master_id).first()
        ri.master_name = m.name if m else None
    return ri


def list_recycles(
    db: Session,
    page: int = 1,
    page_size: int = 20,
    status: int = None,
    keyword: str = "",
    master_id: int = None,
) -> PaginatedResponse[RecycleOut]:
    query = db.query(RecycleOrder)
    query = query.filter(RecycleOrder.is_deleted == 0)
    if status is not None:
        query = query.filter(RecycleOrder.status == status)
    if keyword:
        query = query.filter(RecycleOrder.parts_name.contains(keyword) | RecycleOrder.order_no.contains(keyword))
    if master_id:
        query = query.filter(RecycleOrder.master_id == master_id)

    total = query.count()
    items = query.order_by(RecycleOrder.create_time.desc()).offset((page - 1) * page_size).limit(page_size).all()

    result = [_build_recycle_out(db, item) for item in items]
    return PaginatedResponse(total=total, page=page, page_size=page_size, list=result)


def get_recycle(db: Session, recycle_id: int) -> RecycleOut:
    item = db.query(RecycleOrder).filter(RecycleOrder.id == recycle_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="回收单不存在")
    return _build_recycle_out(db, item)


def create_recycle(db: Session, req: RecycleCreate) -> RecycleOut:
    order = RecycleOrder(
        order_no=gen_order_no(),
        **req.model_dump()
    )
    
    activities = PromotionService.get_user_activities(db, req.master_id)
    if activities:
        best_activity = activities[0]
        discount = PromotionService.calculate_discount(best_activity, order.amount or 0)
        points_multiplier = PromotionService.calculate_points_multiplier(best_activity)
        
        if discount > 0:
            order.amount = max(0, (order.amount or 0) - discount)
            order.activity_id = best_activity.id
        
        if points_multiplier > 1 and order.points:
            order.points = int(order.points * points_multiplier)
    
    db.add(order)
    db.commit()
    db.refresh(order)

    # Auto-create workflow instance for recycle approval
    try:
        wf = db.query(WorkflowDef).filter(
            WorkflowDef.workflow_key == "recycle_approval",
            WorkflowDef.status == 1
        ).first()
        if wf:
            instance = WorkflowInstance(
                workflow_id=wf.id,
                business_key=str(order.id),
                current_node="audit",
                status=0,
                start_time=datetime.utcnow()
            )
            db.add(instance)
            db.commit()
            db.refresh(instance)

            task = WorkflowTask(
                instance_id=instance.id,
                node_name="审核",
                node_key="audit",
                assignee_type="role",
                create_time=datetime.utcnow()
            )
            db.add(task)
            db.commit()
    except Exception:
        pass

    return RecycleOut.model_validate(order)


def audit_recycle(db: Session, recycle_id: int, req: RecycleAuditAction) -> RecycleOut:
    order = db.query(RecycleOrder).filter(RecycleOrder.id == recycle_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="回收单不存在")

    if req.action == "pass":
        order.status = 1
    elif req.action == "reject":
        order.status = 2
        order.reject_reason = req.comment
    elif req.action == "return":
        order.status = 5

    audit = RecycleAudit(
        recycle_id=recycle_id,
        action=req.action,
        comment=req.comment,
        create_time=datetime.utcnow()
    )
    db.add(audit)
    db.commit()
    db.refresh(order)

    return _build_recycle_out(db, order)


def confirm_recycle(db: Session, recycle_id: int) -> RecycleOut:
    order = db.query(RecycleOrder).filter(RecycleOrder.id == recycle_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="回收单不存在")
    order.status = 3

    audit = RecycleAudit(recycle_id=recycle_id, action="confirm", comment="已确认入库", create_time=datetime.utcnow())
    db.add(audit)
    db.commit()
    db.refresh(order)

    return _build_recycle_out(db, order)


def dispose_recycle(db: Session, recycle_id: int) -> RecycleOut:
    order = db.query(RecycleOrder).filter(RecycleOrder.id == recycle_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="回收单不存在")
    order.status = 4

    audit = RecycleAudit(recycle_id=recycle_id, action="dispose", comment="已处置完成", create_time=datetime.utcnow())
    db.add(audit)
    db.commit()
    db.refresh(order)

    return _build_recycle_out(db, order)


def award_points(db: Session, recycle_id: int, req: RecyclePointsAward) -> RecycleOut:
    order = db.query(RecycleOrder).filter(RecycleOrder.id == recycle_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="回收单不存在")

    order.points = req.points
    order.point_status = 1
    if order.status < 7:
        order.status = 7

    master = db.query(Master).filter(Master.id == order.master_id).first()
    if master:
        master.points_balance = (master.points_balance or 0) + req.points
        master.recycle_count = (master.recycle_count or 0) + 1

    db.commit()
    db.refresh(order)

    return _build_recycle_out(db, order)


def get_recycle_audits(db: Session, recycle_id: int):
    audits = db.query(RecycleAudit).filter(RecycleAudit.recycle_id == recycle_id).order_by(RecycleAudit.create_time.desc()).all()
    return [{
        "id": a.id, "auditor_name": a.auditor_name, "action": a.action,
        "comment": a.comment, "create_time": a.create_time
    } for a in audits]
