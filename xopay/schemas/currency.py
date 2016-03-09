from marshmallow import fields

from xopay.schemas import base

__author__ = 'Omelchenko Daniel'


class CurrencySchema(base.BaseSchema):

    id = fields.Int(dump_only=True)
    from_currency = fields.Str()
    to_currency = fields.Str()
    rate = fields.Float()
    commit_time = fields.DateTime()
