from marshmallow import fields
from marshmallow.validate import Length

from api.schemas import base

__author__ = 'Kostel Serhii'


class PaymentSystemSchema(base.BaseSchema):

    id = fields.Str(dump_only=True)
    paysys_name = fields.Str(dump_only=True)
    active = fields.Boolean(default=False)


class PaymentSystemUpdateSchema(base.BaseSchema):

    paysys_login = fields.Str(allow_none=False, validate=Length(min=3, max=255))
    paysys_password = fields.Str(allow_none=False, validate=Length(min=8, max=255))
    active = fields.Boolean(allow_none=False)
