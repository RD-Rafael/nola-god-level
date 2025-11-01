from db_setup import engine, Base, Session
from models import Customer
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session as DbSession
from db_setup import Session as AppSession



import crud
from crud import MetricPeriod

app = FastAPI()


origins = [
    "http://localhost:3000",
    "http://backend:3000", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,             # Allows specified origins
    allow_credentials=True,            # Allows cookies and authentication headers
    allow_methods=["*"],               # Allows all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],               # Allows all headers
)

def get_db():
    db = AppSession()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
async def root():
    return {"message" : "Hello World!"}


@app.get("/data")
def get_data(
    db: DbSession = Depends(get_db),
    period: str = "month",
    count: int = 30,
    aggregateFunction: str = "sum",
    storeList: list[int] = Query(default=[]),
    valueType: str = "faturamento",
    metricType: str = "graph"
):
    match period:
        case "day":
            period = MetricPeriod.DAY
        case "week":
            period = MetricPeriod.WEEK
        case "month":
            period = MetricPeriod.MONTH
        case "quarter":
            period = MetricPeriod.QUARTER
        case "year":
            period = MetricPeriod.YEAR
        case default:
            period = MetricPeriod.MONTH

    period_enum = MetricPeriod(period)
    result = crud.metric_query(db, period_enum, count, aggregateFunction, storeList, valueType, metricType)
    if not result:
        raise HTTPException(status_code=404, detail="No data found")
    return result

@app.get("/stores")
def get_stores(db: DbSession = Depends(get_db)):
    stores = crud.stores_names_query(db)

    if stores is None:
        raise HTTPException(status_code = 404, detail="No stores found")
    
    return stores