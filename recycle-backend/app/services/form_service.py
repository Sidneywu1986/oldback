from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.form_definition import FormDefinition
from app.models.form_data import FormData
from app.schemas.base import PaginatedResponse
from app.schemas.form import FormDefCreate, FormDefOut, FormDataSubmit, FormDataOut


def list_form_defs(
    db: Session, page: int = 1, page_size: int = 20
) -> PaginatedResponse[FormDefOut]:
    total = db.query(FormDefinition).filter(FormDefinition.is_deleted == 0).count()
    items = db.query(FormDefinition).filter(FormDefinition.is_deleted == 0).offset((page - 1) * page_size).limit(page_size).all()
    return PaginatedResponse(
        total=total,
        page=page,
        page_size=page_size,
        list=[FormDefOut.model_validate(f) for f in items],
    )


def create_form_def(db: Session, req: FormDefCreate) -> FormDefOut:
    form = FormDefinition(**req.model_dump())
    db.add(form)
    db.commit()
    db.refresh(form)
    return FormDefOut.model_validate(form)


def update_form_def(db: Session, form_id: int, req: FormDefCreate) -> FormDefOut:
    form = db.query(FormDefinition).filter(FormDefinition.id == form_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="表单不存在")
    for k, v in req.model_dump().items():
        setattr(form, k, v)
    db.commit()
    db.refresh(form)
    return FormDefOut.model_validate(form)


def delete_form_def(db: Session, form_id: int) -> None:
    form = db.query(FormDefinition).filter(FormDefinition.id == form_id).first()
    if form:
        form.is_deleted = 1
        form.status = 0
        db.commit()


def list_form_data(
    db: Session, form_id: int, page: int = 1, page_size: int = 20
) -> PaginatedResponse[FormDataOut]:
    query = db.query(FormData).filter(FormData.form_id == form_id)
    total = query.count()
    items = query.offset((page - 1) * page_size).limit(page_size).all()

    result = []
    for item in items:
        fd = FormDataOut.model_validate(item)
        form_def = db.query(FormDefinition).filter(FormDefinition.id == item.form_id).first()
        fd.form_name = form_def.form_name if form_def else None
        result.append(fd)

    return PaginatedResponse(total=total, page=page, page_size=page_size, list=result)


def submit_form_data(db: Session, form_id: int, req: FormDataSubmit) -> None:
    form = db.query(FormDefinition).filter(FormDefinition.id == form_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="表单不存在")
    data = FormData(form_id=form_id, data_json=req.data_json)
    db.add(data)
    db.commit()
