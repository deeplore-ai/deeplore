from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage
from .config import MISTRAL_API_KEY, DEBUG
from .classes import Speech
from .utils import getPrompt

model = "mistral-large-latest"
client = MistralClient(api_key=MISTRAL_API_KEY)


def test_chat_priest(speech: Speech):
    """
    This function is used to simulate a conversation between a non-playable character (NPC) and a player in an inspector story game.
    The NPC is tasked with responding to a player's statement in French.

    Parameters:
    speech (Speech): An object containing information about the speaker, NPC, and content of the conversation.

    Returns:
    str: The NPC's response to the player's statement in French.

    Note:
    This function uses the MistralClient to interact with the Mistral AI model.
    The DEBUG flag is used to print the chat response if it is set to True.
    """
    chat_response = client.chat(
        model=model,
        messages=[ChatMessage(role="user", content=f"""
                            Respond in french. 
                            You are a non playable character in a inspector story game. 
                            You are {speech.firstname} of the town and you saw at strange people last night running in the streets looks suspect. 
                            You respond to {speech.speaker} who says : "{speech.content}" """)]
        )
    if DEBUG :
        print(chat_response)
    return chat_response.choices[0].message.content

    
def chat(speech: Speech, model="mistral-large-latest"):
    """
    This function is used to simulate a conversation between a non-playable character (NPC) and a player in an inspector story game.
    The NPC is tasked with responding to a player's statement based on the prompt generated by the getPrompt function.

    Parameters:
    speech (Speech): An object containing information about the speaker, NPC, and content of the conversation.

    Returns:
    str: The NPC's response to the player's statement.

    Note:
    This function uses the MistralClient to interact with the Mistral AI model.
    The DEBUG flag is used to print the chat response if it is set to True.
    """
    chat_response = client.chat(
        model=model,
        messages=[ChatMessage(role="user", content=f"""
                           {getPrompt(speech)} 
                            """)]
        )
    if DEBUG :
        print(chat_response)
    return chat_response.choices[0].message.content
    