from flask import request, abort, jsonify

from xopay import app
from xopay.errors import ValidationError
from xopay.models import User, Store, StoreSettings, Merchant

__author__ = 'Kostel Serhii'


def _unique_checker(field_models):

    for field, model in field_models.items():
        value = request.args.get(field)
        if not value:
            continue
        unique = model.check_unique(field_name=field, checked_value=value)
        return jsonify(unique=unique)

    raise ValidationError(message='Wrong request argument')


@app.route('/api/admin/dev/unique/users', methods=['GET'])
def unique_user():
    return _unique_checker({'username': User})


@app.route('/api/admin/dev/unique/merchants', methods=['GET'])
def unique_merchant():
    return _unique_checker({'merchant_name': Merchant})


@app.route('/api/admin/dev/unique/stores', methods=['GET'])
def unique_store():
    return _unique_checker({'store_identifier': Store, 'sign_key': StoreSettings})
