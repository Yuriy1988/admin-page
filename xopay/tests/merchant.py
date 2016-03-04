import unittest

from xopay.tests import base
from xopay.models import Merchant, User

__author__ = 'Kostel Serhii'


class TestMerchant(base.BaseTestCase):

    def _create_merchant(self, merchant_name=None, username=None):
        merchant = self.get_merchant()
        merchant['merchant_name'] = merchant_name or "merchant" + self.rand_str()
        merchant['user']['username'] = username or "user" + self.rand_str()

        merchant_model = Merchant.create(merchant)
        self.db.commit()

        return merchant_model

    # GET /merchants

    def test_get_merchants_list_empty(self):
        status, body = self.get('/merchants')

        self.assertEqual(status, 200)
        self.assertListEqual(body['merchants'], [])

    def test_get_merchants_list_all(self):
        merchants_num = 10
        for mi in range(merchants_num):
            self._create_merchant('merchant' + str(mi))

        status, body = self.get('/merchants')
        self.assertEqual(status, 200)
        self.assertIn('merchants', body)

        merchants = body['merchants']
        self.assertEqual(len(merchants), merchants_num)

    def test_get_merchants_list_valid_structure(self):
        merchants_num = 10
        for mi in range(merchants_num):
            self._create_merchant('merchant' + str(mi))

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

    def test_post_merchant_not_valid_merchant_account_fixer_digits_num(self):
        merchant = self.get_merchant()

        for checking_account, mfo, okpo in [('1'*13, '2'*5, '3'*7), ('4'*15, '5'*7, '6'*9)]:
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


if __name__ == '__main__':

    unittest.main()
