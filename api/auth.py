import redis
import logging
import jwt
import jwt.exceptions as jwt_err
from calendar import timegm
from uuid import uuid4
from datetime import datetime
from functools import wraps
from flask import g, request, json

from api import app, errors

__author__ = 'Kostel Serhii'


_log = logging.getLogger('xop.auth')
_redis_auth = redis.StrictRedis(db=1)


def _create_token(payload):
    token = jwt.encode(payload, app.config['AUTH_KEY'], algorithm=app.config['AUTH_ALGORITHM'])
    return token.decode('utf-8')


def _datetime_to_timestamp(dt_obj):
    """
    Convert datetime object to UTC UNIX timestamp.
    :param dt_obj: datetime object
    :return int: UTC UNIX timestamp
    """
    return timegm(dt_obj.utctimetuple())


# Auth decorator

def _check_authorization(access_groups, verify=False):
    """
    Check user authorisation and permissions.
    Save information about token and user_id into Flask.g storage.
    If access not allowed - raise api exceptions.

    Auth token in header:
        Authorization: Bearer <token>

    Check sequence:
        1. Token expired
        2. Session expired
        3. User access group
        4. IP address

    :param access_groups: user group or list of groups,
            that has permissions to make request for current rule
    :param verify: True/False - raise error if token expired or not
    """
    if isinstance(access_groups, str):
        access_groups = [access_groups]

    token_header = request.headers.get('Authorization', '').split()
    token = token_header[1] if len(token_header) == 2 and token_header[0] == 'Bearer' else None

    if not token:
        _log.warning('Token not found: %r', token_header)
        raise errors.UnauthorizedError('Token not found')

    try:
        payload = jwt.decode(token, app.config['AUTH_KEY'], verify=verify)
    except jwt_err.ExpiredSignatureError as err:
        _log.debug('Token expired: %r', err)
        raise errors.UnauthorizedError('Token expired')
    except jwt_err.InvalidTokenError as err:
        _log.warning('Wrong token: %r', err)
        raise errors.UnauthorizedError('Wrong token')

    groups = payload.get('groups', [])
    user_id = payload.get('user_id', '')

    if not (set(groups) & set(access_groups)):
        _log.warning('User %s not allowed to make such request. Need permissions: %r', user_id, access_groups)
        raise errors.ForbiddenError('Request forbidden for such role')

    if 'system' not in groups:
        session_exp = payload.get('session_exp', 0)
        ip_addr = payload.get('ip_addr', '')

        now = _datetime_to_timestamp(datetime.utcnow())
        if session_exp < now:
            _log.debug('Session %s expired', payload.get('session_id'))
            raise errors.UnauthorizedError('Session expired')

        remote_address = request.remote_addr
        if ip_addr != remote_address:
            _log.warning('Wrong IP: %s. Token created for IP: %s', remote_address, ip_addr)
            raise errors.ForbiddenError('Request forbidden from another network')

    g.token = token
    g.user_id = user_id


def auth(access_groups=None, verify=False):
    """
    A decorator that is used to check user authorization
    for access groups only::

        @auth
        def index():
            return 'Hi to All'

        @auth('admin'):
        def secret_code():
            return 42

        @auth(['admin', 'client'])
        def registered_only():
            return 'Hello User!'

    :param access_groups: user group or list of groups,
            that has permissions to make request for current rule.
            If None - do not check permission.
    :param verify: True/False - raise error if token expired or not
    """
    def auth_decorator(handler_method):

        @wraps(handler_method)
        def _handle_with_auth(*args, **kwargs):

            _check_authorization(access_groups, verify=verify)

            return handler_method(*args, **kwargs)

        return _handle_with_auth if access_groups is not None else handler_method

    return auth_decorator


# Session

def _get_key(session_id, user_id):
    return '%s:%s' % (session_id, user_id)


def _add_token_to_session(session):
    """
    Add 'exp' (expire time) and 'token' fields into session dict
    :param session: dict with session info to be updated
    """
    session['exp'] = datetime.utcnow() + app.config['AUTH_TOKEN_LIFE_TIME']
    session['token'] = _create_token(payload=session)


def create_session(user_model):
    """
    Create user session and token with payload and store it in the Redis storage.
    After session expiration time session will be removed automatically.
    :param user_model:
    :return: dict with session information
    """
    session_id = str(uuid4())
    session_life_time = app.config['AUTH_SESSION_LIFE_TIME']

    session_key = _get_key(session_id, user_model.id)
    session = dict(
        session_id=session_id,
        session_exp=_datetime_to_timestamp(datetime.utcnow() + session_life_time),
        user_id=user_model.id,
        user_name=user_model.get_full_name(),
        ip_addr=request.remote_addr,
        groups=user_model.groups,
    )

    _log.info('Create session [%s]', session_key)

    saved = _redis_auth.setex(session_key, int(session_life_time.total_seconds()), json.dumps(session))
    if not saved:
        _log.error('Error save session [%s] in Redis', session_key)
        raise errors.ServiceUnavailableError('Error save authorization session')

    _add_token_to_session(session)

    return session


def remove_session(token):
    """
    Get session from token and remove them from Redis storage.
    :param token: token value
    """
    try:
        payload = jwt.decode(token, app.config['AUTH_KEY'])
    except jwt_err.InvalidTokenError as err:
        _log.error('Try to remove wrong token: %r', err)
        raise errors.UnauthorizedError('Wrong token')

    session_key = _get_key(payload.get('session_id'), payload.get('user_id'))

    _log.info('Remove session [%s]', session_key)
    _redis_auth.delete(session_key)


def remove_all_sessions(user_id):
    """
    Remove all session for current user
    :param user_id: user identifier
    """
    key_pattern = _get_key('*', user_id)
    _log.info('Remove all sessions for user [%s]', user_id)

    session_keys = _redis_auth.keys(key_pattern)
    _redis_auth.delete(session_keys)


def refresh_session(token):
    """
    Get session for token and generate new token with new expire time
    :param token: previous token
    :return: session with new token
    """
    try:
        payload = jwt.decode(token, app.config['AUTH_KEY'])
    except jwt_err.InvalidTokenError as err:
        _log.error('Try to refresh wrong token: %r', err)
        raise errors.UnauthorizedError('Wrong token')

    session_key = _get_key(payload['session_id'], payload['user_id'])

    _log.info('Refresh token for session [%s]', session_key)

    session_value = _redis_auth.get(session_key)
    if not session_value:
        _log.error('Try to refresh unknown session [%s]', session_key)
        raise errors.UnauthorizedError('Authorization session not found')

    session = json.loads(session_value.decode())
    _add_token_to_session(session)

    return session


# Invite user token

def generate_invite_token(user_id):
    """
    Token for user invite and enable to set password
    :param user_id: user identifier
    :return invite JWT token
    """
    payload = dict(
        exp=datetime.utcnow() + app.config['AUTH_INVITE_LIFE_TIME'],
        user_id=user_id,
    )
    return _create_token(payload=payload)


def get_invite_user_id(token):
    """
    Check invite token and return user id or None if not valid
    :param token: invite JWT token
    :return: user_id or None
    """
    # FIXME: add token to blacklist (?)
    try:
        payload = jwt.decode(token, app.config['AUTH_KEY'])
    except jwt_err.ExpiredSignatureError as err:
        _log.debug('Invite token expired: %r', err)
        return None
    except jwt_err.InvalidTokenError as err:
        _log.warning('Wrong invite token: %r', err)
        return None

    return payload.get('user_id')


# System

def get_system_token():
    """
    System token to communicate between internal services
    :return: system JWT token
    """
    payload = dict(
        exp=datetime.utcnow() + app.config['AUTH_TOKEN_LIFE_TIME'],
        user_id=app.config['AUTH_SYSTEM_USER_ID'],
        groups=['system'],
    )
    return _create_token(payload=payload)
