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

model = genai.GenerativeModel(model_name='gemini-pro')

def chat_gemini(speech: Speech):
    chat_response = model.generate_content(f"""
                           {getPrompt(speech)} \n
                            {speech.speaker} is speaking and says : "{speech.content}" \n
                            Respond in french if needed. I only want the answer.
                            """)  
    if DEBUG :
        print(chat_response)
    return chat_response.text