import unittest

from xopay.tests import base
from xopay.models import Merchant, MerchantAccount, MerchantInfo

__author__ = 'Kostel Serhii'


class TestMerchantContracts(base.BaseTestCase):

    # GET /merchants/{merchant_id}/contracts

    def test_get_contracts_list_empty(self):
        merchant = self.create_merchant(self._merchant)
        status, body = self.get('/merchants/{merchant_id}/contracts'.format(merchant_id=merchant.id))

        self.assertEqual(status, 200, msg=body.get('error', ''))
        self.assertListEqual(body['contracts'], [])

    def test_get_merchant_not_found(self):
        status, body = self.get('/merchants/{merchant_id}/contracts'.format(merchant_id=0))

        self.assertEqual(status, 404, msg=body.get('error', ''))

    def test_get_contract_list(self):
        merchant = self.create_merchant(self._merchant)
        merchant_contract = self._merchant_contract
        contract = self.create_merchant_contract(merchant_contract, merchant.id)
        merchant_contract["id"] = contract.id
        status, body = self.get('/merchants/{merchant_id}/contracts'.format(merchant_id=merchant.id))

        self.assertEqual(status, 200, msg=body.get('error', ''))
        print(body['contracts'])
        print(merchant_contract)
        for i, j in zip(body['contracts'], [merchant_contract]):
            self.assertDictEqual(i, j)
