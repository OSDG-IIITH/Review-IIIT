from typing import List

from pydantic import BaseModel


class Course(BaseModel):
    cid: str
    name: str
    semester: str
    description: str
    reviews: List[str]  # each str will be reviewID

# TODO: add model validators
