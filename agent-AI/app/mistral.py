from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage
from .config import MISTRAL_API_KEY, DEBUG
from .classes import Speech
from .utils import getPrompt

model = "mistral-large-latest"

client = MistralClient(api_key=MISTRAL_API_KEY)

test_policeman_diag = "Hello, I am a policeman, I am investigating on a murder in the town. Did you see or hear something strange ?"

mancini = open('data/mancini.txt', 'r')
dubois = open('data/dubois.txt', 'r')

def test_chat_priest(speech: Speech):
    chat_response = client.chat(
        model=model,
        messages=[ChatMessage(role="user", content=f"""
                            Respond in french. 
                            You are a non playable character in a murder story game. 
                            You are {speech.npc} of the town and you saw at strange people last night running in the streets with a knife. 
                            You respond to {speech.speaker} who says : "{speech.content}" """)]
        )
    if DEBUG :
        print(chat_response)
    return chat_response.choices[0].message.content

    
def chat(speech: Speech):
    
    
    
    chat_response = client.chat(
        model=model,
        messages=[ChatMessage(role="user", content=f"""
                           {getPrompt(speech)} \n
                            You respond to {speech.speaker} who says : "{speech.content}" """)]
        )
    if DEBUG :
        print(chat_response)
    return chat_response.choices[0].message.content
    