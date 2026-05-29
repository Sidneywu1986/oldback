from fastapi import APIRouter
from pathlib import Path
import json

router = APIRouter(prefix="/api/v1/admin", tags=["管理后台"])


@router.get("/menu/routes")
def get_menu_routes():
    """扫描所有模块的 manifest.json，动态生成菜单路由"""
    modules_dir = Path(__file__).parent.parent
    menus = []
    for module_dir in sorted(modules_dir.iterdir(), key=lambda d: d.name):
        if not module_dir.is_dir() or module_dir.name == "__pycache__":
            continue
        manifest = module_dir / "manifest.json"
        if manifest.exists():
            with open(manifest, "r", encoding="utf-8") as f:
                data = json.load(f)
                if data.get("admin_menu"):
                    menus.append(data)
    return {"code": 200, "message": "ok", "data": sorted(menus, key=lambda x: x.get("order", 999))}
