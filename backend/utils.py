import base64

import httpx
import jwt
from cryptography.fernet import Fernet, InvalidToken
from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse, RedirectResponse, StreamingResponse
from starlette.types import Receive, Scope, Send

from config import BACKEND_ADMIN_UIDS, BACKEND_JWT_SECRET

secure_key = Fernet.generate_key()


def get_auth_id(request: Request) -> str:
    """
    Helper function to get auth id (hash) from the request cookie. We use jwt
    to generated an encrypted and signed cookie, so at this stage we do the
    decryption to extract the actual hash value.

    This function raises a HTTPException if the caller is not correctly
    authenticated, and this is important as it is used as a FastAPI dependency
    that safeguards all API from unauthorized access.
    """
    try:
        return jwt.decode(
            request.cookies["auth_hash"],
            BACKEND_JWT_SECRET,
            algorithms=["HS256"],
        )["_id"]
    except (KeyError, jwt.InvalidTokenError):
        raise HTTPException(401, "Caller not authenticated") from None


def get_auth_id_admin(request: Request) -> str:
    """
    It does everything what get_auth_id does, but additionally checks if the
    caller is backend admin. This is used as a dependency for admin API.
    """
    ret = get_auth_id(request)
    if ret not in BACKEND_ADMIN_UIDS:
        raise HTTPException(403, "Caller is authenticated but not admin")

    return ret


def has_auth_id(request: Request) -> bool:
    """
    This just returns a boolean on whether the caller is authenticated correctly
    or not.
    """
    try:
        return bool(get_auth_id(request))
    except HTTPException:
        return False


def set_auth_id(response: RedirectResponse, uid: str | None, is_secure: bool):
    """
    This function is used to set the auth id (hash). If the uid argument is
    None, it deletes the auth cookie, otherwise it sets it to a jwt encoded
    value that contains the hash.
    """
    if uid is not None:
        response.set_cookie(
            "auth_hash",
            jwt.encode({"_id": uid}, BACKEND_JWT_SECRET, algorithm="HS256"),
            httponly=True,
            secure=is_secure,
            samesite="strict",
            max_age=864000,  # 10 days
        )
    else:
        response.delete_cookie(
            "auth_hash",
            httponly=True,
            secure=is_secure,
            samesite="strict",
        )


def hash_encrypt(reviewer_hash: str):
    """
    Converts reviewer hash (identifier associated with reviews) to a id that
    can be safely sent to the client side.
    """
    return Fernet(secure_key).encrypt(base64.b64decode(reviewer_hash)).decode()


def hash_decrypt(reviewer_id: str):
    """
    Converts a reviewer id to the hash (identifier associated with reviews)
    """
    try:
        return base64.b64encode(Fernet(secure_key).decrypt(reviewer_id)).decode()
    except InvalidToken:
        return None


class ProxyFiles:
    """
    This is custom API that serves as a replacement for StaticFiles function
    when a production build is not available and the frontend is running on its
    own server.
    Essentially this implements a basic HTTP proxy so that the backend can serve
    the frontend even in dev mode, like it does in production mode.
    """

    def __init__(self, port: int, host: str = "127.0.0.1", http_scheme: str = "http"):
        self.http_scheme = http_scheme
        self.host = host
        self.port = port

    async def handle_http(self, scope: Scope, receive: Receive, send: Send):
        request = Request(scope, receive, send)
        async with httpx.AsyncClient() as client:
            request_response = await client.request(
                request.method.lower(),
                f"{self.http_scheme}://{self.host}:{self.port}{request.url.path}",
                headers=dict(request.headers),
                params=request.query_params,
                content=await request.body(),
            )
            return StreamingResponse(
                request_response.aiter_bytes(),
                status_code=request_response.status_code,
                headers=dict(request_response.headers),
            )

    async def __call__(self, scope: Scope, receive: Receive, send: Send):
        if scope["type"] == "http":
            response = await self.handle_http(scope, receive, send)
        else:
            response = JSONResponse(
                {"error": f"{scope['type']} connections are not supported"},
                status_code=400,
            )
        await response(scope, receive, send)
