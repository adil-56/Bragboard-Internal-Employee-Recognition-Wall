from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.dependencies import get_current_user
from app.models.shoutout import Shoutout
from app.models.shoutout_recipient import ShoutoutRecipient
from app.models.economy import TransactionLedger
from app.models.user import User
from app.services.notifier import NotificationService

router = APIRouter(prefix="/shoutouts", tags=["Shoutouts"])

@router.post("/")
def create_shoutout(
    message: str,
    receiver_id: int = None,
    points: int = 10,
    core_value_id: int = 1,
    background_tasks: BackgroundTasks = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Validate sender has enough giveable points
    if current_user.giveable_points < points:
        raise HTTPException(
            status_code=400,
            detail=f"Not enough giveable points. You have {current_user.giveable_points} pts."
        )

    shoutout = Shoutout(
        sender_id=current_user.id,
        message=message,
        core_value_id=core_value_id,
        points_awarded=points
    )
    db.add(shoutout)
    db.commit()
    db.refresh(shoutout)

    # Deduct points from sender
    current_user.giveable_points -= points
    db.add(TransactionLedger(
        user_id=current_user.id,
        amount=-points,
        type="spent",
        description=f"Gave shoutout (ID {shoutout.id})",
    ))

    if receiver_id:
        recipient_user = db.query(User).filter(User.id == receiver_id).first()
        if recipient_user:
            recipient = ShoutoutRecipient(
                shoutout_id=shoutout.id,
                receiver_email=recipient_user.email
            )
            db.add(recipient)

            # Credit points to recipient
            recipient_user.redeemable_points += points
            db.add(TransactionLedger(
                user_id=recipient_user.id,
                amount=points,
                type="earned",
                description=f"Received shoutout (ID {shoutout.id}) from {current_user.email}",
            ))

    db.commit()
    
    # Dispatch virtual Slack notification in the background
    recip_email = recipient_user.email if receiver_id and 'recipient_user' in locals() else None
    if background_tasks:
        background_tasks.add_task(
            NotificationService.send_shoutout_alert,
            current_user.email,
            recip_email,
            message,
            points
        )

    return shoutout

from sqlalchemy import func
from app.models.reaction import Reaction
from app.models.comment import Comment

@router.get("/feed")
def get_optimized_feed(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Shoutout).join(User, Shoutout.sender_id == User.id)
    if current_user.role != 'admin':
        query = query.filter(User.department_id == current_user.department_id)
        
    shoutouts = query.order_by(Shoutout.created_at.desc()).offset(skip).limit(limit).all()
    shoutout_ids = [s.id for s in shoutouts]
    if not shoutout_ids:
        return []
    
    # 1. Reactions
    rx_raw = db.query(Reaction.shoutout_id, Reaction.type, func.count(Reaction.id)).group_by(Reaction.shoutout_id, Reaction.type).filter(Reaction.shoutout_id.in_(shoutout_ids)).all()
    rx_map = {sid: {} for sid in shoutout_ids}
    for sid, rtype, cnt in rx_raw:
        rx_map[sid][rtype] = cnt

    # 2. Comments & Sender/Commenter lookups
    comments_raw = db.query(Comment).filter(Comment.shoutout_id.in_(shoutout_ids)).order_by(Comment.created_at.asc()).all()
    user_ids = set([s.sender_id for s in shoutouts] + [c.user_id for c in comments_raw])
    users_by_id = {u.id: u for u in db.query(User).filter(User.id.in_(user_ids)).all()}
    
    cm_map = {sid: [] for sid in shoutout_ids}
    for c in comments_raw:
        u = users_by_id.get(c.user_id)
        cm_map[c.shoutout_id].append({
            "id": c.id,
            "message": c.message,
            "user_email": u.email if u else "Unknown",
            "user_name": u.name if u else None,
            "user_avatar": u.avatar_url if u else None
        })

    # 3. Recipients
    recips_raw = db.query(ShoutoutRecipient).filter(ShoutoutRecipient.shoutout_id.in_(shoutout_ids)).all()
    recip_emails = set([r.receiver_email for r in recips_raw])
    users_by_email = {u.email: u for u in db.query(User).filter(User.email.in_(recip_emails)).all()}

    # 4. Boosts
    boost_map = {sid: 0 for sid in shoutout_ids}
    boosts_raw = db.query(TransactionLedger.description, func.sum(TransactionLedger.amount)).filter(TransactionLedger.description.like("Boosted shoutout (ID %)")).group_by(TransactionLedger.description).all()
    for desc, pts in boosts_raw:
        for sid in shoutout_ids:
            if f"(ID {sid})" in desc:
                boost_map[sid] += abs(pts)
    
    results = []
    for s in shoutouts:
        sender = users_by_id.get(s.sender_id)
        s_recips = [r for r in recips_raw if r.shoutout_id == s.id]
        results.append({
            "id": s.id,
            "message": s.message,
            "created_at": s.created_at.isoformat() if s.created_at else None,
            "sender_email": sender.email if sender else "Unknown",
            "sender_name": sender.name if sender else None,
            "sender_avatar": sender.avatar_url if sender else None,
            "points_awarded": s.points_awarded,
            "reactions": rx_map.get(s.id, {}),
            "comments": cm_map.get(s.id, []),
            "total_boost_points": boost_map.get(s.id, 0),
            "recipients": [
                {
                    "receiver_email": r.receiver_email,
                    "receiver_name": users_by_email.get(r.receiver_email).name if users_by_email.get(r.receiver_email) else None,
                    "receiver_avatar": users_by_email.get(r.receiver_email).avatar_url if users_by_email.get(r.receiver_email) else None,
                } for r in s_recips
            ]
        })
        
    return results

@router.get("/me/received")
def get_my_received_shoutouts(
    limit: int = 5,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    shoutouts = (
        db.query(Shoutout)
        .join(ShoutoutRecipient, Shoutout.id == ShoutoutRecipient.shoutout_id)
        .filter(ShoutoutRecipient.receiver_email == current_user.email)
        .order_by(Shoutout.created_at.desc())
        .limit(limit)
        .all()
    )
    
    if not shoutouts:
        return []

    user_ids = set([s.sender_id for s in shoutouts])
    users_by_id = {u.id: u for u in db.query(User).filter(User.id.in_(user_ids)).all()}

    results = []
    for s in shoutouts:
        sender = users_by_id.get(s.sender_id)
        results.append({
            "id": s.id,
            "message": s.message,
            "created_at": s.created_at.isoformat() if s.created_at else None,
            "sender_email": sender.email if sender else "Unknown",
            "sender_name": sender.name if sender else None,
            "sender_avatar": sender.avatar_url if sender else None,
            "points_awarded": s.points_awarded,
        })
    return results

@router.get("/")
def list_shoutouts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Shoutout).join(User, Shoutout.sender_id == User.id)
    if current_user.role != 'admin':
        query = query.filter(User.department_id == current_user.department_id)
        
    shoutouts = query.order_by(Shoutout.created_at.desc()).all()
    
    results = []
    for s in shoutouts:
        sender = db.query(User).filter(User.id == s.sender_id).first()
        recips = db.query(ShoutoutRecipient).filter(ShoutoutRecipient.shoutout_id == s.id).all()
        
        results.append({
            "id": s.id,
            "message": s.message,
            "created_at": s.created_at.isoformat() if s.created_at else None,
            "sender_email": sender.email if sender else "Unknown",
            "recipients": [{"receiver_email": r.receiver_email} for r in recips],
            "points_awarded": s.points_awarded
        })
        
    return results

@router.get("/{shoutout_id}")
def get_shoutout(
    shoutout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    shoutout = (
        db.query(Shoutout)
        .filter(
            Shoutout.id == shoutout_id,
            Shoutout.sender_id == current_user.id,
        )
        .first()
    )

    if not shoutout:
        raise HTTPException(status_code=404, detail="Shoutout not found")

    return shoutout