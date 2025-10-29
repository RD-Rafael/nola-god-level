from db_setup import engine, Base, Session
from models import Customer
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session as DbSession
from db_setup import Session as AppSession

import crud

app = FastAPI()

def get_db():
    db = AppSession()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
async def root():
    return {"message" : "Hello World!"}


@app.get("/sales")
def get_sales_page(db: DbSession = Depends(get_db), page: int = 0, pageSize: int = 100):
    first_customer = crud.query_sales_page(db, page, pageSize)

    if first_customer is None:
        raise HTTPException(status_code = 404, detail="No customers found")

    return first_customer
