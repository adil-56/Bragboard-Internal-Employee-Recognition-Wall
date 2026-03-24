from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class RewardResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    points_cost: int
    stock_quantity: int

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: int
    reward_id: int
    reward_name: Optional[str] = None
    status: str
    ordered_at: datetime

    class Config:
        from_attributes = True


class TransactionResponse(BaseModel):
    id: int
    amount: int
    type: str
    description: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
