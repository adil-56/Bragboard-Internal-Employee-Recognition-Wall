# from sqlalchemy import Column, Integer, String, DateTime, Boolean
# from datetime import datetime
# from app.database import Base

# class User(Base):
#     __tablename__ = "users"

#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String, nullable=True)
#     email = Column(String, unique=True, index=True, nullable=False)
#     password = Column(String, nullable=False)
#     created_at = Column(DateTime, default=datetime.utcnow)
#     is_admin=Column(Boolean, default=False)


# from sqlalchemy import Column, Integer, String, Boolean, DateTime
# from app.database import Base
# from datetime import datetime

# class User(Base):
#     __tablename__ = "users"

#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String, nullable=False)
#     email = Column(String, unique=True, index=True, nullable=False)
#     password = Column(String, nullable=False)

#     # 🔴 THESE TWO WERE MISSING OR WRONG
#     role = Column(String, nullable=False, default="employee")
#     department = Column(String, nullable=True)

#     is_admin = Column(Boolean, default=False)
#     created_at = Column(DateTime, default=datetime.utcnow)



from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    name = Column(String, nullable=True)
    department = Column(String, nullable=True)

    is_admin = Column(Boolean, default=False)