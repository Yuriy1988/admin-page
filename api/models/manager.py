from copy import deepcopy

from api import db
from api.models import base, user as user_model

__author__ = 'Kostel Serhii'


class Manager(base.BaseModel):

    __tablename__ = 'manager'

    id = db.Column(db.String, primary_key=True, default=base.uuid_id)

    user = db.relationship('User', backref='manager', uselist=False, lazy='joined')

    merchant_id = db.Column(db.String, db.ForeignKey('merchant.id', ondelete='CASCADE'), nullable=False)

    def __init__(self, user, merchant_id):
        self.user = user
        self.merchant_id = merchant_id

    def __repr__(self):
        return '<Manager %r>' % self.id

    @classmethod
    def create(cls, data, add_to_db=True):
        data = deepcopy(data)

        user_data = data.pop('user', {})
        data['user'] = user_model.User.create(user_data)

        manager = super(Manager, cls).create(data)
        return manager

    def update(self, data, add_to_db=True):
        data = deepcopy(data)

        user_data = data.pop('user', {})
        self.user.update(user_data)

        super(Manager, self).update(data)
