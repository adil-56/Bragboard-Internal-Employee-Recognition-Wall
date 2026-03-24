import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models.user import User
from app.core.security import hash_password

def fix_demo_users():
    db = SessionLocal()
    try:
        # UPSERT Admin
        admin = db.query(User).filter(User.email == "admin@bragboard.com").first()
        hashed_pw = hash_password("Bragboard@123")
        
        if admin:
            admin.hashed_password = hashed_pw
            print("Updated existing admin@bragboard.com password to Bragboard@123")
        else:
            admin = User(
                email="admin@bragboard.com",
                name="Admin User",
                hashed_password=hashed_pw,
                role="admin",
                giveable_points=1000,
                redeemable_points=500,
            )
            db.add(admin)
            print("Created missing admin@bragboard.com with password Bragboard@123")
            
        # UPSERT Employee
        employee = db.query(User).filter(User.email == "adil.sharma1@bragboard.com").first()
        if employee:
            employee.hashed_password = hashed_pw
            print("Updated existing adil.sharma1@bragboard.com password to Bragboard@123")
        else:
            employee = User(
                email="adil.sharma1@bragboard.com",
                name="Adil Sharma",
                hashed_password=hashed_pw,
                role="employee",
                giveable_points=500,
                redeemable_points=200,
            )
            db.add(employee)
            print("Created missing adil.sharma1@bragboard.com with password Bragboard@123")
            
        db.commit()
        print("\nSUCCESS! Demo credentials are now fixed and ready to use.")
        
    except Exception as e:
        db.rollback()
        import traceback
        print(f"Error: {e}")
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    fix_demo_users()
