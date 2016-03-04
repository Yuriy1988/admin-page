from sqlalchemy import Column, Integer, String, Float, DateTime, create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base


from config import SQLALCHEMY_DATABASE_URI


Base = declarative_base()


def get_db_sesion():
    engine = create_engine(SQLALCHEMY_DATABASE_URI)
    Base.metadata.bind = engine
    db_session = sessionmaker(bind=engine)
    return db_session()


class Currency(Base):

    __tablename__ = 'currency'

    id = Column(Integer, primary_key=True)
    base_ccy = Column(String(3))
    ccy = Column(String(3))
    sale = Column(Float)
    buy = Column(Float)
    commit_time = Column(DateTime)
