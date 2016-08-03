import io
import pprint
import random
import string
from copy import deepcopy
from unittest.mock import MagicMock
from flask import json
from flask.ext.testing import TestCase

from api import create_app, db as app_db, utils, auth as api_auth
from api.models import Merchant, Manager, Store, PaymentSystem, User, PaySysContract, enum
from api.models.base import BaseModel
from api.models.payment_system import _PAYMENT_SYSTEMS_ID_ENUM, _PAYMENT_SYSTEMS_NAME

__author__ = 'Kostel Serhii'


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
        "commission_pct": "1.42"
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

    _pay_sys_contract = {
        "contractor_name": "Alpha Bank",
        'payment_interface': enum.PAYMENT_INTERFACE_ENUM[0],
        "commission_fixed": '0.10',
        "commission_pct": '2.00',
        "currency": "USD",
        "contract_doc_url": "http://contract.doc",
        "active": True,
        "filter": "*",
    }

    def get_admin(self):
        return self._admin.copy()

    def get_user(self):
        return self._user.copy()

    def get_merchant(self):
        return deepcopy(self._merchant)

    def get_manager(self):
        return deepcopy(self._manager)

    def get_store(self):
        return deepcopy(self._store)

    def get_paysys_contract(self):
        return self._pay_sys_contract.copy()


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
        app = create_app('test')
        return app

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

    def get_auth_token(self, auth_group_or_model):
        if auth_group_or_model in self.token_storage:
            return self.token_storage[auth_group_or_model]

        token_map = {
            'admin': self._create_admin_token,
            'system': self._create_system_token,
        }

        token = None
        if isinstance(auth_group_or_model, str):
            token_creator = token_map.get(auth_group_or_model)
            if token_creator:
                token = token_creator()
        elif isinstance(auth_group_or_model, BaseModel):
            session = api_auth.create_session(auth_group_or_model)
            token = session['token']

        if token:
            self.token_storage[auth_group_or_model] = token

        return token

    def request(self, url, method='GET', data=None, auth=None, token=None, **options):
        token = token or self.get_auth_token(auth)

        headers = {"Content-Type": "application/json"}
        if token:
            headers["Authorization"] = "Bearer %s" % token

        data = json.dumps(data) if isinstance(data, dict) else data

        response = self.client.open(self.api_base + url, method=method, data=data, headers=headers, **options)
        body = response.json if response.data and response.mimetype == 'application/json' else response.data
        return response.status_code, body

    def get(self, url, query_args=None, auth=None, token=None):
        code, body = self.request(url, method='GET', auth=auth or 'admin', token=token, query_string=query_args or {})
        return code, body

    def put(self, url, body, auth=None, token=None):
        code, body = self.request(url, method='PUT', data=body, auth=auth or 'admin', token=token)
        return code, body

    def post(self, url, body, auth=None, token=None):
        code, body = self.request(url, method='POST', data=body, auth=auth or 'admin', token=token)
        return code, body

    def delete(self, url, auth=None, token=None):
        code, body = self.request(url, method='DELETE', auth=auth or 'admin', token=token)
        return code, body

    def create_pay_sys_contracts(self, pay_sys_id, count=1, **contract_kwargs):
        contract = self.get_paysys_contract()
        contract.update(contract_kwargs)
        contract["paysys_id"] = pay_sys_id

        contract_models = [PaySysContract.create(contract) for _ in range(count)]
        self.db.commit()

        contracts = []
        for cm in contract_models:
            contract_result = contract.copy()
            contract_result['id'] = cm.id
            contracts.append(contract_result)

        return contracts

    def create_merchant(self, merchant_dict, merchant_name=None, username=None):
        merchant_dict['merchant_name'] = merchant_name or "merchant" + self.rand_str()
        merchant_dict['user']['username'] = username or "user" + self.rand_str()

        merchant_model = Merchant.create(merchant_dict)
        self.db.commit()

        # Add password to make merchant enabled
        merchant_model.user.set_password('password')

        return merchant_model

    def create_manager(self, manager_dict, merchant_id=None, username=None):
        merchant_id = merchant_id or self.create_merchant(self.get_merchant()).id
        manager_dict['merchant_id'] = merchant_id
        manager_dict['user']['username'] = username or "user" + self.rand_str()

        manager_model = Manager.create(manager_dict)
        self.db.commit()

        # Add password to make manager enabled
        manager_model.user.set_password('password')

        return manager_model

    def create_store(self, store_dict, merchant_id):
        store_dict['merchant_id'] = merchant_id

        store_model = Store.create(store_dict)
        self.db.commit()

        return store_model

    def activate_payment_system(self, paysys_id):
        self.create_pay_sys_contracts(paysys_id)
        paysys_model = PaymentSystem.query.get(paysys_id)
        paysys_model.update({"active": True})
        self.db.commit()

    def login(self, username, password):
        data = dict(username=username, password=password)
        return self.client.post('login', data=data, follow_redirects=True)

    def logout(self):
        return self.client.get('logout', follow_redirects=True)
