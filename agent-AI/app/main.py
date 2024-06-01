from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .mistral import *
from .config import DEBUG
from .classes import Speech

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
    return {"Status" : "Alive"}

@app.post("/hear")
async def hear(speech: Speech):
    result = test_chat_priest(speech)
    return {"NPC": "Priest", "Speech": f"{result}"}

@app.get("/hear")
async def get_hear(speech: Speech):
    print(speech)
    with open("data/heard_conversation_"+Speech.firstname+'_'+Speech.lastname+'.txt', 'a') as file:
        file.write("\n"+Speech.speaker+ ' ; ' + Speech.distance + ';' + Speech.content)


