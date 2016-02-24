from flask import request, abort, jsonify

from xopay import app, db
from xopay.models import Merchant, Manager
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
        return abort(400, errors)

    merchant = Merchant.create(data)
    db.session.commit()

    result = schema.dump(merchant)
    return jsonify(result.data)


@app.route('/api/admin/dev/merchants/<merchant_id>', methods=['GET'])
def merchant_detail(merchant_id):
    merchant = Merchant.query.get(merchant_id)
    if not merchant:
        return abort(404)

    schema = MerchantSchema()

    result = schema.dump(merchant)
    return jsonify(result.data)


@app.route('/api/admin/dev/merchants/<merchant_id>', methods=['PUT'])
def merchant_update(merchant_id):
    merchant = Merchant.query.get(merchant_id)
    if not merchant:
        return abort(404)

    schema = MerchantSchema(partial=True, partial_nested=True)
    data, errors = schema.load(request.get_json())
    if errors:
        return abort(400, errors)

    merchant.update(data)
    db.session.commit()

    result = schema.dump(merchant)
    return jsonify(result.data)


@app.route('/api/admin/dev/merchants/<merchant_id>', methods=['DELETE'])
def merchant_delete(merchant_id):
    delete_count = Merchant.query.filter_by(id=merchant_id).delete()
    if delete_count == 0:
        return abort(404)

    db.session.commit()


@app.route('/api/admin/dev/merchants/<merchant_id>/managers', methods=['GET'])
def merchant_managers_list(merchant_id):
    merchant = Merchant.query.get(merchant_id)
    if not merchant:
        return abort(404)

    schema = ManagerSchema(many=True)
    result = schema.dump(merchant.managers)
    return jsonify(managers=result.data)


@app.route('/api/admin/dev/merchants/<merchant_id>/managers', methods=['POST'])
def merchant_manager_create(merchant_id):
    merchant = Merchant.query.get(merchant_id)
    if not merchant:
        return abort(404)

    schema = ManagerSchema()
    data, errors = schema.load(request.get_json())
    if errors:
        return abort(400, errors)

    data['merchant'] = merchant
    manager = Manager.create(data)
    db.session.commit()

    result = schema.dump(manager)
    return jsonify(result.data)


@app.route('/api/admin/dev/merchants/<merchant_id>/stores', methods=['GET'])
def merchant_stores_list(merchant_id):
    merchant = Merchant.query.get(merchant_id)
    if not merchant:
        return abort(404)

    schema = StoreSchema(many=True)
    result = schema.dump(merchant.stores)
    return jsonify(stores=result.data)


@app.route('/api/admin/dev/merchants/<merchant_id>/stores', methods=['POST'])
def merchant_stores_create(merchant_id):
    merchant = Merchant.query.get(merchant_id)
    if not merchant:
        return abort(404)

    schema = StoreSchema()
    data, errors = schema.load(request.get_json())
    if errors:
        return abort(400, errors)

    data['merchant'] = merchant
    manager = Manager.create(data)
    db.session.commit()

    result = schema.dump(manager)
    return jsonify(result.data)
