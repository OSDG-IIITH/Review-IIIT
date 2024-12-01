from datetime import datetime, timezone
from typing import Literal, TypeAlias

from pydantic import BaseModel, Field

# List of valid semesters. M for monsoon and S for spring. The number after it
# represents the year
Sem: TypeAlias = Literal["S25", "M24", "S24", "M23", "S23", "M22"]


class Review(BaseModel):
    """
    Base class to represent a review
    """

    rating: Literal[1, 2, 3, 4, 5]
    content: str = Field(..., min_length=1)
    dtime: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    # TODO: upvote/downvote system
    # upvoters: set[str]  # set of student emails
    # downvoters: set[str]  # set of student emails


class Member(BaseModel):
    """
    Base class for representing a Member, can be a Student or Prof
    """

    name: str = Field(..., min_length=1)
    email: str = Field(..., min_length=1)


class Student(Member):
    """
    Class for storing a student
    """

    rollno: str = Field(..., min_length=1)


class Prof(Member):
    """
    Class for storing a Prof
    """


class Course(BaseModel):
    """
    Represents a Course.
    The code-sem combination is the ID for every course.
    """

    code: str = Field(..., min_length=1)
    sem: Sem
    name: str = Field(..., min_length=1)
    profs: list[str]  # list of prof emails
