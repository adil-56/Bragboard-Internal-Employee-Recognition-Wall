import traceback
try:
    from app.database import SessionLocal
    from app.models.user import User
    from app.core.security import verify_password
    db = SessionLocal()
    admin = db.query(User).filter(User.email == "admin@bragboard.com").first()
    if admin:
        print(f"Admin found: {admin.email}, role={admin.role}")
        result = verify_password("Bragboard@123", admin.hashed_password)
        print(f"Password verify: {result}")
    else:
        print("Admin user NOT found in database")
    all_users = db.query(User).count()
    print(f"Total users in DB: {all_users}")
    db.close()
except Exception as e:
    traceback.print_exc()
