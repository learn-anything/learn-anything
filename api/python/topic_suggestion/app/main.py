from typing import List
from fastapi import FastAPI

import api.db as db
import api.parsing as parsing
import api.queries as queries
import api.ranking as ranking
from api.schemas import Topic

app = FastAPI()
available_topics = []
available_texts = []

@app.on_event("startup")
async def startup():
    # await db.edgedb.connect()
    pass

@app.on_event("shutdown")
async def shutdown():
    # await db.edgedb.disconnect()
    pass

@app.get("/suggest-topics/")
async def suggest_topics(url: str, k: int) -> List[str]:
    parsed_text = parsing.parse_text_from_url(url)
    close_topics_ids = ranking.get_nearest_topics(parsed_text, available_texts, k)
    return [available_topics[i] for i in close_topics_ids]

@app.post("/update_texts/")
async def update_texts() -> str:
    global available_texts, available_topics
    topics_dict = await queries.fetch_available_texts()
    available_texts = [i['topic_name'] for i in topics_dict]
    available_topics = [i['topic_name'] for i in topics_dict]
    return "TEXTS UPDATED"
