from datetime import datetime
from passlib.apps import custom_app_context as pwd_context

from xopay import db


class User(db.Model):

    NOTIFICATION_TYPE = ['sms', 'email']

    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(32), nullable=False, index=True)
    password = db.Column(db.String(128), nullable=False)
    last_name = db.Column(db.String(32), nullable=True)
    first_name = db.Column(db.String(32), nullable=True)
    email = db.Column(db.String(32), nullable=True)
    phone = db.Column(db.String(32), nullable=True)
    notify = db.Column(db.Enum(*NOTIFICATION_TYPE))
    active = db.Column(db.Boolean, default=True)
    last_login = db.Column(db.DateTime)
    created = db.Column(db.DateTime, default=datetime.now())
    merchant_id = db.Column(db.Integer, db.ForeignKey('merchant.id'), nullable=True)
    manager_id = db.Column(db.Integer, db.ForeignKey('manager.id'), nullable=True)
    merchant = db.relationship("Merchant", uselist=False, back_populates="user")
    manager = db.relationship("Manager", uselist=False, back_populates="user")

    def __repr__(self):
        return '<User %r>' % self.username

    def hash_password(self, password):
        self.password = pwd_context.encrypt(password)

    def verify_password(self, password):
        return pwd_context.verify(password, self.password)

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return str(self.id)





