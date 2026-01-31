from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.dependencies import get_current_user
from app.models.comment import Comment
from app.models.shoutout import Shoutout
from app.models.user import User
from app.schemas.comment import CommentCreate

router = APIRouter(prefix="/comments", tags=["Comments"])


@router.post("/shoutouts/{shoutout_id}")
def create_comment(
    shoutout_id: int,
    payload: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    shoutout = db.query(Shoutout).filter(Shoutout.id == shoutout_id).first()
    if not shoutout:
        raise HTTPException(status_code=404, detail="Shoutout not found")

    comment = Comment(
        shoutout_id=shoutout_id,
        user_id=current_user.id,
        message=payload.message,
    )

    db.add(comment)
    db.commit()
    db.refresh(comment)

    return comment

# @router.get("/comments/shoutouts/{shoutout_id}")
# def get_comments(
#     shoutout_id: int,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
# ):
#     comments = (
#         db.query(
#             Comment.id,
#             Comment.message,
#             Comment.created_at,
#             User.email.label("user_email"),
#         )
#         .join(User, User.id == Comment.user_id)
#         .filter(Comment.shoutout_id == shoutout_id)
#         .order_by(Comment.created_at.asc())
#         .all()
#     )

#     return comments

@router.get("/comments/shoutouts/{shoutout_id}")
def get_comments(
    shoutout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    comments = (
        db.query(Comment)
        .filter(Comment.shoutout_id == shoutout_id)
        .order_by(Comment.created_at.asc())
        .all()
    )

    return comments



@router.delete("/comments/{comment_id}")
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()

    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    if comment.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to delete this comment"
        )

    db.delete(comment)
    db.commit()

    return {"message": "Comment deleted successfully"}    