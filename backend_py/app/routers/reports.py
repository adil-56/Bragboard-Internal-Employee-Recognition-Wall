from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.dependencies import get_current_user
from app.models.report import Report
from app.models.shoutout import Shoutout
from app.models.admin_log import AdminLog
from app.models.user import User

router = APIRouter(prefix="/reports", tags=["Reports"])


# Create Report (Only non-admin users)
@router.post("/{shoutout_id}")
def create_report(
    shoutout_id: int,
    reason: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admins cannot report")

    shoutout = db.query(Shoutout).filter(Shoutout.id == shoutout_id).first()
    if not shoutout:
        raise HTTPException(status_code=404, detail="Shoutout not found")

    report = Report(
        shoutout_id=shoutout_id,
        reported_by=current_user.id,
        reason=reason
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    return {"message": "Report submitted"}





# Admin: View all reports
@router.get("/admin/all")
def get_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")

    return db.query(Report).filter(Report.resolved == False).all()


# Admin: Resolve report
@router.post("/admin/{report_id}/resolve")
def resolve_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")

    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    report.resolved = True

    log = AdminLog(
        admin_id=current_user.id,
        action="Resolved Report",
        target_id=report.id,
        target_type="Report"
    )

    db.add(log)
    db.commit()

    return {"message": "Report resolved"}