"""Initalizing mongo connection"""
import os

from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from pymongo.server_api import ServerApi

user = os.environ.get('MONGO_INITDB_ROOT_USERNAME', 'username')
password = os.environ.get('MONGO_INITDB_ROOT_PASSWORD', 'password')
uri = f'mongodb://{user}:{password}@mongodb:27017'
client = AsyncIOMotorClient(uri, server_api=ServerApi('1'))

# sanity check
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except (ConnectionFailure, ServerSelectionTimeoutError) as e:
    print(e)
  

MONGO_DATABASE = os.getenv("MONGO_DATABASE", "dev")
db = client[MONGO_DATABASE]
