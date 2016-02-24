from flask import request, abort, jsonify

from xopay import app, db
from xopay.models import Manager
from xopay.schemas import ManagerSchema

__author__ = 'Kostel Serhii'


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
