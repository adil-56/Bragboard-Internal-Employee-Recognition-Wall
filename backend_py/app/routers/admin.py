# app/routers/admin_test.py
import csv
from io import StringIO
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Body
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.shoutout import Shoutout
from app.models.comment import Comment
from app.models.reaction import Reaction
from app.models.shoutout_recipient import ShoutoutRecipient
from app.models.economy import Reward, OrderFulfillment

router = APIRouter(prefix="/admin", tags=["Admin"])


# ─── Auth Guard ─────────────────────────────────────────────────────────────

def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


# ─── Ping ───────────────────────────────────────────────────────────────────

@router.get("/ping")
def admin_ping(admin: User = Depends(require_admin)):
    return {"message": "Admin access confirmed"}


# ═══════════════════════════════════════════════════════════════════════════
#  OVERVIEW
# ═══════════════════════════════════════════════════════════════════════════

@router.get("/stats/overview")
def platform_overview(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """High-level platform KPIs."""
    total_users      = db.query(User).count()
    total_shoutouts  = db.query(Shoutout).count()
    total_reactions  = db.query(Reaction).count()
    total_comments   = db.query(Comment).count()
    total_pts_awarded = db.query(func.sum(Shoutout.points_awarded)).scalar() or 0

    # Recent shoutouts (last 5)
    recent = (
        db.query(Shoutout, User)
        .join(User, Shoutout.sender_id == User.id)
        .order_by(Shoutout.created_at.desc())
        .limit(5)
        .all()
    )
    recent_list = [
        {
            "id": s.id,
            "message": s.message,
            "sender_email": u.email,
            "sender_name": u.name,
            "points_awarded": s.points_awarded,
            "created_at": s.created_at.isoformat() if s.created_at else None,
        }
        for s, u in recent
    ]

    return {
        "total_users": total_users,
        "total_shoutouts": total_shoutouts,
        "total_reactions": total_reactions,
        "total_comments": total_comments,
        "total_points_awarded": int(total_pts_awarded),
        "recent_shoutouts": recent_list,
    }


# ═══════════════════════════════════════════════════════════════════════════
#  USER MANAGEMENT
# ═══════════════════════════════════════════════════════════════════════════

@router.get("/users")
def list_all_users(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """List every user with their points and role."""
    users = db.query(User).order_by(User.id).all()
    return [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "giveable_points": u.giveable_points,
            "redeemable_points": u.redeemable_points,
            "department_id": u.department_id,
            "team_id": u.team_id,
        }
        for u in users
    ]


@router.patch("/users/{user_id}/role")
def update_user_role(
    user_id: int,
    role: str = Body(..., embed=True),
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Promote or demote a user. role must be 'admin' or 'employee'."""
    if role not in ("admin", "employee"):
        raise HTTPException(status_code=400, detail="role must be 'admin' or 'employee'")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == admin.id:
        raise HTTPException(status_code=400, detail="Cannot change your own role")
    user.role = role
    db.commit()
    return {"message": f"User {user.email} is now {role}", "user_id": user_id, "role": role}


@router.patch("/users/{user_id}/reset-points")
def reset_user_points(
    user_id: int,
    amount: int = Body(500, embed=True),
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Reset a user's giveable_points (default: 500)."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.giveable_points = amount
    db.commit()
    return {"message": f"Reset giveable_points for {user.email} to {amount}", "user_id": user_id}

@router.post("/trigger-refill")
def trigger_points_refill(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Manually triggers the APScheduler job to refill points."""
    from app.scheduler import refill_giveable_points
    try:
        refill_giveable_points()
        return {"message": "Points refill job triggered and completed successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



# ═══════════════════════════════════════════════════════════════════════════
#  MODERATION
# ═══════════════════════════════════════════════════════════════════════════

@router.delete("/shoutouts/{shoutout_id}")
def delete_shoutout(
    shoutout_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    shoutout = db.query(Shoutout).filter(Shoutout.id == shoutout_id).first()
    if not shoutout:
        raise HTTPException(status_code=404, detail="Shoutout not found")
    db.delete(shoutout)
    db.commit()
    return {"message": "Shoutout deleted"}


@router.get("/comments")
def list_all_comments(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """List all comments with user and shoutout context."""
    rows = (
        db.query(Comment, User, Shoutout)
        .join(User, Comment.user_id == User.id)
        .join(Shoutout, Comment.shoutout_id == Shoutout.id)
        .order_by(Comment.created_at.desc())
        .all()
    )
    return [
        {
            "id": c.id,
            "message": c.message,
            "user_email": u.email,
            "user_name": u.name,
            "shoutout_id": s.id,
            "shoutout_message": s.message[:80] + ("…" if len(s.message) > 80 else ""),
            "created_at": c.created_at.isoformat() if c.created_at else None,
        }
        for c, u, s in rows
    ]


@router.delete("/comments/{comment_id}")
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    db.delete(comment)
    db.commit()
    return {"message": "Comment deleted"}


# ═══════════════════════════════════════════════════════════════════════════
#  REWARDS MANAGEMENT
# ═══════════════════════════════════════════════════════════════════════════

@router.post("/rewards")
def create_reward(
    name: str = Body(...),
    description: Optional[str] = Body(None),
    points_cost: int = Body(...),
    stock_quantity: int = Body(-1),
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    reward = Reward(
        name=name,
        description=description,
        points_cost=points_cost,
        stock_quantity=stock_quantity,
    )
    db.add(reward)
    db.commit()
    db.refresh(reward)
    return {
        "id": reward.id,
        "name": reward.name,
        "description": reward.description,
        "points_cost": reward.points_cost,
        "stock_quantity": reward.stock_quantity,
    }


@router.patch("/rewards/{reward_id}")
def update_reward(
    reward_id: int,
    name: Optional[str] = Body(None),
    description: Optional[str] = Body(None),
    points_cost: Optional[int] = Body(None),
    stock_quantity: Optional[int] = Body(None),
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    reward = db.query(Reward).filter(Reward.id == reward_id).first()
    if not reward:
        raise HTTPException(status_code=404, detail="Reward not found")
    if name is not None: reward.name = name
    if description is not None: reward.description = description
    if points_cost is not None: reward.points_cost = points_cost
    if stock_quantity is not None: reward.stock_quantity = stock_quantity
    db.commit()
    return {"message": "Reward updated", "reward_id": reward_id}


@router.delete("/rewards/{reward_id}")
def delete_reward(
    reward_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    reward = db.query(Reward).filter(Reward.id == reward_id).first()
    if not reward:
        raise HTTPException(status_code=404, detail="Reward not found")
    db.delete(reward)
    db.commit()
    return {"message": "Reward deleted"}


@router.get("/orders")
def list_all_orders(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """All redemption orders with user and reward details."""
    rows = (
        db.query(OrderFulfillment, User, Reward)
        .join(User, OrderFulfillment.user_id == User.id)
        .join(Reward, OrderFulfillment.reward_id == Reward.id)
        .order_by(OrderFulfillment.ordered_at.desc())
        .all()
    )
    return [
        {
            "id": o.id,
            "user_id": u.id,
            "user_email": u.email,
            "user_name": u.name,
            "reward_id": r.id,
            "reward_name": r.name,
            "points_cost": r.points_cost,
            "status": o.status,
            "ordered_at": o.ordered_at.isoformat() if o.ordered_at else None,
        }
        for o, u, r in rows
    ]


@router.patch("/orders/{order_id}/status")
def update_order_status(
    order_id: int,
    status: str = Body(..., embed=True),
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    valid = ("pending", "shipped", "fulfilled", "cancelled")
    if status not in valid:
        raise HTTPException(status_code=400, detail=f"status must be one of {valid}")
    order = db.query(OrderFulfillment).filter(OrderFulfillment.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = status
    db.commit()
    return {"message": f"Order {order_id} status set to {status}", "order_id": order_id, "status": status}


# ═══════════════════════════════════════════════════════════════════════════
#  ANALYTICS
# ═══════════════════════════════════════════════════════════════════════════

@router.get("/analytics/top-contributors")
def top_contributors(
    limit: int = 10,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    rows = (
        db.query(User.email, User.name, func.count(Shoutout.id).label("count"))
        .join(Shoutout, Shoutout.sender_id == User.id)
        .group_by(User.email, User.name)
        .order_by(func.count(Shoutout.id).desc())
        .limit(limit)
        .all()
    )
    return [{"email": r.email, "name": r.name, "count": r.count} for r in rows]


@router.get("/analytics/shoutouts-over-time")
def shoutouts_over_time(
    days: int = 30,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Returns shoutouts aggregated by day for the last N days."""
    # SQLite friendly date truncation
    rows = (
        db.query(
            func.date(Shoutout.created_at).label("date"),
            func.count(Shoutout.id).label("count")
        )
        .group_by(func.date(Shoutout.created_at))
        .order_by(func.date(Shoutout.created_at).asc())
        .limit(days)
        .all()
    )
    return [{"date": r.date, "count": r.count} for r in rows]


@router.get("/analytics/top-contributors/export")
def export_top_contributors_csv(
    limit: int = 10,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    rows = (
        db.query(User.email, User.name, func.count(Shoutout.id).label("count"))
        .join(Shoutout, Shoutout.sender_id == User.id)
        .group_by(User.email, User.name)
        .order_by(func.count(Shoutout.id).desc())
        .limit(limit)
        .all()
    )
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(["Name", "Email", "Shoutouts Sent"])
    for r in rows:
        writer.writerow([r.name or "", r.email, r.count])
    output.seek(0)
    return StreamingResponse(output, media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=top_contributors.csv"})


@router.get("/analytics/most-tagged-users")
def most_tagged_users(
    limit: int = 10,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    rows = (
        db.query(ShoutoutRecipient.receiver_email, func.count(ShoutoutRecipient.id).label("tag_count"))
        .group_by(ShoutoutRecipient.receiver_email)
        .order_by(func.count(ShoutoutRecipient.id).desc())
        .limit(limit)
        .all()
    )
    return [{"receiver_email": r.receiver_email, "tag_count": r.tag_count} for r in rows]


@router.get("/analytics/most-tagged-users/export")
def export_most_tagged_users_csv(
    limit: int = 10,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    rows = (
        db.query(ShoutoutRecipient.receiver_email, func.count(ShoutoutRecipient.id).label("count"))
        .group_by(ShoutoutRecipient.receiver_email)
        .order_by(func.count(ShoutoutRecipient.id).desc())
        .limit(limit)
        .all()
    )
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(["Email", "Times Tagged"])
    for r in rows:
        writer.writerow([r.receiver_email, r.count])
    output.seek(0)
    return StreamingResponse(output, media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=most_tagged_users.csv"})


@router.get("/analytics/reaction-stats")
def reaction_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    rows = (
        db.query(Reaction.type, func.count(Reaction.id).label("count"))
        .group_by(Reaction.type)
        .all()
    )
    return [{"reaction_type": r.type, "count": r.count} for r in rows]


@router.get("/analytics/reaction-stats/export")
def export_reaction_stats_csv(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    rows = (
        db.query(Reaction.type, func.count(Reaction.id).label("count"))
        .group_by(Reaction.type)
        .all()
    )
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(["Reaction", "Count"])
    for r in rows:
        reaction_type = r.type.value if hasattr(r.type, "value") else str(r.type)
        writer.writerow([reaction_type, r.count])
    output.seek(0)
    return StreamingResponse(output, media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=reaction_stats.csv"})


@router.get("/analytics/leaderboard")
def leaderboard(
    limit: int = 10,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    sent = (
        db.query(User.id.label("user_id"), (func.count(Shoutout.id) * 5).label("score"))
        .join(Shoutout, Shoutout.sender_id == User.id)
        .group_by(User.id).subquery()
    )
    received = (
        db.query(ShoutoutRecipient.receiver_email.label("email"),
                 (func.count(ShoutoutRecipient.id) * 3).label("score"))
        .group_by(ShoutoutRecipient.receiver_email).subquery()
    )
    comments = (
        db.query(Comment.user_id.label("user_id"), (func.count(Comment.id) * 2).label("score"))
        .group_by(Comment.user_id).subquery()
    )
    reactions = (
        db.query(Reaction.user_id.label("user_id"), (func.count(Reaction.id) * 1).label("score"))
        .group_by(Reaction.user_id).subquery()
    )
    rows = (
        db.query(
            User.email, User.name,
            (
                func.coalesce(sent.c.score, 0)
                + func.coalesce(comments.c.score, 0)
                + func.coalesce(reactions.c.score, 0)
                + func.coalesce(received.c.score, 0)
            ).label("total_score")
        )
        .outerjoin(sent, sent.c.user_id == User.id)
        .outerjoin(comments, comments.c.user_id == User.id)
        .outerjoin(reactions, reactions.c.user_id == User.id)
        .outerjoin(received, received.c.email == User.email)
        .order_by(
            (
                func.coalesce(sent.c.score, 0)
                + func.coalesce(comments.c.score, 0)
                + func.coalesce(reactions.c.score, 0)
                + func.coalesce(received.c.score, 0)
            ).desc()
        )
        .limit(limit)
        .all()
    )
    return [
        {"rank": idx + 1, "email": r.email, "name": r.name, "score": int(r.total_score)}
        for idx, r in enumerate(rows)
    ]


@router.get("/analytics/leaderboard/export/csv")
def export_leaderboard_csv(
    limit: int = 50,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    sent = (
        db.query(User.id.label("user_id"), (func.count(Shoutout.id) * 5).label("score"))
        .join(Shoutout, Shoutout.sender_id == User.id)
        .group_by(User.id).subquery()
    )
    received = (
        db.query(ShoutoutRecipient.receiver_email.label("email"),
                 (func.count(ShoutoutRecipient.id) * 3).label("score"))
        .group_by(ShoutoutRecipient.receiver_email).subquery()
    )
    comments = (
        db.query(Comment.user_id.label("user_id"), (func.count(Comment.id) * 2).label("score"))
        .group_by(Comment.user_id).subquery()
    )
    reactions = (
        db.query(Reaction.user_id.label("user_id"), (func.count(Reaction.id) * 1).label("score"))
        .group_by(Reaction.user_id).subquery()
    )
    rows = (
        db.query(
            User.email, User.name,
            (
                func.coalesce(sent.c.score, 0)
                + func.coalesce(comments.c.score, 0)
                + func.coalesce(reactions.c.score, 0)
                + func.coalesce(received.c.score, 0)
            ).label("total_score")
        )
        .outerjoin(sent, sent.c.user_id == User.id)
        .outerjoin(comments, comments.c.user_id == User.id)
        .outerjoin(reactions, reactions.c.user_id == User.id)
        .outerjoin(received, received.c.email == User.email)
        .order_by(
            (
                func.coalesce(sent.c.score, 0)
                + func.coalesce(comments.c.score, 0)
                + func.coalesce(reactions.c.score, 0)
                + func.coalesce(received.c.score, 0)
            ).desc()
        )
        .limit(limit)
        .all()
    )
    buffer = StringIO()
    writer = csv.writer(buffer)
    writer.writerow(["Rank", "Name", "Email", "Score"])
    for idx, r in enumerate(rows, start=1):
        writer.writerow([idx, r.name or "", r.email, int(r.total_score)])
    buffer.seek(0)
    return StreamingResponse(buffer, media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=leaderboard.csv"})