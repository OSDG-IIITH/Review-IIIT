"""Initalizing fastapi"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.cas import router as auth_router
from routes.courses import router as course_router
from routes.reviews import router as review_router
from routes.users import router as user_router

app = FastAPI(title="Review-IIIT Backend")

app.include_router(auth_router, tags=["Authentication"])
app.include_router(user_router, prefix="/users", tags=["User Management"])
app.include_router(course_router, prefix="/courses", tags=["Course Management"])
app.include_router(review_router, prefix="/reviews", tags=["Review List"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Backend Index Page - For checking purposes
@app.get("/", tags=["General"])
async def index():
    return {"message": "Backend Running!!"}

