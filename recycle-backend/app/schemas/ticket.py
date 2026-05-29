from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TicketTemplateCreate(BaseModel):
    template_name: str
    template_key: str
    fields_json: str
    workflow_id: Optional[int] = None
    status: int = 1

class TicketTemplateOut(BaseModel):
    id: int
    template_name: str
    template_key: str
    fields_json: str
    workflow_id: Optional[int]
    status: int
    create_time: datetime
    class Config:
        from_attributes = True

class TicketCreate(BaseModel):
    template_id: int
    title: str
    data_json: Optional[str] = None
    assignee_id: Optional[int] = None

class TicketOut(BaseModel):
    id: int
    template_id: int
    template_name: Optional[str] = None
    ticket_no: str
    title: str
    data_json: Optional[str]
    current_node: Optional[str]
    status: int
    status_label: Optional[str] = None
    creator_id: Optional[int]
    creator_name: Optional[str]
    assignee_id: Optional[int]
    assignee_name: Optional[str]
    create_time: datetime
    update_time: datetime
    class Config:
        from_attributes = True
