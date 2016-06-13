from flask import request

from api import api_v1, utils, auth
from .decorators import owner_access_only

__author__ = 'Kostel Serhii'


def _payments_statistics_proxy(request_args):
    """Proxy statistic request to Client service."""
    proxy_resp = utils.client_server_get_request('/statistics/payments', **request_args)
    return proxy_resp.text, proxy_resp.status_code, proxy_resp.headers.items()


@api_v1.route('/statistics/payments', methods=['GET'])
@auth.auth('admin')
def payments_statistics():
    return _payments_statistics_proxy(request.args)


@api_v1.route('/statistics/store/<store_id>', methods=['GET'])
@auth.auth('merchant')
@owner_access_only
def store_payments_statistics(store_id):
    request_args = request.args.copy()
    request_args['store_id'] = store_id
    return _payments_statistics_proxy(request_args)
