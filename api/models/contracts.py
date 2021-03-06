from api import db, utils
from api.models import base, enum

__author__ = 'Omelchenko Daniel'


class AbstractContract(base.BaseModel):

    __abstract__ = True

    id = db.Column(db.Integer, primary_key=True)
    commission_fixed = db.Column(db.Numeric, nullable=False)
    commission_pct = db.Column(db.Numeric, nullable=False)
    active = db.Column(db.Boolean, default=False)
    currency = db.Column(db.Enum(*enum.CURRENCY_ENUM, name='enum_currency'), nullable=False)
    filter = db.Column(db.String(255), default="*")
    contract_doc_url = db.Column(db.String(512))

    def __init__(self, commission_fixed, commission_pct, currency, contract_doc_url, active=True, filter="*"):
        self.currency = currency
        self.commission_fixed = commission_fixed
        self.commission_pct = commission_pct
        self.contract_doc_url = contract_doc_url
        self.active = active
        self.filter = filter


class MerchantContract(AbstractContract):

    __tablename__ = 'merchant_contract'

    merchant_id = db.Column(db.String, db.ForeignKey('merchant.id', ondelete='CASCADE'), nullable=False)

    def __init__(self, merchant_id, commission_fixed, commission_pct, currency, contract_doc_url,
                 active=True, filter="*"):
        super().__init__(commission_fixed, commission_pct, currency, contract_doc_url, active, filter)
        self.merchant_id = merchant_id

    def __repr__(self):
        return '<Merchant contract %r>'.format(self.id)


@base.on_model_event(MerchantContract, 'after_delete')
def delete_contract_doc_url_media_file(merchant_contract):
    utils.remove_media_file(merchant_contract.contract_doc_url)


class PaySysContract(AbstractContract):

    __tablename__ = 'paysys_contract'

    contractor_name = db.Column(db.String(255))
    payment_interface = db.Column(db.Enum(*enum.PAYMENT_INTERFACE_ENUM, name='payment_interface'), nullable=False)
    paysys_id = db.Column(db.String, db.ForeignKey('payment_systems.id', ondelete='CASCADE'), nullable=False)

    def __init__(self, paysys_id, payment_interface,
                 commission_fixed, commission_pct,
                 contractor_name, currency, contract_doc_url,
                 active=True, filter="*"):
        super().__init__(commission_fixed, commission_pct, currency, contract_doc_url, active, filter)
        self.paysys_id = paysys_id
        self.contractor_name = contractor_name
        self.payment_interface = payment_interface

    def __repr__(self):
        return '<PaySys contract %r>'.format(self.id)


@base.on_model_event(PaySysContract, 'after_delete')
def delete_contract_doc_url_media_file(paysys_contract):
    utils.remove_media_file(paysys_contract.contract_doc_url)
