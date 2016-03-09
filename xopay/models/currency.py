import datetime

from xopay import db
from xopay.models import base

__author__ = 'Omelchenko Daniel'


class Currency(base.BaseModel):

    __tablename__ = 'currency'

    id = db.Column(db.Integer, primary_key=True)
    from_currency = db.Column(db.String(3))
    to_currency = db.Column(db.String(3))
    rate = db.Column(db.Float)
    commit_time = db.Column(db.DateTime)

    def __init__(self, from_currency, to_currency, rate, commit_time=datetime.datetime.utcnow()):
        self.from_currency = from_currency
        self.to_currency = to_currency
        self.rate = rate
        self.commit_time = commit_time

    def __repr__(self):
        return '{}/{}:\t {}'.format(self.from_currency, self.to_currency, self.rate)
