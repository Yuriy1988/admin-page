from flask import request, jsonify, Response

from api import api_v1, db, auth, utils
from api.errors import NotFoundError, ValidationError
from api.models import Merchant, Manager
from api.schemas import ManagerSchema
from .decorators import autofill_id, owner_access_only

__author__ = 'Kostel Serhii'


@api_v1.route('/merchants/<merchant_id>/managers', methods=['GET'])
@api_v1.route('/merchant/managers', methods=['GET'])
@auth.auth('admin', 'merchant')
@autofill_id
def merchant_managers_list(merchant_id=None):
    if not Merchant.exists(merchant_id):
        raise NotFoundError()

    managers = Manager.query.filter_by(merchant_id=merchant_id).all()

    schema = ManagerSchema(many=True)
    result = schema.dump(managers)
    return jsonify(managers=result.data)


@api_v1.route('/merchants/<merchant_id>/managers', methods=['POST'])
@api_v1.route('/merchant/managers', methods=['POST'])
@auth.auth('admin', 'merchant')
@autofill_id
def merchant_manager_create(merchant_id=None):
    if not Merchant.exists(merchant_id):
        raise NotFoundError()

    schema = ManagerSchema()
    data, errors = schema.load(request.get_json(silent=True))
    if errors:
        raise ValidationError(errors=errors)

    data['merchant_id'] = merchant_id
    manager = Manager.create(data)
    db.session.commit()

    invite_token = auth.generate_invite_token(manager.user.id)
    utils.send_invite_to_user_by_email(manager.user, invite_token)

    result = schema.dump(manager)
    return jsonify(result.data)


@api_v1.route('/managers/<manager_id>', methods=['GET'])
@auth.auth('admin', 'merchant')
@owner_access_only
def manager_detail(manager_id):
    manager = Manager.query.get(manager_id)
    if not manager:
        raise NotFoundError()

    schema = ManagerSchema()

    result = schema.dump(manager)
    return jsonify(result.data)


@api_v1.route('/managers/<manager_id>', methods=['PUT'])
@auth.auth('admin', 'merchant')
@owner_access_only
def manager_update(manager_id):
    manager = Manager.query.get(manager_id)
    if not manager:
        raise NotFoundError()

    schema = ManagerSchema(partial=True, partial_nested=True)
    data, errors = schema.load(request.get_json(silent=True), origin_model=manager)
    if errors:
        raise ValidationError(errors=errors)

    if data:
        manager.update(data)
        db.session.commit()

    result = schema.dump(manager)
    return jsonify(result.data)


@api_v1.route('/managers/<manager_id>', methods=['DELETE'])
@auth.auth('admin', 'merchant')
@owner_access_only
def manager_delete(manager_id):
    delete_count = Manager.query.filter_by(id=manager_id).delete()
    if delete_count == 0:
        raise NotFoundError()

    db.session.commit()
    return Response(status=200)
