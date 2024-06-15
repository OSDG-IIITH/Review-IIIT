from fastapi import APIRouter

from config.database import db
from models.users import User

router = APIRouter()
user_collection = db["users"]

@router.get("/")
async def get_allusers():
    return [ dict(user) async for user in user_collection.find()]

@router.get("/{id}")
async def get_user(id: str):
    return await user_collection.find_one({"uid": id})

@router.post("/")
async def post_user(user: User):
    await user_collection.insert_one(dict(user))

@router.put("/{id}")
async def put_user(id: str, user: User):
    await user_collection.find_one_and_update({"uid", id}, dict(user))

@router.delete("/{id}")
async def delete_user(id: str):
    await user_collection.find_one_and_delete({"uid", id})
