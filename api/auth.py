import redis
import json
import logging
import jwt
import jwt.exceptions as jwt_err
from calendar import timegm
from uuid import uuid4
from datetime import datetime
from functools import wraps
from flask import g, request

from api import app, errors

__author__ = 'Kostel Serhii'


_log = logging.getLogger('auth')
_redis_auth = redis.StrictRedis(db=1)


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

    session_exp = payload.get('session_exp', 0)
    ip_addr = payload.get('ip_addr', '')
    groups = payload.get('groups', [])
    user_id = payload.get('user_id', '')

    now = timegm(datetime.utcnow().utctimetuple())
    if session_exp < now:
        _log.debug('Session %s expired', payload.get('session_id'))
        raise errors.UnauthorizedError('Session expired')

    if not (set(groups) & set(access_groups)):
        _log.warning('User %s not allowed to make such request. Need permissions: %r', user_id, access_groups)
        raise errors.ForbiddenError('Request forbidden for such role')

    if ip_addr != request.remote_addr:
        _log.warning('Wrong IP: %s. Token created for IP: %s', request.remote_addr, ip_addr)
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


def _add_token(session):
    """
    Add 'exp' (expire time) and 'token' fields into session dict
    :param session: dict with session info to be updated
    """
    session['exp'] = datetime.utcnow() + app.config['AUTH_TOKEN_LIFE_TIME']
    token = jwt.encode(session, app.config['AUTH_KEY'], algorithm=app.config['AUTH_ALGORITHM'])
    session['token'] = token


def create_session(user_model):
    """
    Create user session and token with payload and store it in the Redis storage.
    After session expiration time session will be removed automatically.
    :param user_model:
    :return: dict with session information
    """
    session_id = uuid4()
    session_life_time = app.config['AUTH_SESSION_LIFE_TIME']

    session_key = _get_key(session_id, user_model.id)
    session = dict(
        session_id=session_id,
        session_exp=datetime.utcnow() + session_life_time,
        user_id=user_model.id,
        user_name=user_model.get_full_name(),
        ip_addr=request.remote_addr,
        groups=user_model.get_groups(),
    )

    _log.info('Create session [%s]', session_key)

    saved = _redis_auth.setex(session_key, session_life_time.total_seconds(), json.dumps(session))
    if not saved:
        _log.error('Error save session [%s] in Redis', session_key)
        raise errors.ServiceUnavailableError('Error save authorization session')

    _add_token(session)

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

    session_key = _get_key(payload['session_id'], payload['user_id'])

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
    _add_token(session)

    return session
