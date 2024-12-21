import logging
import os

from motor.motor_asyncio import AsyncIOMotorClient

HOST_PRIVATE = os.environ["HOST_PRIVATE"]
HOST_PORT = int(os.environ.get("HOST_PORT") or 80)

BACKEND_MONGO_DATABASE = os.environ["BACKEND_MONGO_DB"]
BACKEND_MONGO_URI = os.environ["BACKEND_MONGO_URI"]
BACKEND_CAS_SERVER_URL = os.environ["BACKEND_CAS_SERVER_URL"]

BACKEND_JWT_SECRET = os.environ.get("BACKEND_JWT_SECRET", "")
if not BACKEND_JWT_SECRET:
    raise RuntimeError("Empty BACKEND_JWT_SECRET")

BACKEND_ADMIN_UIDS = {
    i for i in os.environ.get("BACKEND_ADMIN_UIDS", "").split(",") if i
}

VITE_SUBPATH = os.environ.get("VITE_SUBPATH", "")
VITE_MSG_MAX_LEN = int(os.environ["VITE_MSG_MAX_LEN"])

mongo_client = AsyncIOMotorClient(
    f"{BACKEND_MONGO_URI}/{BACKEND_MONGO_DATABASE}?retryWrites=true&w=majority"
)
db = mongo_client[BACKEND_MONGO_DATABASE]

logger = logging.getLogger("uvicorn.error")
