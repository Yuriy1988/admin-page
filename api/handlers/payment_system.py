from flask import request, jsonify

from api import app, db
from api.models import PaymentSystem
from api.schemas import PaymentSystemSchema, PaymentSystemUpdateSchema
from api.errors import NotFoundError, ValidationError

__author__ = 'Kostel Serhii'


@app.route('/api/admin/dev/payment_systems/allowed/paysys_id', methods=['GET'])
def allowed_paysys_id():
    return jsonify(paysys_id=list(PaymentSystem.allowed_paysys_id()))


@app.route('/api/admin/dev/payment_systems', methods=['GET'])
def payment_system_list():
    payment_systems = PaymentSystem.query.all()
    schema = PaymentSystemSchema(many=True)
    result = schema.dump(payment_systems)
    return jsonify(payment_systems=result.data)


@app.route('/api/admin/dev/payment_systems/<paysys_id>', methods=['GET'])
def payment_system_detail(paysys_id):
    paysys_id = paysys_id.upper()
    payment_system = PaymentSystem.query.get(paysys_id)
    if not payment_system:
        raise NotFoundError()

    schema = PaymentSystemSchema()

    result = schema.dump(payment_system)
    return jsonify(result.data)


@app.route('/api/admin/dev/payment_systems/<paysys_id>', methods=['PUT'])
def payment_system_update(paysys_id):
    paysys_id = paysys_id.upper()
    payment_system = PaymentSystem.query.get(paysys_id)
    if not payment_system:
        raise NotFoundError()

    update_schema = PaymentSystemUpdateSchema(partial=True, partial_nested=True)
    data, errors = update_schema.load(request.get_json(), origin_model=payment_system)
    if errors:
        raise ValidationError(errors=errors)

    if 'active' in data:
        if data['active'] and (payment_system.paysys_login is None or payment_system._paysys_password_hash is None):
            raise ValidationError(errors={'active': ['Fill in the login and password fields first.']})

    payment_system.update(data)
    db.session.commit()

    schema = PaymentSystemSchema()
    result = schema.dump(payment_system)
    return jsonify(result.data)
