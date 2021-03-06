from flask import request, jsonify

from api import api_v1, db, auth
from api.models import PaymentSystem
from api.schemas import PaymentSystemSchema, PaymentSystemUpdateSchema
from api.errors import NotFoundError, ValidationError

__author__ = 'Kostel Serhii'


@api_v1.route('/payment_systems/allowed/paysys_id', methods=['GET'])
@auth.auth('admin')
def allowed_paysys_id():
    return jsonify(paysys_id=list(PaymentSystem.allowed_paysys_id()))


@api_v1.route('/payment_systems', methods=['GET'])
def payment_system_list():
    payment_systems = PaymentSystem.query.all()
    schema = PaymentSystemSchema(many=True)
    result = schema.dump(payment_systems)
    return jsonify(payment_systems=result.data)


@api_v1.route('/payment_systems/<paysys_id>', methods=['GET'])
@auth.auth('admin')
def payment_system_detail(paysys_id):
    paysys_id = paysys_id.upper()
    payment_system = PaymentSystem.query.get(paysys_id)
    if not payment_system:
        raise NotFoundError()

    schema = PaymentSystemSchema()

    result = schema.dump(payment_system)
    return jsonify(result.data)


@api_v1.route('/payment_systems/<paysys_id>', methods=['PUT'])
@auth.auth('admin')
def payment_system_update(paysys_id):
    paysys_id = paysys_id.upper()
    payment_system = PaymentSystem.query.get(paysys_id)
    if not payment_system:
        raise NotFoundError()

    update_schema = PaymentSystemUpdateSchema(partial=True)
    data, errors = update_schema.load(request.get_json(silent=True), origin_model=payment_system)
    if errors:
        raise ValidationError(errors=errors)

    if data.get('active') and not payment_system.has_contracts():
        raise ValidationError(errors={'active': ['Add payment system contract first.']})

    if data:
        payment_system.update(data)
        db.session.commit()

    schema = PaymentSystemSchema()
    result = schema.dump(payment_system)
    return jsonify(result.data)


@api_v1.route('/payment_systems/<paysys_id>/account', methods=['GET'])
@auth.auth('system')
def payment_system_account(paysys_id):
    paysys_id = paysys_id.upper()
    payment_system = PaymentSystem.query.get(paysys_id)
    if not payment_system:
        raise NotFoundError()

    schema = PaymentSystemUpdateSchema()

    result = schema.dump(payment_system)
    return jsonify(result.data)
