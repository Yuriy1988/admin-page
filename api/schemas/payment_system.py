from marshmallow import fields
from marshmallow.validate import Length

from api.schemas import base

__author__ = 'Kostel Serhii'


class PaymentSystemSchema(base.BaseSchema):

    id = fields.Str(dump_only=True)
    paysys_name = fields.Str(dump_only=True)
    active = fields.Boolean(missing=False)


class PaymentSystemUpdateSchema(base.BaseSchema):

    active = fields.Boolean(allow_none=False)
