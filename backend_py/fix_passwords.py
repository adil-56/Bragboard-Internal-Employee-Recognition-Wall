from app.database import SessionLocal
from app.models.user import User
from app.core.security import hash_password

def fix():
    db = SessionLocal()
    try:
        users = db.query(User).all()
        for u in users:
            u.hashed_password = hash_password("password123")
            print(f"Updated hash for {u.email}")
        db.commit()
        print("All passwords successfully reset to 'password123'")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    fix()
