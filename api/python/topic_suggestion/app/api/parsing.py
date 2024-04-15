import re
import requests
import bs4 

garbage = ['.com', 'www', '.ru']
def parse_text_from_url(url: str):

    link_words = url.split('/')
    # remove garbage words
    link_words = [_ for _ in link_words if _ not in garbage]   
    link_words = [_ for _ in link_words if _[0] != '.']
    # parse link and extract useful text
    link_text = bs4 ... (requests.get(url))    

    return ' '.join(link_words) + link_text[...] 