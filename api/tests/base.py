import io
import pprint
import random
import string
from copy import deepcopy
from flask import json
from flask.ext.testing import TestCase

from api import app, db as app_db
from api.models import Merchant, Manager, Store, enum, PaymentSystem

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

    def get_user(self):
        return self._user.copy()

    def get_merchant(self):
        return deepcopy(self._merchant)

    def get_manager(self):
        return deepcopy(self._manager)

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

    def tearDown(self):
        """ Teardown after test case """
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

    @staticmethod
    def rand_int(a=0, b=100):
        return random.randint(a, b)

    @staticmethod
    def rand_str(str_len=5):
        a_zA_Z0_9 = string.ascii_letters + string.digits
        return ''.join((random.choice(a_zA_Z0_9) for i in range(str_len)))

    def get(self, url, query_args=None):
        response = self.client.get(self.api_base + url, query_string=query_args or {})
        return response.status_code, response.json

    def put(self, url, body):
        headers = {"Content-Type": "application/json"}
        response = self.client.put(self.api_base + url, data=json.dumps(body), headers=headers)
        return response.status_code, response.json

    def post(self, url, body):
        headers = {"Content-Type": "application/json"}
        response = self.client.post(self.api_base + url, data=json.dumps(body), headers=headers)
        return response.status_code, response.json if response.mimetype == 'application/json' else response.data

    def delete(self, url):
        response = self.client.delete(self.api_base + url)
        return response.status_code, response.json if response.status_code >= 400 else None

    def create_merchant(self, merchant_dict, merchant_name=None, username=None):
        merchant_dict['merchant_name'] = merchant_name or "merchant" + self.rand_str()
        merchant_dict['user']['username'] = username or "user" + self.rand_str()

        merchant_model = Merchant.create(merchant_dict)
        self.db.commit()

        return merchant_model

    def create_manager(self, manager_dict, merchant_id, username=None):
        manager_dict['merchant_id'] = merchant_id
        manager_dict['user']['username'] = username or "user" + self.rand_str()

        manager_model = Manager.create(manager_dict)
        self.db.commit()

        return manager_model

    def create_store(self, store_dict, merchant_id):
        store_dict['merchant_id'] = merchant_id

        store_model = Store.create(store_dict)
        self.db.commit()

        return store_model

    def create_payment_systems(self):
        ps_id = enum.PAYMENT_SYSTEMS_ID_ENUM[2]
        paysys = {
            "paysys_id": ps_id,
            "paysys_name": ps_id.lower().replace('_', ' '),
            "paysys_login": "xopay_test",
            "paysys_password": "0xJtwe76GDSAFknui8we45unohyDKUFSGku",
            "active": True,
        }

        paysys_model = PaymentSystem.create(paysys)
        self.db.commit()

        return paysys_model

    def login(self, username, password):
        data = dict(username=username, password=password)
        return self.client.post('login', data=data, follow_redirects=True)

    def logout(self):
        return self.client.get('logout', follow_redirects=True)
