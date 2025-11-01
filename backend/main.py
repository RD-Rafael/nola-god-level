from db_setup import engine, Base, Session
from models import Customer
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session as DbSession
from db_setup import Session as AppSession
import crud
from crud import MetricPeriod


from enum import Enum
class AggFunc(str, Enum):
    SUM = "sum"
    AVG = "avg"
    COUNT = "count"

class ValueType(str, Enum):
    FATURAMENTO = "faturamento"
    QTD_PEDIDOS = "quantidadePedidos"
    ITENS_VENDIDOS = "itensVendidos"
    TEMPO_ENTREGA = "tempoDeEntrega"
    TICKET_MEDIO = "ticketMedio"

class MetricType(str, Enum):
    GRAPH = "graph"
    SINGULAR = "singular"


app = FastAPI(
    title="GodLevel Challenge 2025",
)


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

@app.get("/data")
def get_data(
    db: DbSession = Depends(get_db),
period: MetricPeriod = Query(MetricPeriod.MONTH, description="Período de agrupamento (day, week, month, etc.)"),
    count: int = Query(30, description="Número de períodos/dias/semanas a considerar"),
    aggregateFunction: AggFunc = Query(AggFunc.SUM, description="Função de agregação (sum, avg, count)"),
    storeList: list[int] = Query(default=[], description="Lista de IDs de lojas para filtrar. Vazio = todas as lojas."),
    valueType: ValueType = Query(ValueType.FATURAMENTO, description="A métrica principal a ser calculada."),
    metricType: MetricType = Query(MetricType.GRAPH, description="Formato do retorno: 'graph' (série temporal) ou 'single' (valor único)")
):
    """
    Endpoint principal para consulta de métricas de vendas.
    
    Este endpoint é altamente dinâmico e permite consultar diferentes
    métricas (como faturamento, ticket médio, etc.) agrupadas por
    períodos de tempo e filtradas por lojas.
    """

    result = crud.metric_query(
        db, 
        period=period, 
        count=count, 
        aggregateFunction=aggregateFunction.value,
        storeList=storeList, 
        valueType=valueType.value, 
        metricType=metricType.value
    )

    if not result:
        raise HTTPException(status_code=404, detail="No data found")
    return result

@app.get("/stores")
def get_stores(db: DbSession = Depends(get_db)):
    stores = crud.stores_names_query(db)

    if stores is None:
        raise HTTPException(status_code = 404, detail="No stores found")
    
    """
    Retorna uma lista de todos os nomes das lojas disponíveis no banco de dados.
    """

    return stores