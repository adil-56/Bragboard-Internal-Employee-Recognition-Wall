from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.economy import Reward, OrderFulfillment, TransactionLedger
from app.schemas.economy import RewardResponse, OrderResponse, TransactionResponse

router = APIRouter(prefix="/rewards", tags=["Rewards & Economy"])


# ─── Rewards ───────────────────────────────────────────────────────────────

@router.get("/", response_model=List[RewardResponse])
def list_rewards(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all available rewards."""
    rewards = db.query(Reward).filter(
        (Reward.stock_quantity == -1) | (Reward.stock_quantity > 0)
    ).all()
    return rewards


@router.post("/{reward_id}/redeem")
def redeem_reward(
    reward_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Redeem a reward using redeemable_points."""
    reward = db.query(Reward).filter(Reward.id == reward_id).first()
    if not reward:
        raise HTTPException(status_code=404, detail="Reward not found")

    # Check stock
    if reward.stock_quantity == 0:
        raise HTTPException(status_code=400, detail="Reward is out of stock")

    # Check user balance
    if current_user.redeemable_points < reward.points_cost:
        raise HTTPException(
            status_code=400,
            detail=f"Not enough points. You have {current_user.redeemable_points} pts but need {reward.points_cost} pts."
        )

    # Deduct points
    current_user.redeemable_points -= reward.points_cost

    # Decrement stock if limited
    if reward.stock_quantity > 0:
        reward.stock_quantity -= 1

    # Create order
    order = OrderFulfillment(
        user_id=current_user.id,
        reward_id=reward.id,
        status="pending",
        ordered_at=datetime.utcnow(),
    )
    db.add(order)

    # Log transaction
    tx = TransactionLedger(
        user_id=current_user.id,
        amount=-reward.points_cost,
        type="spent",
        description=f"Redeemed reward: {reward.name}",
    )
    db.add(tx)
    db.commit()
    db.refresh(order)

    return {
        "message": f"Successfully redeemed '{reward.name}'!",
        "order_id": order.id,
        "status": order.status,
        "points_spent": reward.points_cost,
        "remaining_points": current_user.redeemable_points,
    }


# ─── My Orders ──────────────────────────────────────────────────────────────

@router.get("/my-orders")
def my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get current user's redemption order history."""
    orders = (
        db.query(OrderFulfillment, Reward)
        .join(Reward, OrderFulfillment.reward_id == Reward.id)
        .filter(OrderFulfillment.user_id == current_user.id)
        .order_by(OrderFulfillment.ordered_at.desc())
        .all()
    )
    return [
        {
            "id": o.id,
            "reward_id": r.id,
            "reward_name": r.name,
            "reward_description": r.description,
            "points_cost": r.points_cost,
            "status": o.status,
            "ordered_at": o.ordered_at.isoformat() if o.ordered_at else None,
        }
        for o, r in orders
    ]


# ─── Transaction History ────────────────────────────────────────────────────

@router.get("/history", response_model=List[TransactionResponse])
def transaction_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get current user's full points transaction history."""
    txs = (
        db.query(TransactionLedger)
        .filter(TransactionLedger.user_id == current_user.id)
        .order_by(TransactionLedger.created_at.desc())
        .all()
    )
    return txs
