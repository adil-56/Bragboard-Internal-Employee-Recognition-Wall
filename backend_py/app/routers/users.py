from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.deps import get_current_user
from app.database import get_db
from app.schemas.user import UserResponse, UserUpdate
from app.models.user import User

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.get("/me", response_model=UserResponse)
def read_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.patch("/me", response_model=UserResponse)
def update_me(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if user_update.name is not None:
        current_user.name = user_update.name
    if user_update.avatar_url is not None:
        current_user.avatar_url = user_update.avatar_url
    
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/", response_model=list[UserResponse])
def get_all_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(User).offset(skip).limit(limit).all()