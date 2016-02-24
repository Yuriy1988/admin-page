from marshmallow import fields
from marshmallow.validate import Length, OneOf, Regexp

from xopay.schemas import base, user
from xopay.models import enum, Merchant

__author__ = 'Kostel Serhii'


class MerchantAccountSchema(base.BaseSchema):

    bank_name = fields.Str(required=True, validate=Length(max=255))
    checking_account = fields.Str(required=True, validate=Regexp('^\d{14}$'))
    currency = fields.Str(required=True, validate=OneOf(enum.CURRENCY_ENUM), default='USD')
    mfo = fields.Str(required=True, validate=Regexp('^\d{6}$'))
    okpo = fields.Str(required=True, validate=Regexp('^\d{8}$'))


class MerchantInfoSchema(base.BaseSchema):

    address = fields.Str(validate=Length(max=320))
    director_name = fields.Str(validate=Length(max=100))


class MerchantSchema(base.BaseSchema):

    id = fields.Int(dump_only=True)
    merchant_name = fields.Str(required=True, validate=(Length(max=32), base.Unique(Merchant, 'merchant_name')))

    merchant_account = fields.Nested(MerchantAccountSchema, required=True)
    merchant_info = fields.Nested(MerchantInfoSchema)
    user = fields.Nested(user.UserSchema, required=True)
