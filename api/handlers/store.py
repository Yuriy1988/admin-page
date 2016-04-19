from flask import request, jsonify, Response

from api import app, db, utils
from api.errors import NotFoundError, ValidationError
from api.models import Merchant, Store, StorePaySys, PaymentSystem
from api.schemas import StoreSchema, StorePaySysSchema

__author__ = 'Kostel Serhii'


# Store

@app.route('/api/admin/dev/merchants/<merchant_id>/stores', methods=['GET'])
def merchant_stores_list(merchant_id):
    if not Merchant.exists(merchant_id):
        raise NotFoundError()

    stores = Store.query.filter_by(merchant_id=merchant_id).all()

    schema = StoreSchema(many=True, exclude=('merchant_id', 'store_settings',))
    result = schema.dump(stores)
    return jsonify(stores=result.data)


@app.route('/api/admin/dev/merchants/<merchant_id>/stores', methods=['POST'])
def merchant_stores_create(merchant_id):
    if not Merchant.exists(merchant_id):
        raise NotFoundError()

    schema = StoreSchema()
    data, errors = schema.load(request.get_json())
    if errors:
        raise ValidationError(errors=errors)

    data['merchant_id'] = merchant_id
    store = Store.create(data)
    db.session.commit()

    result = schema.dump(store)
    return jsonify(result.data)


@app.route('/api/admin/dev/stores/<store_id>', methods=['GET'])
def store_detail(store_id):
    store = Store.query.get(store_id)
    if not store:
        raise NotFoundError()

    schema = StoreSchema()

    result = schema.dump(store)
    return jsonify(result.data)


@app.route('/api/admin/dev/stores/<store_id>', methods=['PUT'])
def store_update(store_id):
    store = Store.query.get(store_id)
    if not store:
        raise NotFoundError()

    schema = StoreSchema(partial=True, partial_nested=True)
    data, errors = schema.load(request.get_json(), origin_model=store)
    if errors:
        raise ValidationError(errors=errors)

    store.update(data)
    db.session.commit()

    result = schema.dump(store)
    return jsonify(result.data)


@app.route('/api/admin/dev/stores/<store_id>', methods=['DELETE'])
def store_delete(store_id):
    delete_count = Store.query.filter_by(id=store_id).delete()
    if delete_count == 0:
        raise NotFoundError()

    db.session.commit()
    return Response(status=200)


@app.route('/api/admin/dev/stores/<store_id>/upload/logo', methods=['POST'])
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


@app.route('/api/admin/dev/stores/<store_id>/exists', methods=['GET'])
def store_exists(store_id):
    return jsonify(exists=Store.exists(store_id))


# Store Payment System

@app.route('/api/admin/dev/stores/<store_id>/store_paysys', methods=['GET'])
def store_payment_systems_list(store_id):
    if not Store.exists(store_id):
        raise NotFoundError()

    query = StorePaySys.query.filter_by(store_id=store_id)
    query = PaymentSystem.filter_allowed(query.join(PaymentSystem))
    store_paysys = query.all()

    schema = StorePaySysSchema(many=True)
    result = schema.dump(store_paysys)
    return jsonify(store_paysys=result.data)


@app.route('/api/admin/dev/store_paysys/<store_paysys_id>', methods=['PUT'])
def store_payment_system_update(store_paysys_id):
    store_paysys = StorePaySys.query.get(store_paysys_id)
    if not store_paysys:
        raise NotFoundError()

    if store_paysys.paysys_id not in PaymentSystem.allowed_paysys_id():
        raise ValidationError(
            'Payment system {paysys_id} is not allowed to use.'.format(paysys_id=store_paysys.paysys_id))

    schema = StorePaySysSchema(partial=True, exclude=('paysys_id',))
    data, errors = schema.load(request.get_json(), origin_model=store_paysys)
    if errors:
        raise ValidationError(errors=errors)

    store_paysys.update(data)
    db.session.commit()

    schema = StorePaySysSchema()
    result = schema.dump(store_paysys)
    return jsonify(result.data)
