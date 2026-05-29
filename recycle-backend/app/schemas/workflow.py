from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class WorkflowDefCreate(BaseModel):
    workflow_name: str
    workflow_key: str
    config_json: Optional[str] = None
    status: int = 1

class WorkflowDefOut(BaseModel):
    id: int
    workflow_name: str
    workflow_key: str
    version: int
    status: int
    config_json: Optional[str]
    create_time: datetime
    class Config:
        from_attributes = True

class WorkflowTaskOut(BaseModel):
    id: int
    instance_id: int
    node_name: str
    node_key: str
    assignee_type: str
    assignee_id: Optional[int]
    assignee_name: Optional[str]
    action: Optional[str]
    comment: Optional[str]
    create_time: datetime
    complete_time: Optional[datetime]
    class Config:
        from_attributes = True

class WorkflowInstanceOut(BaseModel):
    id: int
    workflow_id: int
    business_key: Optional[str]
    current_node: Optional[str]
    status: int
    start_time: datetime
    end_time: Optional[datetime]
    tasks: List[WorkflowTaskOut] = []
    class Config:
        from_attributes = True

class TaskComplete(BaseModel):
    action: str  # pass/reject/transfer
    comment: Optional[str] = None
    assignee_id: Optional[int] = None  # for transfer
