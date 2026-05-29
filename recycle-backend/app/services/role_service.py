from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.role import Role
from app.models.permission import Permission
from app.schemas.rbac import RoleCreate, RoleUpdate, RoleOut
from app.schemas.base import PaginatedResponse


def list_roles(db: Session, page: int = 1, page_size: int = 20, keyword: str = "") -> PaginatedResponse[RoleOut]:
    query = db.query(Role)
    query = query.filter(Role.is_deleted == 0)
    if keyword:
        query = query.filter(Role.role_name.contains(keyword) | Role.role_code.contains(keyword))
    total = query.count()
    items = query.offset((page - 1) * page_size).limit(page_size).all()
    return PaginatedResponse(total=total, page=page, page_size=page_size,
                             list=[RoleOut.model_validate(r) for r in items])


def create_role(db: Session, req: RoleCreate) -> RoleOut:
    if db.query(Role).filter(Role.role_code == req.role_code).first():
        raise HTTPException(status_code=400, detail="角色编码已存在")
    role = Role(**req.model_dump())
    db.add(role)
    db.commit()
    db.refresh(role)
    return RoleOut.model_validate(role)


def update_role(db: Session, role_id: int, req: RoleUpdate) -> RoleOut:
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="角色不存在")
    for k, v in req.model_dump(exclude_unset=True).items():
        setattr(role, k, v)
    db.commit()
    db.refresh(role)
    return RoleOut.model_validate(role)


def delete_role(db: Session, role_id: int):
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="角色不存在")
    role.is_deleted = 1
    role.status = 0
    db.commit()


def get_role_permissions(db: Session, role_id: int):
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="角色不存在")
    return [{"id": p.id, "perm_name": p.perm_name, "perm_code": p.perm_code} for p in role.permissions]


def set_role_permissions(db: Session, role_id: int, perm_ids: list[int]):
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="角色不存在")
    perms = db.query(Permission).filter(Permission.id.in_(perm_ids)).all()
    role.permissions = perms
    db.commit()
