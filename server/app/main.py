from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from concurrent.futures import ThreadPoolExecutor
import asyncio
from .mistral import *
from .config import DEBUG
from .classes import Speech
#from .gemini import chat_gemini
#from .langchain import *
from .langchain_hugging_face import chat_langchain_hugging_face

##### API #################################
origins = ["*"]
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

##### Nombre de workers ###################
executor = ThreadPoolExecutor(max_workers=8)
loop = asyncio.get_event_loop()

@app.get("/", tags=["root"])
async def root():
    """
    This function is a FastAPI endpoint that returns a simple status message.

    Parameters:
    None

    Returns:
    dict: A dictionary containing a single key-value pair, where the key is "Status" and the value is "Alive".

    Raises:
    None
    """
    return {"Status" : "Alive"}

@app.post("/hear/{model}")
async def hear(speech: Speech, model: str): # TODO move npc to listener
    """
    This function handles the '/hear/{model}' endpoint. It simulates an NPC hearing a speech and responding.

    Parameters:
    speech (Speech): An instance of the Speech class representing the speech heard by the NPC.
    model (str): A string representing the NLP model to use for generating the response.

    Returns:
    dict: A dictionary containing the NPC's name, the speaker's name, and the NPC's response.

    Raises:
    None
    """
    # create a variable using to create files 
    var = speech.firstname+'_'+speech.lastname + '_' + speech.id + '.txt'    

    # Store the speech heard by the NPC in a file
    with open("data/provisoire/heard_conversation_" + var, 'a') as f:
        f.write("\n"+speech.speaker+ " ; " + speech.distance + ' ; ' + speech.content)

    # Get the NPC's response to the speech if needed    
    if not speech.noAnswerExpected:
        open("data/provisoire/conversations_" + var, 'a').close() # create the file if it doesn't exist

        # Get the NPC's response to the speech using the specified NLP model
        if "gemini" in model:
            pass
            #result = await loop.run_in_executor(executor,chat_gemini,speech, model)
        elif model == "LangChain":
            pass
            #result = await loop.run_in_executor(executor,chat_langchain,speech)
        elif "mistral" in model:
            result = await loop.run_in_executor(executor,chat,speech, model)
        else:
            result = await loop.run_in_executor(executor,chat_langchain_hugging_face, speech)

        # Store the NPC's response to the speech in a file 
        with open("data/provisoire/conversations_" + var, 'a') as f:
            f.write("\n"+speech.speaker+ ' : ' + speech.content)
            f.write("\n" + speech.firstname+ ' ' + speech.lastname + ':' + result)
    
    # Return the NPC's name, the speaker's name, and the NPC's response
        return {"NPC": speech.speaker,"Speaker": f"{speech.firstname} {speech.lastname}", "Speech": f"{result}"}
    else:
        return {"NPC": speech.speaker,"Speaker": f"{speech.firstname} {speech.lastname}", "Speech": ""}

@app.get("/files/{file}")
async def get_file(file: str):
    """
    This function is used to retrieve a file from the specified path.

    Parameters:
    file (str): The name of the file to retrieve. The file should be located in the "data/provisoire/" directory.

    Returns:
    str: The content of the file if it exists. If the file does not exist, an empty string is returned.

    Raises:
    FileNotFoundError: If the specified file does not exist in the directory.
    """
    with open("data/provisoire/"+file, 'r') as f:
        return f.read()


# print(chat_langchain(test_speech()))
