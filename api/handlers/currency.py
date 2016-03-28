import pytz
from datetime import datetime, timedelta
from flask import jsonify, request, Response

from api import app, db
from api.errors import ValidationError
from api.models import Currency
from api.schemas import CurrencySchema, CurrencyRequestSchema

__author__ = 'Omelchenko Daniel, Kostel Serhii'


@app.route('/api/admin/dev/currency/current', methods=['GET'])
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

    schema = CurrencySchema(many=True)
    result = schema.dump(query.all())
    return jsonify(current=result.data)


@app.route('/api/admin/dev/currency/history', methods=['GET'])
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


@app.route('/api/admin/dev/currency/update', methods=['POST'])
def currency_update():
    """ Handler for currency daemon to update (add new record) information about currency. """
    data_json = request.get_json()
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

    return Response(response='', status=200)
