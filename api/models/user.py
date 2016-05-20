from passlib.apps import custom_app_context as pwd_context

from api import db, auth
from api.models import base, enum

__author__ = 'Kostel Serhii'


class UserGroup(base.BaseModel):
    """
    User to Group connection model.
    User receives access according to the group.
    User can be added to the admin or system group only manually.
    """

    __tablename__ = 'user_group'

    id = db.Column(db.String, primary_key=True, default=base.uuid_id)

    user_id = db.Column(db.String, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    group_name = db.Column(db.Enum(*enum.USER_GROUP_ENUM, name='enum_group'), nullable=False)

    # unique together
    __table_args__ = (db.UniqueConstraint('group_name', 'user_id', name='_user_group_unique'),)

    def __init__(self, group_name):
        # self.user_id = user_id
        self.group_name = group_name

    def __repr__(self):
        return '<UserGroup [%r, %r]>' % (self.user_id, self.group)


class User(base.BaseModel):
    """
    User model.
    User model can be created by another user with blank password.
    While password blank - user is not activated.
    """
    # admin and system must be always enabled
    _always_enabled_groups = {'admin', 'system'}

    __tablename__ = 'user'

    id = db.Column(db.String, primary_key=True, default=base.uuid_id)
    username = db.Column(db.String(80), nullable=False, unique=True, index=True)
    _password_hash = db.Column('password_hash', db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)

    _groups = db.relationship('UserGroup', backref='user')

    first_name = db.Column(db.String(80))
    last_name = db.Column(db.String(80))

    phone = db.Column(db.String(16))
    notify = db.Column(db.Enum(*enum.USER_NOTIFY_ENUM, name='enum_user_notify'), nullable=False, default='NONE')

    _enabled = db.Column('enabled', db.Boolean, nullable=False, default=False)

    created = db.Column(db.DateTime(timezone=True), server_default=base.now_dt)

    merchant_id = db.Column(db.String, db.ForeignKey('merchant.id', ondelete='CASCADE'))
    manager_id = db.Column(db.String, db.ForeignKey('manager.id', ondelete='CASCADE'))

    def __init__(self, username, email, password='', enabled=False,
                 first_name=None, last_name=None, phone=None, notify=None):
        self.id = base.uuid_id()
        self.username = username
        self.set_password(password)
        self.email = email
        self.first_name = first_name
        self.last_name = last_name
        self.phone = phone
        self.notify = notify
        self.enabled = enabled

    def __repr__(self):
        return '<User %r>' % self.username

    def set_password(self, password):
        auth.remove_all_sessions(self.id)
        self._password_hash = pwd_context.encrypt(password)

    def check_password(self, password):
        return pwd_context.verify(password, self._password_hash)

    def is_activated(self):
        """ User is activated, if his password is not blank """
        return not self.check_password('')

    @property
    def enabled(self):
        return self._enabled and self.is_activated()

    @enabled.setter
    def enabled(self, value):
        self._enabled = True if set(self.groups) & self._always_enabled_groups else value

    @property
    def groups(self):
        return list(grp.group_name for grp in self._groups)

    def add_to_group(self, group_name):
        if group_name in self._always_enabled_groups:
            self._enabled = True
        self._groups.append(UserGroup(group_name))

    def remove_from_group(self, group_name):
        self._groups.query.filter_by(group_name=group_name).delete()

    def get_full_name(self):
        return ' '.join((self.first_name, self.last_name)).strip() or self.username
