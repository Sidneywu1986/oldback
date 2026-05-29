from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime
import random
from app.models.ticket_template import TicketTemplate
from app.models.ticket import Ticket
from app.schemas.base import PaginatedResponse
from app.schemas.ticket import TicketTemplateCreate, TicketTemplateOut, TicketCreate, TicketOut


def gen_ticket_no():
    return f"T{datetime.now().strftime('%Y%m%d%H%M%S')}{random.randint(1000, 9999)}"


def list_templates(db: Session, page: int = 1, page_size: int = 20) -> PaginatedResponse[TicketTemplateOut]:
    total = db.query(TicketTemplate).filter(TicketTemplate.is_deleted == 0).count()
    items = db.query(TicketTemplate).filter(TicketTemplate.is_deleted == 0).offset((page - 1) * page_size).limit(page_size).all()
    return PaginatedResponse(total=total, page=page, page_size=page_size,
                             list=[TicketTemplateOut.model_validate(t) for t in items])


def create_template(db: Session, req: TicketTemplateCreate) -> TicketTemplateOut:
    tpl = TicketTemplate(**req.model_dump())
    db.add(tpl)
    db.commit()
    db.refresh(tpl)
    return TicketTemplateOut.model_validate(tpl)


def update_template(db: Session, tpl_id: int, req: TicketTemplateCreate) -> TicketTemplateOut:
    tpl = db.query(TicketTemplate).filter(TicketTemplate.id == tpl_id).first()
    if not tpl:
        raise HTTPException(status_code=404, detail="模板不存在")
    for k, v in req.model_dump().items():
        setattr(tpl, k, v)
    db.commit()
    db.refresh(tpl)
    return TicketTemplateOut.model_validate(tpl)


def list_tickets(db: Session, page: int = 1, page_size: int = 20,
                 status: int = None, keyword: str = "") -> PaginatedResponse[TicketOut]:
    query = db.query(Ticket)
    query = query.filter(Ticket.is_deleted == 0)
    if status is not None:
        query = query.filter(Ticket.status == status)
    if keyword:
        query = query.filter(Ticket.title.contains(keyword))

    total = query.count()
    items = query.order_by(Ticket.create_time.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return PaginatedResponse(total=total, page=page, page_size=page_size,
                             list=[TicketOut.model_validate(t) for t in items])


def create_ticket(db: Session, req: TicketCreate) -> TicketOut:
    ticket = Ticket(ticket_no=gen_ticket_no(), **req.model_dump())
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return TicketOut.model_validate(ticket)


def transfer_ticket(db: Session, ticket_id: int, assignee_id: int):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="工单不存在")
    ticket.assignee_id = assignee_id
    db.commit()
