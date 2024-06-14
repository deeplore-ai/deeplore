import os
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage

from ...domain import BaseChat

class Mistral(BaseChat):
    def __init__(self):
        self.client = MistralClient(api_key=os.getenv("MISTRAL_API_KEY"))
    
    def chat(self, prompt: str):
        chat_response = self.client.chat(
            model=os.getenv("MODEL_NAME"),
            messages=[ChatMessage(role="user", content=f"""\n{prompt}\n""")]
        )
        
        return chat_response.choices[0].message.content