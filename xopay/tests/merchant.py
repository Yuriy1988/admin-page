from xopay.tests import base
from xopay.models import Merchant, MerchantAccount, MerchantInfo

__author__ = 'Kostel Serhii'


class TestMerchant(base.BaseTestCase):

    # GET /merchants

    def test_get_merchants_list_empty(self):
        status, body = self.get('/merchants')

        self.assertEqual(status, 200)
        self.assertListEqual(body['merchants'], [])

    def test_get_merchants_list_all(self):
        merchants_num = 10
        for mi in range(merchants_num):
            merchant = self.get_merchant()
            self.create_merchant(merchant, merchant_name='merchant' + str(mi))

        status, body = self.get('/merchants')
        self.assertEqual(status, 200)
        self.assertIn('merchants', body)

        merchants = body['merchants']
        self.assertEqual(len(merchants), merchants_num)

    def test_get_merchants_list_valid_structure(self):
        merchants_num = 10
        for mi in range(merchants_num):
            merchant = self.get_merchant()
            self.create_merchant(merchant, merchant_name='merchant' + str(mi))

        status, body = self.get('/merchants')
        self.assertEqual(status, 200)

        for merchant in body['merchants']:
            self.assertIn('id', merchant)
            self.assertIn('merchant_name', merchant)

            self.assertIsInstance(merchant.pop('id'), int)
            self.assertIsInstance(merchant.pop('merchant_name'), str)

            self.assertDictEqual(merchant, {})

    # POST /merchants

    def test_post_merchant_full_valid_response(self):
        merchant = self.get_merchant()

        status, body = self.post('/merchants', merchant)

        self.assertEqual(status, 200)
        self.assertIn('id', body)
        self.assertIn('user', body)
        self.assertIn('id', body['user'])
        self.assertEqual(body['merchant_name'], merchant['merchant_name'])
        self.assertDictEqual(body['merchant_account'], merchant['merchant_account'])
        self.assertDictEqual(body['merchant_info'], merchant['merchant_info'])

    def test_post_merchant_partial_valid_response(self):
        # request can contain null fields or miss not required field
        merchant = self.get_merchant()
        del merchant['merchant_info']

        status, body = self.post('/merchants', merchant)
        self.assertEqual(status, 200)

        self.assertIn('id', body)
        self.assertEqual(body['merchant_name'], merchant['merchant_name'])
        self.assertDictEqual(body['merchant_account'], merchant['merchant_account'])
        self.assertEqual(body['merchant_info'], {"address": None, "director_name": None})

    def test_post_merchant_create_merchant_info_model(self):
        merchant = self.get_merchant()
        merchant['merchant_info'] = None

        status, body = self.post('/merchants', merchant)
        self.assertEqual(status, 200)

        merchant_model = Merchant.query.get(body['id'])
        self.assertIsNotNone(merchant_model.merchant_info)
        self.assertIsNotNone(merchant_model.merchant_info.id)
        self.assertIsNone(merchant_model.merchant_info.address)
        self.assertIsNone(merchant_model.merchant_info.director_name)

    def test_post_merchant_created(self):
        merchant = self.get_merchant()

        # merchant not created
        merchant_model = Merchant.query.filter_by(merchant_name=merchant['merchant_name']).first()
        self.assertIsNone(merchant_model)

        status, body = self.post('/merchants', merchant)
        self.assertEqual(status, 200)

        # merchant created
        merchant_model = Merchant.query.filter_by(merchant_name=merchant['merchant_name']).first()
        self.assertEqual(body['id'], merchant_model.id)

    def test_post_merchant_id_readonly(self):
        merchant = self.get_merchant()
        merchant['id'] = 27

        status, body = self.post('/merchants', merchant)
        self.assertEqual(status, 200)

        self.assertNotEqual(body['id'], merchant['id'])

    def test_post_merchant_unique_fields(self):

        status, body = self.post('/merchants', self.get_merchant())
        self.assertEqual(status, 200)

        status, body = self.post('/merchants', self.get_merchant())
        self.assertEqual(status, 400)

        # unique fields
        errors = body['error']['errors']
        self.assertIn('merchant_name', errors)

    def test_post_merchant_missing_merchant_account(self):
        merchant = self.get_merchant()
        merchant_account = merchant.pop('merchant_account')

        status, body = self.post('/merchants', merchant)
        self.assertEqual(status, 400)

        errors = body['error']['errors']
        self.assertIn('merchant_account', errors)
        self.assertSetEqual(set(errors['merchant_account'].keys()), set(merchant_account.keys()))

    def test_post_merchant_missing_required_fields(self):
        merchant = self.get_merchant()
        merchant['merchant_name'] = None
        merchant['merchant_account'] = {"bank_name": None, "checking_account": None,
                                        "currency": None, "mfo": None, "okpo": None}
        merchant['user'] = {'username': None, 'enabled': None}

        status, body = self.post('/merchants', merchant)
        self.assertEqual(status, 400)

        errors = body['error']['errors']
        self.assertIn('merchant_name', errors)
        self.assertIn('merchant_account', errors)
        self.assertIn('user', errors)
        self.assertSetEqual(set(errors['merchant_account'].keys()), set(merchant['merchant_account'].keys()))

    def test_post_merchant_not_valid_merchant_account_currency(self):
        merchant = self.get_merchant()
        merchant['merchant_account']['currency'] = 'NOT'

        status, body = self.post('/merchants', merchant)
        self.assertEqual(status, 400)

        errors = body['error']['errors']
        self.assertIn('currency', errors['merchant_account'])

    def test_post_merchant_not_valid_merchant_account_digits_fields(self):
        merchant = self.get_merchant()
        checked_values = [
            ('', '', ''),
            ('a'+'0'*13, 'b'+'5'*5, 'c'+'7'*7),
            ('1'*11, '2'*5, '3'*7),
            ('4'*25, '5'*7, '6'*9)
        ]

        for checking_account, mfo, okpo in checked_values:
            merchant['merchant_account']['checking_account'] = checking_account
            merchant['merchant_account']['mfo'] = mfo
            merchant['merchant_account']['okpo'] = okpo

            status, body = self.post('/merchants', merchant)
            self.assertEqual(status, 400)

            errors = body['error']['errors']
            self.assertIn('checking_account', errors['merchant_account'])
            self.assertIn('mfo', errors['merchant_account'])
            self.assertIn('okpo', errors['merchant_account'])

    def test_post_merchant_not_valid_merchant_account_string(self):
        merchant = self.get_merchant()

        for merchant_name, bank_name, address, director_name in [('mm', 'bb', 'aaa', 'ddd'),
                                                                 ('m'*40, 'b'*300, 'a'*500, 'd'*150)]:
            merchant['merchant_name'] = merchant_name
            merchant['merchant_account']['bank_name'] = bank_name
            merchant['merchant_info']['address'] = address
            merchant['merchant_info']['director_name'] = director_name

            status, body = self.post('/merchants', merchant)
            self.assertEqual(status, 400)

            errors = body['error']['errors']
            self.assertIn('merchant_name', errors)
            self.assertIn('bank_name', errors['merchant_account'])
            self.assertIn('address', errors['merchant_info'])
            self.assertIn('director_name', errors['merchant_info'])

    # GET /merchants/<merchant_id>

    def test_get_merchant_by_id(self):
        merchant = self.get_merchant()
        merchant_model_1 = self.create_merchant(merchant, merchant_name='apple', username='jobs')
        merchant_model_2 = self.create_merchant(merchant, merchant_name='linux', username='torvalds')

        status, body = self.get('/merchants/{merchant_id}'.format(merchant_id=merchant_model_1.id))
        self.assertEqual(status, 200)

        status, body = self.get('/merchants/{merchant_id}'.format(merchant_id=merchant_model_2.id))
        self.assertEqual(status, 200)

    def test_get_merchant_full_valid_response(self):
        merchant = self.get_merchant()
        merchant_model = self.create_merchant(merchant, merchant_name='apple', username='jobs')

        status, body = self.get('/merchants/{merchant_id}'.format(merchant_id=merchant_model.id))
        self.assertEqual(status, 200)

        self.assertIn('id', body)
        self.assertIn('user', body)
        self.assertIn('id', body['user'])
        self.assertEqual(body['merchant_name'], merchant['merchant_name'])
        self.assertDictEqual(body['merchant_account'], merchant['merchant_account'])
        self.assertDictEqual(body['merchant_info'], merchant['merchant_info'])

    def test_get_merchant_partial_valid_response(self):
        merchant = self.get_merchant()
        del merchant['merchant_info']
        merchant_model = self.create_merchant(merchant, merchant_name='who', username='someone')

        status, body = self.get('/merchants/{merchant_id}'.format(merchant_id=merchant_model.id))
        self.assertEqual(status, 200)

        self.assertIn('id', body)
        self.assertIn('user', body)
        self.assertIn('id', body['user'])
        self.assertEqual(body['merchant_name'], merchant['merchant_name'])
        self.assertDictEqual(body['merchant_account'], merchant['merchant_account'])
        self.assertDictEqual(body['merchant_info'], {"address": None, "director_name": None})

    def test_get_merchant_not_found(self):
        self.create_merchant(self.get_merchant())

        for merchant_id in ['0', '2', 'test', 'null', '']:
            status, body = self.get('/merchants/%s' % merchant_id)
            self.assertEqual(status, 404)

    # PUT /merchants/<merchant_id>

    def test_put_merchant_update_merchant_name_success(self):
        merchant = self.create_merchant(self.get_merchant(), merchant_name='merchant_name')
        new_merchant_name = 'new_merchant_name'

        status, body = self.put('/merchants/%s' % merchant.id, {'merchant_name': new_merchant_name})
        self.assertEqual(status, 200)
        self.assertEqual(body['merchant_name'], new_merchant_name)

        new_merchant_model = Merchant.query.get(merchant.id)
        self.assertEqual(new_merchant_model.merchant_name, new_merchant_name)

    def test_put_merchant_update_unique_merchant_name_with_the_same_value(self):
        merchant = self.get_merchant()
        merchant['merchant_name'] = 'David Blain'
        merchant_model = self.create_merchant(merchant)

        status, body = self.put('/merchants/%s' % merchant_model.id, {'merchant_name': merchant['merchant_name']})
        self.assertEqual(status, 200)
        self.assertEqual(body['merchant_name'], merchant['merchant_name'])

    def test_put_merchant_id_field_read_only(self):
        merchant = self.create_merchant(self.get_merchant())

        status, body = self.put('/merchants/%s' % merchant.id, {'id': 69})
        self.assertEqual(status, 200)
        self.assertEqual(body['id'], merchant.id)

    def test_put_merchant_update_merchant_info_single_filed(self):
        merchant_model = self.create_merchant(self.get_merchant())
        merchant_info = {'address': 'Country, City, Street'}

        status, body = self.put('/merchants/%s' % merchant_model.id, {'merchant_info': merchant_info})
        self.assertEqual(status, 200)
        self.assertEqual(body['merchant_info']['address'], merchant_info['address'])

    def test_put_merchant_update_merchant_info_to_none(self):
        merchant = self.get_merchant()
        merchant['merchant_info'] = {'address': 'test address', 'director_name': 'Jon Dou'}
        merchant_model = self.create_merchant(merchant)
        merchant_info = {'address': None, 'director_name': None}

        status, body = self.put('/merchants/%s' % merchant_model.id, {'merchant_info': merchant_info})
        self.assertEqual(status, 200)
        self.assertEqual(body['merchant_info'], merchant_info)

        status, body = self.put('/merchants/%s' % merchant_model.id, {'merchant_info': None})
        self.assertEqual(status, 200)
        self.assertEqual(body['merchant_info'], merchant_info)

    def test_put_merchant_update_merchant_info_from_none(self):
        merchant = self.get_merchant()
        merchant['merchant_info'] = None
        merchant_model = self.create_merchant(merchant)

        merchant_info = {'address': None, 'director_name': None}
        status, body = self.put('/merchants/%s' % merchant_model.id, {'merchant_info': merchant_info})
        self.assertEqual(status, 200)
        self.assertEqual(body['merchant_info'], merchant_info)

        merchant_info = {'address': 'test address', 'director_name': 'Jon Dou'}
        status, body = self.put('/merchants/%s' % merchant_model.id, {'merchant_info': merchant_info})
        self.assertEqual(status, 200)
        self.assertEqual(body['merchant_info'], merchant_info)

    def test_put_merchant_update_merchant_account_single_filed(self):
        merchant_model = self.create_merchant(self.get_merchant())
        merchant_account = {"bank_name": "Serhiivsky Bank"}

        status, body = self.put('/merchants/%s' % merchant_model.id, {'merchant_account': merchant_account})
        self.assertEqual(status, 200)
        self.assertEqual(body['merchant_account']['bank_name'], merchant_account['bank_name'])

    def test_put_merchant_update_merchant_account_success(self):
        merchant = self.create_merchant(self.get_merchant(), merchant_name='merchant_name')
        merchant_account = {
            "bank_name": "test",
            "checking_account": "00000000000000",
            "currency": "RUB",
            "mfo": "111111",
            "okpo": "22222222"
        }

        status, body = self.put('/merchants/%s' % merchant.id, {'merchant_account': merchant_account})
        self.assertEqual(status, 200)
        self.assertEqual(body['merchant_account'], merchant_account)

        merchant_account = Merchant.query.get(merchant.id).merchant_account
        self.assertEqual(merchant_account.bank_name, 'test')
        self.assertEqual(merchant_account.checking_account, '00000000000000')
        self.assertEqual(merchant_account.currency, 'RUB')
        self.assertEqual(merchant_account.mfo, '111111')
        self.assertEqual(merchant_account.okpo, '22222222')

    def test_put_merchant_not_update_merchant_account_if_required_field(self):
        merchant = self.create_merchant(self.get_merchant(), merchant_name='merchant_name')
        merchant_account = {
            "bank_name": None,
            "checking_account": None,
            "currency": None,
            "mfo": None,
            "okpo": None
        }

        status, body = self.put('/merchants/%s' % merchant.id, {'merchant_account': merchant_account})
        self.assertEqual(status, 400)
        errors = body['error']['errors']
        self.assertIn('merchant_account', errors)
        self.assertSetEqual(set(errors['merchant_account'].keys()), set(merchant_account.keys()))

    def test_put_merchant_not_update_merchant_name_none(self):
        merchant = self.create_merchant(self.get_merchant(), merchant_name='test_name')

        status, body = self.put('/merchants/%s' % merchant.id, {'merchant_name': None})
        self.assertEqual(status, 400)
        errors = body['error']['errors']
        self.assertIn('merchant_name', errors)

    def test_put_merchant_not_update_merchant_name_if_not_unique(self):
        merchant_1 = self.create_merchant(self.get_merchant(), merchant_name='test_name1')
        merchant_2 = self.create_merchant(self.get_merchant(), merchant_name='test_name2')

        status, body = self.put('/merchants/%s' % merchant_1.id,
                                {'merchant_name': merchant_2.merchant_name})
        self.assertEqual(status, 400)
        errors = body['error']['errors']
        self.assertIn('merchant_name', errors)

        merchant_model = Merchant.query.get(merchant_1.id)
        self.assertNotEqual(merchant_model.merchant_name, merchant_2.merchant_name)

    def test_put_merchant_not_found(self):
        self.create_merchant(self.get_merchant())

        for merchant_id in ['0', '2', 'test', 'null', '']:
            status, body = self.put('/merchants/%s' % merchant_id, {'merchant_name': 'not found'})
            self.assertEqual(status, 404)

    # DELETE /merchants/<merchant_id>

    def test_delete_merchant_success(self):
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id
        merchant_account_id = merchant.merchant_account.id
        merchant_info_id = merchant.merchant_info.id

        status, body = self.delete('/merchants/%s' % merchant_id)
        self.assertEqual(status, 200)

        deleted_merchant_model = Merchant.query.get(merchant_id)
        self.assertIsNone(deleted_merchant_model)

        deleted_merchant_account_model = MerchantAccount.query.get(merchant_account_id)
        self.assertIsNone(deleted_merchant_account_model)

        deleted_merchant_info_model = MerchantInfo.query.get(merchant_info_id)
        self.assertIsNone(deleted_merchant_info_model)

    def test_delete_merchant_not_found(self):
        self.create_merchant(self.get_merchant())

        for merchant_id in ['0', '2', 'test', 'null', '']:
            status, body = self.delete('/merchants/%s' % merchant_id)
            self.assertEqual(status, 404)
