from marshmallow import fields

from api.schemas import base, user

__author__ = 'Kostel Serhii'


class ManagerSchema(base.BaseSchema):

    id = fields.Str(dump_only=True)
    merchant_id = fields.Str(dump_only=True)
    user = fields.Nested(user.UserSchema(), required=True)
