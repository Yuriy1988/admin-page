from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

from xopay import app

db = SQLAlchemy(app)


class User(db.Model):

    NOTIFICATION_TYPE = ('sms', 'email')

    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(32), nullable=False)
    password = db.Column(db.String(32), nullable=False)
    last_name = db.Column(db.String(32), nullable=True)
    first_name = db.Column(db.String(32), nullable=True)
    email = db.Column(db.String(32), nullable=True)
    phone = db.Column(db.String(32), nullable=True)
    notify = db.Column(db.Enum(NOTIFICATION_TYPE))
    active = db.Column(db.Boolean, default=True)
    last_login = db.Column(db.DateTime)
    created = db.Column(db.DateTime, default=datetime.now())
    merchant = db.relationship("Merchant", uselist=False, back_populates="user")
    manager = db.relationship("Manager", uselist=False, back_populates="user")

    def __repr__(self):
        return '<User %r>' % self.username