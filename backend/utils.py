from fastapi import HTTPException, Request
from fastapi.responses import RedirectResponse
import jwt

from config import BACKEND_ADMIN_UIDS, BACKEND_JWT_SECRET, HOST_SECURE


def get_auth_id(request: Request) -> str:
    try:
        return jwt.decode(
            request.cookies["Authorization"], BACKEND_JWT_SECRET, algorithms=["HS256"]
        )["_id"]
    except (KeyError, jwt.InvalidTokenError):
        raise HTTPException(401, "Caller not authenticated")


def get_auth_id_admin(request: Request) -> str:
    ret = get_auth_id(request)
    if ret not in BACKEND_ADMIN_UIDS:
        raise HTTPException(403, "Caller is authenticated but not admin")

    return ret


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
            secure=HOST_SECURE,
            samesite="strict",
            max_age=864000,  # 10 days
        )
    else:
        response.delete_cookie(
            "Authorization",
            httponly=True,
            secure=HOST_SECURE,
            samesite="strict",
        )
