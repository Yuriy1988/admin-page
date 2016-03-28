from api.tests import base

__author__ = 'Kostel Serhii'


class TestManager(base.BaseTestCase):

    # GET /merchants/<merchant_id>/managers

    def test_get_merchant_managers_list_empty(self):
        merchant = self.create_merchant(self.get_merchant())

        status, body = self.get('/merchants/%s/managers' % merchant.id)

        self.assertEqual(status, 200)
        self.assertIn('managers', body)
        self.assertListEqual(body['managers'], [])

    def test_get_merchant_managers_list_all(self):
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id
        managers_num = 10
        for mi in range(managers_num):
            manager = self.get_manager()
            self.create_manager(manager, merchant_id, username='user' + str(mi))

        status, body = self.get('/merchants/%s/managers' % merchant_id)

        self.assertEqual(status, 200)
        self.assertIn('managers', body)
        self.assertEqual(len(body['managers']), managers_num)

    def test_get_merchant_managers_list_valid_structure(self):
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id
        managers_num = 10
        for mi in range(managers_num):
            manager = self.get_manager()
            self.create_manager(manager, merchant_id, username='user' + str(mi))

        status, body = self.get('/merchants/%s/managers' % merchant_id)
        self.assertEqual(status, 200)

        for manager in body['managers']:
            self.assertIn('id', manager)
            self.assertIn('user', manager)

            self.assertIsInstance(manager.pop('id'), str)
            self.assertIsInstance(manager.pop('user'), dict)

            self.assertDictEqual(manager, {})

    def test_get_merchant_managers_not_found(self):
        self.create_merchant(self.get_merchant())

        for merchant_id in ['00000000-1111-2222-3333-444444444444', '0', '1', 'test', 'null', '']:
            status, body = self.get('/merchants/%s/managers' % merchant_id)
            self.assertEqual(status, 404)

    # POST /merchants/<merchant_id>/managers
