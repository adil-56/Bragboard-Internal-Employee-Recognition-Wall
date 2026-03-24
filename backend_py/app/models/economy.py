from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from app.database import Base

class TransactionLedger(Base):
    __tablename__ = "transaction_ledger"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Integer, nullable=False)
    type = Column(String, nullable=False) # earned, spent, expired
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Reward(Base):
    __tablename__ = "rewards"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    points_cost = Column(Integer, nullable=False)
    stock_quantity = Column(Integer, default=-1)

class OrderFulfillment(Base):
    __tablename__ = "order_fulfillment"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    reward_id = Column(Integer, ForeignKey("rewards.id"), nullable=False)
    status = Column(String, default="pending") # pending, shipped, fulfilled, cancelled
    ordered_at = Column(DateTime, default=datetime.utcnow)
