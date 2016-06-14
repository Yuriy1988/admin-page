import pytz
from datetime import datetime, timedelta
from flask import jsonify, request, Response

from api import api_v1, db, auth
from api.errors import ValidationError
from api.models import Currency
from api.schemas import CurrencySchema, CurrencyRequestSchema

__author__ = 'Omelchenko Daniel, Kostel Serhii'


@api_v1.route('/currency/current', methods=['GET'])
@auth.auth('admin', 'merchant', 'manager')
def currency_current():
    request_schema = CurrencyRequestSchema()
    data, errors = request_schema.load(request.args)
    if errors:
        raise ValidationError(errors=errors)

    query = Currency.query
    if 'from_currency' in data:
        query = query.filter_by(from_currency=data['from_currency'])
    if 'to_currency' in data:
        query = query.filter_by(to_currency=data['to_currency'])

    last_commit = Currency.request_last_commit_time()
    if last_commit:
        query = query.filter_by(commit_time=last_commit)
    currency = query.all()

    schema = CurrencySchema(many=True)
    result = schema.dump(currency)
    return jsonify(current=result.data)


@api_v1.route('/currency/history', methods=['GET'])
@auth.auth('admin', 'merchant', 'manager')
def currency_history():
    request_schema = CurrencyRequestSchema()
    data, errors = request_schema.load(request.args)
    if errors:
        raise ValidationError(errors=errors)

    query = Currency.query
    if 'from_currency' in data:
        query = query.filter_by(from_currency=data['from_currency'])
    if 'to_currency' in data:
        query = query.filter_by(to_currency=data['to_currency'])
    if 'from_date' in data:
        query = query.filter(Currency.commit_time >= data['from_date'])
    if 'till_date' in data:
        query = query.filter(Currency.commit_time < data['till_date'] + timedelta(days=1))

    schema = CurrencySchema(many=True)
    result = schema.dump(query.all())
    return jsonify(history=result.data)


@api_v1.route('/currency/update', methods=['POST'])
@auth.auth('system')
def currency_update():
    """ Handler for currency daemon to update (add new record) information about currency. """
    data_json = request.get_json(silent=True)
    if not data_json or 'update' not in data_json:
        raise ValidationError(message='Wrong JSON or update field missing')

    schema = CurrencySchema(many=True)
    data, errors = schema.load(data_json['update'])
    if errors:
        raise ValidationError(errors=errors)

    commit_time = datetime.now(tz=pytz.utc)
    curr_pair_set = set()

    for curr in data:
        cur_pair = (curr['from_currency'], curr['to_currency'])
        if cur_pair in curr_pair_set:
            continue

        curr_pair_set.add(cur_pair)
        curr['commit_time'] = commit_time

        Currency.create(curr)

    db.session.commit()

    return Response(response='', status=200, mimetype='application/json')
