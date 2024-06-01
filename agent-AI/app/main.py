from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .mistral import *
from .config import DEBUG
from .classes import Speech
from .utils import getPrompt
from .gemini import chat_gemini
from .langchain_test import *

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
async def hear(speech: Speech): # TODO move npc to listener
    with open("data/heard_conversations_"+speech.firstname+'_'+speech.lastname+'.txt', 'a') as f:
        f.write("\n"+speech.speaker+ " ; " + speech.distance + ' ; ' + speech.content)
    result = chat(speech)
    with open("data/conversations_"+speech.firstname+'_'+speech.lastname+'.txt', 'a') as f:
        f.write("\n"+speech.speaker+ ' : ' + speech.content)
        f.write("\n" + speech.firstname+ ' ' + speech.lastname + ':' + result)
    return {"NPC": speech.speaker,"Speaker": f"{speech.firstname} {speech.lastname}", "Speech": f"{result}"}


@app.post("/hearGemini")
async def hearGemini(speech: Speech):
    result = chat_gemini(speech)
    return {"NPC": speech.speaker,"Speaker": f"{speech.firstname} {speech.lastname}", "Speech": f"{result}"}


@app.post("/hearLangchain")
async def hearLangchain(speech: Speech): 
    result = chat_langchain(speech)
    with open("data/conversations_"+speech.firstname+'_'+speech.lastname+'.txt', 'a') as f:
        f.write("\n"+speech.speaker+ ' : ' + speech.content)
        f.write("\n" + speech.firstname+ ' ' + speech.lastname + ':' + result)
    return {"NPC": speech.speaker,"Speaker": f"{speech.firstname} {speech.lastname}", "Speech": f"{result}"}

print(chat_langchain(test_speech()))
