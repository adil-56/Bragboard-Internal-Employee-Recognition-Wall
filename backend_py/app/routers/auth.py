from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token
)

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = User(
        email=user.email,
        hashed_password=hash_password(user.password),
        name=user.name,
        role=user.role,
        department_id=getattr(user, 'department_id', None),
        team_id=getattr(user, 'team_id', None),
        manager_id=getattr(user, 'manager_id', None)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(password, user.hashed_password):  
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(user.id)

    return {
    "access_token": token,
    "token_type": "bearer",
    "role": user.role,
    "name": user.name,
    "email": user.email
}