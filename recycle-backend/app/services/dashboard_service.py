from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from decimal import Decimal
from app.models.recycle_order import RecycleOrder
from app.models.master import Master
from app.models.fund_transaction import FundTransaction
from app.models.workflow_task import WorkflowTask
from app.models.ticket import Ticket
from app.schemas.dashboard import DashboardStats, DashboardTrend, TrendItem, RecentRecycle


STATUS_MAP = {0: "待审核", 1: "审核通过", 2: "审核驳回", 3: "已入库", 4: "已处置", 5: "待重传", 6: "已关闭", 7: "积分已发放"}


def get_stats(db: Session) -> DashboardStats:
    total_recycle = db.query(RecycleOrder).filter(RecycleOrder.is_deleted == 0).count()
    pending_audit = db.query(RecycleOrder).filter(RecycleOrder.status == 0).count()
    total_masters = db.query(Master).filter(Master.status == 1).count()

    total_fund = db.query(func.sum(FundTransaction.amount)).filter(FundTransaction.status == 1).scalar() or 0

    today = datetime.utcnow().date()
    today_start = datetime.combine(today, datetime.min.time())
    today_recycle = db.query(RecycleOrder).filter(RecycleOrder.create_time >= today_start).count()

    today_points = db.query(RecycleOrder).filter(
        RecycleOrder.point_status == 1,
        RecycleOrder.create_time >= today_start
    ).count()

    withdraw_pending = db.query(FundTransaction).filter(
        FundTransaction.txn_type == "withdraw",
        FundTransaction.status == 2
    ).count()

    ticket_pending = db.query(Ticket).filter(Ticket.status.in_([0, 1])).count()

    return DashboardStats(
        total_recycle=total_recycle,
        pending_audit=pending_audit,
        total_masters=total_masters,
        total_fund=Decimal(str(total_fund)),
        today_recycle=today_recycle,
        today_points=today_points,
        withdraw_pending=withdraw_pending,
        ticket_pending=ticket_pending,
    )


def get_trend(db: Session) -> DashboardTrend:
    recycle_trend = []
    fund_trend = []

    for i in range(29, -1, -1):
        date = datetime.utcnow() - timedelta(days=i)
        date_str = date.strftime("%m-%d")
        date_start = datetime.combine(date.date(), datetime.min.time())
        date_end = datetime.combine(date.date(), datetime.max.time())

        count = db.query(RecycleOrder).filter(
            RecycleOrder.create_time >= date_start,
            RecycleOrder.create_time <= date_end
        ).count()

        amount = db.query(func.sum(FundTransaction.amount)).filter(
            FundTransaction.status == 1,
            FundTransaction.create_time >= date_start,
            FundTransaction.create_time <= date_end
        ).scalar() or 0

        recycle_trend.append({"date": date_str, "count": count})
        fund_trend.append({"date": date_str, "amount": Decimal(str(amount))})

    return DashboardTrend(recycle_trend=recycle_trend, fund_trend=fund_trend)


def get_recent(db: Session) -> list[RecentRecycle]:
    orders = db.query(RecycleOrder).filter(RecycleOrder.is_deleted == 0).order_by(RecycleOrder.create_time.desc()).limit(10).all()
    result = []
    for o in orders:
        m = db.query(Master).filter(Master.id == o.master_id).first()
        result.append(RecentRecycle(
            id=o.id,
            order_no=o.order_no,
            parts_name=o.parts_name,
            master_name=m.name if m else None,
            status=o.status,
            status_label=STATUS_MAP.get(o.status, "未知"),
            create_time=o.create_time,
        ))
    return result


def get_status_distribution(db: Session) -> dict:
    status_dist = {}
    for status_val, label in STATUS_MAP.items():
        count = db.query(RecycleOrder).filter(RecycleOrder.status == status_val).count()
        if count > 0:
            status_dist[label] = count
    return status_dist


def get_top_masters(db: Session) -> list[dict]:
    top_masters = db.query(Master).filter(Master.is_deleted == 0).order_by(Master.recycle_count.desc()).limit(5).all()
    return [
        {"id": m.id, "name": m.name, "recycle_count": m.recycle_count, "points_balance": m.points_balance}
        for m in top_masters
    ]
