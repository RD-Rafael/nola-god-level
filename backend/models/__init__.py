
from sqlalchemy import Column, Integer, String
from sqlalchemy.types import  TIMESTAMP, DECIMAL
from db_setup import Base


class Customer(Base):
    __tablename__ = 'customers'
    id = Column(Integer, primary_key=True)
    customer_name = Column(String)
    email = Column(String)

    def __repr__(self):
        return f"Customer(ie = {self.id}, name = '{self.name}')"
    

class Sale(Base):
    __tablename__ = 'sales'
    id = Column(Integer, primary_key =True)
    store_id = Column(Integer)
    sub_brand_id = Column(Integer)
    customer_id = Column(Integer)
    channel_id = Column(Integer)

    cod_sale1 = Column(String)
    created_at = Column(TIMESTAMP)

    total_amount_items = Column(DECIMAL)
    total_amount = Column(DECIMAL)
    value_paid = Column(DECIMAL)
    
    production_seconds = Column(Integer)
    delivery_seconds = Column(Integer)