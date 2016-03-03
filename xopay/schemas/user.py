from string import ascii_letters, digits
from marshmallow import fields
from marshmallow.validate import Length, OneOf, ContainsOnly

from xopay.schemas import base
from xopay.models import enum, User

__author__ = 'Kostel Serhii'

_username_chars = ascii_letters + digits + "._-"


class UserSchema(base.BaseSchema):

    id = fields.Int(dump_only=True)
    # TODO: login only latin
    username = fields.Str(required=True,
                          validate=(Length(min=3, max=80),
                                    ContainsOnly(_username_chars),
                                    base.Unique(User, 'username')))

    first_name = fields.Str(validate=Length(min=2, max=80))
    last_name = fields.Str(validate=Length(min=2, max=80))

    email = fields.Email()
    phone = fields.Str(validate=base.Phone())
    notify = fields.Str(validate=OneOf(enum.USER_NOTIFY_ENUM))

    enabled = fields.Bool(required=True, default=False)
