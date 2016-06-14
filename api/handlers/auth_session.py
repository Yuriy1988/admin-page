from flask import g, request, jsonify, Response

from api import db, api_v1, auth, errors as api_err, models, schemas, utils

__author__ = 'Kostel Serhii'


# Authorization

def _filter_dict(dict_obj, keys):
    return {key: val for key, val in dict_obj.items() if key in keys}


@api_v1.route('/authorization', methods=['POST'])
def auth_login():
    schema = schemas.UserAuthSchema()
    data, errors = schema.load(request.get_json(silent=True))
    if errors:
        raise api_err.ValidationError(errors=errors)

    user = models.User.query.filter_by(username=data['username']).first()
    if not user or not user.check_password(data['password']):
        raise api_err.ForbiddenError('Wrong username or password')

    if not user.enabled:
        raise api_err.ForbiddenError('User is not enabled')

    session = auth.create_session(user)
    return jsonify(_filter_dict(session, ('token', 'exp', 'session_exp', 'user_name', 'groups')))


@api_v1.route('/authorization/token', methods=['GET'])
@auth.auth('admin', 'merchant', 'manager')
def auth_refresh_token():
    session = auth.refresh_session(g.token)
    return jsonify(_filter_dict(session, ('token', 'exp', 'session_exp')))


@api_v1.route('/authorization/token', methods=['DELETE'])
@auth.auth('admin', 'merchant', 'manager')
def auth_logout():
    auth.remove_session(g.token)
    return Response(status=200)


# Password

@api_v1.route('/user/create_password', methods=['POST'])
def user_create_password():
    schema = schemas.UserCreatePasswordSchema()
    data, errors = schema.load(request.get_json(silent=True))
    if errors:
        raise api_err.ValidationError(errors=errors)

    invite_token = request.args.get('token')
    user_id = auth.get_invite_user_id(token=invite_token)
    if not user_id:
        raise api_err.ForbiddenError('Invite token invalid or expired')

    user = models.User.query.get(user_id)
    if not user:
        raise api_err.ForbiddenError('User not found')

    user.set_password(data['password'])
    db.session.commit()

    return Response(status=200)


@api_v1.route('/user/forgot_password', methods=['POST'])
def user_forgot_password():
    schema = schemas.UserForgotPasswordSchema()
    data, errors = schema.load(request.get_json(silent=True))
    if errors:
        raise api_err.ValidationError(errors=errors)

    user = models.User.query.filter_by(username=data['username']).first()
    if not user:
        raise api_err.ValidationError('User with username "%s" not registered' % data['username'])

    invite_token = auth.generate_invite_token(user.id)
    utils.send_invite_to_user_by_email(user, invite_token)

    return Response(status=200)


@api_v1.route('/users/<user_id>/change_password', methods=['POST'])
@auth.auth('admin')
def user_change_password(user_id):
    schema = schemas.UserChangePasswordSchema(exclude=('old_password',))
    data, errors = schema.load(request.get_json(silent=True))
    if errors:
        raise api_err.ValidationError(errors=errors)

    user = models.User.query.get(user_id)
    user.set_password(data['new_password'])
    db.session.commit()

    return Response(status=200)


@auth.auth('admin', 'merchant', 'manager')
def user_change_password():
    schema = schemas.UserChangePasswordSchema()
    data, errors = schema.load(request.get_json(silent=True))
    if errors:
        raise api_err.ValidationError(errors=errors)

    user = models.User.query.get(g.user_id)
    if not user or not user.check_password(data['old_password']):
        raise api_err.ForbiddenError('Wrong original password')

    if not user.is_activated():
        raise api_err.ForbiddenError('User is not activated')

    user.set_password(data['new_password'])
    db.session.commit()

    return Response(status=200)


@api_v1.route('/admins_emails', methods=['GET'])
@auth.auth('system')
def admins_emails():
    emails = db.session.query(models.User.email).join(models.UserGroup).filter_by(group_name='admin').all()
    return jsonify(emails=list(emails))
