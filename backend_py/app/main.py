import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.scheduler import start_scheduler, shutdown_scheduler

from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.routers.shoutout import router as shoutout_router
from app.routers.reaction import router as reaction_router
from app.routers.comment import router as comment_router
from app.routers.admin import router as admin_router
from app.routers.reports import router as reports_router
from app.routers.boost import router as boost_router
from app.routers.economy import router as economy_router

from app.database import Base, engine

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    start_scheduler()
    yield
    shutdown_scheduler()

app = FastAPI(
    title="Bragboard API",
    description="Employee Recognition Platform API",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS: reads comma-separated origins from env, defaults to localhost for dev
cors_origins = os.environ.get(
    "CORS_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in cors_origins],
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
app.include_router(reports_router)
app.include_router(boost_router)
app.include_router(economy_router)


@app.get("/")
def root():
    return {"message": "Bragboard API is running 🚀"}