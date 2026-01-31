from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from enum import Enum
from app.database import Base


class ReactionType(str, Enum):
    clap = "clap"
    heart = "heart"
    star = "star"


class Reaction(Base):
    __tablename__ = "reactions"

    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)