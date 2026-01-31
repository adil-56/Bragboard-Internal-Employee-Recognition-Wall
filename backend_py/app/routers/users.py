




# from fastapi import APIRouter, Depends
# from app.deps import get_current_user
# from app.models.user import User

# router = APIRouter(prefix="/users", tags=["Users"])

# @router.get("/me")
# def read_me(current_user: User = Depends(get_current_user)):
#     """Return current logged-in user"""
#     return current_user








from fastapi import APIRouter, Depends
from app.deps import get_current_user
from app.schemas.user import UserResponse
from app.models.user import User

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.get("/me", response_model=UserResponse)
def read_me(current_user: User = Depends(get_current_user)):
    return current_user