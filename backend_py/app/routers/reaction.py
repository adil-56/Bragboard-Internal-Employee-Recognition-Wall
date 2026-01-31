from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.core.dependencies import get_current_user
from app.models.reaction import Reaction
from app.models.shoutout import Shoutout
from app.models.user import User

router = APIRouter(prefix="/reactions", tags=["Reactions"])


@router.post("/shoutouts/{shoutout_id}")
def react_to_shoutout(
    shoutout_id: int,
    reaction_type: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    shoutout = db.query(Shoutout).filter(Shoutout.id == shoutout_id).first()
    if not shoutout:
        raise HTTPException(status_code=404, detail="Shoutout not found")

    existing = (
        db.query(Reaction)
        .filter(
            Reaction.shoutout_id == shoutout_id,
            Reaction.user_id == current_user.id,
            Reaction.type == reaction_type
        )
        .first()
    )

    if existing:
        db.delete(existing)
        db.commit()
        return {"message": "Reaction removed"}

    reaction = Reaction(
        shoutout_id=shoutout_id,
        user_id=current_user.id,
        type=reaction_type
    )
    db.add(reaction)
    db.commit()

    return {"message": "Reaction added"}

@router.get("/shoutouts/{shoutout_id}/summary")
def reaction_summary(
    shoutout_id: int,
    db: Session = Depends(get_db),
):
    summary = (
        db.query(Reaction.type, func.count(Reaction.id))
        .filter(Reaction.shoutout_id == shoutout_id)
        .group_by(Reaction.type)
        .all()
    )

    return {reaction_type: count for reaction_type, count in summary}