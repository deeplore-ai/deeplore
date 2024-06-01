from fastapi import FastAPI
from .mistral import *
from .config import DEBUG

app = FastAPI()


@app.get("/", tags=["root"])
async def root():
    result = test_chat_priest()
    return {"NPC": "Priest", "Speech": f"{result}"}
