from flask import request, jsonify, Response

from api import app, db
from api.errors import NotFoundError, ValidationError, ForbiddenError
from api.models import Merchant, MerchantContract, PaySysContract, PaymentSystem
from api.schemas import MerchantContractSchema, PaySysContractSchema, ContractRequestSchema


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


@app.route('/api/admin/dev/merchant_contracts/<int:merchant_contract_id>', methods=['GET'])
def merchant_contract(merchant_contract_id):
    contract = MerchantContract.query.get(merchant_contract_id)
    if not contract:
        raise NotFoundError()

    schema = MerchantContractSchema(many=False)
    result = schema.dump(contract)
    return jsonify(result.data)


@app.route('/api/admin/dev/merchant_contracts/<int:merchant_contract_id>', methods=['PUT'])
def update_merchant_contract(merchant_contract_id):
    contract = MerchantContract.query.get(merchant_contract_id)
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


@app.route('/api/admin/dev/merchant_contracts/<int:merchant_contract_id>', methods=['DELETE'])
def delete_merchant_contract(merchant_contract_id):
    delete_count = MerchantContract.query.filter_by(id=merchant_contract_id).delete()
    if delete_count == 0:
        raise NotFoundError()

    db.session.commit()
    return Response(status=200)


@app.route('/api/admin/dev/payment_systems/<paysys_id>/contracts', methods=['GET'])
def paysys_contracts_list(paysys_id):
    paysys_id = paysys_id.upper()
    if not PaymentSystem.exists(paysys_id):
        raise NotFoundError()

    request_schema = ContractRequestSchema()
    data, errors = request_schema.load(request.args)

    if errors:
        raise ValidationError(errors=errors)

    query = PaySysContract.query.filter_by(paysys_id=paysys_id)
    if 'active' in data:
        query = query.filter_by(active=data['active'])
    if 'currency' in data:
        query = query.filter_by(currency=data['currency'])

    contracts = query.all()

    schema = PaySysContractSchema(many=True)
    result = schema.dump(contracts)
    return jsonify(contracts=result.data)


@app.route('/api/admin/dev/payment_systems/<paysys_id>/contracts', methods=['POST'])
def create_paysys_contract(paysys_id):
    paysys_id = paysys_id.upper()

    payment_system = PaymentSystem.query.get(paysys_id)

    if not payment_system:
        raise NotFoundError()

    if not payment_system.is_allowed_to_use():
        raise ForbiddenError('Payment system is not allowed to use')

    schema = PaySysContractSchema()
    data, errors = schema.load(request.get_json())
    if errors:
        raise ValidationError(errors=errors)

    data['paysys_id'] = paysys_id
    contract = PaySysContract.create(data)
    db.session.commit()

    result = schema.dump(contract)
    return jsonify(result.data)


@app.route('/api/admin/dev/paysys_contracts/<paysys_contract_id>', methods=['GET'])
def paysys_contract(paysys_contract_id):
    contract = PaySysContract.query.get(paysys_contract_id)
    if not contract:
        raise NotFoundError()

    schema = PaySysContractSchema(many=False)
    result = schema.dump(contract)
    return jsonify(result.data)


@app.route('/api/admin/dev/paysys_contracts/<paysys_contract_id>', methods=['PUT'])
def update_paysys_contract(paysys_contract_id):
    contract = PaySysContract.query.get(paysys_contract_id)
    if not contract:
        raise NotFoundError()

    schema = PaySysContractSchema(partial=True)
    data, errors = schema.load(request.get_json())
    if errors:
        raise ValidationError(errors=errors)

    contract.update(data)
    db.session.commit()

    result = schema.dump(contract)
    return jsonify(result.data)


@app.route('/api/admin/dev/paysys_contracts/<paysys_contract_id>', methods=['DELETE'])
def delete_paysys_contract(paysys_contract_id):
    delete_count = PaySysContract.query.filter_by(id=paysys_contract_id).delete()
    if delete_count == 0:
        raise NotFoundError()

    db.session.commit()
    return Response(status=200)
