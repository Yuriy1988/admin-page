from flask import jsonify, request
from sqlalchemy import desc

from xopay import app
from xopay.models import Currency
from xopay.schemas import CurrencySchema

__author__ = 'Omelchenko Daniel'


@app.route('/api/admin/dev/currency/current', methods=['GET'])
def currency():
    from_currency = request.args.get('from_currency')
    to_currency = request.args.get('to_currency')

    latest_version = Currency.query.order_by(desc(Currency.commit_time)).first().commit_time

    query = Currency.query.filter_by(commit_time=latest_version).all()
    if from_currency:
        query = query.filter_by(from_currency=from_currency)
    if to_currency:
        query = query.filter_by(to_currency=to_currency)
    currencies = query.all()

    schema = CurrencySchema(many=True)
    result = schema.dump(currencies)
    return jsonify(current=result.data)


@app.route('/api/admin/dev/currency/history', methods=['GET'])
def currency_history():
    from_currency = request.args.get('from_currency', '')
    to_currency = request.args.get('to_currency', '')
    # from_date = request.args.get('from_date')
    # till_date = request.args.get('till_date')

    query = Currency.query
    if from_currency:
        query = query.filter_by(from_currency=from_currency)
    if to_currency:
        query = query.filter_by(to_currency=to_currency)
    # if from_date:
    #     query = query.filter(Currency.commit_time >= from_date)
    # if till_date:
    #     query = query.filter(Currency.commit_time <= till_date)

    query = query.all()

    schema = CurrencySchema(many=True)
    result = schema.dump(query)
    return jsonify(history=result.data)
