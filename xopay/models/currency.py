import datetime

from xopay import db
from xopay.models import base, user

__author__ = 'Omelchenko Daniel'


class Currency(base.BaseModel):

    __tablename__ = 'currency'

    id = db.Column(db.Integer, primary_key=True)
    base_ccy = db.Column(db.String(3))
    ccy = db.Column(db.String(3))
    sale = db.Column(db.Float)
    buy = db.Column(db.Float)
    commit_time = db.Column(db.DateTime)

    def __init__(self, base_ccy, ccy, sale, buy, commit_time=datetime.datetime.utcnow()):
        self.base_ccy = base_ccy
        self.ccy = ccy
        self.sale = sale
        self.buy = buy
        self.commit_time = commit_time

    def __repr__(self):
        return '<Currency %r>' % self.id
