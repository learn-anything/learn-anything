from typing import List
from fastapi import Header, APIRouter

from app.api.models import Topic
from app.api import db_manager

topics = APIRouter()

@topics.get('/', response_model=List[Topic])
async def return_all_topics():
    return await db_manager.get_all_movies()