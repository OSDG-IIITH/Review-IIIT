"""Initalizing fastapi"""

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from config import HOST_SUBPATH
from routes.auth import router as auth_router
from routes.courses import router as course_router
from routes.members import router as members_router

app = FastAPI(title="Review-IIIT", root_path=HOST_SUBPATH)

app.include_router(auth_router, prefix="/api", tags=["Authentication"])
app.include_router(course_router, prefix="/api/courses", tags=["Course Management"])
app.include_router(members_router, prefix="/api/members", tags=["Member Management"])

FRONTEND_PATH = "../frontend/dist"


@app.exception_handler(404)
async def exception_404_handler(_, __):
    return FileResponse(f"{FRONTEND_PATH}/index.html")


# serve frontend
app.mount("/", StaticFiles(directory=FRONTEND_PATH, html=True), "frontend")
