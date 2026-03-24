"""
seed.py — Bragboard Data Seeder
================================
Creates:
  - 1 admin account
  - N employee accounts (configurable)
  - Sample rewards catalog
  - Sample shoutouts between employees

Usage:
    cd backend_py
    python seed.py              # creates 20 employees (default)
    python seed.py --count 100  # creates 100 employees
    python seed.py --reset      # drops existing seeded data first

All users get password: Bragboard@123
"""

import sys
import os
import argparse
from datetime import datetime

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models.user import User
from app.models.economy import Reward, TransactionLedger
from app.core.security import hash_password

# ─── Config ─────────────────────────────────────────────────────────────────

ADMIN_EMAIL    = "admin@bragboard.com"
ADMIN_PASSWORD = "Bragboard@123"
ADMIN_NAME     = "Admin User"

EMPLOYEE_PASSWORD = "Bragboard@123"

DEPARTMENTS = ["Engineering", "Marketing", "Sales", "HR", "Finance", "Design", "Operations"]

FIRST_NAMES = [
    "Adil", "Priya", "Rahul", "Sneha", "Arjun", "Meera", "Kiran", "Divya",
    "Vikram", "Ananya", "Rohan", "Shruti", "Aakash", "Nisha", "Siddharth",
    "Pooja", "Gaurav", "Riya", "Manish", "Kavya", "Tarun", "Deepa",
    "Harish", "Swati", "Nikhil", "Anjali", "Suresh", "Pallavi", "Kunal", "Neha",
    "Rajiv", "Smita", "Ashok", "Usha", "Vinay", "Rekha", "Dinesh", "Lata",
    "Mayur", "Geeta", "Sachin", "Sunita", "Prakash", "Mala", "Vivek", "Seema",
    "Ajay", "Nandita", "Sanjay", "Asha",
]

LAST_NAMES = [
    "Sharma", "Patel", "Rao", "Singh", "Kumar", "Joshi", "Mehta", "Nair",
    "Iyer", "Desai", "Shah", "Verma", "Gupta", "Pillai", "Reddy",
    "Khanna", "Mishra", "Bose", "Chatterjee", "Das",
]

SAMPLE_REWARDS = [
    {"name": "Amazon Gift Card ₹500",    "description": "Redeem for a ₹500 Amazon gift card.", "points_cost": 500,  "stock_quantity": -1},
    {"name": "Extra Day Off",            "description": "One additional paid leave day.",        "points_cost": 1000, "stock_quantity": 10},
    {"name": "Team Lunch Voucher",       "description": "Lunch for you and your team.",          "points_cost": 300,  "stock_quantity": 20},
    {"name": "Bragboard Merch Kit",      "description": "Exclusive Bragboard branded goodies.", "points_cost": 250,  "stock_quantity": 50},
    {"name": "₹1000 Flipkart Voucher",  "description": "Flipkart shopping voucher.",            "points_cost": 800,  "stock_quantity": -1},
    {"name": "Online Course Voucher",    "description": "Any Udemy or Coursera course.",         "points_cost": 600,  "stock_quantity": -1},
]

# ─── Helpers ────────────────────────────────────────────────────────────────

def make_email(first: str, last: str, idx: int) -> str:
    return f"{first.lower()}.{last.lower()}{idx}@bragboard.com"


def seed(employee_count: int = 20, reset: bool = False):
    db = SessionLocal()
    try:
        if reset:
            print("⚠  Resetting seeded data (non-admin employees)...")
            db.query(User).filter(User.email.like("%@bragboard.com"), User.role == "employee").delete(synchronize_session=False)
            db.query(Reward).delete(synchronize_session=False)
            db.commit()
            print("✓  Old data cleared.\n")

        # ── Admin ──────────────────────────────────
        admin = db.query(User).filter(User.email == ADMIN_EMAIL).first()
        if not admin:
            admin = User(
                email=ADMIN_EMAIL,
                hashed_password=hash_password(ADMIN_PASSWORD),
                name=ADMIN_NAME,
                role="admin",
                giveable_points=9999,
                redeemable_points=0,
            )
            db.add(admin)
            db.commit()
            print(f"✓  Admin created  →  {ADMIN_EMAIL}  /  {ADMIN_PASSWORD}")
        else:
            # Ensure password is hashed properly even if admin already exists
            admin.hashed_password = hash_password(ADMIN_PASSWORD)
            admin.role = "admin"
            db.commit()
            print(f"✓  Admin already exists — password re-hashed  →  {ADMIN_EMAIL}")

        # ── Employees ──────────────────────────────
        created = 0
        idx = 0
        while created < employee_count:
            first = FIRST_NAMES[idx % len(FIRST_NAMES)]
            last  = LAST_NAMES[(idx // len(FIRST_NAMES)) % len(LAST_NAMES)]
            email = make_email(first, last, idx + 1)

            existing = db.query(User).filter(User.email == email).first()
            if not existing:
                emp = User(
                    email=email,
                    hashed_password=hash_password(EMPLOYEE_PASSWORD),
                    name=f"{first} {last}",
                    role="employee",
                    giveable_points=500,
                    redeemable_points=0,
                )
                db.add(emp)
                created += 1

            idx += 1

        db.commit()
        print(f"✓  {created} employees created  (password: {EMPLOYEE_PASSWORD})")

        # ── Rewards catalog ────────────────────────
        existing_rewards = db.query(Reward).count()
        if existing_rewards == 0:
            for r in SAMPLE_REWARDS:
                db.add(Reward(**r))
            db.commit()
            print(f"✓  {len(SAMPLE_REWARDS)} rewards added to catalog")
        else:
            print(f"  (Rewards already exist — skipping)")

        print("\n" + "─" * 50)
        print("🎉  Seed complete!")
        print(f"   Admin login  →  {ADMIN_EMAIL}  /  {ADMIN_PASSWORD}")
        print(f"   Employees    →  e.g. adil.sharma1@bragboard.com  /  {EMPLOYEE_PASSWORD}")
        print("─" * 50)

    except Exception as e:
        db.rollback()
        print(f"❌  Error: {e}")
        raise
    finally:
        db.close()


# ─── Entry point ────────────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed Bragboard with demo data")
    parser.add_argument("--count", type=int, default=20, help="Number of employees to create (default: 20)")
    parser.add_argument("--reset", action="store_true", help="Clear existing seeded employees before seeding")
    args = parser.parse_args()

    seed(employee_count=args.count, reset=args.reset)
