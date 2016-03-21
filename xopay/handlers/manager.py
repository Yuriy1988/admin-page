from flask import request, jsonify, Response

from xopay import app, db
from xopay.errors import NotFoundError, ValidationError
from xopay.models import Merchant, Manager
from xopay.schemas import ManagerSchema

__author__ = 'Kostel Serhii'


@app.route('/api/admin/dev/merchants/<merchant_id>/managers', methods=['GET'])
def merchant_managers_list(merchant_id):
    if not Merchant.exists(merchant_id):
        raise NotFoundError()

    managers = Manager.query.filter_by(merchant_id=merchant_id).all()

    schema = ManagerSchema(many=True)
    result = schema.dump(managers)
    return jsonify(managers=result.data)


@app.route('/api/admin/dev/merchants/<merchant_id>/managers', methods=['POST'])
def merchant_manager_create(merchant_id):
    if not Merchant.exists(merchant_id):
        raise NotFoundError()

    schema = ManagerSchema()
    data, errors = schema.load(request.get_json())
    if errors:
        raise ValidationError(errors=errors)

    data['merchant_id'] = merchant_id
    manager = Manager.create(data)
    db.session.commit()

    result = schema.dump(manager)
    return jsonify(result.data)


@app.route('/api/admin/dev/managers/<manager_id>', methods=['GET'])
def manager_detail(manager_id):
    manager = Manager.query.get(manager_id)
    if not manager:
        raise NotFoundError()

    schema = ManagerSchema()

    result = schema.dump(manager)
    return jsonify(result.data)


@app.route('/api/admin/dev/managers/<manager_id>', methods=['PUT'])
def manager_update(manager_id):
    manager = Manager.query.get(manager_id)
    if not manager:
        raise NotFoundError()

    schema = ManagerSchema(partial=True, partial_nested=True)
    data, errors = schema.load(request.get_json(), origin_model=manager)
    if errors:
        raise ValidationError(errors=errors)

    manager.update(data)
    db.session.commit()

    result = schema.dump(manager)
    return jsonify(result.data)


@app.route('/api/admin/dev/managers/<manager_id>', methods=['DELETE'])
def manager_delete(manager_id):
    delete_count = Manager.query.filter_by(id=manager_id).delete()
    if delete_count == 0:
        raise NotFoundError()

    db.session.commit()
    return Response(status=200)
