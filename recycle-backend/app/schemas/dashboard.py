from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from decimal import Decimal

class DashboardStats(BaseModel):
    total_recycle: int = 0
    pending_audit: int = 0
    total_masters: int = 0
    total_fund: Decimal = Decimal("0")
    today_recycle: int = 0
    today_points: int = 0
    withdraw_pending: int = 0
    ticket_pending: int = 0

class TrendItem(BaseModel):
    date: str
    count: Optional[int] = None
    amount: Optional[Decimal] = None

class DashboardTrend(BaseModel):
    recycle_trend: List[TrendItem] = []
    fund_trend: List[TrendItem] = []

class RecentRecycle(BaseModel):
    id: int
    order_no: str
    parts_name: str
    master_name: Optional[str]
    status: int
    status_label: Optional[str]
    create_time: datetime
