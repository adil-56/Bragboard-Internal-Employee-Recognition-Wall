import sys
import os

# Ensure the app imports work properly
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models.user import User

def promote_to_admin(email: str):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if user:
            user.role = "admin"
            db.commit()
            print(f"SUCCESS: Promoted {email} to admin!")
        else:
            print(f"FAILED: Could not find user {email}")
    finally:
        db.close()

if __name__ == "__main__":
    promote_to_admin("Adil@test.com")
