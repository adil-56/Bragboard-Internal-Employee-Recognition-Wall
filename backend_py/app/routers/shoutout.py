# 
# app/routers/shoutout.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.dependencies import get_current_user
from app.models.shoutout import Shoutout
from app.models.user import User

router = APIRouter(prefix="/shoutouts", tags=["Shoutouts"])


@router.post("/")
def create_shoutout(
    message: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    shoutout = Shoutout(
        sender_id=current_user.id,
        message=message,
    )
    db.add(shoutout)
    db.commit()
    db.refresh(shoutout)
    return shoutout


@router.get("/")
def list_shoutouts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Shoutout)
        .filter(Shoutout.sender_id == current_user.id)
        .order_by(Shoutout.created_at.desc())
        .all()
    )


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