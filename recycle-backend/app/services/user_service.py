from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.models.role import Role
from app.models.department import Department
from app.core.security import get_password_hash
from app.schemas.user import UserCreate, UserUpdate, UserOut
from app.schemas.base import PaginatedResponse


def list_users(db: Session, page: int = 1, page_size: int = 20,
               keyword: str = "", dept_id: int = None, status: int = None) -> PaginatedResponse[UserOut]:
    query = db.query(User)
    query = query.filter(User.is_deleted == 0)
    if keyword:
        query = query.filter(User.username.contains(keyword) | User.real_name.contains(keyword))
    if dept_id:
        query = query.filter(User.dept_id == dept_id)
    if status is not None:
        query = query.filter(User.status == status)

    total = query.count()
    items = query.offset((page - 1) * page_size).limit(page_size).all()

    result = []
    for u in items:
        uo = UserOut.model_validate(u)
        if u.dept_id:
            dept = db.query(Department).filter(Department.id == u.dept_id).first()
            uo.dept_name = dept.dept_name if dept else None
        result.append(uo)

    return PaginatedResponse(total=total, page=page, page_size=page_size, list=result)


def create_user(db: Session, req: UserCreate) -> UserOut:
    if db.query(User).filter(User.username == req.username).first():
        raise HTTPException(status_code=400, detail="用户名已存在")

    user = User(
        username=req.username,
        password_hash=get_password_hash(req.password),
        real_name=req.real_name,
        phone=req.phone,
        email=req.email,
        dept_id=req.dept_id,
        status=req.status,
    )
    if req.role_ids:
        roles = db.query(Role).filter(Role.id.in_(req.role_ids)).all()
        user.roles = roles

    db.add(user)
    db.commit()
    db.refresh(user)
    return UserOut.model_validate(user)


def update_user(db: Session, user_id: int, req: UserUpdate) -> UserOut:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")

    for field, value in req.model_dump(exclude_unset=True).items():
        if field == "role_ids" and value is not None:
            roles = db.query(Role).filter(Role.id.in_(value)).all()
            user.roles = roles
        else:
            setattr(user, field, value)

    db.commit()
    db.refresh(user)
    return UserOut.model_validate(user)


def delete_user(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")
    user.is_deleted = 1
    user.status = 0
    db.commit()
