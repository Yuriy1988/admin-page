

from xopay import app, db
from xopay.users.models import User


class Merchant(db.Model):
    __tablename__ = 'merchant'
    id = db.Column(db.Integer, primary_key=True)
    сhairman = db.Column(db.String(320))
    phone = db.Column(db.String(15))
    adress = db.Column(db.String(320), nullable=True)
    email = db.Column(db.String(32), unique=True)
    checking_account = db.Column(db.String(32), nullable=True)
    mfo = db.Column(db.String(32), nullable=True)
    okpo = db.Column(db.String(32), nullable=True)
    bank_name = db.Column(db.String(32), nullable=True)
    currency = db.Column(db.String(3), nullable=True)
    user = db.relationship("User", uselist=False, back_populates="merchant")
    store = db.relationship("MerchantStore")
    manager = db.relationship("Manager")

    def __repr__(self):
        return '<User %r>' % self.сhairman


class MerchantStore(db.Model):
    __tablename__ = 'merchant_store'
    id = db.Column(db.Integer, primary_key=True)
    store_name = db.Column(db.String(32))
    url = db.Column(db.String(32))
    category = db.Column(db.String(320), nullable=True)
    description = db.Column(db.Text(32), nullable=True)
    store_settings = db.relationship("StoreSettings", uselist=False, back_populates="merchant_store")
    merchant_id = db.Column(db.Integer, db.ForeignKey('merchant.id'))

    def __repr__(self):
        return '<Store %r>' % self.store_name


class StoreSettings(db.Model):

    CRYPT_ALGORYTHM = ['md5', 'sha1']
    NOTIFICATION_TYPE = ['sms', 'email']

    __tablename__ = 'store_settings'
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(32))
    key = db.Column(db.String(320), nullable=True)
    commission = db.Column(db.Float(asdecimal=True), default=0)
    success_url = db.Column(db.String(32), nullable=True)
    reject_url = db.Column(db.String(32), nullable=True)
    logo = db.Column(db.String(32), nullable=True)
    show_logo = db.Column(db.Boolean, default=False)
    notif_type = db.Column(db.Enum(*NOTIFICATION_TYPE))
    crypt_algorythm = db.Column(db.Enum(*CRYPT_ALGORYTHM))
    store_id = db.Column(db.Integer, db.ForeignKey('merchant_store.id'), nullable=True)
    merchant_store = db.relationship("MerchantStore", back_populates="store_settings")

    def __repr__(self):
        return '<Store %r>' % self.store.store_name


class Manager(db.Model):

    __tablename__ = 'manager'
    id = db.Column(db.Integer, primary_key=True)
    enabled = db.Column(db.Boolean, default=False)
    user = db.relationship("User", uselist=False, back_populates="manager")
    merchant_id = db.Column(db.Integer, db.ForeignKey('merchant.id'))
    merchant = db.relationship("Merchant", back_populates="manager")