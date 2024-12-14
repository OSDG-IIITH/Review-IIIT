from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from pydantic import EmailStr

from routes.members import prof_exists
from config import db
from utils import get_auth_id, get_auth_id_admin
from models import Course, Review, ReviewFrontend, Sem, CourseCode

# The get_auth_id Dependency validates authentication of the caller
router = APIRouter(dependencies=[Depends(get_auth_id)])
course_collection = db["courses"]


@router.get("/")
async def course_list(
    course_sem_filter: Sem | None = None,
    course_code_filter: CourseCode | None = None,
    prof_filter: EmailStr | None = None,
):
    """
    List all courses.
    This does not return the reviews attribute, that must be queried individually.
    Can optionally pass filters for:
    - course semester
    - course code
    - prof
    """
    filter_op: dict[str, Any] = {}
    if course_sem_filter:
        filter_op |= {"sem": course_sem_filter}
    if course_code_filter:
        filter_op |= {"code": course_code_filter}
    if prof_filter:
        filter_op |= {"profs": {"$all": [prof_filter]}}

    return [
        Course(**course).model_dump()
        async for course in course_collection.find(
            filter_op, projection={"_id": False, "reviews": False}
        )
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

    return [
        ReviewFrontend(**v, is_reviewer=(k == auth_id)).model_dump()
        for k, v in course_reviews.get("reviews", {}).items()
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
        {"$set": {f"reviews.{auth_id}": review.model_dump()}},
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
        {"sem": sem, "code": code},
        {"$unset": {f"reviews.{auth_id}": ""}}
    )
