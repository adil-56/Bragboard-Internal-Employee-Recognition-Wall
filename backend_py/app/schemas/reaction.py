# app/schemas/reaction.py
from pydantic import BaseModel

class ReactionCreate(BaseModel):
    type: str

class ReactionOut(BaseModel):
    id: int
    shoutout_id: int
    user_id: int
    type: str

    class Config:
        from_attributes = True
