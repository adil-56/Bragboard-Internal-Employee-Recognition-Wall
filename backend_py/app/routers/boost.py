from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.core.dependencies import get_current_user
from app.models.boost import Boost
from app.models.shoutout import Shoutout
from app.models.shoutout_recipient import ShoutoutRecipient
from app.models.user import User

BOOST_COST = 10
router = APIRouter(prefix="/boosts", tags=["Boosts"])


@router.post("/shoutouts/{shoutout_id}")
def boost_shoutout(
    shoutout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    shoutout = db.query(Shoutout).filter(Shoutout.id == shoutout_id).first()
    if not shoutout:
        raise HTTPException(status_code=404, detail="Shoutout not found")
    if shoutout.sender_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot boost your own shoutout")
    already = db.query(Boost).filter(Boost.shoutout_id == shoutout_id, Boost.user_id == current_user.id).first()
    if already:
        raise HTTPException(status_code=400, detail="Already boosted")
    if (current_user.giveable_points or 0) < BOOST_COST:
        raise HTTPException(status_code=400, detail="Not enough points")

    current_user.giveable_points = (current_user.giveable_points or 0) - BOOST_COST

    recipients = db.query(ShoutoutRecipient).filter(ShoutoutRecipient.shoutout_id == shoutout_id).all()
    for r in recipients:
        recipient_user = db.query(User).filter(User.email == r.receiver_email).first()
        if recipient_user:
            recipient_user.redeemable_points = (recipient_user.redeemable_points or 0) + BOOST_COST

    db.add(Boost(shoutout_id=shoutout_id, user_id=current_user.id, points=BOOST_COST))
    db.commit()
    return {"message": f"Boosted! -{BOOST_COST} pts from you.", "remaining": current_user.giveable_points}


@router.get("/shoutouts/{shoutout_id}/summary")
def boost_summary(shoutout_id: int, db: Session = Depends(get_db)):
    total = db.query(func.sum(Boost.points)).filter(Boost.shoutout_id == shoutout_id).scalar() or 0
    count = db.query(func.count(Boost.id)).filter(Boost.shoutout_id == shoutout_id).scalar() or 0
    return {"total_points": total, "boost_count": count}
