from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException
from app.models.fund_transaction import FundTransaction
from app.models.fund_account import FundAccount
from app.models.master import Master
from app.schemas.base import PaginatedResponse
from app.schemas.fund import FundTransactionOut, FundWithdrawApply, FundWithdrawAudit
from datetime import datetime
from decimal import Decimal
import threading

TXN_TYPE_MAP = {
    "recycle_reward": "回收奖励",
    "withdraw": "提现",
    "award": "手动发放",
    "deduct": "扣减",
    "exchange": "积分兑换",
}

_withdraw_lock = threading.Lock()


def list_transactions(
    db: Session,
    page: int = 1,
    page_size: int = 20,
    master_id: int = None,
    txn_type: str = None,
) -> PaginatedResponse[FundTransactionOut]:
    query = db.query(FundTransaction)
    query = query.filter(FundTransaction.is_deleted == 0)
    if master_id:
        query = query.filter(FundTransaction.master_id == master_id)
    if txn_type:
        query = query.filter(FundTransaction.txn_type == txn_type)

    total = query.count()
    items = (
        query.order_by(FundTransaction.create_time.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    result = []
    for item in items:
        ft = FundTransactionOut.model_validate(item)
        ft.txn_type_label = TXN_TYPE_MAP.get(item.txn_type, item.txn_type)
        m = db.query(Master).filter(Master.id == item.master_id).first()
        ft.master_name = m.name if m else None
        result.append(ft)

    return PaginatedResponse(total=total, page=page, page_size=page_size, list=result)


def apply_withdraw(db: Session, req: FundWithdrawApply) -> dict:
    account = db.query(FundAccount).filter(FundAccount.master_id == req.master_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="账户不存在")
    if Decimal(str(account.balance)) < req.amount:
        raise HTTPException(status_code=400, detail="余额不足")

    with _withdraw_lock:
        # Re-fetch inside lock to prevent stale reads
        account = db.query(FundAccount).filter(FundAccount.id == account.id).with_for_update().first()
        if Decimal(str(account.balance)) < req.amount:
            raise HTTPException(status_code=400, detail="余额不足")

        account.balance = Decimal(str(account.balance)) - req.amount
        account.frozen_amount = Decimal(str(account.frozen_amount)) + req.amount

        txn = FundTransaction(
            account_id=account.id,
            master_id=req.master_id,
            txn_type="withdraw",
            amount=-req.amount,
            balance_after=account.balance,
            remark=f"提现申请: {req.remark or ''}",
            status=2,
            create_time=datetime.utcnow(),
        )
        db.add(txn)
        db.commit()
        db.refresh(txn)

    return {"message": "提现申请已提交，等待审核"}


def audit_withdraw(db: Session, txn_id: int, req: FundWithdrawAudit) -> dict:
    txn = db.query(FundTransaction).filter(FundTransaction.id == txn_id).first()
    if not txn:
        raise HTTPException(status_code=404, detail="交易记录不存在")

    account = db.query(FundAccount).filter(FundAccount.id == txn.account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="账户不存在")

    with _withdraw_lock:
        txn = (
            db.query(FundTransaction)
            .filter(FundTransaction.id == txn_id)
            .with_for_update()
            .first()
        )
        account = (
            db.query(FundAccount)
            .filter(FundAccount.id == txn.account_id)
            .with_for_update()
            .first()
        )

        if req.action == "pass":
            txn.status = 1
            amount_abs = abs(Decimal(str(txn.amount)))
            account.frozen_amount = Decimal(str(account.frozen_amount)) - amount_abs
            account.total_outcome = Decimal(str(account.total_outcome)) + amount_abs
            txn.remark = f"{txn.remark or ''} | 审核通过: {req.remark or ''}"
        elif req.action == "reject":
            txn.status = 0
            return_amount = abs(Decimal(str(txn.amount)))
            account.balance = Decimal(str(account.balance)) + return_amount
            account.frozen_amount = Decimal(str(account.frozen_amount)) - return_amount
            txn.remark = f"{txn.remark or ''} | 审核驳回: {req.remark or ''}"
        else:
            raise HTTPException(status_code=400, detail="无效的操作，请使用 pass 或 reject")

        db.commit()

    return {"message": "审核完成"}
