from copy import deepcopy

from api import db
from api.models import base, enum, user as user_model

__author__ = 'Kostel Serhii'


class MerchantAccount(base.BaseModel):

    __tablename__ = 'merchant_account'

    id = db.Column(db.Integer, primary_key=True)
    bank_name = db.Column(db.String(255), nullable=False)
    checking_account = db.Column(db.String(24), nullable=False)
    currency = db.Column(db.Enum(*enum.CURRENCY_ENUM, name='enum_currency'), default='USD', nullable=False)
    mfo = db.Column(db.String(6), nullable=False)
    okpo = db.Column(db.String(8), nullable=False)

    merchant_id = db.Column(db.String, db.ForeignKey('merchant.id', ondelete='CASCADE'), nullable=False)

    def __init__(self, bank_name, checking_account, currency, mfo, okpo):
        self.bank_name = bank_name
        self.checking_account = checking_account
        self.currency = currency
        self.mfo = mfo
        self.okpo = okpo

    def __repr__(self):
        return '<MerchantAccount %r>' % self.id


class MerchantInfo(base.BaseModel):

    __tablename__ = 'merchant_info'

    id = db.Column(db.Integer, primary_key=True)
    address = db.Column(db.String(320))
    director_name = db.Column(db.String(100))

    merchant_id = db.Column(db.String, db.ForeignKey('merchant.id', ondelete='CASCADE'), nullable=False)

    def __init__(self, address=None, director_name=None):
        self.address = address
        self.director_name = director_name

    def __repr__(self):
        return '<MerchantInfo %r>' % self.id


class Merchant(base.BaseModel):
    """
    Merchant model.
    Has One-To-One connection to MerchantAccount, MerchantInfo and User models.
    Use 'joined' connection, that load current model and one-to-one models in a single request.
    Use ondelete='CASCADE', that delete one-to-one models when current model deleted, or
    one-to-one model lose his parent.
    """

    __tablename__ = 'merchant'

    id = db.Column(db.String, primary_key=True, default=base.uuid_id)
    merchant_name = db.Column(db.String(32), nullable=False, unique=True)

    merchant_account = db.relationship('MerchantAccount', backref='merchant', uselist=False, lazy='joined')
    merchant_info = db.relationship('MerchantInfo', backref='merchant', uselist=False, lazy='joined')
    user = db.relationship('User', backref='merchant', uselist=False, lazy='joined')

    managers = db.relationship('Manager', backref="merchant")
    stores = db.relationship('Store', backref="merchant")

    def __init__(self, merchant_name, merchant_account, merchant_info, user):
        self.merchant_name = merchant_name
        self.merchant_account = merchant_account
        self.merchant_info = merchant_info
        self.user = user

    def __repr__(self):
        return '<Merchant %r>' % self.merchant_name

    @classmethod
    def create(cls, data, add_to_db=True):
        data = deepcopy(data)

        merchant_account_data = data.pop('merchant_account', {})
        merchant_info_data = data.pop('merchant_info', {})
        user_data = data.pop('user', {})

        data['merchant_account'] = MerchantAccount.create(merchant_account_data)
        data['merchant_info'] = MerchantInfo.create(merchant_info_data)
        data['user'] = user_model.User.create(user_data)

        merchant = super(Merchant, cls).create(data)
        return merchant

    def update(self, data, add_to_db=True):
        data = deepcopy(data)

        merchant_account_data = data.pop('merchant_account', {})
        merchant_info_data = data.pop('merchant_info', {})
        user_data = data.pop('user', {})

        self.merchant_account.update(merchant_account_data)
        self.merchant_info.update(merchant_info_data)
        self.user.update(user_data)

        super(Merchant, self).update(data)
