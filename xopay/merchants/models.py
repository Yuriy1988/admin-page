from xopay.backend import db, enum, BaseModel
from xopay.users.models import User

__author__ = 'Kostel Serhii'


class MerchantAccount(BaseModel):

    __taclename__ = 'merchant_account'

    id = db.Column(db.Integer, primary_key=True)
    bank_name = db.Column(db.String(255), nullable=False)
    checking_account = db.Column(db.String(14), nullable=False)
    currency = db.Column(db.Enum(*enum.CURRENCY_ENUM), default='USD', nullable=False)
    mfo = db.Column(db.String(6), nullable=False)
    okpo = db.Column(db.String(8), nullable=False)

    def __init__(self, bank_name, checking_account, currency, mfo, okpo):
        self.bank_name = bank_name
        self.checking_account = checking_account
        self.currency = currency
        self.mfo = mfo
        self.okpo = okpo

    def __repr__(self):
        return '<MerchantAccount %r>' % self.id


class MerchantInfo(BaseModel):

    __tablename__ = 'merchant_info'

    id = db.Column(db.Integer, primary_key=True)
    address = db.Column(db.String(320))
    director_name = db.Column(db.String(100))

    def __init__(self, address=None, director_name=None):
        self.address = address
        self.director_name = director_name

    def __repr__(self):
        return '<MerchantInfo %r>' % self.id


class Merchant(BaseModel):

    __tablename__ = 'merchant'

    id = db.Column(db.Integer, primary_key=True)
    merchant_name = db.Column(db.String(32), nullable=False, unique=True)

    merchant_account_id = db.Column(db.Integer, db.ForeignKey('merchant_account.id'), nullable=False)
    merchant_account = db.relationship('MerchantAccount', backref=db.backref('merchant', uselist=False, lazy='joined'))

    merchant_info_id = db.Column(db.Integer, db.ForeignKey('merchant_info.id'), nullable=False)
    merchant_info = db.relationship('MerchantInfo', backref=db.backref('merchant', uselist=False, lazy='joined'))

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('merchant', uselist=False, lazy='joined'))

    managers = db.relationship('Manager', back_populates='merchant')
    stores = db.relationship('Store', back_populates='merchant')

    def __init__(self, merchant_name, merchant_account, merchant_info, user):
        self.merchant_name = merchant_name
        self.merchant_account = merchant_account
        self.merchant_info = merchant_info
        self.user = user

    def __repr__(self):
        return '<Merchant %r>' % self.merchant_name

    @classmethod
    def create(cls, data, add_to_db=True):
        merchant_account_data = data.pop('merchant_account', {})
        merchant_info_data = data.pop('merchant_info', {})
        user_data = data.pop('user', {})

        data['merchant_account'] = MerchantAccount.create(merchant_account_data)
        data['merchant_info'] = MerchantInfo.create(merchant_info_data)
        data['user'] = User.create(user_data)

        merchant = super(Merchant, cls).create(data)
        return merchant

    def update(self, data, add_to_db=True):
        merchant_account_data = data.pop('merchant_account', {})
        merchant_info_data = data.pop('merchant_info', {})
        user_data = data.pop('user', {})

        self.merchant_account.update(merchant_account_data)
        self.merchant_info.update(merchant_info_data)
        self.user.update(user_data)

        super(Merchant, self).update(data)


class Manager(BaseModel):

    __tablename__ = 'manager'

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('manager', uselist=False, lazy='joined'))

    merchant_id = db.Column(db.Integer, db.ForeignKey('merchant.id'), nullable=False)
    merchant = db.relationship('Merchant', back_populates='managers')

    def __init__(self, user, merchant):
        self.user = user
        self.merchant = merchant

    def __repr__(self):
        return '<Manager %r>' % self.id

    @classmethod
    def create(cls, data, add_to_db=True):
        user_data = data.pop('user', {})
        data['user'] = User.create(user_data)

        manager = super(Manager, cls).create(data)
        return manager

    def update(self, data, add_to_db=True):
        user_data = data.pop('user', {})
        self.user.update(user_data)

        super(Manager, self).update(data)


class StoreSettings(BaseModel):

    __tablename__ = 'store_settings'

    id = db.Column(db.Integer, primary_key=True)
    sign_algorithm = db.Column(db.Enum(*enum.SIGN_ALGORITHM_ENUM), default='MD5', nullable=False)
    sign_key = db.Column(db.String(127), nullable=False, unique=True)
    succeed_url = db.Column(db.String(255), nullable=False)
    failure_url = db.Column(db.String(255), nullable=False)
    commission_pct = db.Column(db.Numeric(precision=2, scale=4), nullable=False)

    def __init__(self, sign_algorithm, sign_key, succeed_url, failure_url, commission_pct):
        self.sign_algorithm = sign_algorithm
        self.sign_key = sign_key
        self.succeed_url = succeed_url
        self.failure_url = failure_url
        self.commission_pct = commission_pct

    def __repr__(self):
        return '<StoreSettings %r>' % self.id


class Store(BaseModel):

    __tablename__ = 'store'

    id = db.Column(db.Integer, primary_key=True)
    store_name = db.Column(db.String(32), nullable=False)
    store_url = db.Column(db.String(255), nullable=False)
    store_identifier = db.Column(db.String(127), nullable=False, unique=True)

    category = db.Column(db.Enum(*enum.STORE_CATEGORY_ENUM))
    description = db.Column(db.String(255))
    logo = db.Column(db.String(255))
    show_logo = db.Column(db.Boolean, default=False)

    store_settings_id = db.Column(db.Integer, db.ForeignKey('store_settings.id'), nullable=False)
    store_settings = db.relationship('StoreSettings', backref=db.backref('store', uselist=False, lazy='joined'))

    merchant_id = db.Column(db.Integer, db.ForeignKey('merchant.id'), nullable=False)
    merchant = db.relationship('Merchant', back_populates='stores')

    def __init__(self, store_name, store_url, store_identifier, store_settings, merchant,
                 category=None, description=None, logo=None, show_logo=False):
        self.store_name = store_name
        self.store_url = store_url
        self.store_identifier = store_identifier
        self.category = category
        self.description = description
        self.logo = logo
        self.show_logo = show_logo
        self.store_settings = store_settings
        self.merchant = merchant

    def __repr__(self):
        return '<Store %r>' % self.store_name

    @classmethod
    def create(cls, data, add_to_db=True):
        store_settings_data = data.pop('store_settings', {})
        data['store_settings'] = StoreSettings.create(store_settings_data)

        store = super(Store, cls).create(data)
        return store

    def update(self, data, add_to_db=True):
        store_settings_data = data.pop('store_settings', {})
        self.store_settings.update(store_settings_data)

        super(Store, self).update(data)
