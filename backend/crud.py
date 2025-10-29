from sqlalchemy.orm import Session
from sqlalchemy import select
from models import Customer, Sale

def query_sales_page(db: Session, page: int = 0, pageSize: int = 100) -> Sale | None:
    pageSize = max(min(1000, pageSize), 10)
    return db.query(Sale).offset(page*pageSize).limit(pageSize).all()
    