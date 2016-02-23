from flask import request, abort, jsonify

from xopay import app, db
from xopay.merchants.models import Merchant, Manager, Store
from xopay.merchants.schemas import MerchantSchema, ManagerSchema, StoreSchema

__author__ = 'Kostel Serhii'


# -------- Merchants --------

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


# -------- Manager --------


@app.route('/api/admin/dev/managers/<manager_id>', methods=['GET'])
def manager_detail(manager_id):
    manager = Manager.query.get(manager_id)
    if not manager:
        return abort(404)

    schema = ManagerSchema()

    result = schema.dump(manager)
    return jsonify(result.data)


@app.route('/api/admin/dev/managers/<manager_id>', methods=['PUT'])
def manager_update(manager_id):
    manager = Manager.query.get(manager_id)
    if not manager:
        return abort(404)

    schema = ManagerSchema(partial=True, partial_nested=True)
    data, errors = schema.load(request.get_json())
    if errors:
        return abort(400, errors)

    manager.update(data)
    db.session.commit()

    result = schema.dump(manager)
    return jsonify(result.data)


@app.route('/api/admin/dev/managers/<manager_id>', methods=['DELETE'])
def manager_delete(manager_id):
    delete_count = Manager.query.filter_by(id=manager_id).delete()
    if delete_count == 0:
        return abort(404)

    db.session.commit()


# -------- Store --------


@app.route('/api/admin/dev/stores/<store_id>', methods=['GET'])
def store_detail(store_id):
    store = Store.query.get(store_id)
    if not store:
        return abort(404)

    schema = StoreSchema()

    result = schema.dump(store)
    return jsonify(result.data)


@app.route('/api/admin/dev/stores/<store_id>', methods=['PUT'])
def store_update(store_id):
    store = Store.query.get(store_id)
    if not store:
        return abort(404)

    schema = StoreSchema(partial=True, partial_nested=True)
    data, errors = schema.load(request.get_json())
    if errors:
        return abort(400, errors)

    store.update(data)
    db.session.commit()

    result = schema.dump(store)
    return jsonify(result.data)


@app.route('/api/admin/dev/stores/<store_id>', methods=['DELETE'])
def store_delete(store_id):
    delete_count = Store.query.filter_by(id=store_id).delete()
    if delete_count == 0:
        return abort(404)

    db.session.commit()
