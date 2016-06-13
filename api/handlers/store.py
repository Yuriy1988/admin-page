from flask import request, jsonify, Response

from api import api_v1, db, utils, auth
from api.errors import NotFoundError, ValidationError
from api.models import Merchant, Store, StorePaySys, PaymentSystem
from api.schemas import StoreSchema, StorePaySysSchema, StorePaySysRequestSchema
from .decorators import autofill_id, owner_access_only

__author__ = 'Kostel Serhii'


# Store

@api_v1.route('/merchants/<merchant_id>/stores', methods=['GET'])
@api_v1.route('/merchant/stores', methods=['GET'])
@auth.auth('admin', 'merchant')
@autofill_id
def merchant_stores_list(merchant_id=''):
    if not Merchant.exists(merchant_id):
        raise NotFoundError()

    stores = Store.query.filter_by(merchant_id=merchant_id).all()

    schema = StoreSchema(many=True, exclude=('merchant_id', 'store_settings',))
    result = schema.dump(stores)
    return jsonify(stores=result.data)


@api_v1.route('/merchants/<merchant_id>/stores', methods=['POST'])
@auth.auth('admin')
def merchant_stores_create(merchant_id):
    if not Merchant.exists(merchant_id):
        raise NotFoundError()

    schema = StoreSchema()
    data, errors = schema.load(request.get_json(silent=True))
    if errors:
        raise ValidationError(errors=errors)

    data['merchant_id'] = merchant_id
    store = Store.create(data)
    db.session.commit()

    result = schema.dump(store)
    return jsonify(result.data)


@api_v1.route('/stores/<store_id>', methods=['GET'])
@auth.auth('admin', 'system', 'merchant')
@owner_access_only
def store_detail(store_id):
    store = Store.query.get(store_id)
    if not store:
        raise NotFoundError()

    schema = StoreSchema()

    result = schema.dump(store)
    return jsonify(result.data)


@api_v1.route('/stores/<store_id>', methods=['PUT'])
@auth.auth('admin')
def store_update(store_id):
    store = Store.query.get(store_id)
    if not store:
        raise NotFoundError()

    schema = StoreSchema(partial=True, partial_nested=True)
    data, errors = schema.load(request.get_json(silent=True), origin_model=store)
    if errors:
        raise ValidationError(errors=errors)

    if data:
        store.update(data)
        db.session.commit()

    result = schema.dump(store)
    return jsonify(result.data)


@api_v1.route('/stores/<store_id>', methods=['DELETE'])
@auth.auth('admin')
def store_delete(store_id):
    delete_count = Store.query.filter_by(id=store_id).delete()
    if delete_count == 0:
        raise NotFoundError()

    db.session.commit()
    return Response(status=200)


@api_v1.route('/stores/<store_id>/upload/logo', methods=['POST'])
@auth.auth('admin')
def store_upload_logo(store_id):
    store = Store.query.get(store_id)
    if not store:
        raise NotFoundError()

    file_url = utils.upload_media_file(allowed_extensions={'png', 'jpg', 'jpeg', 'gif'}, upload_subdir='store/logo')
    if store.logo:
        utils.remove_media_file(store.logo)

    store.logo = file_url
    db.session.commit()

    return jsonify(logo=store.logo)


@api_v1.route('/stores/<store_id>/exists', methods=['GET'])
@auth.auth('system')
def store_exists(store_id):
    return jsonify(exists=Store.exists(store_id))


# Store Payment System

@api_v1.route('/stores/<store_id>/store_paysys', methods=['GET'])
@auth.auth('admin', 'system', 'merchant')
@owner_access_only
def store_payment_systems_list(store_id):
    if not Store.exists(store_id):
        raise NotFoundError()

    request_schema = StorePaySysRequestSchema()
    data, errors = request_schema.load(request.args)
    if errors:
        raise ValidationError(errors=errors)

    query = StorePaySys.query.filter_by(store_id=store_id)
    if 'allowed' in data:
        query = query.filter_by(allowed=data['allowed'])
    query = PaymentSystem.filter_allowed(query.join(PaymentSystem))
    store_paysys = query.all()

    schema = StorePaySysSchema(many=True)
    result = schema.dump(store_paysys)
    return jsonify(store_paysys=result.data)


@api_v1.route('/store_paysys/<store_paysys_id>', methods=['PUT'])
@auth.auth('admin')
def store_payment_system_update(store_paysys_id):
    store_paysys = StorePaySys.query.get(store_paysys_id)
    if not store_paysys:
        raise NotFoundError()

    if store_paysys.paysys_id not in PaymentSystem.allowed_paysys_id():
        raise ValidationError(
            'Payment system {paysys_id} is not allowed to use.'.format(paysys_id=store_paysys.paysys_id))

    schema = StorePaySysSchema(partial=True, exclude=('paysys_id',))
    data, errors = schema.load(request.get_json(silent=True), origin_model=store_paysys)
    if errors:
        raise ValidationError(errors=errors)

    if data:
        store_paysys.update(data)
        db.session.commit()

    schema = StorePaySysSchema()
    result = schema.dump(store_paysys)
    return jsonify(result.data)
