from fastapi import FastAPI

app = FastAPI()


@app.get("/", tags=["root"])
async def root():
    return {"message": "Hello World"}
