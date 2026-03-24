from app.database import SessionLocal
from app.models.user import User

def check():
    db = SessionLocal()
    try:
        users = db.query(User).all()
        with open("output_db_native.txt", "w") as f:
            f.write(f"Total users in DB: {len(users)}\n")
            for u in users:
                f.write(f"ID: {u.id} | Email: '{u.email}' | Role: {u.role}\n")
    except Exception as e:
        with open("output_db_native.txt", "w") as f:
            f.write(f"Error querying DB: {e}\n")
    finally:
        db.close()

if __name__ == "__main__":
    check()
