import sys, traceback, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

outfile = os.path.join(os.path.dirname(os.path.abspath(__file__)), "startup_error.log")

with open(outfile, "w") as f:
    try:
        f.write("1. Testing basic imports...\n")
        f.flush()
        
        from dotenv import load_dotenv
        load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))
        f.write("2. dotenv loaded OK\n")
        f.flush()
        
        from sqlalchemy import create_engine
        f.write("3. sqlalchemy OK\n")
        f.flush()
        
        from app.database import SessionLocal, Base, engine
        f.write("4. database import OK\n")
        f.flush()
        
        from app.core.security import hash_password, verify_password
        f.write("5. security import OK\n")
        f.flush()
        
        from app.models.user import User
        f.write("6. User model import OK\n")
        f.flush()
        
        from app.routers.auth import router as auth_router
        f.write("7. auth router OK\n")
        f.flush()
        
        from app.routers.admin import router as admin_router
        f.write("8. admin router OK\n")
        f.flush()
        
        from app.routers.economy import router as economy_router
        f.write("9. economy router OK\n")
        f.flush()
        
        from app.scheduler import start_scheduler
        f.write("10. scheduler OK\n")
        f.flush()
        
        from app.main import app
        f.write("11. main app import OK\n")
        f.flush()
        
        # Test DB connection
        db = SessionLocal()
        count = db.query(User).count()
        f.write(f"12. DB connected, {count} users found\n")
        
        admin = db.query(User).filter(User.email == "admin@bragboard.com").first()
        if admin:
            f.write(f"13. Admin found: {admin.email}\n")
            ok = verify_password("Bragboard@123", admin.hashed_password)
            f.write(f"14. Password verify: {ok}\n")
        else:
            f.write("13. ADMIN NOT FOUND\n")
        
        db.close()
        f.write("ALL CHECKS PASSED\n")
        
    except Exception as e:
        f.write(f"\nERROR: {e}\n")
        f.write(traceback.format_exc())
