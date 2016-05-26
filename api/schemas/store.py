from marshmallow import fields
from marshmallow.validate import Length, OneOf, Range

from api.schemas import base
from api.models import enum

__author__ = 'Kostel Serhii'


class StoreSettingsSchema(base.BaseSchema):

    sign_algorithm = fields.Str(required=True, validate=OneOf(enum.SIGN_ALGORITHM_ENUM))
    sign_key = fields.Str(dump_only=True)
    succeed_url = fields.Url(required=True)
    failure_url = fields.Url(required=True)
    commission_pct = fields.Decimal(required=True, validate=Range(min=0, max=100))


class StoreSchema(base.BaseSchema):

    id = fields.Str(dump_only=True)
    store_name = fields.Str(required=True, validate=Length(min=3, max=32))
    store_url = fields.Url(required=True)

    category = fields.Str(allow_none=True, validate=OneOf(enum.STORE_CATEGORY_ENUM))
    description = fields.Str(allow_none=True, validate=Length(max=255))
    logo = fields.Url(allow_none=True)
    show_logo = fields.Bool(default=False)

    merchant_id = fields.Str(dump_only=True)

    store_settings = fields.Nested(StoreSettingsSchema(), required=True)


class StorePaySysSchema(base.BaseSchema):

    id = fields.Str(dump_only=True)
    store_id = fields.Str(dump_only=True)
    paysys_id = fields.Str(dump_only=True)
    allowed = fields.Boolean(missing=False)


class StorePaySysRequestSchema(base.BaseSchema):

    allowed = fields.Boolean(allow_none=True)
