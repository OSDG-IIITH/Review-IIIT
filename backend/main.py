"""Initalizing fastapi"""

from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import uvicorn

from utils import ProxyFiles
from config import HOST_PORT, HOST_PRIVATE, VITE_DEV_PORT, VITE_SUBPATH
from routes.auth import router as auth_router
from routes.courses import router as course_router
from routes.members import router as members_router

app = FastAPI(title="Review-IIIT", root_path=VITE_SUBPATH)

app.include_router(auth_router, prefix="/api", tags=["Authentication"])
app.include_router(course_router, prefix="/api/courses", tags=["Course Management"])
app.include_router(members_router, prefix="/api/members", tags=["Member Management"])

FRONTEND_PATH = "../frontend/dist"


@app.exception_handler(404)
async def exception_404_handler(_, __):
    """
    A generic 404 error handler. Here we just let the frontend react router code
    handle it, so redirect to it.
    """
    return FileResponse(f"{FRONTEND_PATH}/index.html")


@app.get("/api/diagnostics")
async def diagnostics(request: Request):
    """
    Endpoint to display all diagnostic information about the incoming request.
    """
    return {
        "method": request.method,
        "url": {
            "str": str(request.url),
            "is_secure": request.url.is_secure,
            "scheme": request.url.scheme,
            "netloc": {
                "str": request.url.netloc,
                "hostname": request.url.hostname,
                "port": request.url.port,
            },
            "path": request.url.path,
            "fragment": request.url.fragment,
        },
        "path_params": dict(request.path_params),
        "query_params": dict(request.query_params),
        "client": {
            "host": request.client.host if request.client else "UNKNOWN",
            "port": request.client.port if request.client else "UNKNOWN",
        },
        "headers": dict(request.headers),
        "cookies": request.cookies,
    }


# serve frontend
try:
    app.mount("/", StaticFiles(directory=FRONTEND_PATH, html=True), "frontend")
except RuntimeError:
    # we don't have a production build of the frontend, so assume that the
    # frontend is running on its own server, and proxy to it
    app.mount("/", ProxyFiles(VITE_DEV_PORT), "frontend")


if __name__ == "__main__":
    # forwarded_allow_ips set to * so that the nginx headers are trusted
    uvicorn.run(
        "main:app",
        host=HOST_PRIVATE,
        port=HOST_PORT,
        proxy_headers=True,
        forwarded_allow_ips="*",
    )
