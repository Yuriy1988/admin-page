from itertools import chain
from flask import jsonify, request

from api import api_v1, auth, db, models
from api.errors import ValidationError

__author__ = 'Kostel Serhii'


# Constants

@api_v1.route('/constants/notify', methods=['GET'])
@auth.auth('admin')
def constant_notify():
    return jsonify(notify=models.enum.USER_NOTIFY_ENUM)


@api_v1.route('/constants/currency', methods=['GET'])
@auth.auth('admin', 'system', 'merchant', 'manager')
def constant_currency():
    return jsonify(currency=models.enum.CURRENCY_ENUM)


@api_v1.route('/constants/sign_algorithm', methods=['GET'])
@auth.auth('admin')
def constant_sign_algorithm():
    return jsonify(sign_algorithm=models.enum.SIGN_ALGORITHM_ENUM)


@api_v1.route('/constants/category', methods=['GET'])
@auth.auth('admin')
def constant_category():
    return jsonify(category=models.enum.STORE_CATEGORY_ENUM)


@api_v1.route('/constants/payment_interface', methods=['GET'])
@auth.auth('admin')
def constant_payment_interface():
    return jsonify(category=models.enum.PAYMENT_INTERFACE_ENUM)


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
    return _unique_checker({'username': models.User})


@api_v1.route('/unique/merchants', methods=['GET'])
@auth.auth('admin')
def unique_merchant():
    return _unique_checker({'merchant_name': models.Merchant})


# Emails

@api_v1.route('/emails/groups/<group_name>', methods=['GET'])
@auth.auth('system')
def emails_of_group(group_name):
    emails = []
    if group_name in models.enum.USER_GROUP_ENUM:
        emails = db.session.query(models.User.email).\
            join(models.UserGroup).\
            filter(models.UserGroup.group_name == group_name).\
            all()
    return jsonify(emails=list(chain.from_iterable(emails)))


@api_v1.route('/emails/users/<user_id>', methods=['GET'])
@auth.auth('system')
def emails_of_user(user_id):
    emails = db.session.query(models.User.email).\
        filter(models.User.id == user_id).\
        all()
    return jsonify(emails=list(chain.from_iterable(emails)))


@api_v1.route('/emails/stores/<store_id>/merchants', methods=['GET'])
@auth.auth('system')
def emails_of_store_merchants(store_id):
    emails = db.session.query(models.User.email).\
        join(models.Merchant).\
        join(models.Store).\
        join(models.UserGroup).\
        filter(models.Store.id == store_id).\
        filter(models.UserGroup.group_name == 'merchant').\
        all()
    print(emails)
    return jsonify(emails=list(chain.from_iterable(emails)))


@api_v1.route('/emails/stores/<store_id>/managers', methods=['GET'])
@auth.auth('system')
def emails_of_store_managers(store_id):
    emails = db.session.query(models.User.email).\
        join(models.Manager).\
        join(models.ManagerStore).\
        join(models.Store).\
        join(models.UserGroup).\
        filter(models.Store.id == store_id).\
        filter(models.UserGroup.group_name == 'manager').\
        all()
    return jsonify(emails=list(chain.from_iterable(emails)))
