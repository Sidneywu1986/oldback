from typing import List, Dict, Any
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, case
from decimal import Decimal

from app.models.recycle_order import RecycleOrder
from app.models.master import Master
from app.models.fund_transaction import FundTransaction
from app.models.points_record import PointsRecord
from app.models.parts_category import PartsCategory


class ReportService:
    @staticmethod
    def get_recycle_trend(db: Session, days: int = 30) -> List[Dict[str, Any]]:
        """获取回收订单趋势数据"""
        trend = []
        for i in range(days - 1, -1, -1):
            date = datetime.utcnow() - timedelta(days=i)
            date_str = date.strftime("%Y-%m-%d")
            date_start = datetime.combine(date.date(), datetime.min.time())
            date_end = datetime.combine(date.date(), datetime.max.time())

            count = db.query(RecycleOrder).filter(
                RecycleOrder.is_deleted == 0,
                RecycleOrder.create_time >= date_start,
                RecycleOrder.create_time <= date_end
            ).count()

            approved = db.query(RecycleOrder).filter(
                RecycleOrder.is_deleted == 0,
                RecycleOrder.status == 1,
                RecycleOrder.create_time >= date_start,
                RecycleOrder.create_time <= date_end
            ).count()

            rejected = db.query(RecycleOrder).filter(
                RecycleOrder.is_deleted == 0,
                RecycleOrder.status == 2,
                RecycleOrder.create_time >= date_start,
                RecycleOrder.create_time <= date_end
            ).count()

            trend.append({
                "date": date_str,
                "total": count,
                "approved": approved,
                "rejected": rejected,
            })
        return trend

    @staticmethod
    def get_master_performance(db: Session, start_time: datetime = None, end_time: datetime = None) -> List[Dict[str, Any]]:
        """获取师傅绩效统计"""
        q = db.query(
            Master.id,
            Master.name,
            Master.phone,
            Master.level,
            Master.credit_score,
            func.count(RecycleOrder.id).label("recycle_count"),
            func.sum(RecycleOrder.points).label("total_points"),
            func.sum(RecycleOrder.amount).label("total_amount"),
        ).outerjoin(RecycleOrder, Master.id == RecycleOrder.master_id)

        if start_time:
            q = q.filter(RecycleOrder.create_time >= start_time)
        if end_time:
            q = q.filter(RecycleOrder.create_time <= end_time)

        q = q.filter(Master.is_deleted == 0)
        q = q.filter(Master.status == 1)
        q = q.group_by(Master.id, Master.name, Master.phone, Master.level, Master.credit_score)
        q = q.order_by(desc("recycle_count"))

        results = q.all()
        return [{
            "master_id": r.id,
            "name": r.name,
            "phone": r.phone,
            "level": r.level,
            "credit_score": r.credit_score,
            "recycle_count": r.recycle_count or 0,
            "total_points": Decimal(str(r.total_points)) if r.total_points else Decimal(0),
            "total_amount": Decimal(str(r.total_amount)) if r.total_amount else Decimal(0),
        } for r in results]

    @staticmethod
    def get_parts_category_stats(db: Session) -> List[Dict[str, Any]]:
        """获取旧件分类统计"""
        q = db.query(
            PartsCategory.id,
            PartsCategory.category_name,
            PartsCategory.points_ratio,
            func.count(RecycleOrder.id).label("recycle_count"),
            func.sum(RecycleOrder.points).label("total_points"),
        ).outerjoin(RecycleOrder, PartsCategory.id == RecycleOrder.parts_type)
        q = q.filter(PartsCategory.is_deleted == 0)
        q = q.group_by(PartsCategory.id, PartsCategory.category_name, PartsCategory.points_ratio)
        q = q.order_by(desc("recycle_count"))

        results = q.all()
        return [{
            "category_id": r.id,
            "category_name": r.category_name,
            "points_ratio": r.points_ratio,
            "recycle_count": r.recycle_count or 0,
            "total_points": Decimal(str(r.total_points)) if r.total_points else Decimal(0),
        } for r in results]

    @staticmethod
    def get_fund_report(db: Session, start_time: datetime = None, end_time: datetime = None) -> Dict[str, Any]:
        """获取资金报表"""
        q = db.query(FundTransaction)
        q = q.filter(FundTransaction.is_deleted == 0)
        if start_time:
            q = q.filter(FundTransaction.create_time >= start_time)
        if end_time:
            q = q.filter(FundTransaction.create_time <= end_time)

        total_income = q.filter(FundTransaction.txn_type.in_(["recycle_award"])).with_entities(
            func.sum(FundTransaction.amount)
        ).scalar() or 0

        total_withdraw = q.filter(FundTransaction.txn_type == "withdraw").with_entities(
            func.sum(FundTransaction.amount)
        ).scalar() or 0

        total_adjust = q.filter(FundTransaction.txn_type == "adjust").with_entities(
            func.sum(FundTransaction.amount)
        ).scalar() or 0

        txn_by_type = db.query(
            FundTransaction.txn_type,
            func.count(FundTransaction.id).label("count"),
            func.sum(FundTransaction.amount).label("total_amount"),
        ).filter(FundTransaction.is_deleted == 0, FundTransaction.status == 1)
        if start_time:
            txn_by_type = txn_by_type.filter(FundTransaction.create_time >= start_time)
        if end_time:
            txn_by_type = txn_by_type.filter(FundTransaction.create_time <= end_time)
        txn_by_type = txn_by_type.group_by(FundTransaction.txn_type).all()

        txn_type_map = {
            "recycle_award": "回收奖励",
            "withdraw": "提现",
            "adjust": "手动调整",
            "exchange": "兑换",
        }

        return {
            "total_income": Decimal(str(total_income)),
            "total_withdraw": Decimal(str(total_withdraw)),
            "total_adjust": Decimal(str(total_adjust)),
            "balance_change": Decimal(str(total_income - total_withdraw + total_adjust)),
            "txn_by_type": [{
                "txn_type": t[0],
                "txn_type_label": txn_type_map.get(t[0], t[0]),
                "count": t[1],
                "total_amount": Decimal(str(t[2])) if t[2] else Decimal(0),
            } for t in txn_by_type],
        }

    @staticmethod
    def get_points_report(db: Session, start_time: datetime = None, end_time: datetime = None) -> Dict[str, Any]:
        """获取积分报表"""
        q = db.query(PointsRecord)
        q = q.filter(PointsRecord.is_deleted == 0)
        if start_time:
            q = q.filter(PointsRecord.create_time >= start_time)
        if end_time:
            q = q.filter(PointsRecord.create_time <= end_time)

        total_awarded = q.filter(PointsRecord.points_type.in_(["recycle", "bonus"])).with_entities(
            func.sum(PointsRecord.points_amount)
        ).scalar() or 0

        total_consumed = q.filter(PointsRecord.points_type == "exchange").with_entities(
            func.sum(PointsRecord.points_amount)
        ).scalar() or 0

        return {
            "total_awarded": total_awarded,
            "total_consumed": total_consumed,
            "total_frozen": 0,
            "net_change": total_awarded - total_consumed,
        }

    @staticmethod
    def get_monthly_report(db: Session, year: int, month: int) -> Dict[str, Any]:
        """获取月度综合报表"""
        start_time = datetime(year, month, 1)
        if month == 12:
            end_time = datetime(year + 1, 1, 1)
        else:
            end_time = datetime(year, month + 1, 1)

        recycle_stats = db.query(
            func.count(RecycleOrder.id).label("total_orders"),
            func.sum(RecycleOrder.points).label("total_points"),
            func.sum(RecycleOrder.amount).label("total_amount"),
        ).filter(
            RecycleOrder.is_deleted == 0,
            RecycleOrder.create_time >= start_time,
            RecycleOrder.create_time < end_time
        ).first()

        master_stats = db.query(
            func.count(Master.id).label("active_masters"),
        ).filter(Master.is_deleted == 0, Master.status == 1).first()

        total_award = db.query(func.sum(FundTransaction.amount)).filter(
            FundTransaction.is_deleted == 0,
            FundTransaction.create_time >= start_time,
            FundTransaction.create_time < end_time,
            FundTransaction.status == 1,
            FundTransaction.txn_type == "recycle_award"
        ).scalar() or 0

        total_withdraw = db.query(func.sum(FundTransaction.amount)).filter(
            FundTransaction.is_deleted == 0,
            FundTransaction.create_time >= start_time,
            FundTransaction.create_time < end_time,
            FundTransaction.status == 1,
            FundTransaction.txn_type == "withdraw"
        ).scalar() or 0

        return {
            "year": year,
            "month": month,
            "period": f"{year}年{month}月",
            "recycle": {
                "total_orders": recycle_stats.total_orders or 0,
                "total_points": Decimal(str(recycle_stats.total_points)) if recycle_stats.total_points else Decimal(0),
                "total_amount": Decimal(str(recycle_stats.total_amount)) if recycle_stats.total_amount else Decimal(0),
            },
            "masters": {
                "active_masters": master_stats.active_masters or 0,
            },
            "fund": {
                "total_award": Decimal(str(total_award)),
                "total_withdraw": Decimal(str(total_withdraw)),
            },
        }