from flask import g, request, jsonify, Response

from api import app, auth
from api.errors import ValidationError, UnauthorizedError
from api.schemas import UserAuthSchema
from api.models import User

__author__ = 'Kostel Serhii'


def _filter_dict(dict_obj, keys):
    return {key: val for key, val in dict_obj if key in keys}


@app.route('/api/admin/dev/authorization', methods=['POST'])
def auth_login():
    schema = UserAuthSchema()
    data, errors = schema.load(request.get_json())
    if errors:
        raise ValidationError(errors=errors)

    user = User.query.get(data['username'])
    if not user or not user.check_password(data['password']):
        raise UnauthorizedError('Wrong username or password')

    session = auth.create_session(user)
    return jsonify(_filter_dict(session, ('token', 'exp', 'session_exp', 'user_name', 'groups')))


@app.route('/api/admin/dev/authorization/token', methods=['DELETE'])
def auth_logout():
    auth.remove_session(g.token)
    return Response(status=200)


@app.route('/api/admin/dev/authorization/token', methods=['GET'])
def auth_refresh_token():
    session = auth.refresh_session(g.token)
    return jsonify(_filter_dict(session, ('token', 'exp', 'session_exp')))
