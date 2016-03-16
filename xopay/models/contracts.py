from xopay import db
from xopay.models import base, enum

__author__ = 'Omelchenko Daniel'


class MerchantContract(base.BaseModel):

    __tablename__ = 'merchant_contract'

    id = db.Column(db.Integer, primary_key=True)
    commission_fixed = db.Column(db.Numeric, nullable=False)
    commission_pct = db.Column(db.Numeric, nullable=False)
    merchant_id = db.Column(db.Integer, db.ForeignKey('merchant.id'), nullable=False)
    active = db.Column(db.Boolean, default=False)
    currency = db.Column(db.Enum(*enum.CURRENCY_ENUM, name='enum_currency'), nullable=False)
    filter = db.Column(db.String(255), default="*")
    contract_doc_url = db.Column(db.String(512))

    def __init__(self, commission_fixed, commission_pct, merchant_id, currency, contract_doc_url,
                 active=True, filter="*"):
        self.merchant_id = merchant_id
        self.currency = currency
        self.commission_fixed = commission_fixed
        self.commission_pct = commission_pct
        self.contract_doc_url = contract_doc_url
        self.active = active
        self.filter = filter

    def __repr__(self):
        return '<Merchant contract %r>'.format(self.id)


class BankContract(base.BaseModel):

    __tablename__ = 'bank_contract'

    id = db.Column(db.Integer, primary_key=True)
    commission_fixed = db.Column(db.Numeric, nullable=False)
    commission_pct = db.Column(db.Numeric, nullable=False)
    contractor_name = db.Column(db.String(255))
    payment_system_id = db.Column(db.Enum(*enum.PAYMENT_SYSTEMS_ID_ENUM, name='enum_payment_system_id'),
                                  db.ForeignKey('payment_systems.paysys_id'), nullable=False)
    active = db.Column(db.Boolean, default=False)
    currency = db.Column(db.Enum(*enum.CURRENCY_ENUM, name='enum_currency'), nullable=False)
    filter = db.Column(db.String(255), default="*")
    contract_doc_url = db.Column(db.String(512))

    def __init__(self, commission_fixed, commission_pct, contractor_name, payment_system_id, currency, contract_doc_url,
                 active=True, filter="*"):
        self.payment_system_id = payment_system_id
        self.commission_fixed = commission_fixed
        self.commission_pct = commission_pct
        self.contractor_name = contractor_name
        self.currency = currency
        self.contract_doc_url = contract_doc_url
        self.active = active
        self.filter = filter

    def __repr__(self):
        return '<Bank contract %r>'.format(self.id)
