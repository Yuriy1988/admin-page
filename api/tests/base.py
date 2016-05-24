import io
import pprint
import random
import string
from copy import deepcopy
from datetime import timedelta
from unittest.mock import MagicMock
from flask import json
from flask.ext.testing import TestCase

from api import app, db as app_db, utils, auth as api_auth
from api.models import Merchant, Store, PaymentSystem, User
from api.models.payment_system import _PAYMENT_SYSTEMS_ID_ENUM, _PAYMENT_SYSTEMS_NAME

__author__ = 'Kostel Serhii'

# If database is missing, run shell command: make db_test_create
SQLALCHEMY_DATABASE_URI = "postgresql://xopadmintest:test123@localhost/xopadmintestdb"


def prettify(obj, depth=10):
    """"
    Return formatted string representation of Python object.
    :param obj: python object.
    :param depth: depth of recursive iteration of python object structure.
    """
    string_io = io.StringIO()
    pprint.pprint(obj, depth=depth, stream=string_io)
    return str(string_io.getvalue())


class TestDefaults:

    _admin = {
        'username': 'admin',
        'password': 'test12345678',
        'email': 'admin@xopay.do',
        'enabled': True,
        'notify': 'EMAIL'
    }

    _user = {
        "username": "mustbeunique",
        "first_name": "John",
        "last_name": "Doe",
        "email": "jhon.doe@test.com",
        "phone": "304201234567",
        "notify": "NONE",
        "enabled": True
    }
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
    _merchant = {
        "merchant_name":  "must_be_unique",
        "merchant_account": _merchant_account,
        "merchant_info": _merchant_info,
        "user": _user
    }
    _manager = {
        "user": _user
    }
    _store_settings = {
        "sign_algorithm": "SHA1",
        "succeed_url": "http://good.ron",
        "failure_url": "http://bad.boy",
        "commission_pct": "1.423"
    }
    _store = {
        "store_name": "Test Store",
        "store_url": "http://store.platform.ju",

        "category": None,
        "description": "Краткое описание магазина",
        "logo": "http://logo.store.ju",
        "show_logo": True,
        "store_settings": _store_settings
    }

    def get_admin(self):
        return self._admin.copy()

    def get_user(self):
        return self._user.copy()

    def get_merchant(self):
        return deepcopy(self._merchant)

    def get_store(self):
        return deepcopy(self._store)


class BaseTestCase(TestCase, TestDefaults):

    api_base = '/api/admin/dev'

    # defaults

    def setUp(self):
        """ Setup before test case """
        app_db.session.close()
        app_db.drop_all()
        app_db.create_all()

        self.token_storage = {}

        self.create_admin()
        self.create_payment_systems()

        # mock
        utils.push_to_queue = MagicMock(return_value=None)

    def tearDown(self):
        """ Teardown after test case """

        for token in self.token_storage.values():
            api_auth.remove_session(token)

        self.db.remove()
        app_db.session.close()
        app_db.drop_all()

    @property
    def db(self):
        """ Database session, that can be used in test """
        return app_db.session

    def create_app(self):
        """ App for testing """
        self.config()
        return app

    def config(self):
        """ Configuration for testing """
        app.config['DEBUG'] = True
        app.config['TESTING'] = True
        app.config['PRESERVE_CONTEXT_ON_EXCEPTION'] = False
        app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI

        app.config['AUTH_TOKEN_LIFE_TIME'] = timedelta(minutes=15)
        app.config['AUTH_SESSION_LIFE_TIME'] = timedelta(minutes=30)
        app.config['AUTH_INVITE_LIFE_TIME'] = timedelta(minutes=30)

    @staticmethod
    def rand_int(a=0, b=100):
        return random.randint(a, b)

    @staticmethod
    def rand_str(str_len=5):
        a_zA_Z0_9 = string.ascii_letters + string.digits
        return ''.join((random.choice(a_zA_Z0_9) for i in range(str_len)))

    def create_admin(self):
        admin_user = User(**self.get_admin())
        admin_user.add_to_group('admin')
        self.db.add(admin_user)
        self.db.commit()

    def create_payment_systems(self):
        for ps_id, ps_name in zip(_PAYMENT_SYSTEMS_ID_ENUM, _PAYMENT_SYSTEMS_NAME):
            model = PaymentSystem(ps_id, ps_name)
            self.db.add(model)
        self.db.commit()

    def _create_admin_token(self):
        auth_body = {k: v for k, v in self.get_admin().items() if k in {'username', 'password'}}
        headers = {"Content-Type": "application/json"}
        response = self.client.post(self.api_base + '/authorization', data=json.dumps(auth_body), headers=headers)
        return response.json['token']

    def _create_system_token(self):
        return api_auth.get_system_token()

    def get_auth_token(self, auth_group):
        if auth_group in self.token_storage:
            return self.token_storage[auth_group]

        token_map = {
            'admin': self._create_admin_token,
            'system': self._create_system_token,
        }

        token = None
        token_creator = token_map.get(auth_group)
        if token_creator:
            token = token_creator()
            self.token_storage[auth_group] = token

        return token

    def request(self, url, method='GET', data=None, auth=None, token=None, **options):
        token = token or self.get_auth_token(auth)

        headers = {"Content-Type": "application/json"}
        if token:
            headers["Authorization"] = "Bearer %s" % token

        data = json.dumps(data) if isinstance(data, dict) else data

        return self.client.open(self.api_base + url, method=method, data=data, headers=headers, **options)

    def get(self, url, query_args=None, auth=None, token=None):
        response = self.request(url, method='GET', auth=auth or 'admin', token=token, query_string=query_args or {})
        return response.status_code, response.json

    def put(self, url, body, auth=None, token=None):
        response = self.request(url, method='PUT', data=body, auth=auth or 'admin', token=token)
        return response.status_code, response.json

    def post(self, url, body, auth=None, token=None):
        response = self.request(url, method='POST', data=body, auth=auth or 'admin', token=token)
        return response.status_code, response.json if response.mimetype == 'application/json' else response.data

    def delete(self, url, auth=None, token=None):
        response = self.request(url, method='DELETE', auth=auth or 'admin', token=token)
        return response.status_code, response.json if response.status_code >= 400 else None

    def create_merchant(self, merchant_dict, merchant_name=None, username=None):
        merchant_dict['merchant_name'] = merchant_name or "merchant" + self.rand_str()
        merchant_dict['user']['username'] = username or "user" + self.rand_str()

        merchant_model = Merchant.create(merchant_dict)
        self.db.commit()

        # Add password to make merchant enabled
        merchant_model.user.set_password('password')

        return merchant_model

    def create_store(self, store_dict, merchant_id):
        store_dict['merchant_id'] = merchant_id

        store_model = Store.create(store_dict)
        self.db.commit()

        return store_model

    def activate_payment_system(self, paysys_id):
        paysys_model = PaymentSystem.query.get(paysys_id)
        paysys_model.update({"paysys_login": "xopay_test", "active": True})
        paysys_model.set_password("0xJtwe76GDSAFknui8we45unohyDKUFSGku")
        self.db.commit()

    def login(self, username, password):
        data = dict(username=username, password=password)
        return self.client.post('login', data=data, follow_redirects=True)

    def logout(self):
        return self.client.get('logout', follow_redirects=True)
