from datetime import timedelta
from sqlalchemy import desc
from flask import jsonify, request

from xopay import app
from xopay.errors import ValidationError
from xopay.models import Currency
from xopay.schemas import CurrencySchema, CurrencyRequestSchema

__author__ = 'Omelchenko Daniel'


@app.route('/api/admin/dev/currency/current', methods=['GET'])
def currency():
    request_schema = CurrencyRequestSchema()
    data, errors = request_schema.load(request.args)
    if errors:
        raise ValidationError(errors=errors)

    query = Currency.query
    if 'from_currency' in data:
        query = query.filter_by(from_currency=data['from_currency'])
    if 'to_currency' in data:
        query = query.filter_by(to_currency=data['to_currency'])

    last_currency = Currency.query.order_by(desc(Currency.commit_time)).first()
    if last_currency:
        query = query.filter_by(commit_time=last_currency.commit_time)

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


# TODO: add API for currency load
