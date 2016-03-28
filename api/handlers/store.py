from flask import request, jsonify, Response

from api import app, db
from api.errors import NotFoundError, ValidationError
from api.models import Merchant, Store
from api.schemas import StoreSchema

__author__ = 'Kostel Serhii'


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
