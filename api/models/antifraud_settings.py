import json

from api import db
from api.models import base


DEFAULT_SCORING_RULES = [
    {
        "id": "is_trust_location",
        "formatted_text": "Different country of customer and card issuer country.",
        "score": 30.0,
        "parameters": {}
    },
    {
        "id": "is_normal_amount",
        "formatted_text": "Average transaction amount for day increases by {threshold} percents.",
        "score": 30.0,
        "parameters": {
            "threshold": 200.0
        }
    },
    {
        "id": "is_normal_count",
        "formatted_text": "Average transaction count for day increases by {threshold} percents.",
        "score": 30.0,
        "parameters": {
            "threshold": 200.0
        }
    }
]


class AntiFraudScoringRule(base.BaseModel):

    __tablename__ = 'antifraud_scoring_rules'

    id = db.Column(db.String(256), primary_key=True)

    rule = db.Column(db.String(1024), default="{}")

    def __init__(self, rule_dict):
        self.id = rule_dict["id"]
        self.rule = json.dumps(rule_dict)

    def get_rule(self):
        return json.loads(self.rule)

    def update_rule(self, new_rule):
        rule = self.get_rule()
        rule.update(new_rule)
        self.rule = json.dumps(rule)

    @property
    def formatted_text(self):
        return self.get_rule().get("formatted_text", "")

    @property
    def score(self):
        return self.get_rule().get("score", 0)

    @property
    def parameters(self):
        return self.get_rule().get("parameters", {})

    def get_parameter(self, name):
        return self.parameters.get(name)


class AntiFraudRule(base.BaseModel):

    __tablename__ = 'antifraud_rules'

    id = db.Column(db.Integer(), primary_key=True)

    def __init__(self, three_d_secure_threshold,  decline_threshold):
        self.id = 0
        self.three_d_secure_threshold = three_d_secure_threshold
        self.decline_threshold = decline_threshold

    three_d_secure_threshold = db.Column(db.Float)
    decline_threshold = db.Column(db.Float)
