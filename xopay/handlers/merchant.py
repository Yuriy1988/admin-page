from flask import request, jsonify, Response

from xopay import app, db
from xopay.errors import NotFoundError, ValidationError
from xopay.models import Merchant
from xopay.schemas import MerchantSchema

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
