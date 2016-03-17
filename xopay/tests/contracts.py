from copy import deepcopy

from xopay.tests import base
from xopay.utils import prettify
from xopay.models import enum

__author__ = 'Daniel Omelchenko'


class TestMerchantContracts(base.BaseTestCase):

    # GET /merchants/{merchant_id}/contracts

    def test_get_contracts_list_empty(self):
        merchant = self.create_merchant(self._merchant)
        status, body = self.get('/merchants/{merchant_id}/contracts'.format(merchant_id=merchant.id))

        self.assertEqual(status, 200, msg=body.get('error', ''))
        self.assertListEqual(body['contracts'], [])

    def test_get_merchant_not_found(self):
        status, body = self.get('/merchants/{merchant_id}/contracts'.format(merchant_id=0))

        self.assertEqual(status, 404, msg=body.get('error', ''))

    def test_get_contract_list(self):
        merchant = self.create_merchant(self._merchant)
        expected_contracts = []
        for i in range(10):
            merchant_contract = deepcopy(self._merchant_contract)
            merchant_contract["id"] = self.create_merchant_contract(merchant_contract, merchant.id).id
            expected_contracts.append(merchant_contract)
        status, body = self.get('/merchants/{merchant_id}/contracts'.format(merchant_id=merchant.id))

        self.assertEqual(status, 200, msg=body.get('error', ''))
        for i, j in zip(body['contracts'], expected_contracts):
            self.assertDictEqual(i, j)

    def test_get_contract_list_filtering(self):
        merchant = self.create_merchant(self._merchant)
        for i in range(3):
            merchant_contract = deepcopy(self._merchant_contract)
            self.create_merchant_contract(merchant_contract, merchant.id, active=False)
        for i in range(3):
            merchant_contract = deepcopy(self._merchant_contract)
            self.create_merchant_contract(merchant_contract, merchant.id, currency='UAH')
        expected_contracts = []
        for i in range(3):
            merchant_contract = deepcopy(self._merchant_contract)
            merchant_contract["id"] = self.create_merchant_contract(merchant_contract, merchant.id).id
            expected_contracts.append(merchant_contract)

        status, body = self.get('/merchants/{merchant_id}/contracts?currency=USD&active=true'.format(merchant_id=merchant.id))

        self.assertEqual(status, 200, msg=body.get('error', ''))
        for i, j in zip(body['contracts'], expected_contracts):
            self.assertDictEqual(i, j)

    def test_get_contract_empty_list_filtering(self):
        merchant = self.create_merchant(self._merchant)
        for i in range(3):
            merchant_contract = deepcopy(self._merchant_contract)
            self.create_merchant_contract(merchant_contract, merchant.id, active=False)
        for i in range(3):
            merchant_contract = deepcopy(self._merchant_contract)
            self.create_merchant_contract(merchant_contract, merchant.id, currency='UAH')

        status, body = self.get('/merchants/{merchant_id}/contracts?currency=USD&active=true'.format(merchant_id=merchant.id))

        self.assertEqual(status, 200, msg=body.get('error', ''))
        self.assertEqual(body['contracts'], [], msg=body.get('error', ''))

    # POST /merchants/{merchant_id}/contracts

    def test_post_contract(self):
        merchant = self.create_merchant(self._merchant)
        merchant_contract = deepcopy(self._merchant_contract)

        status, body = self.post('/merchants/{merchant_id}/contracts'.format(
            merchant_id=merchant.id
        ), merchant_contract)

        self.assertEqual(status, 200, msg=body.get('error', ''))

        merchant_contract["id"] = body.get('id')
        self.assertDictEqual(body, merchant_contract)

        status, body = self.get('/merchant_contracts/{contract_id}'.format(
            contract_id=merchant_contract["id"],
        ))
        self.assertEqual(status, 200, msg=body.get('error', ''))
        self.assertDictEqual(body, merchant_contract)

    # GET /merchant_contracts/{contract_id}

    def test_get_contract_not_found(self):
        status, body = self.get('/merchant_contracts/{contract_id}'.format(
            contract_id=1,
        ))

        self.assertEqual(status, 404, msg=body.get('error', ''))

    def test_get_contract(self):
        merchant = self.create_merchant(self._merchant)
        merchant_contract = deepcopy(self._merchant_contract)
        contract = self.create_merchant_contract(merchant_contract, merchant.id)
        merchant_contract["id"] = contract.id

        status, body = self.get('/merchant_contracts/{contract_id}'.format(
            contract_id=contract.id,
        ))

        self.assertEqual(status, 200, msg=body.get('error', ''))
        self.assertDictEqual(body, merchant_contract, msg="\nEXPECTED:\n{}\nACTUAL:\n{}".format(
            prettify(merchant_contract),
            prettify(body))
        )

    # PUT /merchant_contracts/{contract_id}

    def test_put_contract(self):
        merchant = self.create_merchant(self._merchant)
        merchant_contract = deepcopy(self._merchant_contract)
        contract = self.create_merchant_contract(merchant_contract, merchant.id)
        merchant_contract["id"] = contract.id

        merchant_contract_update = {
            "commission_fixed": "3.5",
            "active": False
        }

        status, body = self.put('/merchant_contracts/{contract_id}'.format(
            contract_id=contract.id,
        ), merchant_contract_update)

        merchant_contract.update(merchant_contract_update)

        self.assertEqual(status, 200, msg=body.get('error', ''))
        self.assertDictEqual(body, merchant_contract)

    def test_put_not_found_contract(self):
        status, body = self.put('/merchant_contracts/{contract_id}'.format(
            contract_id=1,
        ), {})

        self.assertEqual(status, 404, msg=body.get('error', ''))

    # DELETE /merchant_contracts/{contract_id}

    def test_delete_contract(self):
        merchant = self.create_merchant(self._merchant)
        merchant_contract = deepcopy(self._merchant_contract)
        contract = self.create_merchant_contract(merchant_contract, merchant.id)
        merchant_contract["id"] = contract.id

        status, body = self.delete('/merchant_contracts/{contract_id}'.format(
            contract_id=contract.id,
        ))

        self.assertEqual(status, 200)

        status, body = self.get('/merchant_contracts/{contract_id}'.format(
            contract_id=contract.id,
        ))
        self.assertEqual(status, 404)

    def test_delete_not_found_contract(self):
        status, body = self.delete('/merchant_contracts/{contract_id}'.format(
            contract_id=1,
        ))
        self.assertEqual(status, 404)


class TestBankContracts(base.BaseTestCase):

    # GET /payment_systems/{paysys_id}/contracts

    def test_get_contracts_list_empty(self):
        payment_system = self.create_payment_system(self._payment_system)
        status, body = self.get('/payment_systems/{paysys_id}/contracts'.format(paysys_id=payment_system.paysys_id))

        self.assertEqual(status, 200, msg=body.get('error', ''))
        self.assertListEqual(body['contracts'], [])

    def test_get_paysys_not_found(self):
        status, body = self.get('/payment_systems/{paysys_id}/contracts'.format(
            paysys_id=enum.PAYMENT_SYSTEMS_ID_ENUM[0]))

        self.assertEqual(status, 404, msg=body.get('error', ''))

    def test_get_contract_list(self):
        payment_system = self.create_payment_system(self._payment_system)
        expected_contracts = []
        for i in range(10):
            bank_contract = deepcopy(self._bank_contract)
            bank_contract["id"] = self.create_bank_contract(bank_contract, payment_system.paysys_id).id
            expected_contracts.append(bank_contract)
        status, body = self.get('/payment_systems/{paysys_id}/contracts'.format(paysys_id=payment_system.paysys_id))

        self.assertEqual(status, 200, msg=body.get('error', ''))
        for i, j in zip(body['contracts'], expected_contracts):
            self.assertDictEqual(i, j)

    def test_get_contract_list_filtering(self):
        payment_system = self.create_payment_system(self._payment_system)
        for i in range(3):
            bank_contract = deepcopy(self._bank_contract)
            self.create_bank_contract(bank_contract, payment_system.paysys_id, active=False)
        for i in range(3):
            bank_contract = deepcopy(self._bank_contract)
            self.create_bank_contract(bank_contract, payment_system.paysys_id, currency='UAH')
        expected_contracts = []
        for i in range(3):
            bank_contract = deepcopy(self._bank_contract)
            bank_contract["id"] = self.create_bank_contract(bank_contract, payment_system.paysys_id).id
            expected_contracts.append(bank_contract)

        status, body = self.get('/payment_systems/{paysys_id}/contracts?currency=USD&active=true'.format(
            paysys_id=payment_system.paysys_id)
        )

        self.assertEqual(status, 200, msg=body.get('error', ''))
        for i, j in zip(body['contracts'], expected_contracts):
            self.assertDictEqual(i, j)

    def test_get_contract_empty_list_filtering(self):
        payment_system = self.create_payment_system(self._payment_system)
        for i in range(3):
            bank_contract = deepcopy(self._bank_contract)
            self.create_bank_contract(bank_contract, payment_system.paysys_id, active=False)
        for i in range(3):
            bank_contract = deepcopy(self._bank_contract)
            self.create_bank_contract(bank_contract, payment_system.paysys_id, currency='UAH')

        status, body = self.get('/payment_systems/{paysys_id}/contracts?currency=USD&active=true'.format(
            paysys_id=payment_system.paysys_id)
        )

        self.assertEqual(status, 200, msg=body.get('error', ''))
        self.assertEqual(body['contracts'], [], msg=body.get('error', ''))

    # POST /payment_systems/{paysys_id}/contracts

    def test_post_contract(self):
        payment_system = self.create_payment_system(self._payment_system)
        bank_contract = deepcopy(self._bank_contract)

        status, body = self.post('/payment_systems/{paysys_id}/contracts'.format(
            paysys_id=payment_system.paysys_id
        ), bank_contract)

        self.assertEqual(status, 200, msg=body.get('error', ''))

        bank_contract["id"] = body.get('id')
        self.assertDictEqual(body, bank_contract)

        status, body = self.get('/paysys_contracts/{paysys_contract_id}'.format(
            paysys_contract_id=bank_contract["id"],
        ))
        self.assertEqual(status, 200, msg=body.get('error', ''))
        self.assertDictEqual(body, bank_contract)

    # GET /paysys_contracts/{paysys_contract_id}

    def test_get_contract_not_found(self):
        status, body = self.get('/paysys_contracts/{paysys_contract_id}'.format(
            paysys_contract_id=1,
        ))

        self.assertEqual(status, 404, msg=body.get('error', ''))

    def test_get_contract(self):
        payment_system = self.create_payment_system(self._payment_system)
        bank_contract = deepcopy(self._bank_contract)
        contract = self.create_bank_contract(bank_contract, payment_system.paysys_id)
        bank_contract["id"] = contract.id

        status, body = self.get('/paysys_contracts/{paysys_contract_id}'.format(
            paysys_contract_id=contract.id,
        ))

        self.assertEqual(status, 200, msg=body.get('error', ''))
        self.assertDictEqual(body, bank_contract, msg="\nEXPECTED:\n{}\nACTUAL:\n{}".format(
            prettify(bank_contract),
            prettify(body))
        )

    # PUT /paysys_contracts/{paysys_contract_id}

    def test_put_contract(self):
        payment_system = self.create_payment_system(self._payment_system)
        bank_contract = deepcopy(self._bank_contract)
        contract = self.create_bank_contract(bank_contract, payment_system.paysys_id)
        bank_contract["id"] = contract.id

        bank_contract_update = {
            "commission_fixed": "3.5",
            "active": False
        }

        status, body = self.put('/paysys_contracts/{paysys_contract_id}'.format(
            paysys_contract_id=contract.id,
        ), bank_contract_update)

        bank_contract.update(bank_contract_update)

        self.assertEqual(status, 200, msg=body.get('error', ''))
        self.assertDictEqual(body, bank_contract)

    def test_put_not_found_contract(self):
        status, body = self.put('/paysys_contracts/{paysys_contract_id}'.format(
            paysys_contract_id=1,
        ), {})

        self.assertEqual(status, 404, msg=body.get('error', ''))

    # DELETE /paysys_contracts/{paysys_contract_id}

    def test_delete_contract(self):
        payment_system = self.create_payment_system(self._payment_system)
        bank_contract = deepcopy(self._bank_contract)
        contract = self.create_bank_contract(bank_contract, payment_system.paysys_id)
        bank_contract["id"] = contract.id

        status, body = self.delete('/paysys_contracts/{paysys_contract_id}'.format(
            paysys_contract_id=contract.id,
        ))

        self.assertEqual(status, 200)

        status, body = self.get('/paysys_contracts/{paysys_contract_id}'.format(
            paysys_contract_id=contract.id,
        ))
        self.assertEqual(status, 404)

    def test_delete_not_found_contract(self):
        status, body = self.delete('/paysys_contracts/{paysys_contract_id}'.format(
            paysys_contract_id=1,
        ))
        self.assertEqual(status, 404)
