from xopay import db
from xopay.models import base, enum

__author__ = 'Kostel Serhii'


class StoreSettings(base.BaseModel):

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


class Store(base.BaseModel):

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