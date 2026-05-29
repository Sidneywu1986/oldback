from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.base import BaseResponse, PaginatedResponse
from app.schemas.fund import FundAccountOut, FundTransactionOut, FundAward, FundWithdrawApply, FundWithdrawAudit
from app.services import fund_service
from app.services import fund_transaction_service

router = APIRouter(prefix="/api/v1/fund", tags=["资金管理"])


@router.get("/accounts", response_model=BaseResponse[PaginatedResponse[FundAccountOut]])
def list_accounts(
    page: int = 1, page_size: int = 20, keyword: str = "",
    db: Session = Depends(get_db),
):
    data = fund_service.list_accounts(db, page=page, page_size=page_size, keyword=keyword)
    return BaseResponse(data=data)


@router.get("/accounts/{master_id}", response_model=BaseResponse[FundAccountOut])
def get_account(master_id: int, db: Session = Depends(get_db)):
    data = fund_service.get_account(db, master_id)
    return BaseResponse(data=data)


@router.get("/transactions", response_model=BaseResponse[PaginatedResponse[FundTransactionOut]])
def list_transactions(
    page: int = 1, page_size: int = 20,
    master_id: int = None, txn_type: str = None,
    db: Session = Depends(get_db),
):
    data = fund_transaction_service.list_transactions(
        db, page=page, page_size=page_size, master_id=master_id, txn_type=txn_type,
    )
    return BaseResponse(data=data)


@router.post("/award", response_model=BaseResponse)
def award_fund(req: FundAward, db: Session = Depends(get_db)):
    result = fund_service.award_fund(db, req)
    return BaseResponse(message=result["message"])


@router.post("/withdraw/apply", response_model=BaseResponse)
def apply_withdraw(req: FundWithdrawApply, db: Session = Depends(get_db)):
    result = fund_transaction_service.apply_withdraw(db, req)
    return BaseResponse(message=result["message"])


@router.put("/withdraw/{txn_id}/audit", response_model=BaseResponse)
def audit_withdraw(txn_id: int, req: FundWithdrawAudit, db: Session = Depends(get_db)):
    result = fund_transaction_service.audit_withdraw(db, txn_id, req)
    return BaseResponse(message=result["message"])
