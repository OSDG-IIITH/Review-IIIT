import base64
import hashlib
from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from pydantic import EmailStr

from config import db
from utils import get_auth_id, get_auth_id_admin
from models import Prof, Review, ReviewFrontend, Student

# The get_auth_id Dependency validates authentication of the caller
router = APIRouter(dependencies=[Depends(get_auth_id)])
profs_collection = db["profs"]


@router.get("/")
async def prof_list():
    """
    Helper to return all Prof instances stored in the db.
    This does not return the reviews attribute, that must be queried individually.
    """
    return [
        Prof(**user).model_dump()
        async for user in profs_collection.find(
            projection={"_id": False, "reviews": False}
        )
    ]


@router.get("/exists/{email}")
async def prof_exists(email: EmailStr):
    """
    Simple helper that checks whether a Prof record already exists, given the
    email
    """
    record = await profs_collection.find_one({"email": email}, ["_id"])
    return record is not None


@router.post("/", dependencies=[Depends(get_auth_id_admin)])
async def prof_post(profs: list[Prof]):
    """
    Helper method to update a list of Profs in the records. This is an admin
    endpoint and can't be used by regular users.
    """
    for prof in profs:
        if await prof_exists(prof.email):
            raise HTTPException(
                status_code=400,
                detail="Cannot re-post a prof that is already in the db",
            )

        await profs_collection.insert_one(prof.model_dump())


@router.get("/reviews/{email}")
async def prof_reviews_get(email: EmailStr, auth_id: str = Depends(get_auth_id)):
    """
    Helper to return all reviews under a given Prof email.
    This function returns None if the prof does not exist
    """
    prof_reviews: dict[str, Any] = await profs_collection.find_one(
        {"email": email}, ["reviews"]
    )
    if not prof_reviews:
        return None

    return [
        ReviewFrontend(**v, is_reviewer=(k == auth_id)).model_dump()
        for k, v in prof_reviews.get("reviews", {}).items()
    ]


@router.post("/reviews/{email}")
async def prof_reviews_post(
    email: EmailStr, review: Review, auth_id: str = Depends(get_auth_id)
):
    """
    Helper to post a single review on a Prof.
    Every user can only post one review on a Prof, and attempting to post a new
    review discards any older reviews.
    """
    await profs_collection.update_one(
        {"email": email}, {"$set": {f"reviews.{auth_id}": review.model_dump()}}
    )


@router.delete("/reviews/{email}")
async def prof_reviews_delete(email: EmailStr, auth_id: str = Depends(get_auth_id)):
    """
    Helper to delete a review posted by the authenticated user on a professor.
    If the user hasn't posted a review, no action will be taken.
    """
    await profs_collection.update_one(
        {"email": email}, {"$unset": {f"reviews.{auth_id}": ""}}
    )


async def student_hash(user: Student):
    """
    Internal function to hash a Student object. This hash is used as a review key
    to ensure that a user cannot repost reviews.
    """
    if await prof_exists(user.email):
        raise ValueError("invalid user for student_post")

    # first generate a sha512 hash of user data and then base64 encode it
    return base64.b64encode(
        hashlib.sha512(f"{user.name}-{user.email}-{user.rollno}".encode()).digest()
    ).decode()
