from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.base import BaseResponse
from app.schemas.dashboard import DashboardStats, DashboardTrend, RecentRecycle
from app.services.dashboard_service import (
    get_stats,
    get_trend,
    get_recent,
    get_status_distribution,
    get_top_masters,
)

router = APIRouter(prefix="/api/v1/dashboard", tags=["数据看板"])


@router.get("/stats", response_model=BaseResponse[DashboardStats])
def get_stats_route(db: Session = Depends(get_db)):
    return BaseResponse(data=get_stats(db))


@router.get("/trend", response_model=BaseResponse[DashboardTrend])
def get_trend_route(db: Session = Depends(get_db)):
    return BaseResponse(data=get_trend(db))


@router.get("/recent", response_model=BaseResponse)
def get_recent_route(db: Session = Depends(get_db)):
    return BaseResponse(data=get_recent(db))


@router.get("/full", response_model=BaseResponse)
def get_full_dashboard_route(db: Session = Depends(get_db)):
    stats = get_stats(db)
    trend = get_trend(db)
    recent = get_recent(db)
    status_dist = get_status_distribution(db)
    top_masters = get_top_masters(db)

    colors = ["#0075de", "#52c41a", "#ff4d4f", "#faad14", "#722ed1", "#13c2c2", "#eb2f96", "#f5222d"]
    status_list = [
        {"name": name, "value": value, "color": colors[i % len(colors)]}
        for i, (name, value) in enumerate(status_dist.items())
    ]

    return BaseResponse(data={
        "stats": stats.model_dump(),
        "trend": trend.model_dump().get("recycle_trend", []),
        "recent": [r.model_dump() for r in recent],
        "status_distribution": status_list,
        "top_masters": top_masters,
    })
