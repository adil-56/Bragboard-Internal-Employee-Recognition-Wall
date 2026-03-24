from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base

class Department(Base):
    __tablename__ = "departments"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    head_id = Column(Integer, ForeignKey("users.id"), nullable=True)

class Team(Base):
    __tablename__ = "teams"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    manager_id = Column(Integer, ForeignKey("users.id"), nullable=True)
