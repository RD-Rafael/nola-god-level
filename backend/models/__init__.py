
from sqlalchemy import Column, Integer, String

class Customer(Base):
    __tablename__ = 'Customers'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String)

    def __repr__(self):
        return f"Customer(ie = {self.id}, name = '{self.name}')"