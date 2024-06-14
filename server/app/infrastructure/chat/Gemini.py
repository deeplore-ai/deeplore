import os
import google.generativeai as genai

from ...domain import BaseChat

class Gemini(BaseChat):
    def __init__(self):
        genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
    
    def chat(self, prompt: str):
        model = genai.GenerativeModel(model_name=os.getenv("MODEL_NAME"))
        chat_response = model.generate_content(f"""\n{prompt} \n""")
        return chat_response.text