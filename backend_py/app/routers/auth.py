# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from passlib.context import CryptContext
# from app.database import get_db
# from app.models.user import User
# from app.schemas.user import UserCreate

# router = APIRouter(prefix="/auth", tags=["Auth"])

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# def hash_password(password: str) -> str:
#     return pwd_context.hash(password)


# @router.post("/register")
# def register(user: UserCreate, db: Session = Depends(get_db)):
#     existing = db.query(User).filter(User.email == user.email).first()
#     if existing:
#         raise HTTPException(status_code=400, detail="Email already registered")

#     new_user = User(
#         email=user.email,
#         hashed_password=hash_password(user.password),
#         is_admin=False
#     )

#     db.add(new_user)
#     db.commit()
#     db.refresh(new_user)

#     return {"message": "User registered successfully"}


# @router.post("/reset-password")
# def reset_password(email: str, new_password: str, db: Session = Depends(get_db)):
#     user = db.query(User).filter(User.email == email).first()
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")

#     user.hashed_password = hash_password(new_password)
#     db.commit()

#     return {"message": "Password reset successful"}

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
        department=user.department,
        is_admin=False
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully"}


@router.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(password, user.hashed_password):  
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(user.id)

    return {
    "access_token": token,
    "token_type": "bearer",
    "is_admin": user.is_admin,
    "role": "Admin" if user.is_admin else "User",
    "name": user.name,
    "email": user.email,
    "department": user.department
}

@router.post("/reset-password")
def reset_password(email: str, new_password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password = hash_password(new_password)  # ✅ CONSISTENT
    db.commit()

    return {"message": "Password reset successful"}