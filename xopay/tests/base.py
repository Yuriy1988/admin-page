import random
import string
import json
from copy import deepcopy
from flask.ext.testing import TestCase

from xopay import app, db as app_db
from xopay.models import User, Merchant

__author__ = 'Kostel Serhii'


class BaseTestCase(TestCase):

    # If database is missing, run shell command: make db_test_create
    SQLALCHEMY_DATABASE_URI = "postgresql://xopadmintest:test123@localhost/xopadmintestdb"

    api_base = '/api/admin/dev'

    # defaults

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
        "username": "mustbeunique",
        "first_name": "John",
        "last_name": "Doe",
        "email": "jhon.doe@test.com",
        "phone": "304201234567",
        "notify": "NONE",
        "enabled": True
    }
    _merchant = {
        "merchant_name":  "must_be_unique",
        "merchant_account": _merchant_account,
        "merchant_info": _merchant_info,
        "user": _user
    }

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
        app.config['SQLALCHEMY_DATABASE_URI'] = self.SQLALCHEMY_DATABASE_URI

    @staticmethod
    def rand_int(a=0, b=100):
        return random.randint(a, b)

    @staticmethod
    def rand_str(str_len=5):
        a_zA_Z0_9 = string.ascii_letters + string.digits
        return ''.join((random.choice(a_zA_Z0_9) for i in range(str_len)))

    def get(self, url):
        response = self.client.get(self.api_base + url)
        return response.status_code, response.json

    def put(self, url, body):
        headers = {"Content-Type": "application/json"}
        response = self.client.put(self.api_base + url, data=json.dumps(body), headers=headers)
        return response.status_code, response.json

    def post(self, url, body):
        headers = {"Content-Type": "application/json"}
        response = self.client.post(self.api_base + url, data=json.dumps(body), headers=headers)
        return response.status_code, response.json

    def delete(self, url):
        response = self.client.delete(self.api_base + url)
        return response.status_code, response.json if response.status_code >=400 else None

    def get_merchant(self):
        return deepcopy(self._merchant)

    def create_user(self, **user_data):
        user = User(**user_data)
        self.db.add(user)
        self.db.commit()
        return user

    def create_merchant(self, merchant_dict, merchant_name=None, username=None):
        merchant_dict['merchant_name'] = merchant_name or "merchant" + self.rand_str()
        merchant_dict['user']['username'] = username or "user" + self.rand_str()

        merchant_model = Merchant.create(merchant_dict)
        self.db.commit()

        return merchant_model

    def login(self, username, password):
        data = dict(username=username, password=password)
        return self.client.post('login', data=data, follow_redirects=True)

    def logout(self):
        return self.client.get('logout', follow_redirects=True)
