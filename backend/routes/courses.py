from fastapi import APIRouter, Depends

from config.database import db
from models.courses import Course
from routes.cas import get_authenticated_user

router = APIRouter(dependencies=[Depends(get_authenticated_user)])
course_collection = db["courses"]

@router.get("/")
async def get_courses():
    return [ dict(course) async for course in course_collection.find()]

@router.post("/")
async def post_course(course: Course):
    await course_collection.insert_one(dict(course))

@router.put("/{id}")
async def put_course(id: str, course: Course):
    await course_collection.find_one_and_update({"cid", id}, dict(course))

@router.delete("/{id}")
async def delete_course(id: str):
    await course_collection.find_one_and_delete({"cid", id})
