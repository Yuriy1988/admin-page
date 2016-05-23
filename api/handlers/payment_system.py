from flask import request, jsonify

from api import api_v1, db
from api.models import PaymentSystem
from api.schemas import PaymentSystemSchema, PaymentSystemUpdateSchema
from api.errors import NotFoundError, ValidationError

__author__ = 'Kostel Serhii'


@api_v1.route('/payment_systems/allowed/paysys_id', methods=['GET'], auth=['admin'])
def allowed_paysys_id():
    return jsonify(paysys_id=list(PaymentSystem.allowed_paysys_id()))


@api_v1.route('/payment_systems', methods=['GET'])
def payment_system_list():
    payment_systems = PaymentSystem.query.all()
    schema = PaymentSystemSchema(many=True)
    result = schema.dump(payment_systems)
    return jsonify(payment_systems=result.data)


@api_v1.route('/payment_systems/<paysys_id>', methods=['GET'], auth=['admin'])
def payment_system_detail(paysys_id):
    paysys_id = paysys_id.upper()
    payment_system = PaymentSystem.query.get(paysys_id)
    if not payment_system:
        raise NotFoundError()

    schema = PaymentSystemSchema()

    result = schema.dump(payment_system)
    return jsonify(result.data)


@api_v1.route('/payment_systems/<paysys_id>', methods=['PUT'], auth=['admin'])
def payment_system_update(paysys_id):
    paysys_id = paysys_id.upper()
    payment_system = PaymentSystem.query.get(paysys_id)
    if not payment_system:
        raise NotFoundError()

    update_schema = PaymentSystemUpdateSchema(partial=True)
    data, errors = update_schema.load(request.get_json(), origin_model=payment_system)
    if errors:
        raise ValidationError(errors=errors)

    if 'active' in data:
        # TODO: check for contract before activate
        if data['active'] and (payment_system.paysys_login is None or payment_system._paysys_password_hash is None):
            raise ValidationError(errors={'active': ['Fill in the login and password fields first.']})

    if data:
        payment_system.update(data)
        db.session.commit()

    schema = PaymentSystemSchema()
    result = schema.dump(payment_system)
    return jsonify(result.data)
