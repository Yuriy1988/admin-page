import unittest

from xopay.tests import base
from xopay.models import Merchant

__author__ = 'Kostel Serhii'


class TestMerchant(base.BaseTestCase):

    # defaults
    url = '/api/admin/dev'

    _merchant_account = {
        "bank_name": "Test Bank Name",
        "checking_account": "01234567891234",
        "currency": "USD",
        "mfo": "123456",
        "okpo": "12345678"
    }
    _merchant_info = {
        "address": "One Microsoft Way, Redmond, WA",
        "director_name": "Bill Gates"
    }
    _user = {
        "username": "must_be_unique",
        "first_name": "John",
        "last_name": "Doe",
        "email": "jhon.doe@test.com",
        "phone": "304201234567",
        "notify": None,
        "enabled": True
    }
    _merchant = {
        "merchant_name":  "must_be_unique",
        "merchant_account": _merchant_account,
        "merchant_info": _merchant_info,
        "user": _user
    }

    def _create_merchant(self, merchant_name=None, username=None):
        merchant = self._merchant.copy()
        merchant['merchant_name'] = merchant_name or "merchant" + self.rand_str()
        merchant['user']['username'] = username or "user" + self.rand_str()

        merchant_model = Merchant.create(merchant)
        self.db.commit()

        return merchant_model

    def test_get_merchants_list_empty(self):
        Merchant.query.delete()

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


if __name__ == '__main__':

    unittest.main()
