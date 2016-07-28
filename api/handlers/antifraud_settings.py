from flask import request, jsonify

from api import api_v1, db, auth
from api.errors import NotFoundError, ValidationError
from api.models import AntiFraudRule, AntiFraudScoringRule
from api.schemas import AntiFraudRuleSchema
from sqlalchemy.exc import IntegrityError


@api_v1.route('/antifraud_settings/scoring_rules', methods=['GET'])
@auth.auth('admin', 'system')
def get_antifraud_scoring_rules():
    rules = AntiFraudScoringRule.query.all()
    return jsonify({"rules": list(map(lambda r: r.get_rule(), rules))})


@api_v1.route('/antifraud_settings/scoring_rules', methods=['POST'])
@auth.auth('admin', 'system')
def create_antifraud_scoring_rule():
    new_rule = AntiFraudScoringRule(request.get_json())
    db.session.add(new_rule)
    try:
        db.session.commit()
    except IntegrityError as ex:
        raise ValidationError(str(ex))
    return jsonify(new_rule.get_rule())


@api_v1.route('/antifraud_settings/scoring_rules/<rule_id>', methods=['PUT'])
@auth.auth('admin', 'system')
def update_antifraud_scoring_rule(rule_id):
    rule = AntiFraudScoringRule.query.filter_by(id=rule_id).all()[0]
    rule.update_rule(request.get_json())
    db.session.add(rule)
    try:
        db.session.commit()
    except IntegrityError as ex:
        raise ValidationError(str(ex))
    return jsonify(rule.get_rule())


@api_v1.route('/antifraud_settings/scoring_rules/<rule_id>', methods=['DELETE'])
@auth.auth('admin', 'system')
def delete_antifraud_scoring_rule(rule_id):
    delete_count = AntiFraudScoringRule.query.filter_by(id=rule_id).delete()
    if delete_count == 0:
        raise NotFoundError()
    db.session.commit()
    return jsonify({})


@api_v1.route('/antifraud_settings/settings', methods=['GET'])
@auth.auth('admin', 'system')
def antifraud_settings():
    settings = AntiFraudRule.query.all()
    if not settings:
        raise NotFoundError()

    schema = AntiFraudRuleSchema()

    result = schema.dump(settings[0])
    return jsonify(result.data)


@api_v1.route('/antifraud_settings/settings', methods=['PUT'])
@auth.auth('admin', 'system')
def update_antifraud_settings():
    settings = AntiFraudRule.query.all()
    if not settings:
        raise NotFoundError()

    schema = AntiFraudRuleSchema(partial=True, partial_nested=True)
    data, errors = schema.load(request.get_json(silent=True), origin_model=settings[0])
    if errors:
        raise ValidationError(errors=errors)

    if data:
        settings[0].update(data)
        db.session.commit()

    result = schema.dump(settings[0])
    return jsonify(result.data)
