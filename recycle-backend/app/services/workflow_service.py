from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime
from app.models.workflow_def import WorkflowDef
from app.models.workflow_instance import WorkflowInstance
from app.models.workflow_task import WorkflowTask
from app.schemas.workflow import WorkflowDefCreate, WorkflowDefOut, TaskComplete


def list_workflow_defs(db: Session) -> list[WorkflowDefOut]:
    items = db.query(WorkflowDef).filter(WorkflowDef.is_deleted == 0).all()
    return [WorkflowDefOut.model_validate(w) for w in items]


def create_workflow_def(db: Session, req: WorkflowDefCreate) -> WorkflowDefOut:
    wf = WorkflowDef(**req.model_dump())
    db.add(wf)
    db.commit()
    db.refresh(wf)
    return WorkflowDefOut.model_validate(wf)


def update_workflow_def(db: Session, wf_id: int, req: WorkflowDefCreate) -> WorkflowDefOut:
    wf = db.query(WorkflowDef).filter(WorkflowDef.id == wf_id).first()
    if not wf:
        raise HTTPException(status_code=404, detail="流程定义不存在")
    for k, v in req.model_dump().items():
        setattr(wf, k, v)
    db.commit()
    db.refresh(wf)
    return WorkflowDefOut.model_validate(wf)


def start_instance(db: Session, workflow_id: int, business_key: str):
    wf = db.query(WorkflowDef).filter(WorkflowDef.id == workflow_id).first()
    if not wf:
        raise HTTPException(status_code=404, detail="流程定义不存在")

    instance = WorkflowInstance(
        workflow_id=workflow_id,
        business_key=business_key,
        current_node="start",
        status=0,
        start_time=datetime.utcnow()
    )
    db.add(instance)
    db.commit()
    db.refresh(instance)

    task = WorkflowTask(
        instance_id=instance.id,
        node_name="审核",
        node_key="audit",
        assignee_type="role",
        create_time=datetime.utcnow()
    )
    db.add(task)
    db.commit()

    return {"instance_id": instance.id, "status": "started"}


def get_my_todos(db: Session) -> list[dict]:
    tasks = db.query(WorkflowTask).filter(
        WorkflowTask.complete_time.is_(None)
    ).order_by(WorkflowTask.create_time.desc()).all()
    return [{
        "id": t.id, "instance_id": t.instance_id, "node_name": t.node_name,
        "assignee_name": t.assignee_name, "create_time": t.create_time
    } for t in tasks]


def get_my_done(db: Session) -> list[dict]:
    tasks = db.query(WorkflowTask).filter(
        WorkflowTask.complete_time.isnot(None)
    ).order_by(WorkflowTask.complete_time.desc()).all()
    return [{
        "id": t.id, "instance_id": t.instance_id, "node_name": t.node_name,
        "action": t.action, "comment": t.comment, "complete_time": t.complete_time
    } for t in tasks]


def complete_task(db: Session, task_id: int, req: TaskComplete):
    task = db.query(WorkflowTask).filter(WorkflowTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="任务不存在")

    task.action = req.action
    task.comment = req.comment
    task.complete_time = datetime.utcnow()

    if req.action == "transfer" and req.assignee_id:
        new_task = WorkflowTask(
            instance_id=task.instance_id,
            node_name=task.node_name,
            node_key=task.node_key,
            assignee_id=req.assignee_id,
            create_time=datetime.utcnow()
        )
        db.add(new_task)

    db.commit()
