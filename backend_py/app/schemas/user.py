# from pydantic import BaseModel, EmailStr

# class UserCreaye(BaseModel):
#     email:EmailStr
#     password:str



# class LoginRequest(BaseModel):
#     email: str
#     password: str

# class LoginResponse(BaseModel):
#     access_token: str
#     token_type: str = "bearer"

# class UserResponse(BaseModel):
#     id: int
#     name: str
#     email: str
#     role: str
#     department: str
#     is_admin:bool

#     class Config:
#         from_attributes = True



# from pydantic import BaseModel, EmailStr


# class UserBase(BaseModel):
#     email: EmailStr


# class UserCreate(UserBase):
#     password: str


# class UserOut(UserBase):
#     id: int
#     is_admin: bool

#     class Config:
#         from_attributes = True






# from pydantic import BaseModel, EmailStr


# # Shared fields
# class UserBase(BaseModel):
#     email: EmailStr


# # Used during registration
# class UserCreate(UserBase):
#     password: str


# # Used in API responses
# class UserResponse(UserBase):
#     id: int
#     is_admin: bool

#     class Config:
#         from_attributes = True

from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: EmailStr
    name: str | None = None
    department: str | None = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_admin: bool

    class Config:
        from_attributes = True