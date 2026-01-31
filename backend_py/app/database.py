# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker, declarative_base

# DATABASE_URL = "postgresql://postgres:Zxcvbnm%404556@localhost:5432/bragboard"
# engine = create_engine(DATABASE_URL)
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base = declarative_base()



# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()




from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "postgresql://postgres:Zxcvbnm%404556@localhost:5432/bragboard"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Ensure models load before creating tables
import app.models.user
Base.metadata.create_all(bind=engine)