from fastapi import HTTPException, Request
from fastapi.responses import RedirectResponse
import jwt

from config import logger, BACKEND_JWT_SECRET


def get_auth_id(request: Request) -> str:
    try:
        return jwt.decode(
            request.cookies["Authorization"], BACKEND_JWT_SECRET, algorithms=["HS256"]
        )["_id"]
    except (KeyError, jwt.InvalidTokenError) as e:
        logger.info(f"Failed to get auth id: {e}")
        raise HTTPException(401, "Caller not authenticated")


def has_auth_id(request: Request) -> bool:
    try:
        return bool(get_auth_id(request))
    except HTTPException:
        return False


def set_auth_id(response: RedirectResponse, uid: str | None):
    if uid is not None:
        response.set_cookie(
            "Authorization",
            jwt.encode({"_id": uid}, BACKEND_JWT_SECRET, algorithm="HS256"),
            httponly=True,
            max_age=864000,  # 10 days
        )
    else:
        response.delete_cookie("Authorization")
