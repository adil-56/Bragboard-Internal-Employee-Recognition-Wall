from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class CommentCreate(BaseModel):
    message: str
    parent_comment_id: Optional[int] = None


class CommentResponse(BaseModel):
    id: int
    message: str
    user_id: int
    parent_comment_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True
