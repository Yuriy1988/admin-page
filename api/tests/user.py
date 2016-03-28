import unittest

from api.tests import base
from api.models import User

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

        status, body = self.post('/merchants', merchant)
        self.assertEqual(status, 200)

        user = body['user']
        self.assertIn('id', user)
        self.assertIsNone(user['first_name'])
        self.assertIsNone(user['last_name'])
        self.assertIsNone(user['email'])
        self.assertIsNone(user['phone'])

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
        merchant['user'] = {'username': None, 'enabled': None, 'notify': None}

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

    # GET /merchants/<merchant_id> (user get, when merchant get)

    def test_get_merchant_user_full_valid_response(self):
        merchant = self.get_merchant()
        merchant_model = self.create_merchant(merchant, merchant_name='merchant_name')

        status, body = self.get('/merchants/%s' % merchant_model.id)
        self.assertEqual(status, 200)

        self.assertIn('id', body['user'])
        body['user'].pop('id')
        self.assertDictEqual(merchant['user'], body['user'])

    def test_get_merchant_user_partial_valid_response(self):
        merchant = self.get_merchant()
        merchant['user']['first_name'] = None
        merchant['user']['last_name'] = None
        merchant['user']['email'] = None
        del merchant['user']['phone']

        merchant_model = self.create_merchant(merchant, merchant_name='merchant_name')

        status, body = self.get('/merchants/%s' % merchant_model.id)
        self.assertEqual(status, 200)

        user = body['user']
        self.assertIn('id', user)
        self.assertIsNone(user['first_name'])
        self.assertIsNone(user['last_name'])
        self.assertIsNone(user['email'])
        self.assertIsNone(user['phone'])

    # PUT /merchants/<merchant_id> (user update, when merchant updated)

    def test_put_merchant_user_update(self):
        merchant = self.create_merchant(self.get_merchant(), merchant_name='merchant_name')
        user = {
            "first_name": "test",
            "last_name": "test",
            "email": "test@some.to.go",
            "phone": "380771234567",
            "notify": 'EMAIL',
            "enabled": False
        }

        status, body = self.put('/merchants/%s' % merchant.id, {'user': user})
        self.assertEqual(status, 200)
        self.assertDictContainsSubset(user, body['user'])

        user_model = User.query.get(merchant.user.id)
        self.assertEqual(user_model.first_name, user['first_name'])
        self.assertEqual(user_model.last_name, user['last_name'])
        self.assertEqual(user_model.email, user['email'])
        self.assertEqual(user_model.phone, user['phone'])
        self.assertEqual(user_model.notify, user['notify'])
        self.assertEqual(user_model.enabled, user['enabled'])

    def test_put_merchant_user_update_username(self):
        merchant = self.create_merchant(self.get_merchant(), merchant_name='merchant_name')
        user = User.query.filter_by(username='new_user').first()
        self.assertIsNone(user)

        status, body = self.put('/merchants/%s' % merchant.id, {'user': {'username': 'new_user'}})
        self.assertEqual(status, 200)
        self.assertEqual(body['user']['id'], merchant.user.id)

        user = User.query.get(merchant.user.id)
        self.assertIsNotNone(user)
        self.assertEqual(user.username, 'new_user')

    def test_put_merchant_update_unique_username_with_the_same_value(self):
        merchant = self.get_merchant()
        username = 'Bob Dilan'
        merchant_model = self.create_merchant(merchant, username=username)

        status, body = self.put('/merchants/%s' % merchant_model.id, {'user': {'username': username}})
        self.assertEqual(status, 200)
        self.assertEqual(body['user']['username'], username)

    def test_put_merchant_user_update_single_value(self):
        merchant = self.get_merchant()
        merchant['user']['enabled'] = False
        merchant = self.create_merchant(merchant)

        status, body = self.put('/merchants/%s' % merchant.id, {'user': {"enabled": True}})
        self.assertEqual(status, 200)
        self.assertTrue(body['user']['enabled'])

    def test_put_merchant_user_not_update(self):
        merchant = self.create_merchant(self.get_merchant(), merchant_name='merchant_name')
        user = {"username": None, "enabled": None, "notify": None}

        status, body = self.put('/merchants/%s' % merchant.id, {'user': user})
        self.assertEqual(status, 400)
        errors = body['error']['errors']
        self.assertIn('user', errors)
        self.assertSetEqual(set(errors['user'].keys()), set(user.keys()))

    # DELETE /merchants/<merchant_id> (user delete, when merchant deleted)

    @unittest.skip("Repair delete orphan!")
    def test_delete_merchant_user_deleted(self):
        merchant_model = self.create_merchant(self.get_merchant())
        merchant_id = merchant_model.id
        user_id = merchant_model.user.id

        status, body = self.delete('/merchants/%s' % merchant_id)
        self.assertEqual(status, 200)

        user_model = User.query.get(user_id)
        self.assertIsNone(user_model)
