from typing import Union
from os import environ


from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return {"OPENAI_API_KEY": environ.get("OPENAI_API_KEY")}
    return {"Hello": "World"}
