from marshmallow import fields
from marshmallow.validate import Length, OneOf, Regexp

from xopay.schemas import base
from xopay.models import enum, User

__author__ = 'Kostel Serhii'


class UserSchema(base.BaseSchema):

    id = fields.Int(dump_only=True)
    username = fields.Str(required=True, validate=(Length(max=80), base.Unique(User, 'username')))

    first_name = fields.Str(validate=Length(max=80))
    last_name = fields.Str(validate=Length(max=80))

    email = fields.Email()
    phone = fields.Str(validate=Regexp('^[1-9]{1}[0-9]{3,14}$'))
    notify = fields.Str(validate=OneOf(enum.USER_NOTIFY_ENUM))

    enabled = fields.Bool(required=True, default=False)
