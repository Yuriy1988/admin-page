from flask import request, jsonify, Response

from api import api_v1, db, utils, auth
from api.errors import NotFoundError, ValidationError
from api.models import Merchant, MerchantContract, PaySysContract, PaymentSystem
from api.schemas import MerchantContractSchema, PaySysContractSchema, ContractRequestSchema

__author__ = 'Kostel Serhii'


# Merchant Contract

@api_v1.route('/merchants/<merchant_id>/contracts', methods=['GET'])
@auth.auth('admin', 'system')
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

    contracts = query.order_by('id').all()

    schema = MerchantContractSchema(many=True)
    result = schema.dump(contracts)
    return jsonify(contracts=result.data)


@api_v1.route('/merchants/<merchant_id>/contracts', methods=['POST'])
@auth.auth('admin')
def merchant_contract_create(merchant_id):
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


@api_v1.route('/merchant_contracts/<int:merchant_contract_id>', methods=['GET'])
@auth.auth('admin')
def merchant_contract_detail(merchant_contract_id):
    contract = MerchantContract.query.get(merchant_contract_id)
    if not contract:
        raise NotFoundError()

    schema = MerchantContractSchema(many=False)
    result = schema.dump(contract)
    return jsonify(result.data)


@api_v1.route('/merchant_contracts/<int:merchant_contract_id>', methods=['PUT'])
@auth.auth('admin')
def merchant_contract_update(merchant_contract_id):
    contract = MerchantContract.query.get(merchant_contract_id)
    if not contract:
        raise NotFoundError()

    schema = MerchantContractSchema(partial=True, partial_nested=True)
    data, errors = schema.load(request.get_json(), origin_model=contract)
    if errors:
        raise ValidationError(errors=errors)

    if data:
        contract.update(data)
        db.session.commit()

    result = schema.dump(contract)
    return jsonify(result.data)


@api_v1.route('/merchant_contracts/<int:merchant_contract_id>', methods=['DELETE'])
@auth.auth('admin')
def merchant_contract_delete(merchant_contract_id):
    delete_count = MerchantContract.query.filter_by(id=merchant_contract_id).delete()
    if delete_count == 0:
        raise NotFoundError()

    db.session.commit()
    return Response(status=200)


@api_v1.route('/merchant_contract/<int:merchant_contract_id>/upload/contract_doc_url', methods=['POST'])
@auth.auth('admin')
def merchant_contract_upload_contract_doc_url(merchant_contract_id):
    merchant_contract = MerchantContract.query.get(merchant_contract_id)
    if not merchant_contract:
        raise NotFoundError()

    file_url = utils.upload_media_file(allowed_extensions={'pdf', }, upload_subdir='merchant_contracts')
    if merchant_contract.contract_doc_url:
        utils.remove_media_file(merchant_contract.contract_doc_url)

    merchant_contract.contract_doc_url = file_url
    db.session.commit()

    return jsonify(contract_doc_url=merchant_contract.contract_doc_url)


# Payment System Contract

@api_v1.route('/payment_systems/<paysys_id>/contracts', methods=['GET'])
@auth.auth('admin', 'system')
def payment_system_contracts_list(paysys_id):
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

    contracts = query.order_by('id').all()

    schema = PaySysContractSchema(many=True)
    result = schema.dump(contracts)
    return jsonify(contracts=result.data)


@api_v1.route('/payment_systems/<paysys_id>/contracts', methods=['POST'])
@auth.auth('admin')
def payment_system_contract_create(paysys_id):
    paysys_id = paysys_id.upper()

    payment_system = PaymentSystem.query.get(paysys_id)

    if not payment_system:
        raise NotFoundError()

    schema = PaySysContractSchema()
    data, errors = schema.load(request.get_json())
    if errors:
        raise ValidationError(errors=errors)

    data['paysys_id'] = paysys_id
    contract = PaySysContract.create(data)
    db.session.commit()

    result = schema.dump(contract)
    return jsonify(result.data)


@api_v1.route('/paysys_contracts/<paysys_contract_id>', methods=['GET'])
@auth.auth('admin')
def payment_system_contract_detail(paysys_contract_id):
    contract = PaySysContract.query.get(paysys_contract_id)
    if not contract:
        raise NotFoundError()

    schema = PaySysContractSchema(many=False)
    result = schema.dump(contract)
    return jsonify(result.data)


@api_v1.route('/paysys_contracts/<paysys_contract_id>', methods=['PUT'])
@auth.auth('admin')
def payment_system_contract_update(paysys_contract_id):
    contract = PaySysContract.query.get(paysys_contract_id)
    if not contract:
        raise NotFoundError()

    schema = PaySysContractSchema(partial=True)
    data, errors = schema.load(request.get_json())
    if errors:
        raise ValidationError(errors=errors)

    if data:
        contract.update(data)
        db.session.commit()

    result = schema.dump(contract)
    return jsonify(result.data)


@api_v1.route('/paysys_contracts/<paysys_contract_id>', methods=['DELETE'])
@auth.auth('admin')
def payment_system_contract_delete(paysys_contract_id):
    delete_count = PaySysContract.query.filter_by(id=paysys_contract_id).delete()
    if delete_count == 0:
        raise NotFoundError()

    db.session.commit()
    return Response(status=200)


@api_v1.route('/paysys_contract/<int:paysys_contract_id>/upload/contract_doc_url', methods=['POST'])
@auth.auth('admin')
def payment_system_contract_upload_contract_doc_url(paysys_contract_id):
    paysys_contract = PaySysContract.query.get(paysys_contract_id)
    if not paysys_contract:
        raise NotFoundError()

    file_url = utils.upload_media_file(allowed_extensions={'pdf', }, upload_subdir='paysys_contracts')
    if paysys_contract.contract_doc_url:
        utils.remove_media_file(paysys_contract.contract_doc_url)

    paysys_contract.contract_doc_url = file_url
    db.session.commit()

    return jsonify(contract_doc_url=paysys_contract.contract_doc_url)
