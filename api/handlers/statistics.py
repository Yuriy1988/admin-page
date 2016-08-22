import json
from api.models import Store
from flask import request, jsonify

from api import api_v1, utils, auth, db
from .decorators import owner_access_only

__author__ = 'Kostel Serhii'


def _proxy_request(url, request_args):
    """Proxy statistic request to Client service."""
    proxy_resp = utils.client_server_get_request(url, **request_args)
    return proxy_resp.text, proxy_resp.status_code, proxy_resp.headers.items()


@api_v1.route('/statistics/payments', methods=['GET'])
@auth.auth('admin')
def payments_statistics():
    return _proxy_request('/statistics/payments', request.args)


@api_v1.route('/statistics/payments_count', methods=['GET'])
@auth.auth('admin')
def payments_count_statistics():
    text, status_code, headers = _proxy_request('/statistics/payments_count', request.args)
    if status_code == 200 and request.args.get('by') == 'store':
        store_counts_json = json.loads(text)

        for count in store_counts_json["counts"]:
            count["value"] = Store.query.filter_by(id=count["value"]).first().store_name

        text = json.dumps(store_counts_json)
    return text, status_code, headers


@api_v1.route('/statistics/store/<store_id>', methods=['GET'])
@auth.auth('merchant', 'manager')
@owner_access_only
def store_payments_statistics(store_id):
    request_args = request.args.copy()
    request_args['store_id'] = store_id
    return _proxy_request('/statistics/payments', request_args)
