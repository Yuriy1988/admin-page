from marshmallow import fields
from marshmallow.validate import Length, OneOf

from xopay.schemas import base
from xopay.models import enum, User

__author__ = 'Kostel Serhii'


class UserSchema(base.BaseSchema):

    id = fields.Int(dump_only=True)
    username = fields.Str(required=True, validate=(Length(max=80), base.Unique(User, 'username')))

    first_name = fields.Str(validate=Length(max=80))
    last_name = fields.Str(validate=Length(max=80))

    email = fields.Email()
    phone = fields.Str(validate=base.Phone())
    notify = fields.Str(validate=OneOf(enum.USER_NOTIFY_ENUM))

    enabled = fields.Bool(required=True, default=False)
