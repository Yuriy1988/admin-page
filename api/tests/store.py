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

    # GET /merchant/stores

    def test_get_stores_list_all_for_merchant(self):
        merchant = self.create_merchant(self.get_merchant())
        [self.create_store(self.get_store(), merchant.id) for _ in range(10)]
        status, body = self.get('/merchant/stores', auth=merchant.user)

        self.assertEqual(status, 200)
        self.assertIn('stores', body)
        self.assertEqual(len(body['stores']), 10)

    def test_get_stores_list_wrong_user(self):
        merchant = self.create_merchant(self.get_merchant())
        self.create_store(self.get_store(), merchant.id)
        status, body = self.get('/merchant/stores', auth='admin')

        self.assertEqual(status, 404)

    # POST /merchants/<merchant_id>/stores

    def test_post_merchant_stores_full_valid_response(self):
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id
        stores_num = 10

        for si in range(stores_num):
            store = self.get_store()
            self.create_store(store, merchant_id)

        status, body = self.post('/merchants/%s/stores' % merchant_id, self.get_store())

        self.assertEqual(status, 200)
        self.assertIn('store_url', body)

    def test_post_merchant_stores_missing_data(self):
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id
        stores_num = 10

        for si in range(stores_num):
            store = self.get_store()
            self.create_store(store, merchant_id)

        status, body = self.post('/merchants/%s/stores' % merchant_id, {})

        self.assertEqual(status, 400)

    def test_post_merchant_store_connect_by_another_merchant(self):
        merchant = self.create_merchant(self.get_merchant())

        another_merchant = self.create_merchant(self.get_merchant(), 'AMer', 'AmerU')

        status, body = self.post('/merchants/%s/stores' % merchant.id,
                                 body={}, auth=another_merchant.user)

        self.assertEqual(status, 403)

    # GET /stores/<store_id>

    def test_get_store_full_valid_response(self):
        store_dict = self.get_store()
        merchant = self.create_merchant(self.get_merchant())
        store = self.create_store(store_dict, merchant.id)

        status, body = self.get('/stores/%s' % store.id)

        self.assertEqual(status, 200)

        store_dict['id'] = store.id
        store_settings = store_dict.pop('store_settings')
        body_store_settings = body.pop('store_settings')
        store_settings['sign_key'] = body_store_settings['sign_key']

        self.assertEqual(body, store_dict)
        self.assertEqual(body_store_settings, store_settings)

    def test_get_store_not_found(self):
        merchant = self.create_merchant(self.get_merchant())
        self.create_store(self.get_store(), merchant.id)

        for store_id in ['0', '00000000-1111-2222-3333-444444444444', '1', '2', 'test', 'null', '']:
            status, body = self.get('/stores/%s' % store_id)
            self.assertEqual(status, 404)

    def test_get_store_owner_only_by_merchant(self):
        merchant1 = self.create_merchant(self.get_merchant(), 'MerchantFirst', 'UserFirst')
        store1 = self.create_store(self.get_store(), merchant1.id)

        merchant2 = self.create_merchant(self.get_merchant(), 'MerchantSecond', 'UserSecond')
        store2 = self.create_store(self.get_store(), merchant2.id)

        status, body = self.get('/stores/%s' % store1.id, auth=merchant1.user)
        self.assertEqual(status, 200)
        status, body = self.get('/stores/%s' % store2.id, auth=merchant2.user)
        self.assertEqual(status, 200)

        status, body = self.get('/stores/%s' % store1.id, auth=merchant2.user)
        self.assertEqual(status, 403)
        status, body = self.get('/stores/%s' % store2.id, auth=merchant1.user)
        self.assertEqual(status, 403)

    def test_get_store_owner_only_by_manager(self):
        merchant1 = self.create_merchant(self.get_merchant(), 'MerchantFirst', 'UserFirst')
        store1 = self.create_store(self.get_store(), merchant1.id)
        manager1 = self.create_manager(self.get_manager(), merchant1.id)
        manager1.stores.append(store1)
        self.db.commit()

        merchant2 = self.create_merchant(self.get_merchant(), 'MerchantSecond', 'UserSecond')
        store2 = self.create_store(self.get_store(), merchant2.id)
        manager2 = self.create_manager(self.get_manager(), merchant2.id)
        manager2.stores.append(store2)
        self.db.commit()

        status, body = self.get('/stores/%s' % store1.id, auth=manager1.user)
        self.assertEqual(status, 200)
        status, body = self.get('/stores/%s' % store2.id, auth=manager2.user)
        self.assertEqual(status, 200)

        status, body = self.get('/stores/%s' % store1.id, auth=manager2.user)
        self.assertEqual(status, 403)
        status, body = self.get('/stores/%s' % store2.id, auth=manager1.user)
        self.assertEqual(status, 403)

    # PUT /stores/<store_id>

    def test_put_store_full_valid_response(self):
        store_dict = self.get_store()
        merchant = self.create_merchant(self.get_merchant())
        store = self.create_store(store_dict, merchant.id)

        status, body = self.put('/stores/%s' % store.id, store_dict)

        self.assertEqual(status, 200)

        store_dict['id'] = store.id
        store_settings = store_dict.pop('store_settings')
        body_store_settings = body.pop('store_settings')
        store_settings['sign_key'] = body_store_settings['sign_key']

        self.assertEqual(body, store_dict)
        self.assertEqual(body_store_settings, store_settings)

    def test_put_store_bad_request(self):
        store_dict = self.get_store()
        merchant = self.create_merchant(self.get_merchant())
        store = self.create_store(store_dict, merchant.id)

        for show_logo in ('test', '', 42, None):
            status, body = self.put('/stores/%s' % store.id, {'show_logo': show_logo})
            self.assertEqual(status, 400)

    def test_put_store_forbidden(self):
        store_dict = self.get_store()
        merchant = self.create_merchant(self.get_merchant())
        store = self.create_store(self.get_store(), merchant.id)
        manager = self.create_manager(self.get_manager(), merchant.id)
        manager.stores.append(store)
        self.db.commit()

        another_merchant = self.create_merchant(self.get_merchant(), 'AMer', 'AmerU')

        status, body = self.put('/stores/%s' % store.id, auth=another_merchant.user, body=store_dict)
        self.assertEqual(status, 403)

    def test_put_store_not_found(self):
        store_dict = self.get_store()

        for store_id in ['00000000-1111-2222-3333-444444444444', '0', '1', 'test', 'null', '']:
            status, body = self.put('/stores/%s' % store_id, store_dict)
            self.assertEqual(status, 404)

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

    def test_delete_store_access_denied(self):
        merchant = self.create_merchant(self.get_merchant())
        store = self.create_store(self.get_store(), merchant.id)
        manager = self.create_manager(self.get_manager(), merchant.id)
        manager.stores.append(store)
        self.db.commit()

        another_merchant = self.create_merchant(self.get_merchant(), 'AMer', 'AmerU')

        status, body = self.delete('/stores/%s' % store.id, auth=another_merchant.user)
        self.assertEqual(status, 403)

    def test_delete_store_not_found(self):
        merchant = self.create_merchant(self.get_merchant())
        store = self.create_store(self.get_store(), merchant.id)
        store_id = store.id

        status, body = self.delete('/stores/%s' % store_id)
        self.assertEqual(status, 200)
        status, body = self.delete('/stores/%s' % store_id)
        self.assertEqual(status, 404)


    # GET /managers/<manager_id>/stores

    def test_get_manager_stores_list_empty(self):
        merchant = self.create_merchant(self.get_merchant())
        self.create_store(self.get_store(), merchant.id)
        manager = self.create_manager(self.get_manager(), merchant.id)

        status, body = self.get('/managers/%s/stores' % manager.id)

        self.assertEqual(status, 200)
        self.assertIn('stores', body)
        self.assertListEqual(body['stores'], [])

    def test_get_manager_stores_list_all(self):
        merchant = self.create_merchant(self.get_merchant())
        manager = self.create_manager(self.get_manager(), merchant.id)
        [self.create_store(self.get_store(), merchant.id) for _ in range(5)]

        stores_num = 10
        for si in range(stores_num):
            store = self.create_store(self.get_store(), merchant.id)
            manager.stores.append(store)
        self.db.commit()

        status, body = self.get('/managers/%s/stores' % manager.id)

        self.assertEqual(status, 200)
        self.assertIn('stores', body)
        self.assertEqual(len(body['stores']), stores_num)

    def test_get_manager_stores_not_found(self):
        merchant = self.create_merchant(self.get_merchant())
        self.create_manager(self.get_manager(), merchant.id)

        for manager_id in ['00000000-1111-2222-3333-444444444444', '0', '1', 'test', 'null', '']:
            status, body = self.get('/managers/%s/stores' % manager_id)
            self.assertEqual(status, 404)

    # POST /managers/<manager_id>/stores/<store_id>

    def test_post_manager_store_connected(self):
        merchant = self.create_merchant(self.get_merchant())
        store = self.create_store(self.get_store(), merchant.id)
        manager = self.create_manager(self.get_manager(), merchant.id)

        status, body = self.post('/managers/%s/stores/%s' % (manager.id, store.id), body={})
        self.assertEqual(status, 200)

        status, body = self.get('/managers/%s/stores' % manager.id)

        self.assertEqual(status, 200)
        self.assertEqual(len(body['stores']), 1)
        self.assertEqual(body['stores'][0]['id'], store.id)

    def test_post_manager_store_connect_again(self):
        merchant = self.create_merchant(self.get_merchant())
        store = self.create_store(self.get_store(), merchant.id)
        manager = self.create_manager(self.get_manager(), merchant.id)

        status, body = self.post('/managers/%s/stores/%s' % (manager.id, store.id), body={})
        self.assertEqual(status, 200)
        status, body = self.post('/managers/%s/stores/%s' % (manager.id, store.id), body={})
        self.assertEqual(status, 200)

        status, body = self.get('/managers/%s/stores' % manager.id)
        self.assertEqual(status, 200)
        self.assertEqual(len(body['stores']), 1)
        self.assertEqual(body['stores'][0]['id'], store.id)

    def test_post_manager_store_connect_by_merchant(self):
        merchant = self.create_merchant(self.get_merchant())
        store = self.create_store(self.get_store(), merchant.id)
        manager = self.create_manager(self.get_manager(), merchant.id)

        status, body = self.post('/managers/%s/stores/%s' % (manager.id, store.id),
                                 body={}, auth=merchant.user)
        self.assertEqual(status, 200)

    def test_post_manager_store_connect_by_another_merchant(self):
        merchant = self.create_merchant(self.get_merchant())
        store = self.create_store(self.get_store(), merchant.id)
        manager = self.create_manager(self.get_manager(), merchant.id)

        another_merchant = self.create_merchant(self.get_merchant(), 'AMer', 'AmerU')

        status, body = self.post('/managers/%s/stores/%s' % (manager.id, store.id),
                                 body={}, auth=another_merchant.user)
        self.assertEqual(status, 403)

    def test_post_manager_store_different_owner(self):
        merchant1 = self.create_merchant(self.get_merchant(), 'MerchantFirst', 'UserFirst')
        manager1 = self.create_manager(self.get_manager(), merchant1.id, 'ManagerFirst')
        store1 = self.create_store(self.get_store(), merchant1.id)

        merchant2 = self.create_merchant(self.get_merchant(), 'MerchantSecond', 'UserSecond')
        manager2 = self.create_manager(self.get_manager(), merchant2.id, 'ManagerSecond')
        store2 = self.create_store(self.get_store(), merchant2.id)

        status, body = self.post('/managers/%s/stores/%s' % (manager1.id, store1.id), body={})
        self.assertEqual(status, 200)
        status, body = self.post('/managers/%s/stores/%s' % (manager2.id, store2.id), body={})
        self.assertEqual(status, 200)

        status, body = self.post('/managers/%s/stores/%s' % (manager1.id, store2.id), body={})
        self.assertEqual(status, 403)
        status, body = self.post('/managers/%s/stores/%s' % (manager2.id, store1.id), body={})
        self.assertEqual(status, 403)

    # DELETE /managers/<manager_id>/stores/<store_id>

    def test_delete_manager_store_connected(self):
        merchant = self.create_merchant(self.get_merchant())
        store = self.create_store(self.get_store(), merchant.id)
        manager = self.create_manager(self.get_manager(), merchant.id)
        manager.stores.append(store)
        self.db.commit()

        status, body = self.delete('/managers/%s/stores/%s' % (manager.id, store.id))
        self.assertEqual(status, 200)

        status, body = self.get('/managers/%s/stores' % manager.id)
        self.assertEqual(status, 200)
        self.assertEqual(len(body['stores']), 0)

    def test_delete_manager_store_connect_again(self):
        merchant = self.create_merchant(self.get_merchant())
        store = self.create_store(self.get_store(), merchant.id)
        manager = self.create_manager(self.get_manager(), merchant.id)
        manager.stores.append(store)
        self.db.commit()

        status, body = self.delete('/managers/%s/stores/%s' % (manager.id, store.id))
        self.assertEqual(status, 200)
        status, body = self.delete('/managers/%s/stores/%s' % (manager.id, store.id))
        self.assertEqual(status, 404)

        status, body = self.get('/managers/%s/stores' % manager.id)
        self.assertEqual(status, 200)
        self.assertEqual(len(body['stores']), 0)

    def test_delete_manager_store_connect_by_merchant(self):
        merchant = self.create_merchant(self.get_merchant())
        store = self.create_store(self.get_store(), merchant.id)
        manager = self.create_manager(self.get_manager(), merchant.id)
        manager.stores.append(store)
        self.db.commit()

        status, body = self.delete('/managers/%s/stores/%s' % (manager.id, store.id),
                                   auth=merchant.user)
        self.assertEqual(status, 200)

    def test_delete_manager_store_connect_by_another_merchant(self):
        merchant = self.create_merchant(self.get_merchant())
        store = self.create_store(self.get_store(), merchant.id)
        manager = self.create_manager(self.get_manager(), merchant.id)
        manager.stores.append(store)
        self.db.commit()

        another_merchant = self.create_merchant(self.get_merchant(), 'AMer', 'AmerU')

        status, body = self.delete('/managers/%s/stores/%s' % (manager.id, store.id), auth=another_merchant.user)
        self.assertEqual(status, 403)

    def test_delete_manager_store_different_owner(self):
        merchant1 = self.create_merchant(self.get_merchant(), 'MerchantFirst', 'UserFirst')
        manager1 = self.create_manager(self.get_manager(), merchant1.id, 'ManagerFirst')
        store1 = self.create_store(self.get_store(), merchant1.id)
        manager1.stores.append(store1)
        self.db.commit()

        merchant2 = self.create_merchant(self.get_merchant(), 'MerchantSecond', 'UserSecond')
        manager2 = self.create_manager(self.get_manager(), merchant2.id, 'ManagerSecond')
        store2 = self.create_store(self.get_store(), merchant2.id)
        manager2.stores.append(store2)
        self.db.commit()

        status, body = self.delete('/managers/%s/stores/%s' % (manager1.id, store1.id))
        self.assertEqual(status, 200)
        status, body = self.delete('/managers/%s/stores/%s' % (manager2.id, store2.id))
        self.assertEqual(status, 200)

        status, body = self.delete('/managers/%s/stores/%s' % (manager1.id, store2.id))
        self.assertEqual(status, 404)
        status, body = self.delete('/managers/%s/stores/%s' % (manager2.id, store1.id))
        self.assertEqual(status, 404)

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
