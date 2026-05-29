from sqlalchemy.orm import Session
from typing import List
from fastapi import HTTPException
from app.models.department import Department
from app.models.user import User
from app.schemas.rbac import DepartmentCreate, DepartmentOut


def build_dept_tree(depts: list, parent_id: int = None) -> List[DepartmentOut]:
    tree = []
    for d in depts:
        if d.parent_id == parent_id:
            node = DepartmentOut.model_validate(d)
            node.children = build_dept_tree(depts, d.id)
            tree.append(node)
    return tree


def get_dept_tree(db: Session) -> List[DepartmentOut]:
    depts = db.query(Department).filter(Department.is_deleted == 0, Department.status == 1).all()
    result = []
    for d in depts:
        do = DepartmentOut.model_validate(d)
        if d.leader_id:
            leader = db.query(User).filter(User.is_deleted == 0, User.id == d.leader_id).first()
            do.leader_name = leader.real_name or leader.username if leader else None
        result.append(do)
    return build_dept_tree(result)


def create_department(db: Session, req: DepartmentCreate) -> DepartmentOut:
    dept = Department(**req.model_dump())
    db.add(dept)
    db.commit()
    db.refresh(dept)
    return DepartmentOut.model_validate(dept)


def update_department(db: Session, dept_id: int, req: DepartmentCreate) -> DepartmentOut:
    dept = db.query(Department).filter(Department.is_deleted == 0, Department.id == dept_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="部门不存在")
    for k, v in req.model_dump().items():
        setattr(dept, k, v)
    db.commit()
    db.refresh(dept)
    return DepartmentOut.model_validate(dept)


def delete_department(db: Session, dept_id: int):
    dept = db.query(Department).filter(Department.is_deleted == 0, Department.id == dept_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="部门不存在")
    dept.is_deleted = 1
    dept.status = 0
    db.commit()
