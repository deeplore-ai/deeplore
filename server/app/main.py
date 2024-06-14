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
    if speech.noAnswerExpected:
        datastore.hear(speech)
        return
    
    prompt = getPrompt(speech)
    result = await loop.run_in_executor(executor, chat.chat, prompt)

    answer_speech = speech.answer_speech(result)

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
