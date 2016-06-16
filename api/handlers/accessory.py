from flask import jsonify, request

from api import api_v1, auth
from api.errors import ValidationError
from api.models import enum, User, Merchant

__author__ = 'Kostel Serhii'


# Constants

@api_v1.route('/constants/notify', methods=['GET'])
@auth.auth('admin')
def constant_notify():
    return jsonify(notify=enum.USER_NOTIFY_ENUM)


@api_v1.route('/constants/currency', methods=['GET'])
@auth.auth('admin', 'system', 'merchant', 'manager')
def constant_currency():
    return jsonify(currency=enum.CURRENCY_ENUM)


@api_v1.route('/constants/sign_algorithm', methods=['GET'])
@auth.auth('admin')
def constant_sign_algorithm():
    return jsonify(sign_algorithm=enum.SIGN_ALGORITHM_ENUM)


@api_v1.route('/constants/category', methods=['GET'])
@auth.auth('admin')
def constant_category():
    return jsonify(category=enum.STORE_CATEGORY_ENUM)


@api_v1.route('/constants/payment_interface', methods=['GET'])
@auth.auth('admin')
def constant_payment_interface():
    return jsonify(category=enum.PAYMENT_INTERFACE_ENUM)


# Unique

def _unique_checker(field_models):

    for field, model in field_models.items():
        value = request.args.get(field)
        if not value:
            continue
        unique = model.unique(field_name=field, checked_value=value)
        return jsonify(unique=unique)

    raise ValidationError(message='Wrong request argument')


@api_v1.route('/unique/users', methods=['GET'])
@auth.auth('admin')
def unique_user():
    return _unique_checker({'username': User})


@api_v1.route('/unique/merchants', methods=['GET'])
@auth.auth('admin')
def unique_merchant():
    return _unique_checker({'merchant_name': Merchant})
