import uuid
import pytz
from datetime import datetime
from passlib.apps import custom_app_context as pwd_context

from xopay import db
from xopay.models import base, enum

__author__ = 'Kostel Serhii'


class User(base.BaseModel):
    """
    User model.
    User model can be created by another user with blank password.
    While password blank - user is not activated.
    """

    __tablename__ = 'user'

    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    username = db.Column(db.String(80), nullable=False, unique=True, index=True)
    _password_hash = db.Column('password_hash', db.String(255), nullable=False)

    first_name = db.Column(db.String(80))
    last_name = db.Column(db.String(80))

    email = db.Column(db.String(255))
    phone = db.Column(db.String(16))
    notify = db.Column(db.Enum(*enum.USER_NOTIFY_ENUM, name='enum_user_notify'), nullable=False, default='NONE')

    enabled = db.Column(db.Boolean, nullable=False, default=False)

    created = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(tz=pytz.utc))

    def __init__(self, username, password='', enabled=False,
                 first_name=None, last_name=None, email=None, phone=None, notify=None):
        self.username = username
        self.set_password(password)
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.phone = phone
        self.notify = notify
        self.enabled = enabled

    def __repr__(self):
        return '<User %r>' % self.username

    def set_password(self, password):
        self._password_hash = pwd_context.encrypt(password)

    def check_password(self, password):
        return pwd_context.verify(password, self._password_hash)

    def is_activated(self):
        """ User is activated, if his password is not blank """
        return not self.check_password('')

    def is_enabled(self):
        return self.enabled
