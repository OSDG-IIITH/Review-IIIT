"""Initalizing fastapi"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from config import HOST_SUBPATH
from routes.auth import router as auth_router
from routes.courses import router as course_router
from routes.members import router as members_router

app = FastAPI(title="Review-IIIT", root_path=HOST_SUBPATH)

app.include_router(auth_router, prefix="/api", tags=["Authentication"])
app.include_router(course_router, prefix="/api/courses", tags=["Course Management"])
app.include_router(members_router, prefix="/api/members", tags=["Member Management"])

# fix CORS issues
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# serve frontend
app.mount("/", StaticFiles(directory="../frontend/dist", html=True))
