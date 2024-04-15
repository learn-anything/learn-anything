import asyncio

from api.schemas import Topic
from api.db import edgedb

async def fetch_available_texts():
    # query = Topics.select()
    # return await edgedb.fetch_all(query)
    return [
    {"topic_name": "Artificial Intelligence", "description": "The simulation of human intelligence processes by machines, especially computer systems."},
    {"topic_name": "Machine Learning", "description": "A subset of artificial intelligence that provides systems the ability to automatically learn and improve from experience without being explicitly programmed."},
    {"topic_name": "Deep Learning", "description": "A subset of machine learning where artificial neural networks with multiple layers are used to model and analyze complex patterns in data."},
    {"topic_name": "Natural Language Processing", "description": "A field of artificial intelligence concerned with the interaction between computers and humans in natural language."},
    {"topic_name": "Computer Vision", "description": "A field of computer science that deals with how computers can gain high-level understanding from digital images or videos."},
    {"topic_name": "Robotics", "description": "The interdisciplinary branch of engineering and science that includes mechanical engineering, electronics engineering, computer science, and others."},
    {"topic_name": "Data Science", "description": "A multi-disciplinary field that uses scientific methods, processes, algorithms, and systems to extract knowledge and insights from structured and unstructured data."},
    {"topic_name": "Blockchain", "description": "A decentralized, distributed ledger technology that records the provenance of a digital asset."},
    ]