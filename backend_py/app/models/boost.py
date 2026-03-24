from sqlalchemy import Column, Integer, DateTime, ForeignKey
from datetime import datetime
from app.database import Base

class Boost(Base):
    __tablename__ = "boosts"

    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    points = Column(Integer, default=10)
    created_at = Column(DateTime, default=datetime.utcnow)
