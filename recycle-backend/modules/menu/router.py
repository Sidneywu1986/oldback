from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.base import BaseResponse
from app.schemas.rbac import MenuCreate, MenuOut
from app.services.menu_service import get_menu_tree, get_user_menus, create_menu, update_menu, delete_menu

router = APIRouter(prefix="/api/v1/menus", tags=["菜单管理"])


@router.get("/tree", response_model=BaseResponse[list[MenuOut]])
def menu_tree(db: Session = Depends(get_db)):
    return BaseResponse(data=get_menu_tree(db))


@router.get("/user")
def user_menus(db: Session = Depends(get_db)):
    return BaseResponse(data=get_user_menus(db))


@router.post("", response_model=BaseResponse[MenuOut])
def post_menu(req: MenuCreate, db: Session = Depends(get_db)):
    return BaseResponse(data=create_menu(db, req))


@router.put("/{menu_id}", response_model=BaseResponse[MenuOut])
def put_menu(menu_id: int, req: MenuCreate, db: Session = Depends(get_db)):
    return BaseResponse(data=update_menu(db, menu_id, req))


@router.delete("/{menu_id}")
def del_menu(menu_id: int, db: Session = Depends(get_db)):
    delete_menu(db, menu_id)
    return BaseResponse(message="已停用")
