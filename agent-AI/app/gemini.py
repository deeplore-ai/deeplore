import os
from .utils import getPrompt
from .config import GOOGLE_API_KEY, DEBUG
import pathlib
import textwrap
from .classes import Speech

import google.generativeai as genai

from IPython.display import display
from IPython.display import Markdown


def to_markdown(text):
  text = text.replace('•', '  *')
  return Markdown(textwrap.indent(text, '> ', predicate=lambda _: True))



genai.configure(api_key=GOOGLE_API_KEY)

model = genai.GenerativeModel(model_name='gemini-1.5-pro-latest')

def chat_gemini(speech: Speech):
    chat_response = model.generate_content(f"""
                           {getPrompt(speech)} \n
                            """)  
    if DEBUG :
        print(chat_response)
    return chat_response.text