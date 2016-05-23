from flask import jsonify

from api import api_v1
from api.models import enum

__author__ = 'Kostel Serhii'


@api_v1.route('/constants/notify', methods=['GET'], auth=['admin'])
def constant_notify():
    return jsonify(notify=enum.USER_NOTIFY_ENUM)


@api_v1.route('/constants/currency', methods=['GET'], auth=['admin', 'system', 'merchant', 'manager'])
def constant_currency():
    return jsonify(currency=enum.CURRENCY_ENUM)


@api_v1.route('/constants/sign_algorithm', methods=['GET'], auth=['admin'])
def constant_sign_algorithm():
    return jsonify(sign_algorithm=enum.SIGN_ALGORITHM_ENUM)


@api_v1.route('/constants/category', methods=['GET'], auth=['admin'])
def constant_category():
    return jsonify(category=enum.STORE_CATEGORY_ENUM)


@api_v1.route('/constants/payment_interface', methods=['GET'], auth=['admin'])
def constant_payment_interface():
    return jsonify(category=enum.PAYMENT_INTERFACE_ENUM)
