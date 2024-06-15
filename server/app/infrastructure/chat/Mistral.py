import os
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage

from ...domain import BaseChat

class Mistral(BaseChat):
    """
    A class to interact with the Mistral AI platform.

    ...

    Attributes
    ----------
    client : MistralClient
        An instance of the MistralClient class for making API requests.

    Methods
    -------
    __init__()
        Initializes the Mistral class by creating a MistralClient instance.

    chat(prompt: str) -> str
        Sends a chat message to the Mistral AI platform and returns the response.

    """

    def __init__(self):
        """
        Initializes the Mistral class by creating a MistralClient instance.
        The API key and model name are obtained from environment variables.
        """
        self.client = MistralClient(api_key=os.getenv("MISTRAL_API_KEY"))

    def chat(self, prompt: str) -> str:
        """
        Sends a chat message to the Mistral AI platform and returns the response.

        Parameters:
        prompt (str): The user's input message.

        Returns:
        str: The AI's response to the user's input message.
        """
        chat_response = self.client.chat(
            model=os.getenv("MODEL_NAME"),
            messages=[ChatMessage(role="user", content=f"""\n{prompt}\n""")]
        )
        
        return chat_response.choices[0].message.content