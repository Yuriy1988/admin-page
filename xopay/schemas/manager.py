from marshmallow import fields

from xopay.schemas import base, user

__author__ = 'Kostel Serhii'


class ManagerSchema(base.BaseSchema):

    id = fields.Str(dump_only=True)
    user = fields.Nested(user.UserSchema(), required=True)
