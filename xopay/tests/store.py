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
        # TODO: continue
        pass

    def test_get_merchant_stores_list_valid_structure(self):
        # TODO: continue
        pass

    def test_get_merchant_stores_not_found(self):
        self.create_merchant(self.get_merchant())

        for merchant_id in ['0', '2', 'test', 'null', '']:
            status, body = self.get('/merchants/%s/stores' % merchant_id)
            self.assertEqual(status, 404)

    # POST /merchants/<merchant_id>/stores
