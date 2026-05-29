from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.base import BaseResponse, PaginatedResponse
from app.schemas.ticket import TicketTemplateCreate, TicketTemplateOut, TicketCreate, TicketOut
from app.services.ticket_service import (
    list_templates,
    create_template,
    update_template,
    list_tickets,
    create_ticket,
    transfer_ticket,
)

router = APIRouter(prefix="/api/v1/tickets", tags=["自定义工单"])


@router.get("/templates", response_model=BaseResponse[PaginatedResponse[TicketTemplateOut]])
def list_templates_route(page: int = 1, page_size: int = 20, db: Session = Depends(get_db)):
    return BaseResponse(data=list_ticket_templates(db, page=page, page_size=page_size))


@router.post("/templates", response_model=BaseResponse[TicketTemplateOut])
def create_template_route(req: TicketTemplateCreate, db: Session = Depends(get_db)):
    return BaseResponse(data=create_ticket_template(db, req))


@router.put("/templates/{tpl_id}", response_model=BaseResponse[TicketTemplateOut])
def update_template_route(tpl_id: int, req: TicketTemplateCreate, db: Session = Depends(get_db)):
    return BaseResponse(data=update_ticket_template(db, tpl_id, req))


@router.get("", response_model=BaseResponse[PaginatedResponse[TicketOut]])
def list_tickets_route(
    page: int = 1,
    page_size: int = 20,
    status: int = None,
    keyword: str = "",
    db: Session = Depends(get_db),
):
    return BaseResponse(data=list_tickets(db, page=page, page_size=page_size, status=status, keyword=keyword))


@router.post("", response_model=BaseResponse[TicketOut])
def create_ticket_route(req: TicketCreate, db: Session = Depends(get_db)):
    return BaseResponse(data=create_ticket(db, req))


@router.put("/{ticket_id}/transfer", response_model=BaseResponse)
def transfer_ticket_route(ticket_id: int, assignee_id: int, db: Session = Depends(get_db)):
    transfer_ticket(db, ticket_id, assignee_id)
    return BaseResponse(message="已转办")
