from marshmallow import fields
from marshmallow.validate import Length, OneOf

from api.schemas import base, user
from api.models import enum, Merchant

__author__ = 'Kostel Serhii'


class MerchantAccountSchema(base.BaseSchema):

    bank_name = fields.Str(required=True, validate=Length(min=3, max=255))
    checking_account = fields.Str(required=True, validate=[base.DigitsOnly(), Length(min=12, max=24)])
    currency = fields.Str(required=True, validate=OneOf(enum.CURRENCY_ENUM))
    mfo = fields.Str(required=True, validate=[base.DigitsOnly(), Length(equal=6)])
    okpo = fields.Str(required=True, validate=[base.DigitsOnly(), Length(equal=8)])


class MerchantInfoSchema(base.BaseSchema):

    address = fields.Str(allow_none=True, validate=Length(min=4, max=320))
    director_name = fields.Str(allow_none=True, validate=Length(min=4, max=100))


class MerchantSchema(base.BaseSchema):

    id = fields.Str(dump_only=True)
    merchant_name = fields.Str(required=True, validate=(Length(min=3, max=32), base.Unique(Merchant, 'merchant_name')))

    # for partial_nested schema must be class instance
    merchant_account = fields.Nested(MerchantAccountSchema(), required=True)
    merchant_info = fields.Nested(MerchantInfoSchema(), allow_none=True)
    user = fields.Nested(user.UserSchema(), required=True)
