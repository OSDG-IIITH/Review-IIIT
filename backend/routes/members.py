from typing import Any
from fastapi import APIRouter, Depends, HTTPException

from config import db
from utils import get_auth_id
from models import Prof, Review, Student

router = APIRouter(dependencies=[Depends(get_auth_id)])
profs_collection = db["profs"]
students_collection = db["students"]


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
async def prof_exists(email: str):
    """
    Simple helper that checks whether a Prof record already exists, given the
    email
    """
    record = await profs_collection.find_one({"email": email}, ["_id"])
    return record is not None


@router.post("/")
async def prof_post(profs: list[Prof]):
    """
    Helper method to update a list of Profs in the records
    """
    for prof in profs:
        if await prof_exists(prof.email):
            raise HTTPException(
                status_code=400,
                detail="Cannot re-post a prof that is already in the db",
            )

        await profs_collection.insert_one(prof.model_dump())


@router.get("/reviews/{email}")
async def prof_reviews_get(email: str):
    """
    Helper to return all reviews under a given Prof email.
    This function returns None if the prof does not exist
    """
    prof_reviews: dict[str, Any] = await profs_collection.find_one(
        {"email": email}, ["reviews"]
    )
    if not prof_reviews:
        return None

    return [Review(**i).model_dump() for i in prof_reviews.get("reviews", {}).values()]


@router.post("/reviews/{email}")
async def prof_reviews_post(
    email: str, review: Review, auth_id: str = Depends(get_auth_id)
):
    """
    Helper to post a single review on a Prof.
    Every user can only post one review on a Prof, and attempting to post a new
    review discards any older reviews.
    """
    await profs_collection.update_one(
        {"email": email}, {"$set": {f"reviews.{auth_id}": review.model_dump()}}
    )


async def student_post(user: Student):
    """
    Internal function to post a Student to the database. This function must not
    be exposed directly as public API, as it does an unauthenticated update.
    """
    if await prof_exists(user.email):
        raise ValueError("invalid user for student_post")

    member_dict: dict = await students_collection.find_one({"email": user.email})
    if member_dict:
        return str(member_dict["_id"])

    return str((await students_collection.insert_one(user.model_dump())).inserted_id)
