from api.tests import base
from api.models import enum, MerchantContract, PaySysContract

__author__ = 'Daniel Omelchenko'


class TestMerchantContracts(base.BaseTestCase):

    # test environment

    _merchant_contract = {
        "commission_fixed": '0.1',
        "commission_pct": '2.0',
        "currency": "USD",
        "contract_doc_url": "http://contract.doc",
        "active": True,
        "filter": "*",
    }

    def create_merchant_contracts(self, merchant_id, count=1, **contract_kwargs):
        contract = self._merchant_contract.copy()
        contract.update(contract_kwargs)
        contract["merchant_id"] = merchant_id

        contract_models = [MerchantContract.create(contract) for _ in range(count)]
        self.db.commit()

        contracts = []
        for cm in contract_models:
            contract_result = contract.copy()
            contract_result['id'] = cm.id
            contracts.append(contract_result)

        return contracts

    # GET /merchants/{merchant_id}/contracts

    def test_get_contracts_list_empty(self):
        merchant = self.create_merchant(self._merchant)

        status, body = self.get('/merchants/%s/contracts' % merchant.id)

        self.assertEqual(status, 200, msg=body)
        self.assertListEqual(body['contracts'], [])

    def test_get_merchant_not_found(self):
        status, body = self.get('/merchants/0/contracts')

        self.assertEqual(status, 404, msg=body)

    def test_get_contract_list(self):
        merchant = self.create_merchant(self._merchant)
        expected_contracts = self.create_merchant_contracts(merchant.id, count=10)

        status, body = self.get('/merchants/%s/contracts' % merchant.id)

        self.assertEqual(status, 200, msg=body)
        for i, j in zip(body['contracts'], expected_contracts):
            self.assertDictEqual(i, j)

    def test_get_contract_list_filtering(self):
        merchant = self.create_merchant(self._merchant)
        self.create_merchant_contracts(merchant.id, active=False, count=3)
        self.create_merchant_contracts(merchant.id, currency='UAH', count=3)
        expected_contracts = self.create_merchant_contracts(merchant.id, count=3)

        status, body = self.get('/merchants/%s/contracts' % merchant.id, query_args={"currency": "USD", "active": True})

        self.assertEqual(status, 200, msg=body)
        for i, j in zip(body['contracts'], expected_contracts):
            self.assertDictEqual(i, j)

    def test_get_contract_empty_list_filtering(self):
        merchant = self.create_merchant(self._merchant)
        self.create_merchant_contracts(merchant.id, active=False, count=3)
        self.create_merchant_contracts(merchant.id, currency='UAH', count=3)

        status, body = self.get('/merchants/%s/contracts' % merchant.id, query_args={"currency": "USD", "active": True})

        self.assertEqual(status, 200, msg=body)
        self.assertEqual(body['contracts'], [], msg=body)

    # POST /merchants/{merchant_id}/contracts

    def test_post_contract_success(self):
        merchant = self.create_merchant(self._merchant)

        merchant_contract = self._merchant_contract.copy()
        status, body = self.post('/merchants/%s/contracts' % merchant.id, merchant_contract)

        merchant_contract["id"] = body.get('id')
        merchant_contract["merchant_id"] = merchant.id

        self.assertEqual(status, 200, msg=body)
        self.assertDictEqual(body, merchant_contract)

        status, body = self.get('/merchant_contracts/%s' % merchant_contract["id"])
        
        self.assertEqual(status, 200, msg=body)
        self.assertDictEqual(body, merchant_contract)

    def test_post_contract_read_only_fields_not_set(self):
        merchant = self.create_merchant(self._merchant)

        merchant_contract = self._merchant_contract.copy()
        merchant_contract['id'] = 77
        merchant_contract['merchant_id'] = "test"

        status, body = self.post('/merchants/%s/contracts' % merchant.id, merchant_contract)

        self.assertEqual(status, 200, msg=body)
        self.assertNotEqual(body['id'], merchant_contract['id'])
        self.assertNotEqual(body['merchant_id'], merchant_contract['merchant_id'])

    # GET /merchant_contracts/{merchant_contract_id}

    def test_get_contract_not_found(self):
        status, body = self.get('/merchant_contracts/1')

        self.assertEqual(status, 404, msg=body)

    def test_get_contract(self):
        merchant = self.create_merchant(self._merchant)
        contract = self.create_merchant_contracts(merchant.id)[0]

        status, body = self.get('/merchant_contracts/%s' % contract['id'])
        self.assertEqual(status, 200, msg=body)

        self.assertDictEqual(body, contract,
                             msg="\nEXPECTED:\n{}\nACTUAL:\n{}".format(base.prettify(contract), base.prettify(body)))

    # PUT /merchant_contracts/{merchant_contract_id}

    def test_put_contract(self):
        merchant = self.create_merchant(self._merchant)
        contract = self.create_merchant_contracts(merchant.id)[0]

        merchant_contract_update = {"commission_fixed": "3.5", "active": False}
        contract.update(merchant_contract_update)

        status, body = self.put('/merchant_contracts/%s' % contract['id'], merchant_contract_update)

        self.assertEqual(status, 200, msg=body)
        self.assertDictEqual(body, contract)

    def test_put_contract_read_only_fields_not_update(self):
        merchant = self.create_merchant(self._merchant)
        contract = self.create_merchant_contracts(merchant.id)[0]

        status, body = self.put('/merchant_contracts/%s' % contract['id'], {'id': 777})
        self.assertEqual(status, 200, msg=body)
        self.assertNotEqual(body['id'], 777)

        status, body = self.put('/merchant_contracts/%s' % contract['id'], {'merchant_id': 'test555'})
        self.assertEqual(status, 200, msg=body)
        self.assertNotEqual(body['merchant_id'], 'test555')

    def test_put_not_found_contract(self):
        status, body = self.put('/merchant_contracts/1', {})

        self.assertEqual(status, 404, msg=body)

    # DELETE /merchant_contracts/{merchant_contract_id}

    def test_delete_contract(self):
        merchant = self.create_merchant(self._merchant)
        contract = self.create_merchant_contracts(merchant.id)[0]

        status, body = self.delete('/merchant_contracts/%s' % contract['id'])

        self.assertEqual(status, 200)

        status, body = self.get('/merchant_contracts/%s' % contract['id'])
        self.assertEqual(status, 404)

    def test_delete_not_found_contract(self):
        status, body = self.delete('/merchant_contracts/1')
        self.assertEqual(status, 404)


class TestPaySysContracts(base.BaseTestCase):

    # test environment

    _pay_sys_contract = {
        "contractor_name": "Alpha Bank",
        "commission_fixed": '0.1',
        "commission_pct": '2.0',
        "currency": "USD",
        "contract_doc_url": "http://contract.doc",
        "active": True,
        "filter": "*",
    }

    paysys_id = 'VISA_MASTER'

    def create_pay_sys_contracts(self, pay_sys_id, count=1, **contract_kwargs):
        contract = self._pay_sys_contract.copy()
        contract.update(contract_kwargs)
        contract["paysys_id"] = pay_sys_id

        contract_models = [PaySysContract.create(contract) for _ in range(count)]
        self.db.commit()

        contracts = []
        for cm in contract_models:
            contract_result = contract.copy()
            contract_result['id'] = cm.id
            contracts.append(contract_result)

        return contracts

    # GET /payment_systems/{paysys_id}/contracts

    def test_get_contracts_list_empty(self):
        status, body = self.get('/payment_systems/%s/contracts' % self.paysys_id)

        self.assertEqual(status, 200, msg=body)
        self.assertListEqual(body['contracts'], [])

    def test_get_contract_url_case_insensitive(self):
        status, body = self.get('/payment_systems/%s/contracts' % self.paysys_id.lower())
        self.assertEqual(status, 200, msg=body)

        status, body = self.get('/payment_systems/%s/contracts' % self.paysys_id.upper())
        self.assertEqual(status, 200, msg=body)

    def test_get_paysys_not_found(self):
        status, body = self.get('/payment_systems/%s/contracts' % 'PIASTRES')
        self.assertEqual(status, 404, msg=body)

    def test_get_contract_list(self):
        expected_contracts = self.create_pay_sys_contracts(self.paysys_id)

        status, body = self.get('/payment_systems/%s/contracts' % self.paysys_id)

        self.assertEqual(status, 200, msg=body)
        for i, j in zip(body['contracts'], expected_contracts):
            self.assertDictEqual(i, j)

    def test_get_contract_list_filtering(self):
        self.create_pay_sys_contracts(self.paysys_id, active=False, count=3)
        self.create_pay_sys_contracts(self.paysys_id, currency='UAH', count=3)
        expected_contracts = self.create_pay_sys_contracts(self.paysys_id, count=3)

        status, body = self.get('/payment_systems/%s/contracts' % self.paysys_id,
                                query_args={"currency": "USD", "active": True})

        self.assertEqual(status, 200, msg=body)
        for i, j in zip(body['contracts'], expected_contracts):
            self.assertDictEqual(i, j)

    def test_get_contract_empty_list_filtering(self):
        self.create_pay_sys_contracts(self.paysys_id, active=False, count=3)
        self.create_pay_sys_contracts(self.paysys_id, currency='UAH', count=3)

        status, body = self.get('/payment_systems/%s/contracts' % self.paysys_id,
                                query_args={"currency": "USD", "active": True})

        self.assertEqual(status, 200, msg=body)
        self.assertEqual(body['contracts'], [], msg=body)

    # POST /payment_systems/{paysys_id}/contracts

    def test_post_contract_success(self):
        self.activate_payment_system(self.paysys_id)
        contract = self._pay_sys_contract.copy()

        status, body = self.post('/payment_systems/%s/contracts' % self.paysys_id, contract)

        contract["id"] = body.get('id')
        contract["paysys_id"] = self.paysys_id

        self.assertEqual(status, 200, msg=body)
        self.assertDictEqual(body, contract)

        status, body = self.get('/paysys_contracts/%s' % contract["id"])
        self.assertEqual(status, 200, msg=body)
        self.assertDictEqual(body, contract)

    def test_post_contract_url_case_insensitive(self):
        self.activate_payment_system(self.paysys_id)
        contract = self._pay_sys_contract.copy()

        status, body = self.post('/payment_systems/%s/contracts' % self.paysys_id.lower(), contract)
        self.assertEqual(status, 200, msg=body)

        status, body = self.post('/payment_systems/%s/contracts' % self.paysys_id.upper(), contract)
        self.assertEqual(status, 200, msg=body)

    def test_post_contract_read_only_fields_not_set(self):
        self.activate_payment_system(self.paysys_id)
        contract = self._pay_sys_contract.copy()
        contract['id'] = 77
        contract['paysys_id'] = "test"

        status, body = self.post('/payment_systems/%s/contracts' % self.paysys_id, contract)

        self.assertEqual(status, 200, msg=body)
        self.assertNotEqual(body['id'], contract['id'])
        self.assertNotEqual(body['paysys_id'], contract['paysys_id'])

    def test_post_contract_forbidden_if_paysys_not_active(self):
        contract = self._pay_sys_contract.copy()
        status, body = self.post('/payment_systems/%s/contracts' % self.paysys_id, contract)
        self.assertEqual(status, 403)

    def test_post_contract_not_created_paysys(self):
        contract = self._pay_sys_contract.copy()

        status, body = self.post('/payment_systems/%s/contracts' % 'PAY_ME', contract)
        self.assertEqual(status, 404)

    # GET /paysys_contracts/{paysys_contract_id}

    def test_get_contract_not_found(self):
        status, body = self.get('/paysys_contracts/1')

        self.assertEqual(status, 404, msg=body)

    def test_get_contract(self):
        contract = self.create_pay_sys_contracts(self.paysys_id)[0]

        status, body = self.get('/paysys_contracts/%s' % contract['id'])

        self.assertEqual(status, 200, msg=body)
        self.assertDictEqual(body, contract,
                             msg="\nEXPECTED:\n{}\nACTUAL:\n{}".format(base.prettify(contract), base.prettify(body)))

    # PUT /paysys_contracts/{paysys_contract_id}

    def test_put_contract(self):
        contract = self.create_pay_sys_contracts(self.paysys_id)[0]

        pay_sys_contract_update = {"commission_fixed": "3.5", "active": False}

        status, body = self.put('/paysys_contracts/%s' % contract['id'], pay_sys_contract_update)

        contract.update(pay_sys_contract_update)

        self.assertEqual(status, 200, msg=body)
        self.assertDictEqual(body, contract)

    def test_put_contract_read_only_fields_not_update(self):
        contract = self.create_pay_sys_contracts(self.paysys_id)[0]

        status, body = self.put('/paysys_contracts/%s' % contract['id'], {'id': 785})
        self.assertEqual(status, 200, msg=body)
        self.assertNotEqual(body['id'], 785)

        status, body = self.put('/paysys_contracts/%s' % contract['id'], {'paysys_id': "test"})
        self.assertEqual(status, 200, msg=body)
        self.assertNotEqual(body['paysys_id'], 'test')

    def test_put_not_found_contract(self):
        status, body = self.put('/paysys_contracts/%s' % 1, {})
        self.assertEqual(status, 404, msg=body)

    # DELETE /paysys_contracts/{paysys_contract_id}

    def test_delete_contract(self):
        contract = self.create_pay_sys_contracts(self.paysys_id)[0]

        status, body = self.delete('/paysys_contracts/%s' % contract['id'])
        self.assertEqual(status, 200)

        contract_model = PaySysContract.query.get(contract['id'])
        self.assertIsNone(contract_model)

        status, body = self.get('/paysys_contracts/%s' % contract['id'])
        self.assertEqual(status, 404)

    def test_delete_not_found_contract(self):
        status, body = self.delete('/paysys_contracts/1')
        self.assertEqual(status, 404)
