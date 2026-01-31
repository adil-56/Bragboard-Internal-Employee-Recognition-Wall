


from pydantic import BaseModel
from app.schemas import UserCreate

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"