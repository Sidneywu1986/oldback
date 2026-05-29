from sqlalchemy.orm import Session
from sqlalchemy import asc
from typing import List
from fastapi import HTTPException
from app.models.menu import Menu
from app.schemas.rbac import MenuCreate, MenuOut


def build_menu_tree(menus: List[Menu], parent_id: int = None) -> List[MenuOut]:
    tree = []
    for m in menus:
        if m.parent_id == parent_id:
            node = MenuOut.model_validate(m)
            node.children = build_menu_tree(menus, m.id)
            tree.append(node)
    return tree


def get_menu_tree(db: Session) -> List[MenuOut]:
    menus = db.query(Menu).filter(Menu.is_deleted == 0, Menu.status == 1).order_by(asc(Menu.sort_order)).all()
    return build_menu_tree(menus)


def get_user_menus(db: Session) -> List[MenuOut]:
    menus = db.query(Menu).filter(Menu.is_deleted == 0, Menu.status == 1).order_by(asc(Menu.sort_order)).all()
    return build_menu_tree(menus)


def create_menu(db: Session, req: MenuCreate) -> MenuOut:
    menu = Menu(**req.model_dump())
    db.add(menu)
    db.commit()
    db.refresh(menu)
    return MenuOut.model_validate(menu)


def update_menu(db: Session, menu_id: int, req: MenuCreate) -> MenuOut:
    menu = db.query(Menu).filter(Menu.is_deleted == 0, Menu.id == menu_id).first()
    if not menu:
        raise HTTPException(status_code=404, detail="菜单不存在")
    for k, v in req.model_dump().items():
        setattr(menu, k, v)
    db.commit()
    db.refresh(menu)
    return MenuOut.model_validate(menu)


def delete_menu(db: Session, menu_id: int):
    menu = db.query(Menu).filter(Menu.is_deleted == 0, Menu.id == menu_id).first()
    if menu:
        menu.is_deleted = 1
        menu.status = 0
        db.commit()
