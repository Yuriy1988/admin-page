from marshmallow import fields
from marshmallow.validate import Length, OneOf, Regexp

from xopay.shema import Schema, Unique
from xopay.backend import enum
from xopay.users.models import User

__author__ = 'Kostel Serhii'


class UserSchema(Schema):

    id = fields.Int(dump_only=True)
    username = fields.Str(required=True, validate=(Length(max=80), Unique(User, 'username')))

    first_name = fields.Str(validate=Length(max=80))
    last_name = fields.Str(validate=Length(max=80))

    email = fields.Email()
    phone = fields.Str(validate=Regexp('^[1-9]{1}[0-9]{3,14}$'))
    notify = fields.Str(validate=OneOf(enum.USER_NOTIFY_ENUM))

    enabled = fields.Bool(required=True, default=False)
