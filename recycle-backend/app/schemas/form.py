from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class FormDefCreate(BaseModel):
    form_name: str
    form_key: str
    description: Optional[str] = None
    fields_json: str
    status: int = 1

class FormDefOut(BaseModel):
    id: int
    form_name: str
    form_key: str
    description: Optional[str]
    fields_json: str
    status: int
    create_time: datetime
    class Config:
        from_attributes = True

class FormDataSubmit(BaseModel):
    form_id: int
    data_json: str

class FormDataOut(BaseModel):
    id: int
    form_id: int
    form_name: Optional[str] = None
    data_json: str
    submitter_id: Optional[int]
    submitter_name: Optional[str]
    create_time: datetime
    class Config:
        from_attributes = True
