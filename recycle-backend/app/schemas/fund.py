from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal

class FundAccountOut(BaseModel):
    id: int
    master_id: int
    master_name: Optional[str] = None
    balance: Decimal
    frozen_amount: Decimal
    total_income: Decimal
    total_outcome: Decimal
    status: int
    create_time: datetime
    class Config:
        from_attributes = True

class FundTransactionOut(BaseModel):
    id: int
    account_id: Optional[int]
    master_id: int
    master_name: Optional[str] = None
    txn_type: str
    txn_type_label: Optional[str] = None
    amount: Decimal
    balance_after: Decimal
    related_order_no: Optional[str]
    remark: Optional[str]
    status: int
    create_time: datetime
    class Config:
        from_attributes = True

class FundAward(BaseModel):
    master_id: int
    amount: Decimal
    remark: Optional[str] = None

class FundWithdrawApply(BaseModel):
    master_id: int
    amount: Decimal
    remark: Optional[str] = None

class FundWithdrawAudit(BaseModel):
    action: str  # pass/reject
    remark: Optional[str] = None
