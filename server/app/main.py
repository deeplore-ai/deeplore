from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .model.mistral import *
from .config import DEBUG
from .classes import PeopleList, Speech
from .model.gemini import chat_gemini
from .model.langchain import *
from .dependencies import datastore, executor, loop

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
    return {"Status": "Alive"}

@app.post("/initialize")
async def initialize(personList: PeopleList):
    await datastore.start_session(personList)
    return


@app.post("/hear/{model}")
async def hear(speech: Speech, model: str):
    if speech.noAnswerExpected:
        await datastore.hear(speech)
        return
    
    # Get the NPC's response to the speech using the specified NLP model
    if model == "Gemini":
        result = await loop.run_in_executor(executor, chat_gemini, speech)
    elif model == "LangChain":
        result = await chat_langchain(speech)
    else:
        result = await loop.run_in_executor(executor, chat, speech)

    answer_speech = speech.answer_speech(result)

    await datastore.converse(speech, answer_speech)

# Return the NPC's name, the speaker's name, and the NPC's response
    return {
        "NPC": answer_speech.target.fullname(), 
        "Speaker": answer_speech.speaker.fullname(), 
        "Speech": f"{answer_speech.content}"
    }
        


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
    with open("data/provisoire/"+file, 'r', encoding='utf-8') as f:
        return f.read()
