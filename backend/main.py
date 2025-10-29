from db_setup import engine, Base, Session
from models import Customer
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message" : "Hello World!"}
