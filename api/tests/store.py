from api.tests import base
from api import models

__author__ = 'Kostel Serhii'


class TestStore(base.BaseTestCase):

    # GET /merchants/<merchant_id>/stores

    def test_get_merchant_stores_list_empty(self):
        merchant = self.create_merchant(self.get_merchant())

        status, body = self.get('/merchants/%s/stores' % merchant.id)

        self.assertEqual(status, 200)
        self.assertIn('stores', body)
        self.assertListEqual(body['stores'], [])

    def test_get_merchant_stores_list_all(self):
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id
        stores_num = 10
        for si in range(stores_num):
            store = self.get_store()
            self.create_store(store, merchant_id)

        status, body = self.get('/merchants/%s/stores' % merchant_id)

        self.assertEqual(status, 200)
        self.assertIn('stores', body)
        self.assertEqual(len(body['stores']), stores_num)

    def test_get_merchant_stores_list_valid_structure(self):
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id
        stores_num = 10
        for si in range(stores_num):
            store = self.get_store()
            self.create_store(store, merchant_id)

        status, body = self.get('/merchants/%s/stores' % merchant_id)
        self.assertEqual(status, 200)

        store_list_keys = {"id", "store_name", "store_url", "category", "description", "logo", "show_logo"}
        for store in body['stores']:
            self.assertSetEqual(set(store.keys()), store_list_keys)
            self.assertIsInstance(store['id'], str)

    def test_get_merchant_stores_not_found(self):
        self.create_merchant(self.get_merchant())

        for merchant_id in ['00000000-1111-2222-3333-444444444444', '0', '1', 'test', 'null', '']:
            status, body = self.get('/merchants/%s/stores' % merchant_id)
            self.assertEqual(status, 404)

    # POST /merchants/<merchant_id>/stores

    # GET /stores/<store_id>

    # PUT /stores/<store_id>

    # DELETE /stores/<store_id>

    # TODO: add more delete tests

    def test_delete_store(self):
        merchant = self.create_merchant(self.get_merchant())
        store = self.create_store(self.get_store(), merchant.id)
        store_id = store.id
        store_settings_id = store.store_settings.id

        status, body = self.delete('/stores/%s' % store_id)
        self.assertEqual(status, 200)

        deleted_store = models.Store.query.get(store_id)
        deleted_store_settings = models.StoreSettings.query.get(store_settings_id)
        deleted_store_paysys = models.StorePaySys.query.filter_by(store_id=store_id).all()
        self.assertIsNone(deleted_store)
        self.assertIsNone(deleted_store_settings)
        self.assertListEqual(deleted_store_paysys, [])

    # GET /stores/<store_id>/exists

    def test_get_store_exists(self):
        merchant = self.create_merchant(self.get_merchant())
        store = self.create_store(self.get_store(), merchant.id)

        status, body = self.get('/stores/%s/exists' % store.id, auth='system')

        self.assertEqual(status, 200)
        self.assertDictEqual(body, {'exists': True})

    def test_get_store_not_exists(self):
        status, body = self.get('/stores/%s/exists' % 'STORE_UP', auth='system')

        self.assertEqual(status, 200)
        self.assertDictEqual(body, {'exists': False})


class TestStorePaySys(base.BaseTestCase):

    PAYSYS_ID = ('PAY_PAL', 'BIT_COIN', 'VISA_MASTER')

    def setUp(self):
        super().setUp()

        merchant = self.create_merchant(self.get_merchant())
        store = self.create_store(self.get_store(), merchant.id)

        self.merchant_id = merchant.id
        self.store_id = store.id

    def activate_all_paysys(self):
        for paysys_id in self.PAYSYS_ID:
            self.activate_payment_system(paysys_id)

    def _store_paysys(self, paysys_id='VISA_MASTER'):
        self.activate_payment_system(paysys_id)
        store_paysys = models.StorePaySys.query.filter_by(store_id=self.store_id, paysys_id=paysys_id).first()
        return store_paysys

    # GET /stores/<store_id>/store_paysys

    def test_store_paysys_create_when_store_create(self):
        store_dict = self.get_store()
        store_dict['store_name'] = 'New store'
        store = self.create_store(store_dict, self.merchant_id)

        paysys = models.PaymentSystem.query.all()
        store_paysys = models.StorePaySys.query.filter_by(store_id=store.id).all()

        self.assertEqual(len(store_paysys), len(paysys))
        self.assertSetEqual(set(st.paysys_id for st in store_paysys), set(ps.id for ps in paysys))
        self.assertFalse(any(st.allowed for st in store_paysys))

    def test_get_store_paysys_list_allowed_only(self):
        status, body = self.get('/stores/%s/store_paysys' % self.store_id)
        self.assertEqual(status, 200)
        self.assertListEqual(body['store_paysys'], [])

        self.activate_payment_system('VISA_MASTER')
        status, body = self.get('/stores/%s/store_paysys' % self.store_id)
        self.assertEqual(status, 200)
        self.assertEqual(len(body['store_paysys']), 1)
        self.assertEqual(body['store_paysys'][0]['paysys_id'], 'VISA_MASTER')

        self.activate_all_paysys()
        status, body = self.get('/stores/%s/store_paysys' % self.store_id)
        self.assertEqual(status, 200)
        self.assertSetEqual(set(sps['paysys_id'] for sps in body['store_paysys']), set(self.PAYSYS_ID))

    def test_get_store_paysys_valid_structure(self):
        self.activate_all_paysys()
        status, body = self.get('/stores/%s/store_paysys' % self.store_id)

        self.assertEqual(status, 200)
        for store_paysys in body['store_paysys']:
            self.assertIsInstance(store_paysys.pop('id'), str)
            self.assertEqual(store_paysys.pop('store_id'), self.store_id)
            self.assertIn(store_paysys.pop('paysys_id'), self.PAYSYS_ID)
            self.assertFalse(store_paysys.pop('allowed'))
            self.assertDictEqual(store_paysys, {})

    def test_get_store_paysys_allowed_arg_filter(self):
        self.activate_all_paysys()

        status, body = self.get('/stores/%s/store_paysys' % self.store_id, query_args={'allowed': True})
        self.assertEqual(status, 200)
        self.assertListEqual(body['store_paysys'], [])

        store_paysys = self._store_paysys('VISA_MASTER')
        store_paysys.allowed = True
        self.db.commit()

        status, body = self.get('/stores/%s/store_paysys' % self.store_id, query_args={'allowed': True})
        self.assertEqual(status, 200)
        self.assertEqual(len(body['store_paysys']), 1)
        self.assertEqual(body['store_paysys'][0]['paysys_id'], 'VISA_MASTER')

        status, body = self.get('/stores/%s/store_paysys' % self.store_id, query_args={'allowed': False})
        self.assertEqual(status, 200)
        not_allowed_paysys_id = set(self.PAYSYS_ID)
        not_allowed_paysys_id.remove('VISA_MASTER')
        self.assertSetEqual(set(sps['paysys_id'] for sps in body['store_paysys']), not_allowed_paysys_id)

    def test_get_store_paysys_allowed_arg_valid(self):
        self.activate_all_paysys()

        status, body = self.get('/stores/%s/store_paysys' % self.store_id, query_args={'allowed': 'NOT GOOD'})
        self.assertEqual(status, 400)

    def test_get_store_paysys_not_found(self):
        for store_id in ['00000000-1111-2222-3333-444444444444', '0', '1', 'test', 'null', '']:
            status, body = self.get('/stores/%s/store_paysys' % store_id)
            self.assertEqual(status, 404)

    # PUT /store_paysys/<store_paysys_id>

    def test_put_store_paysys_update(self):
        store_paysys = self._store_paysys()
        self.assertFalse(store_paysys.allowed)

        status, body = self.put('/store_paysys/%s' % store_paysys.id, {'allowed': True})
        self.assertEqual(status, 200)
        self.assertTrue(body['allowed'])

        store_paysys = self._store_paysys()
        self.assertTrue(store_paysys.allowed)

    def test_put_store_paysys_update_valid_structure(self):
        store_paysys = self._store_paysys(paysys_id='VISA_MASTER')

        status, body = self.put('/store_paysys/%s' % store_paysys.id, {'allowed': True})
        self.assertEqual(status, 200)

        self.assertIsInstance(body.pop('id'), str)
        self.assertEqual(body.pop('store_id'), self.store_id)
        self.assertEqual(body.pop('paysys_id'), 'VISA_MASTER')
        self.assertTrue(body.pop('allowed'))
        self.assertDictEqual(body, {})

    def test_put_store_paysys_update_activated_paysys_only(self):
        store_paysys = models.StorePaySys.query.filter_by(store_id=self.store_id, paysys_id='VISA_MASTER').first()
        self.assertFalse(store_paysys.allowed)

        status, body = self.put('/store_paysys/%s' % store_paysys.id, {'allowed': True})
        self.assertEqual(status, 400)

        store_paysys = models.StorePaySys.query.filter_by(store_id=self.store_id, paysys_id='VISA_MASTER').first()
        self.assertFalse(store_paysys.allowed)

    def test_put_store_paysys_not_update_read_only_fields(self):
        store_paysys = self._store_paysys()

        data = {'id': '00000000-1111-2222-3333-444444444444'}
        status, body = self.put('/store_paysys/%s' % store_paysys.id, data)
        self.assertEqual(status, 200)
        self.assertNotEqual(body['id'], data['id'])

        data = {'store_id': '00000000-1111-2222-3333-444444444444'}
        status, body = self.put('/store_paysys/%s' % store_paysys.id, data)
        self.assertEqual(status, 200)
        self.assertNotEqual(body['store_id'], data['store_id'])

        data = {'paysys_id': 'MONEY'}
        status, body = self.put('/store_paysys/%s' % store_paysys.id, data)
        self.assertEqual(status, 200)
        self.assertNotEqual(body['paysys_id'], data['paysys_id'])

    def test_put_store_paysys_update_fields_valid_type(self):
        store_paysys = self._store_paysys()

        for allowed in ('test', '', 42, None):
            status, body = self.put('/store_paysys/%s' % store_paysys.id, {'allowed': allowed})
            self.assertEqual(status, 400)

    def test_put_store_paysys_not_found(self):
        for store_paysys_id in ['00000000-1111-2222-3333-444444444444', '0', '1', 'test', 'null', '']:
            status, body = self.put('/store_paysys/%s' % store_paysys_id, {'allowed': True})
            self.assertEqual(status, 404)
