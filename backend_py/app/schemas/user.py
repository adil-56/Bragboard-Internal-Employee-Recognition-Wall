from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: EmailStr
    name: str | None = None
    avatar_url: str | None = None
    department_id: int | None = None
    team_id: int | None = None
    password: str | None = None
    role: str | None = None

class UserUpdate(BaseModel):
    name: str | None = None
    avatar_url: str | None = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True