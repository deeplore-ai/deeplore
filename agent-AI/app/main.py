from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from concurrent.futures import ThreadPoolExecutor
import asyncio
from .mistral import *
from .config import DEBUG
from .classes import Speech
from .utils import getPrompt
from .gemini import chat_gemini
from .langchain_test import *
from .gemini_flash import chat_gemini_flash


origins = ["*"]
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
executor = ThreadPoolExecutor(max_workers=8)

@app.get("/", tags=["root"])
async def root():
    return {"Status" : "Alive"}

@app.post("/hear")
async def hear(speech: Speech): # TODO move npc to listener
    with open("data/heard_conversation_"+speech.firstname+'_'+speech.lastname+'.txt', 'a') as f:
        f.write("\n"+speech.speaker+ " ; " + speech.distance + ' ; ' + speech.content)
    result = chat(speech)
    with open("data/conversations_"+speech.firstname+'_'+speech.lastname+'.txt', 'a') as f:
        f.write("\n"+speech.speaker+ ' : ' + speech.content)
        f.write("\n" + speech.firstname+ ' ' + speech.lastname + ':' + result)
    return {"NPC": speech.speaker,"Speaker": f"{speech.firstname} {speech.lastname}", "Speech": f"{result}"}

@app.get("/files/{file}")
async def get_file(file: str):
    with open("data/"+file, 'r') as f:
        return f.read()



@app.post("/hearGemini")
async def hearGemini(speech: Speech):
    with open("data/heard_conversation_"+speech.firstname+'_'+speech.lastname+'.txt', 'a') as f:
        f.write("\n" + speech.speaker+ " ; " + speech.distance + ' ; ' + speech.content)
    result = chat_gemini(speech)
    with open("data/conversations_"+speech.firstname+'_'+speech.lastname+'.txt', 'a') as f:
        f.write("\n" + speech.speaker+ ' : ' + speech.content)
        f.write("\n" + speech.firstname+ ' ' + speech.lastname + ':' + result)
    return {"NPC": speech.speaker,"Speaker": f"{speech.firstname} {speech.lastname}", "Speech": f"{result}"}

@app.post("/hearGeminiFlash")
async def hearGemini(speech: Speech):
    with open("data/heard_conversation_"+speech.firstname+'_'+speech.lastname+'.txt', 'a') as f:
        f.write("\n" + speech.speaker+ " ; " + speech.distance + ' ; ' + speech.content)
    result = chat_gemini_flash(speech)
    with open("data/conversations_"+speech.firstname+'_'+speech.lastname+'.txt', 'a') as f:
        f.write("\n" + speech.speaker+ ' : ' + speech.content)
        f.write("\n" + speech.firstname+ ' ' + speech.lastname + ':' + result)
    return {"NPC": speech.speaker,"Speaker": f"{speech.firstname} {speech.lastname}", "Speech": f"{result}"}


@app.post("/hearLangchain")
async def hearLangchain(speech: Speech): 
    with open("data/heard_conversation_"+speech.firstname+'_'+speech.lastname+'.txt', 'a') as f:
        f.write("\n"+speech.speaker+ " ; " + speech.distance + ' ; ' + speech.content)
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(executor, chat_langchain, speech)
    with open("data/conversations_"+speech.firstname+'_'+speech.lastname+'.txt', 'a') as f:
        f.write("\n"+speech.speaker+ ' : ' + speech.content)
        f.write("\n" + speech.firstname+ ' ' + speech.lastname + ':' + result)
    return {"NPC": speech.speaker,"Speaker": f"{speech.firstname} {speech.lastname}", "Speech": f"{result}"}


# print(chat_langchain(test_speech()))
