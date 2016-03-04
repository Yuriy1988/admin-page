import random
import string
import json
from copy import deepcopy
from flask.ext.testing import TestCase

from xopay import app, db as app_db
from xopay.models import User

__author__ = 'Kostel Serhii'


class BaseTestCase(TestCase):

    SQLALCHEMY_DATABASE_URI = "sqlite://"   # in memory

    url_prefix = '/api/admin/dev'

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
        "notify": None,
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
        app_db.create_all()

    def tearDown(self):
        """ Teardown after test case """
        self.db.remove()
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
        response = self.client.get(self.url_prefix + url)
        return response.status_code, response.json

    def put(self, url, body):
        headers = {"Content-Type": "application/json"}
        response = self.client.put(self.url_prefix + url, data=json.dumps(body), headers=headers)
        return response.status_code, response.json

    def post(self, url, body):
        headers = {"Content-Type": "application/json"}
        response = self.client.post(self.url_prefix + url, data=json.dumps(body), headers=headers)
        return response.status_code, response.json

    def delete(self, url):
        response = self.client.delete(self.url_prefix + url)
        return response.status_code

    def get_merchant(self):
        return deepcopy(self._merchant)

    def create_user(self, **user_data):
        user = User(**user_data)
        self.db.add(user)
        self.db.commit()
        return user

    def login(self, username, password):
        data = dict(username=username, password=password)
        return self.client.post('login', data=data, follow_redirects=True)

    def logout(self):
        return self.client.get('logout', follow_redirects=True)
