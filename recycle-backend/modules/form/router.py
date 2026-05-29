from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.base import BaseResponse, PaginatedResponse
from app.schemas.form import FormDefCreate, FormDefOut, FormDataSubmit, FormDataOut
from app.services.form_service import (
    list_form_defs,
    create_form_def,
    update_form_def,
    delete_form_def,
    list_form_data,
    submit_form_data,
)

router = APIRouter(prefix="/api/v1/form-defs", tags=["自定义表单"])


@router.get("", response_model=BaseResponse[PaginatedResponse[FormDefOut]])
def list_form_defs_route(page: int = 1, page_size: int = 20, db: Session = Depends(get_db)):
    return BaseResponse(data=list_form_defs(db, page=page, page_size=page_size))


@router.post("", response_model=BaseResponse[FormDefOut])
def create_form_def_route(req: FormDefCreate, db: Session = Depends(get_db)):
    return BaseResponse(data=create_form_def(db, req))


@router.put("/{form_id}", response_model=BaseResponse[FormDefOut])
def update_form_def_route(form_id: int, req: FormDefCreate, db: Session = Depends(get_db)):
    return BaseResponse(data=update_form_def(db, form_id, req))


@router.delete("/{form_id}")
def delete_form_def_route(form_id: int, db: Session = Depends(get_db)):
    delete_form_def(db, form_id)
    return BaseResponse(message="已停用")


@router.get("/{form_id}/data", response_model=BaseResponse[PaginatedResponse[FormDataOut]])
def list_form_data_route(form_id: int, page: int = 1, page_size: int = 20, db: Session = Depends(get_db)):
    return BaseResponse(data=list_form_data(db, form_id, page=page, page_size=page_size))


@router.post("/{form_id}/data", response_model=BaseResponse)
def submit_form_data_route(form_id: int, req: FormDataSubmit, db: Session = Depends(get_db)):
    submit_form_data(db, form_id, req)
    return BaseResponse(message="提交成功")
