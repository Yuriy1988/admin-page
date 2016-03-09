from flask import jsonify, request
from sqlalchemy import desc

from xopay import app
from xopay.models import Currency
from xopay.schemas import CurrencySchema

__author__ = 'Omelchenko Daniel'


@app.route('/api/admin/dev/currency/current', methods=['GET'])
def currency():
    latest_version = Currency.query.order_by(desc(Currency.commit_time)).first().commit_time
    exchange_rates = Currency.query.filter_by(commit_time=latest_version).all()

    schema = CurrencySchema(many=True)
    result = schema.dump(exchange_rates)
    return jsonify(exchange_rates=result.data)


@app.route('/api/admin/dev/currency/history', methods=['GET'])
def currency_history():
    from_currency = request.args.get('from_currency', '')
    to_currency = request.args.get('to_currency', '')
    date_from = request.args.get('date_from', '')
    date_to = request.args.get('date_to', '')

    exchange_rates = Currency.query\
        .filter(Currency.to_currency == to_currency)\
        .filter(Currency.from_currency == from_currency)

    if date_from:
        exchange_rates = exchange_rates.filter(Currency.commit_time >= date_from)
    if date_to:
        exchange_rates = exchange_rates.filter(Currency.commit_time <= date_to)

    exchange_rates = exchange_rates.all()

    schema = CurrencySchema(many=True)
    result = schema.dump(exchange_rates)
    return jsonify(exchange_rates=result.data)
