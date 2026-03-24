import logging
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from app.database import SessionLocal
from app.models.user import User
from app.models.economy import TransactionLedger

logger = logging.getLogger("scheduler")
logger.setLevel(logging.INFO)
ch = logging.StreamHandler()
ch.setLevel(logging.INFO)
formatter = logging.Formatter('\n[⏰ APSCHEDULER]\n%(message)s\n')
ch.setFormatter(formatter)
if not logger.handlers:
    logger.addHandler(ch)

scheduler = BackgroundScheduler()

def refill_giveable_points():
    logger.info("Starting monthly point refill job...")
    db = SessionLocal()
    try:
        users = db.query(User).all()
        for user in users:
            user.giveable_points += 100
            db.add(TransactionLedger(
                user_id=user.id,
                amount=100,
                type="earned",
                description="Monthly giveable points refill"
            ))
        db.commit()
        logger.info(f"Successfully refilled 100 giveable points for {len(users)} users.")
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to refill giveable points: {e}")
    finally:
        db.close()

def start_scheduler():
    scheduler.add_job(
        refill_giveable_points,
        CronTrigger(day=1, hour=0, minute=0),
        id="monthly_points_refill",
        replace_existing=True
    )
    scheduler.start()
    logger.info("Background scheduler started. Next run on 1st of month.")

def shutdown_scheduler():
    scheduler.shutdown()
    logger.info("Background scheduler shut down.")
