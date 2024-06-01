from fastapi import FastAPI
from .mistral import *


app = FastAPI()


@app.get("/", tags=["root"])
async def root():
    return {"message": "Hello World"}
