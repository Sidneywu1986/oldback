from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.schemas.base import BaseResponse, PaginatedResponse
from app.schemas.user import UserCreate, UserUpdate, UserOut
from app.core.dependencies import get_current_active_user
from app.services.user_service import list_users, create_user, update_user, delete_user

router = APIRouter(prefix="/api/v1/users", tags=["用户管理"])


@router.get("", response_model=BaseResponse[PaginatedResponse[UserOut]])
def get_users(
    page: int = 1, page_size: int = 20,
    keyword: str = "", dept_id: int = None, status: int = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return BaseResponse(data=list_users(db, page, page_size, keyword, dept_id, status))


@router.post("", response_model=BaseResponse[UserOut])
def post_user(req: UserCreate, db: Session = Depends(get_db)):
    return BaseResponse(data=create_user(db, req))


@router.put("/{user_id}", response_model=BaseResponse[UserOut])
def put_user(user_id: int, req: UserUpdate, db: Session = Depends(get_db)):
    return BaseResponse(data=update_user(db, user_id, req))


@router.delete("/{user_id}")
def del_user(user_id: int, db: Session = Depends(get_db)):
    delete_user(db, user_id)
    return BaseResponse(message="已禁用")
