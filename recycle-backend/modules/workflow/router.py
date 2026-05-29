from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.base import BaseResponse
from app.schemas.workflow import WorkflowDefCreate, TaskComplete
from app.services.workflow_service import (
    list_workflow_defs, create_workflow_def, update_workflow_def,
    start_instance, get_my_todos, get_my_done, complete_task
)

router = APIRouter(prefix="/api/v1/workflow", tags=["流程引擎"])


@router.get("/defs", response_model=BaseResponse)
def get_defs(db: Session = Depends(get_db)):
    return BaseResponse(data=list_workflow_defs(db))


@router.post("/defs", response_model=BaseResponse)
def post_def(req: WorkflowDefCreate, db: Session = Depends(get_db)):
    return BaseResponse(data=create_workflow_def(db, req))


@router.put("/defs/{wf_id}", response_model=BaseResponse)
def put_def(wf_id: int, req: WorkflowDefCreate, db: Session = Depends(get_db)):
    return BaseResponse(data=update_workflow_def(db, wf_id, req))


@router.post("/instances/start", response_model=BaseResponse)
def post_start(workflow_id: int, business_key: str, db: Session = Depends(get_db)):
    return BaseResponse(data=start_instance(db, workflow_id, business_key))


@router.get("/tasks/my", response_model=BaseResponse)
def my_todos(db: Session = Depends(get_db)):
    return BaseResponse(data=get_my_todos(db))


@router.get("/tasks/my-done", response_model=BaseResponse)
def my_done(db: Session = Depends(get_db)):
    return BaseResponse(data=get_my_done(db))


@router.post("/tasks/{task_id}/complete", response_model=BaseResponse)
def post_complete(task_id: int, req: TaskComplete, db: Session = Depends(get_db)):
    complete_task(db, task_id, req)
    return BaseResponse(message="处理完成")
