import google.generativeai as genai
import os
from .utils import getPrompt

genai.configure(api_key=GOOGLE_API_KEY)

model = genai.GenerativeModel(name='gemini-pro')

def chat_gemini(speech: Speech):
    chat_response = model.generate_content(getPrompt(speech))  
    if DEBUG :
        print(chat_response)
    return chat_response.text