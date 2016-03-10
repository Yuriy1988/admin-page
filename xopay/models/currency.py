from xopay import db
from xopay.models import base, enum

__author__ = 'Omelchenko Daniel'


class Currency(base.BaseModel):

    __tablename__ = 'currency'

    id = db.Column(db.Integer, primary_key=True)
    from_currency = db.Column(db.Enum(*enum.CURRENCY_ENUM, name='enum_currency'), nullable=False)
    to_currency = db.Column(db.Enum(*enum.CURRENCY_ENUM, name='enum_currency'), nullable=False)
    rate = db.Column(db.Numeric, nullable=False)
    commit_time = db.Column(db.DateTime, nullable=False)

    def __init__(self, from_currency, to_currency, rate, commit_time):
        self.from_currency = from_currency
        self.to_currency = to_currency
        self.rate = rate
        self.commit_time = commit_time

    def __repr__(self):
        return '<Currency %r/%r (%r)>'.format(self.from_currency, self.to_currency, self.commit_time)
