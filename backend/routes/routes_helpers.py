from motor.motor_asyncio import AsyncIOMotorCollection

REVIEWS_TO_LIST_STEP = {"$objectToArray": {"$ifNull": ["$reviews", {}]}}
METADATA_PIPELINE_PROJECT = {
    "_id": 0,
    "email": 1,
    "code": 1,
    "sem": 1,
    "profs": 1,
    "name": 1,
    "reviews_metadata": {
        "num_reviews": {"$size": REVIEWS_TO_LIST_STEP},
        "newest_dtime": {
            "$max": {
                "$map": {
                    "input": REVIEWS_TO_LIST_STEP,
                    "as": "entry",
                    "in": "$$entry.v.dtime",
                },
            },
        },
        "avg_rating": {
            "$avg": {
                "$map": {
                    "input": REVIEWS_TO_LIST_STEP,
                    "as": "entry",
                    "in": "$$entry.v.rating",
                },
            },
        },
    },
}


def get_list_with_metadata(collection: AsyncIOMotorCollection):
    return collection.aggregate([{"$project": METADATA_PIPELINE_PROJECT}])
