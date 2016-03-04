import unittest
from copy import deepcopy

from xopay.tests import base
from xopay.models import Merchant, User

__author__ = 'Kostel Serhii'


class TestUser(base.BaseTestCase):

    # POST /merchants (user creation, when merchant created)

    def test_post_merchant_user_full_valid_response(self):
        merchant = self.get_merchant()

        status, body = self.post('/merchants', merchant)

        self.assertEqual(status, 200)
        self.assertIn('id', body['user'])
        body['user'].pop('id')
        self.assertDictEqual(merchant['user'], body['user'])

    def test_post_merchant_user_partial_valid_response(self):
        # request can contain null fields or miss not required field
        merchant = self.get_merchant()
        merchant['user']['first_name'] = None
        merchant['user']['last_name'] = None
        merchant['user']['email'] = None
        del merchant['user']['phone']
        del merchant['user']['notify']

        status, body = self.post('/merchants', merchant)
        self.assertEqual(status, 200)

        user = body['user']
        self.assertIn('id', user)
        self.assertIsNone(user['first_name'])
        self.assertIsNone(user['last_name'])
        self.assertIsNone(user['email'])
        self.assertIsNone(user['phone'])
        self.assertIsNone(user['notify'])

    def test_post_merchant_user_created(self):
        merchant = self.get_merchant()

        # user not created
        user_model = User.query.filter_by(username=merchant['user']['username']).first()
        self.assertIsNone(user_model)

        status, body = self.post('/merchants', merchant)
        self.assertEqual(status, 200)

        # user created
        user_model = User.query.filter_by(username=merchant['user']['username']).first()
        self.assertEqual(body['user']['id'], user_model.id)

    def test_post_merchant_user_id_readonly(self):
        merchant = self.get_merchant()
        merchant['user']['id'] = 9

        status, body = self.post('/merchants', merchant)
        self.assertEqual(status, 200)

        self.assertNotEqual(body['user']['id'], merchant['user']['id'])

    def test_post_merchant_user_unique_fields(self):

        status, body = self.post('/merchants', self.get_merchant())
        self.assertEqual(status, 200)

        status, body = self.post('/merchants', self.get_merchant())
        self.assertEqual(status, 400)

        # unique fields
        errors = body['error']['errors']
        self.assertIn('user', errors)
        self.assertIn('username', errors['user'])

    def test_post_merchant_user_missing_required_fields(self):
        merchant = self.get_merchant()
        merchant['user'] = {'username': None, 'enabled': None}

        status, body = self.post('/merchants', merchant)
        self.assertEqual(status, 400)

        errors = body['error']['errors']
        self.assertIn('user', errors)
        self.assertSetEqual(set(errors['user'].keys()), set(merchant['user'].keys()))

    def test_post_merchant_user_not_valid_username(self):
        merchant = self.get_merchant()
        merchant['user']['username'] = '! #;... not valid username'

        status, body = self.post('/merchants', merchant)
        self.assertEqual(status, 400)

        errors = body['error']['errors']
        self.assertIn('username', errors['user'])

    def test_post_merchant_user_not_valid_user_notify(self):
        merchant = self.get_merchant()
        merchant['user']['notify'] = 'TELEPATHY'

        status, body = self.post('/merchants', merchant)
        self.assertEqual(status, 400)

        errors = body['error']['errors']
        self.assertIn('notify', errors['user'])

    def test_post_merchant_user_not_valid_user_email(self):
        merchant = self.get_merchant()
        merchant['user']['email'] = 'not.valid.email@'

        status, body = self.post('/merchants', merchant)
        self.assertEqual(status, 400)

        errors = body['error']['errors']
        self.assertIn('email', errors['user'])

    def test_post_merchant_user_not_valid_user_phone(self):
        merchant = self.get_merchant()

        for phone in ['380', 'not a phone', '0000000000000000', '+380991234567']:
            merchant['user']['phone'] = phone

            status, body = self.post('/merchants', merchant)
            self.assertEqual(status, 400)

            errors = body['error']['errors']
            self.assertIn('phone', errors['user'])

    def test_post_merchant_user_not_valid_user_string(self):
        merchant = self.get_merchant()

        for username, first_name, last_name in [('u', 'f', 'l'), ('u'*200, 'f'*200, 'l'*200)]:
            merchant['user']['username'] = username
            merchant['user']['first_name'] = first_name
            merchant['user']['last_name'] = last_name

            status, body = self.post('/merchants', merchant)
            self.assertEqual(status, 400)

            errors = body['error']['errors']
            self.assertIn('username', errors['user'])
            self.assertIn('first_name', errors['user'])
            self.assertIn('last_name', errors['user'])



if __name__ == '__main__':

    unittest.main()
