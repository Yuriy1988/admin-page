from marshmallow import fields
from marshmallow.validate import Length, OneOf

from api.schemas import base
from api.models import enum, User

__author__ = 'Kostel Serhii'


class UserSchema(base.BaseSchema):

    id = fields.Str(dump_only=True)
    username = fields.Str(required=True, validate=(Length(min=3, max=80), base.Login(), base.Unique(User, 'username')))

    first_name = fields.Str(allow_none=True, validate=Length(min=2, max=80))
    last_name = fields.Str(allow_none=True, validate=Length(min=2, max=80))

    email = fields.Email(allow_none=True)
    phone = fields.Str(allow_none=True, validate=base.Phone())
    notify = fields.Str(default='NONE', validate=OneOf(enum.USER_NOTIFY_ENUM))

    enabled = fields.Bool(required=True, default=False)


class UserAuthSchema(base.BaseSchema):

    username = fields.Str(required=True, validate=(Length(min=3, max=80), base.Login()))
    password = fields.Str(required=True, validate=Length(min=8, max=255))
