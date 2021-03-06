from api.models import PaymentSystem
from api.tests import base

__author__ = 'Kostel Serhii'


class TestPaymentSystem(base.BaseTestCase):

    PAYSYS_ID = ('PAY_PAL', 'BIT_COIN', 'VISA_MASTER')
    PAYSYS_NAME = ('PayPal', 'Bitcoin', 'Visa/MasterCard')

    paysys_id = 'VISA_MASTER'

    # GET /payment_systems/allowed/paysys_id

    def test_get_paysys_allowed_empty(self):
        status, body = self.get('/payment_systems/allowed/paysys_id')

        self.assertEqual(status, 200)
        self.assertIn('paysys_id', body)
        self.assertListEqual(body['paysys_id'], [])

    def test_get_paysys_allowed_only(self):
        self.activate_payment_system('VISA_MASTER')
        status, body = self.get('/payment_systems/allowed/paysys_id')
        self.assertEqual(status, 200)
        self.assertSetEqual(set(body['paysys_id']), {'VISA_MASTER',})

        self.activate_payment_system('PAY_PAL')
        status, body = self.get('/payment_systems/allowed/paysys_id')
        self.assertEqual(status, 200)
        self.assertSetEqual(set(body['paysys_id']), {'VISA_MASTER', 'PAY_PAL'})

        self.activate_payment_system('BIT_COIN')
        status, body = self.get('/payment_systems/allowed/paysys_id')
        self.assertEqual(status, 200)
        self.assertSetEqual(set(body['paysys_id']), {'VISA_MASTER', 'PAY_PAL', 'BIT_COIN'})

    def test_allowed_only_if_contract_set(self):
        paysys_model = PaymentSystem.query.get(self.paysys_id)

        paysys_model.active = True
        self.db.commit()
        status, body = self.get('/payment_systems/allowed/paysys_id')
        self.assertListEqual(body['paysys_id'], [])

        paysys_model.active = False
        self.db.commit()
        self.create_pay_sys_contracts(paysys_model.id)
        status, body = self.get('/payment_systems/allowed/paysys_id')
        self.assertListEqual(body['paysys_id'], [])

        paysys_model.active = True
        self.db.commit()
        status, body = self.get('/payment_systems/allowed/paysys_id')
        self.assertSetEqual(set(body['paysys_id']), {self.paysys_id, })

    # GET /payment_systems

    def test_get_payment_system_list_valid_structure(self):
        status, body = self.get('/payment_systems')
        self.assertEqual(status, 200)
        for paysys in body['payment_systems']:
            self.assertIn(paysys.pop('id'), self.PAYSYS_ID)
            self.assertIsInstance(paysys.pop('paysys_name'), str)
            self.assertIsInstance(paysys.pop('active'), bool)
            self.assertDictEqual(paysys, {})

    def test_get_payment_system_list(self):
        status, body = self.get('/payment_systems')
        self.assertEqual(status, 200)
        self.assertIn('payment_systems', body)
        self.assertEqual(len(body['payment_systems']), len(self.PAYSYS_ID))

        self.assertSetEqual(set(ps['id'] for ps in body['payment_systems']), set(self.PAYSYS_ID))
        self.assertSetEqual(set(ps['paysys_name'] for ps in body['payment_systems']), set(self.PAYSYS_NAME))
        self.assertFalse(any(ps['active'] for ps in body['payment_systems']))

    def test_get_payment_system_list_activated(self):
        status, body = self.get('/payment_systems')
        self.assertEqual(status, 200)
        self.assertFalse(any(ps['active'] for ps in body['payment_systems']))

        for ps in self.PAYSYS_ID:
            self.activate_payment_system(ps)

        status, body = self.get('/payment_systems')
        self.assertEqual(status, 200)
        self.assertTrue(all(ps['active'] for ps in body['payment_systems']))

    # GET /payment_systems/<paysys_id>

    def test_get_payment_system_by_id(self):
        for ps in self.PAYSYS_ID:
            status, body = self.get('/payment_systems/%s' % ps)
            self.assertEqual(status, 200)

    def test_get_payment_system_full_valid_response(self):
        status, body = self.get('/payment_systems/%s' % self.paysys_id)
        self.assertEqual(status, 200)

        self.assertEqual(body.pop('id'), self.paysys_id)
        self.assertEqual(body.pop('paysys_name'), 'Visa/MasterCard')
        self.assertEqual(body.pop('active'), False)
        self.assertDictEqual(body, {})

    def test_get_payment_system_case_insensitive(self):
        status, body = self.get('/payment_systems/%s' % self.paysys_id.upper())
        self.assertEqual(status, 200)

        status, body = self.get('/payment_systems/%s' % self.paysys_id.lower())
        self.assertEqual(status, 200)

    def test_get_payment_system_not_found(self):
        for paysys_id in ['MY_PAYMENT', 'test', 'null', '']:
            status, body = self.get('/payment_systems/%s' % paysys_id)
            self.assertEqual(status, 404)

    # PUT /payment_systems/<paysys_id>

    def test_put_payment_system_update_active(self):
        self.activate_payment_system(self.paysys_id)

        status, body = self.put('/payment_systems/%s' % self.paysys_id, {'active': False})
        self.assertEqual(status, 200)
        self.assertFalse(body['active'])

        paysys = PaymentSystem.query.get(self.paysys_id)
        self.assertFalse(paysys.active)

    def test_put_payment_system_not_activate_until_contracts_set(self):
        status, body = self.put('/payment_systems/%s' % self.paysys_id, {'active': True})
        self.assertEqual(status, 400)

        self.create_pay_sys_contracts(self.paysys_id)

        status, body = self.put('/payment_systems/%s' % self.paysys_id, {'active': True})
        self.assertEqual(status, 200)
        self.assertTrue(body['active'])

    def test_put_payment_system_not_update_read_only_fields(self):
        self.activate_payment_system(self.paysys_id)

        data = {'id': 'PAL_MAIL'}
        status, body = self.put('/payment_systems/%s' % self.paysys_id, data)
        self.assertEqual(status, 200)
        self.assertNotEqual(body['id'], data['id'])

        data = {'paysys_name': 'Vezi/Mister'}
        status, body = self.put('/payment_systems/%s' % self.paysys_id, data)
        self.assertEqual(status, 200)
        self.assertNotEqual(body['paysys_name'], data['paysys_name'])

    def test_put_payment_system_update_fields_type(self):
        for active in ('test', '', 42):
            status, body = self.put('/payment_systems/%s' % self.paysys_id, {'active': active})
            self.assertEqual(status, 400)

    def test_put_payment_system_not_found(self):
        for paysys_id in ['MY_PAYMENT', 'test', 'null', '']:
            status, body = self.put('/payment_systems/%s' % paysys_id, {'active': True})
            self.assertEqual(status, 404)
