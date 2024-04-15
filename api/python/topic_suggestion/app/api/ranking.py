from typing import List

from langchain import BM25Retriever

def get_nearest_topics(text: str, available_texts: List[str], k: int):
    indixes = BM25Retriever()(text, available_texts)
    return indixes