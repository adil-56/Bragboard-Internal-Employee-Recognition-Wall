

# # # # # from fastapi import FastAPI
# # # # # from app.routers.auth import router as auth_router
# # # # # from app.routers.users import router as users_router
# # # # # from app.routers.shoutout import router as shoutout_router
# # # # # from app.routers.reaction import router as reaction_router
# # # # # from app.routers import reaction


# # # # # app = FastAPI(title="BragBoard API")

# # # # # app.include_router(auth_router)
# # # # # app.include_router(users_router)
# # # # # app.include_router(shoutout_router)
# # # # # app.include_router(reaction_router)  # 🔥 THIS LINE MUST EXIST
# # # # # app.include_router(reaction.router)



# # # # # app/main.py
# # # # from fastapi import FastAPI
# # # # from app.routers import auth, users, shoutout, reaction
# # # # from app.routers.reaction import router as reactions_router


# # # # app = FastAPI()

# # # # app.include_router(auth.router)
# # # # app.include_router(users.router)
# # # # app.include_router(shoutout.router)
# # # # app.include_router(reaction.router)

# # from fastapi import FastAPI
# # from app.routers.auth import router as auth_router
# # from app.routers.users import router as users_router
# # from app.routers.shoutout import router as shoutout_router
# # from app.routers.reaction import router as reactions_router
# # from app.routers import comment

# # app = FastAPI(title="BragBoard API")

# # app.include_router(auth_router)
# # app.include_router(users_router)
# # app.include_router(shoutout_router)
# # app.include_router(reactions_router)
# # app.include_router(comment.router)


# # from fastapi import FastAPI
# # from app.routers import auth, users

# # app = FastAPI(title="BragBoard API")

# # app.include_router(auth.router)
# # app.include_router(users.router)

# from fastapi import FastAPI

# from app.routers.auth import router as auth_router
# from app.routers.users import router as users_router
# from app.routers.shoutout import router as shoutout_router
# from app.routers.reaction import router as reaction_router
# from app.routers.comment import router as comment_router
# from app.routers.admin_test import router as admin_router


# app = FastAPI(title="BragBoard API")

# app.include_router(auth_router)
# app.include_router(users_router)
# app.include_router(shoutout_router)
# app.include_router(reaction_router)
# app.include_router(comment_router)
# app.include_router(admin_router)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.routers.shoutout import router as shoutout_router
from app.routers.reaction import router as reaction_router
from app.routers.comment import router as comment_router
from app.routers.admin_test import router as admin_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(shoutout_router)
app.include_router(reaction_router)
app.include_router(comment_router)
app.include_router(admin_router)