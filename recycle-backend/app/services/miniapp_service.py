from datetime import datetime
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.miniapp_config import MiniappConfig


def list_configs(db: Session, config_group: str = None) -> list[dict]:
    query = db.query(MiniappConfig)
    query = query.filter(MiniappConfig.is_deleted == 0)
    if config_group:
        query = query.filter(MiniappConfig.config_group == config_group)
    items = query.all()
    return [
        {
            "id": c.id,
            "config_key": c.config_key,
            "config_value": c.config_value,
            "config_group": c.config_group,
            "description": c.description,
        }
        for c in items
    ]


def update_config(db: Session, config_id: int, config_value: str) -> None:
    config = db.query(MiniappConfig).filter(MiniappConfig.id == config_id).first()
    if not config:
        raise HTTPException(status_code=404, detail="配置不存在")
    config.config_value = config_value
    if hasattr(config, "update_time"):
        config.update_time = datetime.utcnow()
    db.commit()


def batch_update(db: Session, configs: dict) -> None:
    for key, value in configs.items():
        config = db.query(MiniappConfig).filter(MiniappConfig.config_key == key).first()
        if config:
            config.config_value = value
    db.commit()
