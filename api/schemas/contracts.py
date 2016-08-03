from marshmallow import fields
from marshmallow.validate import OneOf, Range

from api.schemas import base
from api.models import enum

__author__ = 'Omelchenko Daniel'


class AbstractContractSchema(base.BaseSchema):
    id = fields.Int(dump_only=True)
    commission_fixed = fields.Decimal(required=True, places=2)
    commission_pct = fields.Decimal(required=True, places=2, validate=Range(min=-100, max=100))
    contract_doc_url = fields.Url(required=True)
    currency = fields.Str(required=True, validate=OneOf(enum.CURRENCY_ENUM))
    active = fields.Boolean(missing=False)
    filter = fields.Str(missing="*")


class MerchantContractSchema(AbstractContractSchema):
    merchant_id = fields.Str(dump_only=True)


class PaySysContractSchema(AbstractContractSchema):
    paysys_id = fields.Str(dump_only=True)
    contractor_name = fields.Str(required=True)
    payment_interface = fields.Str(required=True, validate=OneOf(enum.PAYMENT_INTERFACE_ENUM))


class ContractRequestSchema(base.BaseSchema):
    active = fields.Boolean(allow_none=True)
    currency = fields.Str(allow_none=True, validate=OneOf(enum.CURRENCY_ENUM))
