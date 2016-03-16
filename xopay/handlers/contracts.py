from flask import request, jsonify, Response

from xopay import app, db
from xopay.errors import NotFoundError, ValidationError
from xopay.models import Merchant, MerchantContract, BankContract
from xopay.schemas import MerchantContractSchema, BankContractSchema, ContractRequestSchema


@app.route('/api/admin/dev/merchants/<int:merchant_id>/contracts', methods=['GET'])
def merchant_contracts_list(merchant_id):
    request_schema = ContractRequestSchema()
    data, errors = request_schema.load(request.args)
    if errors:
        raise ValidationError(errors=errors)

    if not Merchant.exists(merchant_id):
        raise NotFoundError()

    query = MerchantContract.query.filter_by(merchant_id=merchant_id)
    if 'active' in data:
        query = query.filter_by(active=data['active'])
    if 'currency' in data:
        query = query.filter_by(currency=data['currency'])

    contracts = query.all()

    schema = MerchantContractSchema(many=True)
    result = schema.dump(contracts)
    return jsonify(contracts=result.data)

