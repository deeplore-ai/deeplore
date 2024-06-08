from ..utils import getPrompt
from ..config import GOOGLE_API_KEY, DEBUG, LOCAL, MODEL_NAME
from ..classes import Speech

import google.generativeai as genai

if not LOCAL :
    try:
        genai.configure(api_key=GOOGLE_API_KEY) 
    except Exception as e:
        print(e)


def chat_gemini(speech: Speech) -> str:
    """
    This function is used to generate a chat response using the Gemini model.

    Parameters:
    speech (Speech): An instance of the Speech class containing the input text.
    model_name (str, optional): The name of the Gemini model to use. Defaults to 'gemini-1.5-pro'.

    Returns:
    str: The generated chat response.

    Note:
    This function uses the Google Generative AI library to generate the chat response.
    The input text is passed to the Gemini model, and the generated response is returned.
    If the DEBUG constant is set to True, the chat response is printed to the console.
    """

    model = genai.GenerativeModel(model_name=MODEL_NAME)
    chat_response = model.generate_content(f"""
                           {getPrompt(speech)} \n
                            """)  

    if DEBUG :
        print(chat_response)

    return chat_response.text