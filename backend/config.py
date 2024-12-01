import logging
import os

from motor.motor_asyncio import AsyncIOMotorClient

HOST_PROTOCOL = os.environ["HOST_PROTOCOL"]
HOST_PRIVATE = os.environ["HOST_PRIVATE"]
HOST_PUBLIC = os.environ["HOST_PUBLIC"] if os.getenv("HOST_PUBLIC") else HOST_PRIVATE
HOST_SUBPATH = os.environ.get("HOST_SUBPATH", "")

HOST_PORT = int(os.environ.get("HOST_PORT", 80))
_HOST_PORT_SUFFIX = f":{HOST_PORT}" if HOST_PORT != 80 else ""

HOST_BASE_URL = f"{HOST_PROTOCOL}://{HOST_PUBLIC}{_HOST_PORT_SUFFIX}{HOST_SUBPATH}"

BACKEND_MONGO_DATABASE = os.environ["BACKEND_MONGO_DB"]
BACKEND_MONGO_URI = os.environ["BACKEND_MONGO_URI"]
BACKEND_CAS_SERVER_URL = os.environ["BACKEND_CAS_SERVER_URL"]

BACKEND_JWT_SECRET = os.environ.get("BACKEND_JWT_SECRET", "")
if not BACKEND_JWT_SECRET:
    raise RuntimeError("Empty BACKEND_JWT_SECRET")


mongo_client = AsyncIOMotorClient(
    f"{BACKEND_MONGO_URI}/{BACKEND_MONGO_DATABASE}?retryWrites=true&w=majority"
)
db = mongo_client[BACKEND_MONGO_DATABASE]

logger = logging.getLogger("uvicorn.error")
