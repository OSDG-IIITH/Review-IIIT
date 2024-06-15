"""FastAPI implementation of CASAuthentication"""
import logging
from os import getenv
from urllib.parse import quote_plus

import cas
from fastapi import APIRouter, Request, Response
from fastapi.responses import RedirectResponse
from jwt import encode
from models.users import User

from routes.users import get_user, post_user

router = APIRouter()

# Configuration
DEBUG = int(getenv("GLOBAL_DEBUG", "1"))
SECURE_COOKIES = getenv("SECURE_COOKIES", "False").lower() in (
    "true",
    "1",
    "t",
)
CAS_SERVER_URL = getenv("CAS_SERVER_URL")
SERVICE_URL = getenv("SERVICE_URL")
REDIRECT_URL = getenv("REDIRECT_URL", "/")
JWT_SECRET = getenv("JWT_SECRET", "jwt-secret-very-very-secret")
URL_FORMATTER = "%s?next=%s"


# instantiate CAS client
cas_client = cas.CASClient(
    version=3,
    service_url=URL_FORMATTER
    % (SERVICE_URL, quote_plus(REDIRECT_URL)),
    server_url=CAS_SERVER_URL,
)

# Configure logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG if DEBUG else logging.INFO)
handler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)

@router.get("/login")
@router.get("/login/{path:path}")
async def login(request: Request, path: str = None):
    """Handle login, path is the return path after auth is done"""
    back_to = path or str(request.url)
    logger.debug("path: %s", back_to)

    # Already logged in
    if request.cookies.get("Authorization"):
        return RedirectResponse(back_to or REDIRECT_URL)

    next_url = request.query_params.get("next") or None
    logger.debug("next: %s", next_url)

    cas_client.service_url = URL_FORMATTER % (
        SERVICE_URL,
        quote_plus(next_url or back_to or REDIRECT_URL),
    )
    next_url = next_url or REDIRECT_URL

    ticket = request.query_params.get("ticket")
    if not ticket:
        # No ticket, the request come from end user, send to CAS login
        cas_login_url = cas_client.get_login_url()
        logger.debug("CAS login URL: %s", cas_login_url)
        return RedirectResponse(cas_login_url)

    # There is a ticket, the request come from CAS as callback.
    # need call `verify_ticket()` to validate ticket and get user profile.
    logger.debug("ticket: %s", ticket)
    logger.debug("next: %s", next_url)

    user, attributes, pgtiou = cas_client.verify_ticket(ticket)

    logger.info(
        "CAS verify ticket response: user: %s, attributes: %s, pgtiou: %s",
        user,
        attributes,
        pgtiou,
    )

    if not user:
        return "Failed to verify ticket. <a href='/login'>Login</a>"

    # Login successful
    payload = {"uid": attributes["uid"]}

    try: 
        # initialize user if its his first time
        if not get_user(uid):
            user = User(attributes["uid"], attributes["name"], attributes["email"],
                 attributes["rollno"])
            post_user(user)
    except Exception as e:
        logger.error("Unable to connect to the MongoDB server:", e)
        pass

    # generate JWT
    token = encode(payload, JWT_SECRET, algorithm="HS256")

    # send JWT as cookie
    response = RedirectResponse(next_url)
    response.set_cookie(
        "Authorization",
        token,
        httponly=True,
        secure=SECURE_COOKIES,
        max_age=864000,  # 10 days
    )

    return response


@router.get("/logout")
async def logout():
    """Logout doesn't need any args"""
    redirect_url = f"{SERVICE_URL}/logoutCallback"
    cas_logout_url = cas_client.get_logout_url(redirect_url)
    logger.info("CAS logout URL: %s", cas_logout_url)

    return RedirectResponse(cas_logout_url)


@router.get("/logoutCallback")
async def logout_callback(_request: Request, response: Response):
    """Logs the user out by expiring the cookie"""
    response = RedirectResponse(REDIRECT_URL)
    response.delete_cookie("Authorization")

    # Redirect from CAS logout request after logout successful
    return response


# check if the current user is authenticated
def get_authenticated_user(request: Request):
    return request.cookies.get("Authorization")

