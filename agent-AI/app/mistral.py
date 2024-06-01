from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage
from .config import MISTRAL_API_KEY, DEBUG

model = "mistral-large-latest"

client = MistralClient(api_key=MISTRAL_API_KEY)

test_policeman_diag = "Hello, I am a policeman, I am investigating on a murder in the town. Did you see or hear something strange ?"

# chat_response = client.chat(
#     model=model,
#     messages=[ChatMessage(role="user", content=f"""
#                           Respond in french. 
#                           You are a non playable character in a murder story game. 
#                           You are the priest of the town and you saw at strange people last night running in the streets with a knife. 
#                           You respond to the policeman who says : "{test_policeman_diag}" """)]
# )

# print(chat_response.choices[0].message.content)

def test_chat_priest(diag=test_policeman_diag):
    chat_response = client.chat(
        model=model,
        messages=[ChatMessage(role="user", content=f"""
                            Respond in french. 
                            You are a non playable character in a murder story game. 
                            You are the priest of the town and you saw at strange people last night running in the streets with a knife. 
                            You respond to the policeman who says : "{diag}" """)]
        )
    if DEBUG :
        print(chat_response)
    return chat_response.choices[0].message.content

    
    
    