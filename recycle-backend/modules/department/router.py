from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.base import BaseResponse
from app.schemas.rbac import DepartmentCreate, DepartmentOut
from app.services.department_service import get_dept_tree, create_department, update_department, delete_department

router = APIRouter(prefix="/api/v1/departments", tags=["部门管理"])


@router.get("/tree", response_model=BaseResponse[list[DepartmentOut]])
def dept_tree(db: Session = Depends(get_db)):
    return BaseResponse(data=get_dept_tree(db))


@router.get("", response_model=BaseResponse[list[DepartmentOut]])
def list_depts(db: Session = Depends(get_db)):
    return BaseResponse(data=get_dept_tree(db))


@router.post("", response_model=BaseResponse[DepartmentOut])
def post_dept(req: DepartmentCreate, db: Session = Depends(get_db)):
    return BaseResponse(data=create_department(db, req))


@router.put("/{dept_id}", response_model=BaseResponse[DepartmentOut])
def put_dept(dept_id: int, req: DepartmentCreate, db: Session = Depends(get_db)):
    return BaseResponse(data=update_department(db, dept_id, req))


@router.delete("/{dept_id}")
def del_dept(dept_id: int, db: Session = Depends(get_db)):
    delete_department(db, dept_id)
    return BaseResponse(message="已停用")
