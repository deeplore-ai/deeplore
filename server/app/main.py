from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .utils import getPrompt

from .config import DEBUG
from .domain import Speech, PeopleList
from .dependencies import datastore, executor, loop, chat

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
    return {"Status": "Alive"}


@app.post("/initialize")
async def initialize(personList: PeopleList):
    datastore.start_session(personList)
    return


@app.post("/hear")
async def hear(speech: Speech):
    """
    This function handles the 'hear' endpoint. It processes the incoming speech,
    generates a prompt, sends it to the chat model, and updates the datastore.

    Parameters:
    speech (Speech): An instance of Speech class containing the speaker's information and content.

    Returns:
    dict: A dictionary containing the NPC's name, the speaker's name, and the NPC's response.
    """

    # If no answer is expected, just store the speech in the datastore and return
    if speech.noAnswerExpected:
        datastore.hear(speech)
        return
    
    # Generate a prompt based on the incoming speech
    prompt = getPrompt(speech)
    
    # Send the prompt to the chat model using an executor and await the result
    result = await loop.run_in_executor(executor, chat.chat, prompt)

    # Create a new Speech instance for the NPC's response
    answer_speech = speech.answer_speech(result)

    # Update the datastore with the conversation
    datastore.converse(speech, answer_speech)

    # Return the NPC's name, the speaker's name, and the NPC's response
    return {
        "NPC": answer_speech.target.fullname(), 
        "Speaker": answer_speech.speaker.fullname(), 
        "Speech": f"{answer_speech.content}"
    }
        

@app.get("/files/{file}")
async def get_file(file: str):
    with open("data/provisoire/"+file, 'r', encoding='utf-8') as f:
        return f.read()
