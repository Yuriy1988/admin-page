from xopay.tests import base

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

        for merchant_id in ['0', '2', 'test', 'null', '']:
            status, body = self.get('/merchants/%s/stores' % merchant_id)
            self.assertEqual(status, 404)

    # POST /merchants/<merchant_id>/stores
