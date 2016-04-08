from api.models import PaymentSystem
from api.tests import base

__author__ = 'Kostel Serhii'


class TestPaymentSystem(base.BaseTestCase):

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

    def test_allowed_only_if_active_login_and_password_set(self):
        paysys_model = PaymentSystem.query.get('VISA_MASTER')

        paysys_model.active = True
        self.db.commit()
        status, body = self.get('/payment_systems/allowed/paysys_id')
        self.assertListEqual(body['paysys_id'], [])

        paysys_model.paysys_login = 'test_login'
        self.db.commit()
        status, body = self.get('/payment_systems/allowed/paysys_id')
        self.assertListEqual(body['paysys_id'], [])

        paysys_model.active = False
        paysys_model.set_password("0xJtwe76GDSAFknui8we45unohyDKUFSGku")
        self.db.commit()
        status, body = self.get('/payment_systems/allowed/paysys_id')
        self.assertListEqual(body['paysys_id'], [])

        paysys_model.active = True
        self.db.commit()
        status, body = self.get('/payment_systems/allowed/paysys_id')
        self.assertSetEqual(set(body['paysys_id']), {'VISA_MASTER', })
