from typing import List

from pydantic import BaseModel


class User(BaseModel):
    uid: str
    email: str
    rollno: str
    name: str
    batch: str
    branch: str
    reviews: List[str]  # each str will be reviewID

# TODO: add model validators

