from flask import request

from api import api_v1, utils

__author__ = 'Kostel Serhii'


@api_v1.route('/statistics/payments', methods=['GET'], auth=['admin'])
def payments_statistics():
    """Proxy statistic request to Client service"""
    proxy_resp = utils.client_server_get_request('/statistics/payments', **request.args)
    return proxy_resp.text, proxy_resp.status_code, proxy_resp.headers.items()
