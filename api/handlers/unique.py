from flask import request, jsonify

from api import api_v1, auth
from api.errors import ValidationError
from api.models import User, Merchant

__author__ = 'Kostel Serhii'


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
