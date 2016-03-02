from marshmallow import fields

from xopay.schemas import base

__author__ = 'Omelchenko Daniel'


class CurrencySchema(base.BaseSchema):

    id = fields.Int(dump_only=True)
    base_ccy = fields.Str()
    ccy = fields.Str()
    sale = fields.Float()
    buy = fields.Float()
    commit_time = fields.DateTime()


class CurrencyHistorySchema(base.BaseSchema):

    sale = fields.Float()
    buy = fields.Float()
    commit_time = fields.DateTime()
