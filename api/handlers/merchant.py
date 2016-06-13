from flask import request, jsonify, Response

from api import api_v1, db, auth, utils
from api.errors import NotFoundError, ValidationError
from api.models import Merchant
from api.schemas import MerchantSchema

__author__ = 'Kostel Serhii'


@api_v1.route('/merchants', methods=['GET'])
@auth.auth('admin')
def merchants_list():
    merchants = Merchant.query.all()

    schema = MerchantSchema(many=True, only=('id', 'merchant_name'))
    result = schema.dump(merchants)
    return jsonify(merchants=result.data)


@api_v1.route('/merchants', methods=['POST'])
@auth.auth('admin')
def merchant_create():
    schema = MerchantSchema()
    data, errors = schema.load(request.get_json(silent=True))
    if errors:
        raise ValidationError(errors=errors)

    merchant = Merchant.create(data)
    db.session.commit()

    invite_token = auth.generate_invite_token(merchant.user.id)
    utils.send_invite_to_user_by_email(merchant.user, invite_token)

    result = schema.dump(merchant)
    return jsonify(result.data)


@api_v1.route('/merchants/<merchant_id>', methods=['GET'])
@auth.auth('admin', 'system')
def merchant_detail(merchant_id):
    merchant = Merchant.query.get(merchant_id)
    if not merchant:
        raise NotFoundError()

    schema = MerchantSchema()

    result = schema.dump(merchant)
    return jsonify(result.data)


@api_v1.route('/merchants/<merchant_id>', methods=['PUT'])
@auth.auth('admin')
def merchant_update(merchant_id):
    merchant = Merchant.query.get(merchant_id)
    if not merchant:
        raise NotFoundError()

    schema = MerchantSchema(partial=True, partial_nested=True)
    data, errors = schema.load(request.get_json(silent=True), origin_model=merchant)
    if errors:
        raise ValidationError(errors=errors)

    if data:
        merchant.update(data)
        db.session.commit()

    result = schema.dump(merchant)
    return jsonify(result.data)


@api_v1.route('/merchants/<merchant_id>', methods=['DELETE'])
@auth.auth('admin')
def merchant_delete(merchant_id):
    delete_count = Merchant.query.filter_by(id=merchant_id).delete()
    if delete_count == 0:
        raise NotFoundError()

    db.session.commit()
    return Response(status=200)
