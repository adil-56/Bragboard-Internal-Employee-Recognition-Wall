# app/schemas/shoutout.py
from pydantic import BaseModel
from datetime import datetime

class ShoutoutCreate(BaseModel):
    message: str

class ShoutoutResponse(BaseModel):
    id: int
    sender_id: int
    message: str
    created_at: datetime

    class Config:
        from_attributes = True
