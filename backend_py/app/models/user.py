from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    name = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    role = Column(String, nullable=False, default="employee") 
    
    # Organizational Graph
    manager_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)

    # Economy
    giveable_points = Column(Integer, default=500, nullable=False)
    redeemable_points = Column(Integer, default=0, nullable=False)