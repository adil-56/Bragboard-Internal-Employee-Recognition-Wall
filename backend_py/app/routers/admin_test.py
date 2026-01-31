# app/routers/admin.py
import csv
from io import StringIO
from sqlalchemy import case
from fastapi.responses import StreamingResponse
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.shoutout import Shoutout
from app.models.comment import Comment
from app.models.reaction import Reaction
from app.models.shoutout_recipient import ShoutoutRecipient


router = APIRouter(prefix="/admin", tags=["Admin"])


def require_admin(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


# ------------------- BASIC -------------------

@router.get("/ping")
def admin_ping(admin: User = Depends(require_admin)):
    return {"message": "Admin access confirmed"}


@router.delete("/shoutouts/{shoutout_id}")
def delete_shoutout(
    shoutout_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    shoutout = db.query(Shoutout).filter(Shoutout.id == shoutout_id).first()
    if not shoutout:
        raise HTTPException(status_code=404, detail="Shoutout not found")

    db.delete(shoutout)
    db.commit()
    return {"message": "Shoutout deleted"}


@router.delete("/comments/{comment_id}")
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    db.delete(comment)
    db.commit()
    return {"message": "Comment deleted"}


# ------------------- ANALYTICS -------------------

# @router.get("/analytics/top-contributors")
# def top_contributors(
#     limit: int = 10,
#     db: Session = Depends(get_db),
#     admin: User = Depends(require_admin),
# ):
#     rows = (
#         db.query(
#             User.id,
#             User.email,
#             func.count(Shoutout.id).label("shoutout_count"),
#         )
#         .join(Shoutout, Shoutout.sender_id == User.id)
#         .group_by(User.id, User.email)
#         .order_by(func.count(Shoutout.id).desc())
#         .limit(limit)
#         .all()
#     )

#     return [
#         {
#             "user_id": r.id,
#             "email": r.email,
#             "shoutout_count": r.shoutout_count,
#         }
#         for r in rows
    # ]


@router.get("/analytics/top-contributors")
def top_contributors(
    limit: int = 10,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    rows = (
        db.query(
            User.email,
            func.count(Shoutout.id).label("count"),
        )
        .join(Shoutout, Shoutout.sender_id == User.id)
        .group_by(User.email)
        .order_by(func.count(Shoutout.id).desc())
        .limit(limit)
        .all()
    )

    return [
        {
            "email": row.email,
            "count": row.count
        }
        for row in rows
    ]

@router.get("/analytics/top-contributors/export")
def export_top_contributors_csv(
    limit: int = 10,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    rows = (
        db.query(
            User.email,
            func.count(Shoutout.id).label("count"),
        )
        .join(Shoutout, Shoutout.sender_id == User.id)
        .group_by(User.email)
        .order_by(func.count(Shoutout.id).desc())
        .limit(limit)
        .all()
    )

    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(["Email", "Shoutouts Sent"])

    for row in rows:
        writer.writerow([row.email, row.count])

    output.seek(0)

    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=top_contributors.csv"
        },
    )





@router.get("/analytics/most-tagged-users")
def most_tagged_users(
    limit: int = 10,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    rows = (
        db.query(
            ShoutoutRecipient.receiver_email,
            func.count(ShoutoutRecipient.id).label("tag_count"),
        )
        .group_by(ShoutoutRecipient.receiver_email)
        .order_by(func.count(ShoutoutRecipient.id).desc())
        .limit(limit)
        .all()
    )

    return [
        {
            "receiver_email": row.receiver_email,
            "tag_count": row.tag_count,
        }
        for row in rows
    ]


@router.get("/analytics/most-tagged-users/export")
def export_most_tagged_users_csv(
    limit: int = 10,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    rows = (
        db.query(
            ShoutoutRecipient.receiver_email,
            func.count(ShoutoutRecipient.id).label("count"),
        )
        .group_by(ShoutoutRecipient.receiver_email)
        .order_by(func.count(ShoutoutRecipient.id).desc())
        .limit(limit)
        .all()
    )

    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(["Email", "Times Tagged"])

    for row in rows:
        writer.writerow([row.receiver_email, row.count])

    output.seek(0)

    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=most_tagged_users.csv"
        },
    )





@router.get("/analytics/reaction-stats")
def reaction_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    rows = (
        db.query(
            Reaction.type,
            func.count(Reaction.id).label("count"),
        )
        .group_by(Reaction.type)
        .all()
    )

    return [
        {
            "reaction_type": r.type,
            "count": r.count
        }
        for r in rows
    ]

@router.get("/analytics/reaction-stats/export")
def export_reaction_stats_csv(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    rows = (
        db.query(
            Reaction.type,
            func.count(Reaction.id).label("count"),
        )
        .group_by(Reaction.type)
        .all()
    )

    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(["Reaction", "Count"])

    for row in rows:
        reaction_type = (
            row.type.value if hasattr(row.type, "value") else str(row.type)
        )
        writer.writerow([reaction_type, row.count])

    output.seek(0)

    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=reaction_stats.csv"
        },
    )


@router.get("/analytics/leaderboard")
def leaderboard(
    limit: int = 10,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    sent = (
        db.query(
            User.id.label("user_id"),
            (func.count(Shoutout.id) * 5).label("score")
        )
        .join(Shoutout, Shoutout.sender_id == User.id)
        .group_by(User.id)
        .subquery()
    )

    received = (
        db.query(
            ShoutoutRecipient.receiver_email.label("email"),
            (func.count(ShoutoutRecipient.id) * 3).label("score")
        )
        .group_by(ShoutoutRecipient.receiver_email)
        .subquery()
    )

    comments = (
        db.query(
            Comment.user_id.label("user_id"),
            (func.count(Comment.id) * 2).label("score")
        )
        .group_by(Comment.user_id)
        .subquery()
    )

    reactions = (
        db.query(
            Reaction.user_id.label("user_id"),
            (func.count(Reaction.id) * 1).label("score")
        )
        .group_by(Reaction.user_id)
        .subquery()
    )

    leaderboard = (
        db.query(
            User.email,
            (
                func.coalesce(sent.c.score, 0)
                + func.coalesce(comments.c.score, 0)
                + func.coalesce(reactions.c.score, 0)
                + func.coalesce(received.c.score, 0)
            ).label("total_score")
        )
        .outerjoin(sent, sent.c.user_id == User.id)
        .outerjoin(comments, comments.c.user_id == User.id)
        .outerjoin(reactions, reactions.c.user_id == User.id)
        .outerjoin(received, received.c.email == User.email)
        .order_by(func.coalesce(sent.c.score, 0).desc())
        .limit(limit)
        .all()
    )

    return [
        {
            "rank": idx + 1,
            "email": row.email,
            "score": int(row.total_score),
        }
        for idx, row in enumerate(leaderboard)
    ]


# app/routers/admin.py  (ADD THIS BELOW LEADERBOARD ENDPOINT)

import csv
from io import StringIO
from fastapi.responses import StreamingResponse


@router.get("/analytics/leaderboard/export/csv")
def export_leaderboard_csv(
    limit: int = 50,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    sent = (
        db.query(
            User.id.label("user_id"),
            (func.count(Shoutout.id) * 5).label("score")
        )
        .join(Shoutout, Shoutout.sender_id == User.id)
        .group_by(User.id)
        .subquery()
    )

    received = (
        db.query(
            ShoutoutRecipient.receiver_email.label("email"),
            (func.count(ShoutoutRecipient.id) * 3).label("score")
        )
        .group_by(ShoutoutRecipient.receiver_email)
        .subquery()
    )

    comments = (
        db.query(
            Comment.user_id.label("user_id"),
            (func.count(Comment.id) * 2).label("score")
        )
        .group_by(Comment.user_id)
        .subquery()
    )

    reactions = (
        db.query(
            Reaction.user_id.label("user_id"),
            (func.count(Reaction.id) * 1).label("score")
        )
        .group_by(Reaction.user_id)
        .subquery()
    )

    rows = (
        db.query(
            User.email,
            (
                func.coalesce(sent.c.score, 0)
                + func.coalesce(comments.c.score, 0)
                + func.coalesce(reactions.c.score, 0)
                + func.coalesce(received.c.score, 0)
            ).label("total_score")
        )
        .outerjoin(sent, sent.c.user_id == User.id)
        .outerjoin(comments, comments.c.user_id == User.id)
        .outerjoin(reactions, reactions.c.user_id == User.id)
        .outerjoin(received, received.c.email == User.email)
        .order_by(func.coalesce(sent.c.score, 0).desc())
        .limit(limit)
        .all()
    )

    buffer = StringIO()
    writer = csv.writer(buffer)
    writer.writerow(["Rank", "Email", "Score"])

    for idx, r in enumerate(rows, start=1):
        writer.writerow([idx, r.email, int(r.total_score)])

    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=leaderboard.csv"},
    )