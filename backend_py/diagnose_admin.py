import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models.user import User
from app.core.security import hash_password, verify_password

def diagnose_admin():
    db = SessionLocal()
    try:
        admins = db.query(User).filter(User.email == "admin@bragboard.com").all()
        print(f"Found {len(admins)} users with email admin@bragboard.com")
        
        for admin in admins:
            print(f"-- User ID {admin.id} --")
            print(f"Name: {admin.name}")
            print(f"Role: {admin.role}")
            print(f"Hash: {admin.hashed_password[:30]}...")
            
            # Explicitly test the password
            test_pw = "Bragboard@123"
            try:
                is_valid = verify_password(test_pw, admin.hashed_password)
                print(f"Password '{test_pw}' is valid? {is_valid}")
            except Exception as e:
                print(f"Exception verifying password: {e}")
                
            # Test lowercase
            is_valid_lower = verify_password("bragboard@123", admin.hashed_password)
            print(f"Password 'bragboard@123' is valid? {is_valid_lower}")
            
    except Exception as e:
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    diagnose_admin()
