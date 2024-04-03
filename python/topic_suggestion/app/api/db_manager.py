import asyncio

from app.api.models import Topic
from app.api.db import Topics, edgedb

async def get_all_topics():
    query = Topics.select()
    return await edgedb.fetch_all(query)