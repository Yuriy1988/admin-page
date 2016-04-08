from marshmallow import fields

from api.schemas import base

__author__ = 'Kostel Serhii'


class PaymentSystemSchema(base.BaseSchema):

    id = fields.Str(dump_only=True)
    paysys_name = fields.Str(dump_only=True)
    active = fields.Boolean(default=False)


class PaymentSystemUpdateSchema(base.BaseSchema):

    paysys_login = fields.Str(required=False)
    paysys_password = fields.Str(required=False)
    active = fields.Boolean(required=False)
