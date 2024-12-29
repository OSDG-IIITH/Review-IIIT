from datetime import datetime, timezone
from typing import Annotated, Literal, TypeAlias

from pydantic import (
    AwareDatetime,
    BaseModel,
    EmailStr,
    Field,
    StringConstraints,
    model_validator,
)

from config import VITE_MSG_MAX_LEN

# List of valid semesters. M for monsoon and S for spring. The number after it
# represents the year
Sem: TypeAlias = Literal["S25", "M24", "S24", "M23", "S23", "M22"]

# str annotated with a regex to match valid course codes
CourseCode: TypeAlias = Annotated[
    str, StringConstraints(pattern=r"^(C[EGLS]|MA|OC|PD|SC|HS|EC|GS)\d\.\d{3}$")
]

# str annotated with a regex to match valid roll numbers
# currently, this matches any 10 digit positive integer
# TODO: can make this regex more precise
StudentRollno: TypeAlias = Annotated[str, StringConstraints(pattern=r"^\d{10}$")]

# A vote can be 1 (upvote), -1 (downvote) or 0 (no vote)
Vote: TypeAlias = Literal[-1, 0, 1]


class Review(BaseModel):
    """
    Base class to represent a review
    """

    rating: Literal[1, 2, 3, 4, 5]
    content: str = Field(..., min_length=1, max_length=VITE_MSG_MAX_LEN)
    dtime: AwareDatetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # Model-level validator that runs before individual field validation
    @model_validator(mode="before")
    def convert_naive_to_aware(cls, values):
        if "dtime" in values:
            dtime = values["dtime"]
            if dtime and dtime.tzinfo is None:  # Check if datetime is naive
                values["dtime"] = dtime.replace(tzinfo=timezone.utc)  # Make it aware
        return values


class ReviewBackend(Review):
    """
    This represents a Review as it is stored in the backend (db).
    """

    # mapping from student hash to vote.
    # this dict is not to be exposed to the frontend directly, as the hashes
    # must not be exposed.
    votes: dict[str, Vote] = Field(default_factory=dict)


class ReviewFrontend(Review):
    """
    This represents a Review as it is seen from the frontend. Some attributes
    with the backend are common, but some are not.
    """

    # The id of the Review as visible to the frontend. This is the encrypted
    # reviewer hash.
    review_id: str

    # stores whether viewer is the author of the review
    is_reviewer: bool

    # aggregate of votes
    votes_aggregate: int

    # stores the upvote/downvote status of the author
    votes_status: Vote


class ReviewsMetadata(BaseModel):
    """
    Base class for storing some metadata (aggregate statistics) of reviews
    """

    num_reviews: int
    newest_dtime: AwareDatetime | None
    avg_rating: float | None

    # Model-level validator that runs before individual field validation
    @model_validator(mode="before")
    def convert_naive_to_aware(cls, values):
        if "newest_dtime" in values:
            dtime = values["newest_dtime"]
            if dtime and dtime.tzinfo is None:
                values["newest_dtime"] = dtime.replace(tzinfo=timezone.utc)
        return values


class Member(BaseModel):
    """
    Base class for representing a Member, can be a Student or Prof
    """

    name: str = Field(..., min_length=1)
    email: EmailStr


class Student(Member):
    """
    Class for storing a student
    """

    rollno: StudentRollno


class Prof(Member):
    """
    Class for storing a Prof
    """

    reviews_metadata: ReviewsMetadata


class Course(BaseModel):
    """
    Represents a Course.
    The code-sem combination is the ID for every course.
    """

    code: CourseCode
    sem: Sem
    name: str = Field(..., min_length=1)
    profs: list[EmailStr]  # list of prof emails
    reviews_metadata: ReviewsMetadata


class VoteAndReviewID(BaseModel):
    """
    Base class for storing a vote and review_id (used in post body for vote API)
    """

    vote: Vote
    review_id: str
