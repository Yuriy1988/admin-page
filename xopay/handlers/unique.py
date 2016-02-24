from flask import request, abort, jsonify

from xopay import app
from xopay.models import User, Store, StoreSettings, Merchant

__author__ = 'Kostel Serhii'


def _unique_checker(model, field_name):
    value = request.args.get(field_name)
    if not value:
        return None
    unique = model.check_unique(field_name=field_name, checked_value=value)
    return jsonify(unique=unique)


@app.route('/api/admin/dev/unique/users', methods=['GET'])
def unique_user():
    return _unique_checker(User, 'username') or \
           abort(400, 'Wrong request argument')


@app.route('/api/admin/dev/unique/merchants', methods=['GET'])
def unique_merchant():
    return _unique_checker(Merchant, 'merchant_name') or \
           abort(400, 'Wrong request argument')


@app.route('/api/admin/dev/unique/stores', methods=['GET'])
def unique_store():
    return _unique_checker(Store, 'store_identifier') or \
           _unique_checker(StoreSettings, 'sign_key') or \
           abort(400, 'Wrong request argument')
