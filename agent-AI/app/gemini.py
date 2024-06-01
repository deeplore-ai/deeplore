import os
from .utils import getPrompt
from google.colab import userdata

import pathlib
import textwrap

import google.generativeai as genai

from IPython.display import display
from IPython.display import Markdown


def to_markdown(text):
  text = text.replace('•', '  *')
  return Markdown(textwrap.indent(text, '> ', predicate=lambda _: True))

GOOGLE_API_KEY=userdata.get('GOOGLE_API_KEY')


genai.configure(api_key=GOOGLE_API_KEY)

model = genai.GenerativeModel(name='gemini-pro')

def chat_gemini(speech: Speech):
    chat_response = model.generate_content(getPrompt(speech))  
    if DEBUG :
        print(chat_response)
    return chat_response.text