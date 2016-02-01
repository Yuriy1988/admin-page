from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

from xopay import app

db = SQLAlchemy(app)


class StoreSettings(db.Model):

    TYPE = ("VISA_MASTERCARD", "BITCOIN", "PAYPAL")

    __tablename__ = 'store_settings'
    id = db.Column(db.Integer, primary_key=True)
    login = db.Column(db.String(32), nullable=False)
    password = db.Column(db.String(32), nullable=False)
    type = db.Column(db.Enum(TYPE))
    enabled = db.Column(db.Boolean, default=True)

    def __repr__(self):
        return '<Payment login %r>' % self.login