import os
import uuid
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from app.core.config import settings
from app.schemas.base import BaseResponse

router = APIRouter(prefix="/api/v1/upload", tags=["文件上传"])

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


@router.post("", response_model=BaseResponse)
async def upload_file(file: UploadFile = File(...)):
    # Validate file type
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"不支持的文件格式: {ext}，仅支持 jpg、jpeg、png、webp")

    # Validate file size
    contents = await file.read()
    if len(contents) > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(status_code=400, detail="文件大小超过5MB限制")

    # Save with UUID name
    date_dir = datetime.now().strftime("%Y%m%d")
    upload_dir = os.path.join(settings.UPLOAD_DIR, date_dir)
    os.makedirs(upload_dir, exist_ok=True)

    new_filename = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(upload_dir, new_filename)

    with open(file_path, "wb") as f:
        f.write(contents)

    return BaseResponse(data={
        "url": f"/uploads/{date_dir}/{new_filename}",
        "filename": file.filename,
        "size": len(contents),
    })


@router.get("/{date_dir}/{filename}")
async def get_file(date_dir: str, filename: str):
    file_path = os.path.join(settings.UPLOAD_DIR, date_dir, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="文件不存在")
    return FileResponse(file_path)
