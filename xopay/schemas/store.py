from marshmallow import fields
from marshmallow.validate import Length, OneOf, Range

from xopay.schemas import base
from xopay.models import enum, Store, StoreSettings

__author__ = 'Kostel Serhii'


class StoreSettingsSchema(base.BaseSchema):

    sign_algorithm = fields.Str(required=True, validate=OneOf(enum.SIGN_ALGORITHM_ENUM), default='MD5')
    sign_key = fields.Str(required=True, validate=(Length(min=8, max=127), base.Unique(StoreSettings, 'sign_key')))
    succeed_url = fields.Url(required=True)
    failure_url = fields.Url(required=True)
    commission_pct = fields.Float(places=4, rounding=2, required=True, validate=Range(min=0, max=100))


class StoreSchema(base.BaseSchema):

    id = fields.Int(dump_only=True)
    store_name = fields.Str(required=True, validate=Length(min=3, max=32))
    store_url = fields.Url(required=True)
    store_identifier = fields.Str(required=True,
                                  validate=(Length(min=8, max=127), base.Unique(Store, 'store_identifier')))

    category = fields.Str(allow_none=True, validate=OneOf(enum.STORE_CATEGORY_ENUM))
    description = fields.Str(allow_none=True, validate=Length(max=255))
    logo = fields.Url(allow_none=True)
    show_logo = fields.Bool(default=False)

    store_settings = fields.Nested(StoreSettingsSchema(), required=True)
