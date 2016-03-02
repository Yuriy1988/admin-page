from flask import jsonify, request
from sqlalchemy import desc

from xopay import app
from xopay.models import Currency
from xopay.schemas import CurrencySchema, CurrencyHistorySchema

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
    ccy = request.args.get('ccy', '')
    base_ccy = request.args.get('base_ccy', '')
    date_from = request.args.get('date_from', '')
    date_to = request.args.get('date_to', '')

    exchange_rates = Currency.query.filter(Currency.ccy == ccy).filter(Currency.base_ccy == base_ccy)

    if date_from:
        exchange_rates = exchange_rates.filter(Currency.commit_time >= date_from)
    if date_to:
        exchange_rates = exchange_rates.filter(Currency.commit_time <= date_to)

    exchange_rates = exchange_rates.all()

    schema = CurrencyHistorySchema(many=True)
    result = schema.dump(exchange_rates)
    return jsonify(exchange_rates=result.data)
