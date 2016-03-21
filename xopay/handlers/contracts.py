from flask import request, jsonify, Response

from xopay import app, db
from xopay.errors import NotFoundError, ValidationError
from xopay.models import Merchant, MerchantContract, BankContract, PaymentSystem
from xopay.schemas import MerchantContractSchema, BankContractSchema, ContractRequestSchema


@app.route('/api/admin/dev/merchants/<merchant_id>/contracts', methods=['GET'])
def merchant_contracts_list(merchant_id):
    if not Merchant.exists(merchant_id):
        raise NotFoundError()

    request_schema = ContractRequestSchema()
    data, errors = request_schema.load(request.args)
    if errors:
        raise ValidationError(errors=errors)

    query = MerchantContract.query.filter_by(merchant_id=merchant_id)
    if 'active' in data:
        query = query.filter_by(active=data['active'])
    if 'currency' in data:
        query = query.filter_by(currency=data['currency'])

    contracts = query.all()

    schema = MerchantContractSchema(many=True)
    result = schema.dump(contracts)
    return jsonify(contracts=result.data)


@app.route('/api/admin/dev/merchants/<merchant_id>/contracts', methods=['POST'])
def create_merchant_contract(merchant_id):
    if not Merchant.exists(merchant_id):
        raise NotFoundError()

    schema = MerchantContractSchema()
    data, errors = schema.load(request.get_json())
    if errors:
        raise ValidationError(errors=errors)

    data['merchant_id'] = merchant_id
    contract = MerchantContract.create(data)
    db.session.commit()

    result = schema.dump(contract)
    return jsonify(result.data)


@app.route('/api/admin/dev/merchant_contracts/<int:contract_id>', methods=['GET'])
def merchant_contract(contract_id):
    contract = MerchantContract.query.get(contract_id)
    if not contract:
        raise NotFoundError()

    schema = MerchantContractSchema(many=False)
    result = schema.dump(contract)
    return jsonify(result.data)


@app.route('/api/admin/dev/merchant_contracts/<int:contract_id>', methods=['PUT'])
def update_merchant_contract(contract_id):
    contract = MerchantContract.query.get(contract_id)
    if not contract:
        raise NotFoundError()

    schema = MerchantContractSchema(partial=True, partial_nested=True)
    data, errors = schema.load(request.get_json(), origin_model=contract)
    if errors:
        raise ValidationError(errors=errors)

    contract.update(data)
    db.session.commit()

    result = schema.dump(contract)
    return jsonify(result.data)


@app.route('/api/admin/dev/merchant_contracts/<int:contract_id>', methods=['DELETE'])
def delete_merchant_contract(contract_id):
    if not MerchantContract.exists(contract_id):
        raise NotFoundError()

    MerchantContract.query.filter_by(id=contract_id).delete()
    return Response(status=200)


@app.route('/api/admin/dev/payment_systems/<paysys_id>/contracts', methods=['GET'])
def bank_contracts_list(paysys_id):
    if not PaymentSystem.exists(paysys_id):
        raise NotFoundError()

    request_schema = ContractRequestSchema()
    data, errors = request_schema.load(request.args)

    if errors:
        raise ValidationError(errors=errors)

    query = BankContract.query.filter_by(payment_system_id=paysys_id)
    if 'active' in data:
        query = query.filter_by(active=data['active'])
    if 'currency' in data:
        query = query.filter_by(currency=data['currency'])

    contracts = query.all()

    schema = BankContractSchema(many=True)
    result = schema.dump(contracts)
    return jsonify(contracts=result.data)


@app.route('/api/admin/dev/payment_systems/<paysys_id>/contracts', methods=['POST'])
def create_bank_contract(paysys_id):
    if not PaymentSystem.exists(paysys_id):
        raise NotFoundError()

    schema = BankContractSchema()
    data, errors = schema.load(request.get_json())
    if errors:
        raise ValidationError(errors=errors)

    data['payment_system_id'] = paysys_id
    contract = BankContract.create(data)
    db.session.commit()

    result = schema.dump(contract)
    return jsonify(result.data)


@app.route('/api/admin/dev/paysys_contracts/<paysys_contract_id>', methods=['GET'])
def bank_contract(paysys_contract_id):
    contract = BankContract.query.get(paysys_contract_id)
    if not contract:
        raise NotFoundError()

    schema = BankContractSchema(many=False)
    result = schema.dump(contract)
    return jsonify(result.data)


@app.route('/api/admin/dev/paysys_contracts/<paysys_contract_id>', methods=['PUT'])
def update_bank_contract(paysys_contract_id):
    contract = BankContract.query.get(paysys_contract_id)
    if not contract:
        raise NotFoundError()

    schema = BankContractSchema(partial=True, partial_nested=True)
    data, errors = schema.load(request.get_json())
    if errors:
        raise ValidationError(errors=errors)

    contract.update(data)
    db.session.commit()

    result = schema.dump(contract)
    return jsonify(result.data)


@app.route('/api/admin/dev/paysys_contracts/<paysys_contract_id>', methods=['DELETE'])
def delete_bank_contract(paysys_contract_id):
    if not BankContract.exists(paysys_contract_id):
        raise NotFoundError()

    BankContract.query.filter_by(id=paysys_contract_id).delete()
    return Response(status=200)
