from marshmallow import fields
from marshmallow.validate import OneOf, Range

from xopay.schemas import base
from xopay.models import enum

__author__ = 'Omelchenko Daniel'


class MerchantContractSchema(base.BaseSchema):

    id = fields.Int(dump_only=True)
    commission_fixed = fields.Decimal(required=True)
    commission_pct = fields.Decimal(required=True, validate=Range(min=-100, max=100))
    active = fields.Boolean(default=False)
    currency = fields.Str(required=True, validate=OneOf(enum.CURRENCY_ENUM))
    filter = fields.Str(default="*")
    contract_doc_url = fields.Str()


class BankContractSchema(base.BaseSchema):

    id = fields.Int(dump_only=True)
    contractor_name = fields.Str(required=True)
    commission_fixed = fields.Decimal(required=True, places=7, rounding=2)
    commission_pct = fields.Decimal(required=True, places=4, rounding=2, validate=Range(min=-100, max=100))
    active = fields.Boolean(default=False)
    currency = fields.Str(required=True, validate=OneOf(enum.CURRENCY_ENUM))
    filter = fields.Str(default="*")
    contract_doc_url = fields.Str()


class ContractRequestSchema(base.BaseSchema):

    active = fields.Boolean(allow_none=True)
    currency = fields.Str(allow_none=True, validate=OneOf(enum.CURRENCY_ENUM))