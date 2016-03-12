from flask import request, jsonify, Response

from xopay import app, db
from xopay.errors import NotFoundError, ValidationError
from xopay.models import Merchant, Manager, Store
from xopay.schemas import MerchantSchema, ManagerSchema, StoreSchema

__author__ = 'Kostel Serhii'


@app.route('/api/admin/dev/merchants', methods=['GET'])
def merchants_list():
    merchants = Merchant.query.all()

    schema = MerchantSchema(many=True, only=('id', 'merchant_name'))
    result = schema.dump(merchants)
    return jsonify(merchants=result.data)


@app.route('/api/admin/dev/merchants', methods=['POST'])
def merchant_create():
    schema = MerchantSchema()
    data, errors = schema.load(request.get_json())
    if errors:
        raise ValidationError(errors=errors)

    merchant = Merchant.create(data)
    db.session.commit()

    result = schema.dump(merchant)
    return jsonify(result.data)


@app.route('/api/admin/dev/merchants/<int:merchant_id>', methods=['GET'])
def merchant_detail(merchant_id):
    merchant = Merchant.query.get(merchant_id)
    if not merchant:
        raise NotFoundError()

    schema = MerchantSchema()

    result = schema.dump(merchant)
    return jsonify(result.data)


@app.route('/api/admin/dev/merchants/<int:merchant_id>', methods=['PUT'])
def merchant_update(merchant_id):
    merchant = Merchant.query.get(merchant_id)
    if not merchant:
        raise NotFoundError()

    schema = MerchantSchema(partial=True, partial_nested=True)
    data, errors = schema.load(request.get_json())
    if errors:
        raise ValidationError(errors=errors)

    merchant.update(data)
    db.session.commit()

    result = schema.dump(merchant)
    return jsonify(result.data)


@app.route('/api/admin/dev/merchants/<int:merchant_id>', methods=['DELETE'])
def merchant_delete(merchant_id):
    delete_count = Merchant.query.filter_by(id=merchant_id).delete()
    if delete_count == 0:
        raise NotFoundError()

    db.session.commit()
    return Response(status=200)


@app.route('/api/admin/dev/merchants/<int:merchant_id>/managers', methods=['GET'])
def merchant_managers_list(merchant_id):
    merchant = Merchant.query.get(merchant_id)
    if not merchant:
        raise NotFoundError()

    schema = ManagerSchema(many=True)
    result = schema.dump(merchant.managers)
    return jsonify(managers=result.data)


@app.route('/api/admin/dev/merchants/<int:merchant_id>/managers', methods=['POST'])
def merchant_manager_create(merchant_id):
    merchant = Merchant.query.get(merchant_id)
    if not merchant:
        raise NotFoundError()

    schema = ManagerSchema()
    data, errors = schema.load(request.get_json())
    if errors:
        raise ValidationError(errors=errors)

    data['merchant_id'] = merchant.id
    manager = Manager.create(data)
    db.session.commit()

    result = schema.dump(manager)
    return jsonify(result.data)


@app.route('/api/admin/dev/merchants/<int:merchant_id>/stores', methods=['GET'])
def merchant_stores_list(merchant_id):
    merchant = Merchant.query.get(merchant_id)
    if not merchant:
        raise NotFoundError()

    schema = StoreSchema(many=True)
    result = schema.dump(merchant.stores)
    return jsonify(stores=result.data)


@app.route('/api/admin/dev/merchants/<int:merchant_id>/stores', methods=['POST'])
def merchant_stores_create(merchant_id):
    merchant = Merchant.query.get(merchant_id)
    if not merchant:
        raise NotFoundError()

    schema = StoreSchema()
    data, errors = schema.load(request.get_json())
    if errors:
        raise ValidationError(errors=errors)

    data['merchant_id'] = merchant.id
    store = Store.create(data)
    db.session.commit()

    result = schema.dump(store)
    return jsonify(result.data)
