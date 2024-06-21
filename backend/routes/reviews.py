from fastapi import APIRouter, Depends

from config.database import db
from models.reviews import Review
from routes.cas import get_authenticated_user

router = APIRouter(dependencies=[Depends(get_authenticated_user)])
review_collection = db["reviews"]

@router.get("/")
async def get_allreviews():
    return [ dict(review) async for review in review_collection.find()]

@router.get("/{id}")
async def get_review(id: str):
    return await review_collection.find_one({"uid": id})

@router.post("/")
async def post_review(review: Review):
    await review_collection.insert_one(dict(review))

@router.put("/{id}")
async def put_review(id: str, review: Review):
    await review_collection.find_one_and_update({"uid", id}, dict(review))

@router.delete("/{id}")
async def delete_review(id: str):
    await review_collection.find_one_and_delete({"uid", id})
