from flask import jsonify

from xopay import app
from xopay.models import Currency
from xopay.schemas import CurrencySchema

__author__ = 'Omelchenko Daniel'


@app.route('/api/admin/dev/currency/current', methods=['GET'])
def currency():
    # TODO: add_filter
    exchange_rates = Currency.query.all()

    schema = CurrencySchema(many=True)
    result = schema.dump(exchange_rates)
    return jsonify(exchange_rates=result.data)
