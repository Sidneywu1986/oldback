from sqlalchemy.orm import Session
from typing import List
from app.models.permission import Permission
from app.schemas.rbac import PermissionCreate, PermissionOut


def build_permission_tree(permissions: List[Permission], parent_id: int = None) -> List[PermissionOut]:
    tree = []
    for p in permissions:
        if p.parent_id == parent_id:
            node = PermissionOut.model_validate(p)
            node.children = build_permission_tree(permissions, p.id)
            tree.append(node)
    return tree


def list_permissions(db: Session) -> List[PermissionOut]:
    perms = db.query(Permission).filter(Permission.is_deleted == 0).all()
    return build_permission_tree(perms)


def create_permission(db: Session, req: PermissionCreate) -> PermissionOut:
    perm = Permission(**req.model_dump())
    db.add(perm)
    db.commit()
    db.refresh(perm)
    return PermissionOut.model_validate(perm)


def delete_permission(db: Session, perm_id: int):
    perm = db.query(Permission).filter(Permission.id == perm_id).first()
    if perm:
        perm.is_deleted = 1
        db.commit()
