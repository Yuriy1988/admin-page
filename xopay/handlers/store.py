from flask import request, jsonify

from xopay import app, db
from xopay.errors import NotFoundError, ValidationError
from xopay.models import Store
from xopay.schemas import StoreSchema

__author__ = 'Kostel Serhii'


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
    data, errors = schema.load(request.get_json())
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
