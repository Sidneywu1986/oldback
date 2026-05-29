from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.models.role import Role
from app.core.security import verify_password, create_access_token, get_password_hash


def authenticate_user(db: Session, username: str, password: str) -> dict:
    """验证用户登录，返回 token 和 user 信息"""
    user = db.query(User).filter(User.is_deleted == 0, User.username == username, User.status == 1).first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户名或密码错误"
        )

    token = create_access_token({"sub": str(user.id), "username": user.username})

    roles = []
    permissions = []
    for role in user.roles:
        roles.append({"id": role.id, "name": role.role_name, "code": role.role_code})
        for perm in role.permissions:
            if perm.perm_code not in permissions:
                permissions.append(perm.perm_code)

    # 超级管理员自动拥有所有权限，同时返回通配符标记
    if user.is_super:
        permissions.append("*")

    return {
        "token": token,
        "user": {
            "id": user.id,
            "username": user.username,
            "real_name": user.real_name,
            "avatar": user.avatar,
            "roles": roles,
            "permissions": permissions,
            "is_super": user.is_super,
        }
    }


def get_user_by_id(db: Session, user_id: int) -> User:
    """根据 ID 获取用户"""
    user = db.query(User).filter(User.is_deleted == 0, User.id == user_id, User.status == 1).first()
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")
    return user


def change_password(db: Session, user_id: int, old_password: str, new_password: str):
    """修改密码"""
    user = db.query(User).filter(User.is_deleted == 0, User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")
    if not verify_password(old_password, user.password_hash):
        raise HTTPException(status_code=400, detail="旧密码错误")
    user.password_hash = get_password_hash(new_password)
    db.commit()
