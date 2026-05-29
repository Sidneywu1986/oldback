from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.base import BaseResponse
from app.services.miniapp_service import (
    list_configs,
    update_config,
    batch_update,
)

router = APIRouter(prefix="/api/v1/miniapp-configs", tags=["小程序管理"])


@router.get("")
def list_configs_route(config_group: str = None, db: Session = Depends(get_db)):
    return BaseResponse(data=list_configs(db, config_group=config_group))


@router.put("/{config_id}")
def update_config_route(config_id: int, config_value: str, db: Session = Depends(get_db)):
    update_config(db, config_id, config_value)
    return BaseResponse(message="更新成功")


@router.post("/batch")
def batch_update_route(configs: dict, db: Session = Depends(get_db)):
    batch_update(db, configs)
    return BaseResponse(message="批量更新成功")
