from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from pydantic import EmailStr

from routes.routes_helpers import get_list_with_metadata
from routes.members import prof_exists
from config import db
from utils import get_auth_id, get_auth_id_admin, hash_decrypt, hash_encrypt
from models import (
    Course,
    CourseFrontend,
    Review,
    ReviewBackend,
    ReviewFrontend,
    Sem,
    CourseCode,
    VoteAndReviewID,
)

# The get_auth_id Dependency validates authentication of the caller
router = APIRouter(dependencies=[Depends(get_auth_id)])
course_collection = db["courses"]


@router.get("/")
async def course_list():
    """
    List all courses.
    This does not return the reviews attribute, that must be queried individually.
    """
    return [
        CourseFrontend(**course).model_dump()
        async for course in get_list_with_metadata(course_collection)
    ]


@router.get("/exists/{sem}/{code}")
async def course_exists(sem: Sem, code: CourseCode):
    """
    Simple helper that checks whether a Course record already exists, given sem+code
    """
    record = await course_collection.find_one({"sem": sem, "code": code}, ["_id"])
    return record is not None


@router.post("/", dependencies=[Depends(get_auth_id_admin)])
async def course_post(courses: list[Course]):
    """
    Post a list of courses. This is an admin endpoint and can't be used by
    regular users.
    """
    for course in courses:
        if await course_exists(course.sem, course.code):
            raise HTTPException(
                status_code=400, detail="Cannot re-post a course that already exists"
            )

        for p in course.profs:
            if not await prof_exists(p):
                raise HTTPException(
                    status_code=400,
                    detail=f"Course '{course}' has incorrect prof value '{p}'",
                )

        await course_collection.insert_one(course.model_dump())


@router.get("/reviews/{sem}/{code}")
async def course_reviews_get(
    sem: Sem, code: CourseCode, auth_id: str = Depends(get_auth_id)
):
    """
    Helper to return all reviews under a given course.
    This function returns None if the course does not exist
    """
    course_reviews: dict[str, Any] = await course_collection.find_one(
        {"sem": sem, "code": code}, ["reviews"]
    )
    if not course_reviews:
        return None

    course_reviews_validated = [
        (k, ReviewBackend(**v)) for k, v in course_reviews.get("reviews", {}).items()
    ]

    return [
        ReviewFrontend(
            rating=v.rating,
            content=v.content,
            dtime=v.dtime,
            review_id=hash_encrypt(k),
            is_reviewer=(k == auth_id),
            votes_aggregate=sum(v.votes.values()),
            votes_status=v.votes.get(auth_id, 0),
        ).model_dump()
        for k, v in course_reviews_validated
    ]


@router.post("/reviews/{sem}/{code}")
async def course_reviews_post(
    sem: Sem, code: CourseCode, review: Review, auth_id: str = Depends(get_auth_id)
):
    """
    Helper to post a single review on a Course.
    Every user can only post one review on a Course, and attempting to post a new
    review discards any older reviews.
    """
    await course_collection.update_one(
        {"sem": sem, "code": code},
        [
            {
                "$set": {
                    # do merge objects to keep old votes intact
                    f"reviews.{auth_id}": {
                        "$mergeObjects": [f"$reviews.{auth_id}", review.model_dump()]
                    }
                }
            }
        ],
    )


@router.delete("/reviews/{sem}/{code}")
async def course_reviews_delete(
    sem: Sem, code: CourseCode, auth_id: str = Depends(get_auth_id)
):
    """
    Helper to delete a review posted by the authenticated user on a professor.
    If the user hasn't posted a review, no action will be taken.
    """
    await course_collection.update_one(
        {"sem": sem, "code": code}, {"$unset": {f"reviews.{auth_id}": ""}}
    )


@router.post("/reviews/{sem}/{code}/votes")
async def course_reviews_votes_post(
    sem: Sem,
    code: CourseCode,
    post_body: VoteAndReviewID,
    auth_id: str = Depends(get_auth_id),
):
    """
    Helper to post a vote on a single Review on a Course.
    """
    review_hash = hash_decrypt(post_body.review_id)
    if not review_hash:
        raise HTTPException(422, "Invalid review_id value")

    await course_collection.update_one(
        {"sem": sem, "code": code},
        {
            "$set" if post_body.vote else "$unset": {
                f"reviews.{review_hash}.votes.{auth_id}": post_body.vote
            }
        },
    )
