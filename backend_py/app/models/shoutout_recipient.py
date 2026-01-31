from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base


class ShoutoutRecipient(Base):
    __tablename__ = "shoutout_recipients"

    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id"), nullable=False)
    receiver_email = Column(String,nullable=False)