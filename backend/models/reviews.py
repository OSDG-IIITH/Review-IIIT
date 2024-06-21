from pydantic import BaseModel


class Review(BaseModel):
    uid: str
    cid: str
    date: str  # controversial but fixes a lot of data corruption
    anonymous: bool
    likes: int
    dislikes: int
    rating: int
    content: str

    # review_type: str  # to be added later (food, professor, course)

# TODO: add model validators
