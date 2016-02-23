
from marshmallow import fields
from marshmallow.validate import Length, OneOf, Regexp, Range

from xopay.shema import Schema, Unique
from xopay.merchants.models import Merchant, Store, StoreSettings
from xopay.users.schemas import UserSchema
from xopay.backend import enum

__author__ = 'Kostel Serhii'


class MerchantAccountSchema(Schema):

    bank_name = fields.Str(required=True, validate=Length(max=255))
    checking_account = fields.Str(required=True, validate=Regexp('^\d{14}$'))
    currency = fields.Str(required=True, validate=OneOf(enum.CURRENCY_ENUM), default='USD')
    mfo = fields.Str(required=True, validate=Regexp('^\d{6}$'))
    okpo = fields.Str(required=True, validate=Regexp('^\d{8}$'))


class MerchantInfoSchema(Schema):

    address = fields.Str(validate=Length(max=320))
    director_name = fields.Str(validate=Length(max=100))


class MerchantSchema(Schema):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        print('Create Schema')

    id = fields.Int(dump_only=True)
    merchant_name = fields.Str(required=True, validate=(Length(max=32), Unique(Merchant, 'merchant_name')))

    merchant_account = fields.Nested(MerchantAccountSchema, required=True)
    merchant_info = fields.Nested(MerchantInfoSchema)
    user = fields.Nested(UserSchema, required=True)


class ManagerSchema(Schema):

    id = fields.Int(dump_only=True)
    user = fields.Nested(UserSchema, required=True)


class StoreSettingsSchema(Schema):

    sign_algorithm = fields.Str(required=True, validate=OneOf(enum.SIGN_ALGORITHM_ENUM), default='MD5')
    sign_key = fields.Str(required=True, validate=(Length(max=127), Unique(StoreSettings, 'sign_key')))
    succeed_url = fields.Url(required=True)
    failure_url = fields.Url(required=True)
    commission_pct = fields.Decimal(places=4, rounding=2, required=True, validate=Range(min=0, max=100))


class StoreSchema(Schema):

    id = fields.Int(dump_only=True)
    store_name = fields.Str(required=True, validate=Length(max=32))
    store_url = fields.Url(required=True)
    store_identifier = fields.Str(required=True, validate=(Length(max=127), Unique(Store, 'store_identifier')))

    category = fields.Str(validate=OneOf(enum.STORE_CATEGORY_ENUM))
    description = fields.Str(validate=Length(max=255))
    logo = fields.Url()
    show_logo = fields.Bool(default=False)

    store_settings = fields.Nested(StoreSettingsSchema, required=True)
