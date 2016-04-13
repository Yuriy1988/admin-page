from flask import jsonify

from api import app
from api.models import enum

__author__ = 'Kostel Serhii'


@app.route('/api/admin/dev/constants/notify', methods=['GET'])
def constant_notify():
    return jsonify(notify=enum.USER_NOTIFY_ENUM)


@app.route('/api/admin/dev/constants/currency', methods=['GET'])
def constant_currency():
    return jsonify(currency=enum.CURRENCY_ENUM)


@app.route('/api/admin/dev/constants/sign_algorithm', methods=['GET'])
def constant_sign_algorithm():
    return jsonify(sign_algorithm=enum.SIGN_ALGORITHM_ENUM)


@app.route('/api/admin/dev/constants/category', methods=['GET'])
def constant_category():
    return jsonify(category=enum.STORE_CATEGORY_ENUM)


@app.route('/api/admin/dev/constants/payment_interface', methods=['GET'])
def constant_payment_interface():
    return jsonify(category=enum.PAYMENT_INTERFACE_ENUM)
