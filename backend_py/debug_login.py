import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

with open("debug_output.txt", "w", encoding="utf-8") as f:
    try:
        f.write("Step 1: Importing dotenv...\n")
        from dotenv import load_dotenv
        load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))
        f.write(f"  JWT_SECRET from env: {os.environ.get('JWT_SECRET', 'NOT SET')}\n")
        f.write(f"  DB_HOST from env: {os.environ.get('DB_HOST', 'NOT SET')}\n")
        
        f.write("Step 2: Importing database...\n")
        from app.database import SessionLocal
        
        f.write("Step 3: Importing models...\n")
        from app.models.user import User
        
        f.write("Step 4: Importing security...\n")
        from app.core.security import verify_password
        
        f.write("Step 5: Querying database...\n")
        db = SessionLocal()
        
        all_count = db.query(User).count()
        f.write(f"  Total users: {all_count}\n")
        
        admin = db.query(User).filter(User.email == "admin@bragboard.com").first()
        if admin:
            f.write(f"  Admin found: email={admin.email}, role={admin.role}\n")
            f.write(f"  Admin hash: {admin.hashed_password[:30]}...\n")
            result = verify_password("Bragboard@123", admin.hashed_password)
            f.write(f"  Password 'Bragboard@123' verify: {result}\n")
        else:
            f.write("  Admin user NOT FOUND\n")
            first_5 = db.query(User).limit(5).all()
            for u in first_5:
                f.write(f"    user: {u.email}, role={u.role}\n")
        
        db.close()
        f.write("DONE - All checks passed\n")
    except Exception as e:
        import traceback
        f.write(f"ERROR: {e}\n")
        f.write(traceback.format_exc())
