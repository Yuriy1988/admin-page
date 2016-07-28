from marshmallow import fields
from marshmallow.validate import Range

from api.schemas import base


class AntiFraudRuleSchema(base.BaseSchema):
    decline_threshold = fields.Decimal(required=True, places=2, validate=Range(min=0, max=100))
    three_d_secure_threshold = fields.Decimal(required=True, places=2, validate=Range(min=0, max=100))
