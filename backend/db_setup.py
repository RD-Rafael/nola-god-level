import sqlalchemy as sa
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

import os


DB_HOST : str = os.environ.get("DB_HOST") or ""
DB_NAME : str = os.environ.get("DB_NAME") or ""
DB_USER : str = os.environ.get("DB_USER") or ""
DB_PASS : str = os.environ.get("DB_PASS") or ""

db_url : str = "postgresql+psycopg2://" + DB_USER + ":" + DB_PASS + "@" + DB_HOST + ":5432/" + DB_NAME
engine = create_engine(db_url)

Base = declarative_base()

Session = sessionmaker(bind=engine)