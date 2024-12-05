"""FastAPI implementation of CASAuthentication"""

import cas
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import RedirectResponse

from routes.members import student_post
from utils import has_auth_id, set_auth_id
from models import Student

from config import logger, BACKEND_CAS_SERVER_URL, HOST_BASE_URL

router = APIRouter()


# instantiate CAS client
cas_client = cas.CASClient(
    version=2,
    service_url=f"{HOST_BASE_URL}/api/login",
    server_url=BACKEND_CAS_SERVER_URL,
)


@router.get("/login")
async def login(request: Request):
    """
    This is the login endpoint that must be used before accessing any other API.
    Sets an authentication cookie upon successful CAS verification
    """
    if has_auth_id(request):
        # already has login cookie set, no need for CAS relogin
        return RedirectResponse(HOST_BASE_URL)

    ticket = request.query_params.get("ticket")
    if not ticket:
        return RedirectResponse(cas_client.get_login_url())

    user, attributes, _ = cas_client.verify_ticket(ticket)
    logger.info(f"CAS verify ticket response: user - {user}, attributes - {attributes}")

    try:
        if not attributes:
            raise ValueError("CAS attributes not valid")

        student = Student(
            name=attributes.get("Name", ""),
            email=attributes.get("E-Mail", user),
            rollno=attributes.get("RollNo", ""),
        )

        student_uid = await student_post(student)
    except Exception as e:
        logger.error(f"Could not authenticate: {e}")
        student_uid = None

    # send JWT as cookie
    response = RedirectResponse(
        HOST_BASE_URL if student_uid else cas_client.get_logout_url()
    )
    set_auth_id(response, student_uid)
    return response


@router.get("/has_login")
async def has_login(request: Request):
    """
    Returns a boolean that indicates whether the current user is logged in or not.
    This is needed because we are using http_only cookies so the client side cannot
    actually read the cookie.
    """
    return has_auth_id(request)


@router.get("/logout")
async def logout():
    """
    This is the logout endpoint that clears the authentication cookie and does
    a CAS logout.
    """

    # do CAS logout and clear cookie
    response = RedirectResponse(cas_client.get_logout_url())
    set_auth_id(response, None)
    return response
