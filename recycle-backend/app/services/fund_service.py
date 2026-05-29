from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.fund_account import FundAccount
from app.models.master import Master
from app.schemas.base import PaginatedResponse
from app.schemas.fund import FundAccountOut, FundAward
from datetime import datetime
from decimal import Decimal


def list_accounts(
    db: Session,
    page: int = 1,
    page_size: int = 20,
    keyword: str = "",
) -> PaginatedResponse[FundAccountOut]:
    query = db.query(FundAccount)
    query = query.filter(FundAccount.is_deleted == 0)
    if keyword:
        query = query.join(Master).filter(Master.name.contains(keyword))

    total = query.count()
    items = query.offset((page - 1) * page_size).limit(page_size).all()

    result = []
    for item in items:
        fa = FundAccountOut.model_validate(item)
        m = db.query(Master).filter(Master.id == item.master_id).first()
        fa.master_name = m.name if m else None
        result.append(fa)

    return PaginatedResponse(total=total, page=page, page_size=page_size, list=result)


def get_account(db: Session, master_id: int) -> FundAccountOut:
    account = db.query(FundAccount).filter(FundAccount.master_id == master_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="账户不存在")
    fa = FundAccountOut.model_validate(account)
    m = db.query(Master).filter(Master.id == account.master_id).first()
    fa.master_name = m.name if m else None
    return fa


def award_fund(db: Session, req: FundAward) -> dict:
    account = db.query(FundAccount).filter(FundAccount.master_id == req.master_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="账户不存在")

    from app.models.fund_transaction import FundTransaction

    account.balance = Decimal(str(account.balance)) + req.amount
    account.total_income = Decimal(str(account.total_income)) + req.amount

    txn = FundTransaction(
        account_id=account.id,
        master_id=req.master_id,
        txn_type="award",
        amount=req.amount,
        balance_after=account.balance,
        remark=req.remark,
        status=1,
        create_time=datetime.utcnow(),
    )
    db.add(txn)
    db.commit()

    return {"message": f"成功发放 {req.amount} 元"}
