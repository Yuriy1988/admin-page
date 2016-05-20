from copy import deepcopy

from api.tests import base
from api.models import Manager

__author__ = 'Kostel Serhii'


class TestManager(base.BaseTestCase):

    def get_manager(self):
        return deepcopy(self._manager)

    def create_manager(self, manager_dict, merchant_id=None, username=None):
        merchant_id = merchant_id or self.create_merchant(self.get_merchant()).id
        manager_dict['merchant_id'] = merchant_id
        manager_dict['user']['username'] = username or "user" + self.rand_str()

        manager_model = Manager.create(manager_dict)
        self.db.commit()

        # Add password to make manager enabled
        manager_model.user.set_password('password')

        return manager_model

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
            self.create_manager(self.get_manager(), merchant_id, username='user' + str(mi))

        status, body = self.get('/merchants/%s/managers' % merchant_id)

        self.assertEqual(status, 200)
        self.assertIn('managers', body)
        self.assertEqual(len(body['managers']), managers_num)

    def test_get_merchant_managers_list_valid_structure(self):
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id
        managers_num = 10
        for mi in range(managers_num):
            self.create_manager(self.get_manager(), merchant_id, username='user' + str(mi))

        status, body = self.get('/merchants/%s/managers' % merchant_id)
        self.assertEqual(status, 200)

        for manager in body['managers']:
            self.assertIn('id', manager)
            self.assertIn('merchant_id', manager)
            self.assertIn('user', manager)

            self.assertIsInstance(manager.pop('id'), str)
            self.assertIsInstance(manager.pop('merchant_id'), str)
            self.assertIsInstance(manager.pop('user'), dict)

            self.assertDictEqual(manager, {})

    def test_get_merchant_managers_not_found(self):
        self.create_merchant(self.get_merchant())

        for merchant_id in ['00000000-1111-2222-3333-444444444444', '0', '1', 'test', 'null', '']:
            status, body = self.get('/merchants/%s/managers' % merchant_id)
            self.assertEqual(status, 404)

    # POST /merchants/<merchant_id>/managers

    def test_post_manager_create_full_success(self):
        # creating a merchant:
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id

        # getting user and giving him an id:
        user = self.get_user()
        user["id"] = "2345-efss-erfx-e33er-3333"

        # creating a manager:
        data = {'user': user}
        status, body = self.post('/merchants/%s/managers' % merchant_id, data)

        # Getting new manager using GET API request:
        manager_status, manager_body = self.get('/managers/%s' % body["id"])

        self.assertEqual(status, 200)
        self.assertIn("id", manager_body)
        self.assertIn("id", manager_body["user"])
        self.assertIn("user", manager_body)

        # Getting new manager from DB:
        manager = Manager.query.get(manager_body["id"])
        self.assertIsNotNone(manager.merchant_id)

    def test_post_manager_create_valid_response_structure(self):
        # creating a merchant:
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id

        # getting user and giving him an id:
        user = self.get_user()
        user["id"] = "2345-efss-erfx-e33er-3333"

        # creating a manager:
        data = {'user': user}
        status, body = self.post('/merchants/%s/managers' % merchant_id, data)

        # Getting new manager using GET API request:
        manager_status, manager_body = self.get('/managers/%s' % body["id"])

        self.assertEqual(status, 200)
        self.assertIsInstance(manager_body.pop("id"), str)
        self.assertIsInstance(manager_body.pop("user"), dict)

    def test_post_manager_create_read_only_fields_not_saved(self):
        merchant = self.create_merchant(self.get_merchant())

        manager = self.get_manager()
        manager['id'] = '777'
        manager['user']['id'] = '69'
        manager['merchant_id'] = '42'

        status, body = self.post('/merchants/%s/managers' % merchant.id, manager)

        self.assertEqual(status, 200)
        self.assertNotEqual(body['id'], manager['id'])
        self.assertNotEqual(body['merchant_id'], manager['merchant_id'])
        self.assertNotEqual(body['user']['id'], manager['user']['id'])

    def test_post_manager_create_merchant_not_found(self):
        self.create_merchant(self.get_merchant())
        manager = self.get_manager()

        for merchant_id in ['00000000-1111-2222-3333-444444444444', '0', '1', 'test', 'null', '']:
            status, body = self.post('/merchants/%s/managers' % merchant_id, manager)
            self.assertEqual(status, 404)

    def test_post_wrong_json(self):
        merchant = self.create_merchant(self.get_merchant())

        status, body = self.post('/merchants/%s/managers' % merchant.id, None)
        self.assertEqual(status, 400)

        status, body = self.post('/merchants/%s/managers' % merchant.id, '{"wrong": json ]')
        self.assertEqual(status, 400)

    def test_post_invalid_json_user_is_none(self):
        # creating a merchant:
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id

        # getting user and giving him an id:
        user = self.get_user()
        user["id"] = "2345-efss-erfx-e33er-3333"

        # creating a manager:
        data = {'user': None}
        status, body = self.post('/merchants/%s/managers'% merchant_id, data)

        # creating a manager:
        status, body = self.post('/merchants/%s/managers' % merchant_id, None)

        self.assertEqual(status, 400)

    def test_post_invalid_json_user_is_str(self):
        # creating a merchant:
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id

        # getting user and giving him an id:
        user = self.get_user()
        user["id"] = "2345-efss-erfx-e33er-3333"

        # creating a manager:
        data = {'user': 'user'}
        status, body = self.post('/merchants/%s/managers' % merchant_id, data)

        # creating a manager:
        status, body = self.post('/merchants/%s/managers' % merchant_id, None)

        self.assertEqual(status, 400)

    def test_post_invalid_json_user_username_length_less(self):
        # creating a merchant:
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id

        # getting user and giving him an id:
        user = self.get_user()
        user["username"] = "21"
        user["id"] = "2345-efss-erfx-e33er-3333"

        # creating a manager:
        data = {'user': 'user'}
        status, body = self.post('/merchants/%s/managers' % merchant_id, data)

        # creating a manager:
        status, body = self.post('/merchants/%s/managers' % merchant_id, None)

        self.assertEqual(status, 400)

    def test_post_invalid_json_user_username_length_more(self):
        # creating a merchant:
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id

        # getting user and giving him an id:
        user = self.get_user()
        user["username"] = "12345678901234567890123456789012345678901238973895739048579284758384rueruaweyuryq" \
                           "uiyr9283sadklj23k4j1j3elkjwlkdjlkjlwerwkejdlakwjdl;ajwekljdklja23uer93uoUEWUEOUWAEIO" \
                           "RIOAWASDASDSKDJASLKDJLAKSJED"
        user["id"] = "2345-efss-erfx-e33er-3333"

        # creating a manager:
        data = {'user': 'user'}
        status, body = self.post('/merchants/%s/managers' % merchant_id, data)

        # creating a manager:
        status, body = self.post('/merchants/%s/managers' % merchant_id, None)

        self.assertEqual(status, 400)

    def test_post_invalid_json_user_username_is_none(self):
        # creating a merchant:
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id

        # getting user and giving him an id:
        user = self.get_user()
        user["username"] = None
        user["id"] = "2345-efss-erfx-e33er-3333"

        # creating a manager:
        data = {'user': 'user'}
        status, body = self.post('/merchants/%s/managers' % merchant_id, data)

        # creating a manager:
        status, body = self.post('/merchants/%s/managers' % merchant_id, None)

        self.assertEqual(status, 400)

    def test_post_invalid_json_user_first_name_length_less(self):
        # creating a merchant:
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id

        # getting user and giving him an id:
        user = self.get_user()
        user["first_name"] = 'J'
        user["id"] = "2345-efss-erfx-e33er-3333"

        # creating a manager:
        data = {'user': 'user'}
        status, body = self.post('/merchants/%s/managers' % merchant_id, data)

        # creating a manager:
        status, body = self.post('/merchants/%s/managers' % merchant_id, None)

        self.assertEqual(status, 400)

    def test_post_invalid_json_user_first_name_length_more(self):
        # creating a merchant:
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id

        # getting user and giving him an id:
        user = self.get_user()
        user["first_name"] = "12345678901234567890123456789012345678901238973895739048579284758384rueruaweyuryq" \
                             "uiyr9283sadklj23k4j1j3elkjwlkdjlkjlwerwkejdlakwjdl;ajwekljdklja23uer93uoUEWUEOUWAEIO" \
                             "RIOAWASDASDSKDJASLKDJLAKSJED"
        user["id"] = "2345-efss-erfx-e33er-3333"

        # creating a manager:
        data = {'user': 'user'}
        status, body = self.post('/merchants/%s/managers' % merchant_id, data)

        # creating a manager:
        status, body = self.post('/merchants/%s/managers' % merchant_id, None)

        self.assertEqual(status, 400)

    def test_post_invalid_json_user_first_name_is_none(self):
        # creating a merchant:
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id

        # getting user and giving him an id:
        user = self.get_user()
        user["first_name"] = None
        user["id"] = "2345-efss-erfx-e33er-3333"

        # creating a manager:
        data = {'user': 'user'}
        status, body = self.post('/merchants/%s/managers' % merchant_id, data)

        # creating a manager:
        status, body = self.post('/merchants/%s/managers' % merchant_id, None)

        self.assertEqual(status, 400)

    def test_post_invalid_json_user_last_name_length_less(self):
        # creating a merchant:
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id

        # getting user and giving him an id:
        user = self.get_user()
        user["last_name"] = "1"
        user["id"] = "2345-efss-erfx-e33er-3333"

        # creating a manager:
        data = {'user': 'user'}
        status, body = self.post('/merchants/%s/managers' % merchant_id, data)

        # creating a manager:
        status, body = self.post('/merchants/%s/managers' % merchant_id, None)

        self.assertEqual(status, 400)

    def test_post_invalid_json_user_last_name_length_more(self):
        # creating a merchant:
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id

        # getting user and giving him an id:
        user = self.get_user()
        user["last_name"] = "12345678901234567890123456789012345678901238973895739048579284758384rueruaweyuryq" \
                            "uiyr9283sadklj23k4j1j3elkjwlkdjlkjlwerwkejdlakwjdl;ajwekljdklja23uer93uoUEWUEOUWAEIO" \
                            "RIOAWASDASDSKDJASLKDJLAKSJED"
        user["id"] = "2345-efss-erfx-e33er-3333"

        # creating a manager:
        data = {'user': 'user'}
        status, body = self.post('/merchants/%s/managers' % merchant_id, data)

        # creating a manager:
        status, body = self.post('/merchants/%s/managers' % merchant_id, None)

        self.assertEqual(status, 400)

    def test_post_invalid_json_user_last_name_is_none(self):
        # creating a merchant:
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id

        # getting user and giving him an id:
        user = self.get_user()
        user["last_name"] = None
        user["id"] = "2345-efss-erfx-e33er-3333"

        # creating a manager:
        data = {'user': 'user'}
        status, body = self.post('/merchants/%s/managers' % merchant_id, data)

        # creating a manager:
        status, body = self.post('/merchants/%s/managers' % merchant_id, None)

        self.assertEqual(status, 400)

    def test_post_invalid_json_user_email(self):
        # creating a merchant:
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id

        # getting user and giving him an id:
        user = self.get_user()
        user["email"] = 'J'
        user["id"] = "2345-efss-erfx-e33er-3333"

        # creating a manager:
        data = {'user': 'user'}
        status, body = self.post('/merchants/%s/managers' % merchant_id, data)

        # creating a manager:
        status, body = self.post('/merchants/%s/managers' % merchant_id, None)

        self.assertEqual(status, 400)

    def test_post_invalid_json_user_phone(self):
        # creating a merchant:
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id

        # getting user and giving him an id:
        user = self.get_user()
        user["phone"] = 'Something'
        user["id"] = "2345-efss-erfx-e33er-3333"

        # creating a manager:
        data = {'user': 'user'}
        status, body = self.post('/merchants/%s/managers' % merchant_id, data)

        # creating a manager:
        status, body = self.post('/merchants/%s/managers' % merchant_id, None)

        self.assertEqual(status, 400)

    def test_post_invalid_json_notify_is_none(self):
        # creating a merchant:
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id

        # getting user and giving him an id:
        user = self.get_user()
        user["notify"] = None
        user["id"] = "2345-efss-erfx-e33er-3333"

        # creating a manager:
        data = {'user': 'user'}
        status, body = self.post('/merchants/%s/managers' % merchant_id, data)

        # creating a manager:
        status, body = self.post('/merchants/%s/managers' % merchant_id, None)

        self.assertEqual(status, 400)

    def test_post_invalid_json_notify_not_enum(self):
        # creating a merchant:
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id

        # getting user and giving him an id:
        user = self.get_user()
        user["notify"] = "FORK"
        user["id"] = "2345-efss-erfx-e33er-3333"

        # creating a manager:
        data = {'user': 'user'}
        status, body = self.post('/merchants/%s/managers' % merchant_id, data)

        # creating a manager:
        status, body = self.post('/merchants/%s/managers' % merchant_id, None)

        self.assertEqual(status, 400)

    def test_post_invalid_json_enabled_not_bool(self):
        # creating a merchant:
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id

        # getting user and giving him an id:
        user = self.get_user()
        user["enabled"] = "FORK"
        user["id"] = "2345-efss-erfx-e33er-3333"

        # creating a manager:
        data = {'user': 'user'}
        status, body = self.post('/merchants/%s/managers' % merchant_id, data)

        # creating a manager:
        status, body = self.post('/merchants/%s/managers' % merchant_id, None)

        self.assertEqual(status, 400)

    def test_post_invalid_json_enabled_is_none(self):
        # creating a merchant:
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id

        # getting user and giving him an id:
        user = self.get_user()
        user["enabled"] = None
        user["id"] = "2345-efss-erfx-e33er-3333"

        # creating a manager:
        data = {'user': 'user'}
        status, body = self.post('/merchants/%s/managers' % merchant_id, data)

        # creating a manager:
        status, body = self.post('/merchants/%s/managers' % merchant_id, None)

        self.assertEqual(status, 400)

    def test_post_manager_create_wrong_request_method(self):
        # creating a merchant:
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id

        # getting user and giving him an id:
        user = self.get_user()
        user["id"] = "2345-efss-erfx-e33er-3333"

        # creating a manager:
        data = {'user': user}
        status, body = self.put('/merchants/%s/managers' % merchant_id, data)

        self.assertEqual(status, 405)

    # GET /managers/<manager_id>

    def test_get_manager_full_valid_response(self):
        manager = self.create_manager(self.get_manager())

        status, body = self.get('/managers/%s' % manager.id)

        self.assertEqual(status, 200)
        self.assertIn('id', body)
        self.assertIn('merchant_id', body)
        self.assertIn('user', body)

        self.assertIsInstance(body.pop('id'), str)
        self.assertIsInstance(body.pop('merchant_id'), str)
        self.assertIsInstance(body.pop('user'), dict)

        self.assertDictEqual(body, {})

    def test_get_manager_wrong_manager_id_404(self):
        # creating a merchant:
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id

        # getting user and giving him an id:
        user = self.get_user()
        user["id"] = "2345-efss-erfx-e33er-3333"

        # creating a manager:
        data = {'user': user}
        status, body = self.post('/merchants/%s/managers' % merchant_id, data)

        self.assertEqual(status, 200)

        # getting a created manager:
        for manager_id in body['id']+str(range(10)):
            manager_status, manager_body = self.get('/managers/%s' % manager_id)

            self.assertEqual(manager_status, 404)

    # PUT /managers/<manager_id>

    def test_put_manager_edit_full_valid_response_change_user_username(self):
        # creating a merchant:
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id

        # getting user and giving him an id:
        user = self.get_user()
        user["id"] = "2345-efss-erfx-e33er-3333"

        # creating a manager:
        data = {'user': user}
        status, body = self.post('/merchants/%s/managers' % merchant_id, data)

        self.assertEqual(status, 200)

        new_manager = self.get_manager()
        new_manager['id'] = body['id']
        new_manager['user']['username'] = 'Abdula'

        manager_status, manager_body = self.put('/managers/%s' % body["id"],
                                                new_manager)

        self.assertEqual(manager_status, 200)
        self.assertEqual(manager_body['user']['username'], new_manager['user']['username'])
        self.assertEqual(manager_body['id'], new_manager['id'])

        self.assertIsInstance(manager_body.pop("id"), str)
        self.assertIsInstance(manager_body.pop("user"), dict)

    def test_put_manager_edit_full_valid_response_change_user_first_name(self):
        # creating a merchant:
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id

        # getting user and giving him an id:
        user = self.get_user()
        user["id"] = "2345-efss-erfx-e33er-3333"

        # creating a manager:
        data = {'user': user}
        status, body = self.post('/merchants/%s/managers' % merchant_id, data)

        self.assertEqual(status, 200)

        new_manager = self.get_manager()
        new_manager['id'] = body['id']
        new_manager['user']['first_name'] = 'Abdula'

        manager_status, manager_body = self.put('/managers/%s' % body["id"],
                                                new_manager)

        self.assertEqual(manager_status, 200)
        self.assertEqual(manager_body['user']['first_name'], new_manager['user']['first_name'])
        self.assertEqual(manager_body['id'], new_manager['id'])

        self.assertIsInstance(manager_body.pop("id"), str)
        self.assertIsInstance(manager_body.pop("user"), dict)

    def test_put_manager_edit_full_valid_response_change_user_last_name(self):
        # creating a merchant:
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id

        # getting user and giving him an id:
        user = self.get_user()
        user["id"] = "2345-efss-erfx-e33er-3333"

        # creating a manager:
        data = {'user': user}
        status, body = self.post('/merchants/%s/managers' % merchant_id, data)

        self.assertEqual(status, 200)

        new_manager = self.get_manager()
        new_manager['id'] = body['id']
        new_manager['user']['last_name'] = 'Abdula'

        manager_status, manager_body = self.put('/managers/%s' % body["id"],
                                                new_manager)

        self.assertEqual(manager_status, 200)
        self.assertEqual(manager_body['user']['last_name'], new_manager['user']['last_name'])
        self.assertEqual(manager_body['id'], new_manager['id'])

        self.assertIsInstance(manager_body.pop("id"), str)
        self.assertIsInstance(manager_body.pop("user"), dict)

    def test_put_manager_edit_full_valid_response_change_user_email(self):
        # creating a merchant:
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id

        # getting user and giving him an id:
        user = self.get_user()
        user["id"] = "2345-efss-erfx-e33er-3333"

        # creating a manager:
        data = {'user': user}
        status, body = self.post('/merchants/%s/managers' % merchant_id, data)

        self.assertEqual(status, 200)

        new_manager = self.get_manager()
        new_manager['id'] = body['id']
        new_manager['user']['email'] = 'abdula@gmail.com'

        manager_status, manager_body = self.put('/managers/%s' % body["id"],
                                                new_manager)

        self.assertEqual(manager_status, 200)
        self.assertEqual(manager_body['user']['email'], new_manager['user']['email'])
        self.assertEqual(manager_body['id'], new_manager['id'])

        self.assertIsInstance(manager_body.pop("id"), str)
        self.assertIsInstance(manager_body.pop("user"), dict)

    def test_put_manager_edit_full_valid_response_change_user_phone(self):
        # creating a merchant:
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id

        # getting user and giving him an id:
        user = self.get_user()
        user["id"] = "2345-efss-erfx-e33er-3333"

        # creating a manager:
        data = {'user': user}
        status, body = self.post('/merchants/%s/managers' % merchant_id, data)

        self.assertEqual(status, 200)

        new_manager = self.get_manager()
        new_manager['id'] = body['id']
        new_manager['user']['phone'] = '1231231231'

        manager_status, manager_body = self.put('/managers/%s' % body["id"],
                                                new_manager)

        self.assertEqual(manager_status, 200)
        self.assertEqual(manager_body['user']['phone'], new_manager['user']['phone'])
        self.assertEqual(manager_body['id'], new_manager['id'])

        self.assertIsInstance(manager_body.pop("id"), str)
        self.assertIsInstance(manager_body.pop("user"), dict)

    def test_put_manager_edit_full_valid_response_change_user_notify(self):
        # creating a merchant:
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id

        # getting user and giving him an id:
        user = self.get_user()
        user["id"] = "2345-efss-erfx-e33er-3333"

        # creating a manager:
        data = {'user': user}
        status, body = self.post('/merchants/%s/managers' % merchant_id, data)

        self.assertEqual(status, 200)

        new_manager = self.get_manager()
        new_manager['id'] = body['id']
        new_manager['user']['notify'] = 'PHONE'

        manager_status, manager_body = self.put('/managers/%s' % body["id"],
                                                new_manager)

        self.assertEqual(manager_status, 200)
        self.assertEqual(manager_body['user']['notify'], new_manager['user']['notify'])
        self.assertEqual(manager_body['id'], new_manager['id'])

        self.assertIsInstance(manager_body.pop("id"), str)
        self.assertIsInstance(manager_body.pop("user"), dict)

    def test_put_manager_edit_full_valid_response_change_user_enabled(self):
        # creating a merchant:
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id

        # getting user and giving him an id:
        user = self.get_user()
        user["id"] = "2345-efss-erfx-e33er-3333"

        # creating a manager:
        data = {'user': user}
        status, body = self.post('/merchants/%s/managers' % merchant_id, data)

        self.assertEqual(status, 200)

        new_manager = self.get_manager()
        new_manager['id'] = body['id']
        new_manager['user']['enabled'] = False

        manager_status, manager_body = self.put('/managers/%s' % body["id"],
                                                new_manager)

        self.assertEqual(manager_status, 200)
        self.assertEqual(manager_body['user']['enabled'], new_manager['user']['enabled'])
        self.assertEqual(manager_body['id'], new_manager['id'])

        self.assertIsInstance(manager_body.pop("id"), str)
        self.assertIsInstance(manager_body.pop("user"), dict)

    def test_put_manager_update_read_only_fields_not_saved(self):
        manager = self.create_manager(self.get_manager())

        status, body = self.put('/managers/%s' % manager.id, {'id': 'test'})
        self.assertEqual(status, 200)
        self.assertNotEqual(body['id'], 'test')

        status, body = self.put('/managers/%s' % manager.id, {'merchant_id': 'test'})
        self.assertEqual(status, 200)
        self.assertNotEqual(body['merchant_id'], 'test')

        status, body = self.put('/managers/%s' % manager.id, {'user': {'id': 'test'}})
        self.assertEqual(status, 200)
        self.assertNotEqual(body['user']['id'], 'test')

    # User validate:

    def test_put_manager_edit_validate_user_username(self):
        # creating a merchant:
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id

        # getting user and giving him an id:
        user = self.get_user()
        user["id"] = "2345-efss-erfx-e33er-3333"

        # creating a manager:
        data = {'user': user}
        status, body = self.post('/merchants/%s/managers' % merchant_id, data)

        self.assertEqual(status, 200)

        usernames = ['As', "12345678901234567890123456789012345678901238973895739048579284758384rueruaweyuryq" \
                            "uiyr9283sadklj23k4j1j3elkjwlkdjlkjlwerwkejdlakwjdl;ajwekljdklja23uer93uoUEWUEOUWAEIO" \
                            "RIOAWASDASDSKDJASLKDJLAKSJED"]
        for value in usernames:
            new_manager = self.get_manager()
            new_manager['id'] = body['id']
            new_manager['user']['username'] = value

            manager_status, manager_body = self.put('/managers/%s' % body["id"],
                                                    new_manager)

            self.assertEqual(manager_status, 400)

    def test_put_manager_edit_validate_user_first_name(self):
        # creating a merchant:
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id

        # getting user and giving him an id:
        user = self.get_user()
        user["id"] = "2345-efss-erfx-e33er-3333"

        # creating a manager:
        data = {'user': user}
        status, body = self.post('/merchants/%s/managers' % merchant_id, data)

        self.assertEqual(status, 200)

        first_names = ['A', "12345678901234567890123456789012345678901238973895739048579284758384rueruaweyuryq" \
                           "uiyr9283sadklj23k4j1j3elkjwlkdjlkjlwerwkejdlakwjdl;ajwekljdklja23uer93uoUEWUEOUWAEIO" \
                           "RIOAWASDASDSKDJASLKDJLAKSJED"]

        for value in first_names:
            new_manager = self.get_manager()
            new_manager['id'] = body['id']
            new_manager['user']['first_name'] = value

            manager_status, manager_body = self.put('/managers/%s' % body["id"],
                                                    new_manager)

            self.assertEqual(manager_status, 400)

    def test_put_manager_edit_validate_user_last_name(self):
        # creating a merchant:
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id

        # getting user and giving him an id:
        user = self.get_user()
        user["id"] = "2345-efss-erfx-e33er-3333"

        # creating a manager:
        data = {'user': user}
        status, body = self.post('/merchants/%s/managers' % merchant_id, data)

        self.assertEqual(status, 200)

        last_names = ['A', "12345678901234567890123456789012345678901238973895739048579284758384rueruaweyuryq" \
                             "uiyr9283sadklj23k4j1j3elkjwlkdjlkjlwerwkejdlakwjdl;ajwekljdklja23uer93uoUEWUEOUWAEIO" \
                             "RIOAWASDASDSKDJASLKDJLAKSJED"]

        for value in last_names:
            new_manager = self.get_manager()
            new_manager['id'] = body['id']
            new_manager['user']['last_name'] = value

            manager_status, manager_body = self.put('/managers/%s' % body["id"],
                                                    new_manager)

            self.assertEqual(manager_status, 400)

    def test_put_manager_edit_validate_user_email(self):
        # creating a merchant:
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id

        # getting user and giving him an id:
        user = self.get_user()
        user["id"] = "2345-efss-erfx-e33er-3333"

        # creating a manager:
        data = {'user': user}
        status, body = self.post('/merchants/%s/managers' % merchant_id, data)

        self.assertEqual(status, 200)

        new_manager = self.get_manager()
        new_manager['id'] = body['id']
        new_manager['user']['email'] = '11111111111111'

        manager_status, manager_body = self.put('/managers/%s' % body["id"],
                                                new_manager)

        self.assertEqual(manager_status, 400)

    def test_put_manager_edit_validate_user_phone(self):
        # creating a merchant:
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id

        # getting user and giving him an id:
        user = self.get_user()
        user["id"] = "2345-efss-erfx-e33er-3333"

        # creating a manager:
        data = {'user': user}
        status, body = self.post('/merchants/%s/managers' % merchant_id, data)

        self.assertEqual(status, 200)

        new_manager = self.get_manager()
        new_manager['id'] = body['id']
        new_manager['user']['phone'] = 'asdsadd'

        manager_status, manager_body = self.put('/managers/%s' % body["id"],
                                                new_manager)

        self.assertEqual(manager_status, 400)

    def test_put_manager_validate_user_notify(self):
        # creating a merchant:
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id

        # getting user and giving him an id:
        user = self.get_user()
        user["id"] = "2345-efss-erfx-e33er-3333"

        # creating a manager:
        data = {'user': user}
        status, body = self.post('/merchants/%s/managers' % merchant_id, data)

        self.assertEqual(status, 200)

        new_manager = self.get_manager()
        new_manager['id'] = body['id']
        new_manager['user']['notify'] = 'asdadaE'

        manager_status, manager_body = self.put('/managers/%s' % body["id"],
                                                new_manager)

        self.assertEqual(manager_status, 400)

    def test_put_manager_edit_validate_user_enabled(self):
        # creating a merchant:
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id

        # getting user and giving him an id:
        user = self.get_user()
        user["id"] = "2345-efss-erfx-e33er-3333"

        # creating a manager:
        data = {'user': user}
        status, body = self.post('/merchants/%s/managers' % merchant_id, data)

        self.assertEqual(status, 200)

        new_manager = self.get_manager()
        new_manager['id'] = body['id']
        new_manager['user']['enabled'] = 'asdsa'

        manager_status, manager_body = self.put('/managers/%s' % body["id"],
                                                new_manager)

        self.assertEqual(manager_status, 400)

    def test_put_manager_edit_validate_manager_id(self):
        # creating a merchant:
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id

        # getting user and giving him an id:
        user = self.get_user()
        user["id"] = "2345-efss-erfx-e33er-3333"

        # creating a manager:
        data = {'user': user}
        status, body = self.post('/merchants/%s/managers' % merchant_id, data)

        self.assertEqual(status, 200)

        new_manager = self.get_manager()
        new_manager['id'] = 11111

        manager_status, manager_body = self.put('/managers/%s' % body["id"],
                                                new_manager)

        self.assertEqual(manager_body["id"], body["id"])

        manager = Manager.query.get(body['id'])

        self.assertEqual(manager_body["id"], manager.id)

    def test_put_manager_edit_manager_does_not_exists_404(self):
        # creating a merchant:
        merchant = self.create_merchant(self.get_merchant())
        merchant_id = merchant.id

        # getting user and giving him an id:
        user = self.get_user()
        user["id"] = "2345-efss-erfx-e33er-3333"

        # creating a manager:
        data = {'user': user}
        status, body = self.post('/merchants/%s/managers'% merchant_id, data)

        self.assertEqual(status, 200)

        new_manager = self.get_manager()
        new_manager['id'] = body["id"]

        for manager_id in body["id"]+str(range(10)):

            manager_status, manager_body = self.put('/managers/%s' % manager_id, new_manager)

            self.assertEqual(manager_status, 404)
