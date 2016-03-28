from marshmallow import fields
from marshmallow.validate import OneOf

from api.schemas import base
from api.models import enum

__author__ = 'Omelchenko Daniel'


class CurrencySchema(base.BaseSchema):

    from_currency = fields.Str(required=True, validate=OneOf(enum.CURRENCY_ENUM))
    to_currency = fields.Str(required=True, validate=OneOf(enum.CURRENCY_ENUM))
    rate = fields.Decimal(required=True)
    commit_time = fields.DateTime(dump_only=True)


class CurrencyRequestSchema(base.BaseSchema):

    from_currency = fields.Str(allow_none=True, validate=OneOf(enum.CURRENCY_ENUM))
    to_currency = fields.Str(allow_none=True, validate=OneOf(enum.CURRENCY_ENUM))
    from_date = fields.Date(allow_none=True)
    till_date = fields.Date(allow_none=True)
