from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.parts_category import PartsCategory
from app.schemas.recycle import PartsCategoryCreate, PartsCategoryOut


def list_categories(db: Session) -> list[PartsCategoryOut]:
    cats = db.query(PartsCategory).filter(PartsCategory.status == 1).all()
    return [PartsCategoryOut.model_validate(c) for c in cats]


def create_category(db: Session, req: PartsCategoryCreate) -> PartsCategoryOut:
    cat = PartsCategory(**req.model_dump())
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return PartsCategoryOut.model_validate(cat)


def update_category(db: Session, cat_id: int, req: PartsCategoryCreate) -> PartsCategoryOut:
    cat = db.query(PartsCategory).filter(PartsCategory.id == cat_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="分类不存在")
    for k, v in req.model_dump().items():
        setattr(cat, k, v)
    db.commit()
    db.refresh(cat)
    return PartsCategoryOut.model_validate(cat)


def delete_category(db: Session, cat_id: int):
    cat = db.query(PartsCategory).filter(PartsCategory.id == cat_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="分类不存在")
    cat.is_deleted = 1
    cat.status = 0
    db.commit()
