#!venv/bin/python
"""
Generate dummy database.

NOTE: Before use it, please run Admin and Client services!

Usage:
    dummy.py [-h] [--username ADMIN USERNAME] [--password ADMIN PASSWORD]

Examples:
    ./dummy.py                                      : username=admin, password=password
    ./dummy.py --username=admin --password=12345678 : username=admin, password=12345678
"""
import jwt
import uuid
import argparse
import requests
from random import choice, randint
from functools import wraps
from datetime import timedelta, datetime

from api.models import enum

__author__ = 'Kostel Serhii'


AUTH_KEY = 'PzYs2qLh}2$8uUJbBnWB800iYKe5xdYqItRNo7@38yW@tPDVAX}EV5V31*ZK78QS'


def admin_url(url):
    return 'http://127.0.0.1:7128/api/admin/dev' + url


def client_url(url):
    return 'http://127.0.0.1:7254/api/client/dev' + url


def get_currency():
    return choice(enum.CURRENCY_ENUM)


def get_admin_token():
    resp = requests.post(
        url=admin_url('/authorization'),
        json={'username': ADMIN['username'], 'password': ADMIN['password']})

    return resp.json()['token']


def get_system_token():
    payload = dict(
        exp=datetime.utcnow() + timedelta(minutes=10),
        user_id='xopay',
        user_name='system',
        ip_addr='127.0.0.1',
        groups=['system'],
    )
    return jwt.encode(payload, AUTH_KEY, algorithm='HS512').decode('utf-8')


def auth(req_func):

    @wraps(req_func)
    def _request_with_token(*args, **kwargs):
        if not hasattr(auth, 'token'):
            auth.token = get_admin_token()

        token = kwargs.pop('token', auth.token)

        kwargs['headers'] = {
            "Content-Type": "application/json",
            "Authorization": "Bearer %s" % token
        }

        return req_func(*args, **kwargs)

    return _request_with_token


@auth
def request(method, url, json_body=None, headers=None, **params):
    print('[%s] %s' % (method, url))

    resp = requests.request(method, url, json=json_body, headers=headers, **params)
    if resp.status_code >= 400:
        raise Exception('%s (%s) Request error: %s' % (method, url, resp.text))

    return resp.json() if resp.text else resp.text


def get(url, headers=None, **params):
    return request('GET', url, headers=headers, **params)


def put(url, json_body, headers=None, **params):
    return request('PUT', url, json_body=json_body, headers=headers, **params)


def post(url, json_body, headers=None, **params):
    return request('POST', url, json_body=json_body, headers=headers, **params)


def get_user(username):
    return {
        "username": username,
        "first_name": choice(["John", "Leo", "Bill", "Stan", "Ringo", "Bob", "Lida", "Abraham"]),
        "last_name": choice(["Doe", "Smitt", "Uniqum", "Nilson", "Gates", "Jobs", "Li"]),
        "email": "%s@test.com" % username,
        "phone": "304201234567",
        "notify": "NONE",
        "enabled": True
    }


def get_merchant(merchant_name, username):
    return {
        "merchant_name":  merchant_name,
        "merchant_account": {
            "bank_name": choice(["TASS Bank", "Privat Bank", "Raifaizen Bank Aval"]),
            "checking_account": "01234567891234",
            "currency": get_currency(),
            "mfo": "123456",
            "okpo": "12345678"
        },
        "merchant_info": {
            "address": "One Microsoft Way, Redmond, WA",
            "director_name": ("%s %s" %(merchant_name, username)).title()
        },
        "user": get_user(username)
    }


def get_manager(username):
    return {
        "user": get_user(username)
    }


def get_store():
    return {
        "store_name": choice(["Apple Store", "MShop", "Soap Inc", "BubbleGums", "UMC", "XOTel", "Rozetka"]),
        "store_url": "http://shop.platform.ju",

        "category": None,
        "description": "Магазин по продаже всего на свете",
        "logo": "http://chickeneggdesign.com/eGreen123/images/shoppingLogo.png",
        "show_logo": True,
        "store_settings": {
            "sign_algorithm": "SHA1",
            "succeed_url": "http://shop.platform.ju/pay/good",
            "failure_url": "http://shop.platform.ju/pay/bad",
            "commission_pct": "2.0"
        }
    }


def get_paysys_contract(curr=None):
    return {
        "contractor_name": choice(["TASS Bank", "Privat Bank", "Raifaizen Bank Aval"]),
        'payment_interface': choice(enum.PAYMENT_INTERFACE_ENUM),
        "commission_fixed": choice(['0.1', '0.2', '0.96', '1.7', '1.77', '1.99']),
        "commission_pct": choice(['1.07', '1.4', '1.76', '2.00', '2.42', '3.00']),
        "currency": curr or get_currency(),
        "contract_doc_url": "http://hrcouncil.ca/docs/samplecontract.pdf",
        "active": True,
        "filter": "*",
    }


def get_merchant_contract(curr=None):
    return {
        "commission_fixed": choice(['0.1', '0.2', '0.96', '1.7', '1.77', '1.99']),
        "commission_pct": choice(['1.07', '1.4', '1.76', '2.00', '2.42', '3.00']),
        "currency": curr or get_currency(),
        "contract_doc_url": "http://hrcouncil.ca/docs/samplecontract.pdf",
        "active": True,
        "filter": "*",
    }


def get_currency_list():
    return [
        {
            'from_currency': fc,
            'to_currency': tc,
            'rate': '%.2f' % (randint(1, 2500) / 100)
        }
        for fc in enum.CURRENCY_ENUM for tc in enum.CURRENCY_ENUM if fc != tc
        ]


def get_invoice(store_id):
    return {
        "order_id": str(uuid.uuid4()),
        "store_id": store_id,
        "currency": get_currency(),
        "items": [
            {
                "store_item_id": "store_item_id_1",
                "quantity": randint(1, 3),
                "unit_price": '%.2f' % (randint(5, 2500) / 10)
            }
            for _ in range(randint(1, 4))
        ]
    }


def get_payment():
    return {
        "paysys_id": choice(['PAY_PAL', 'VISA_MASTER']),
        "crypted_payment": "secret" * 10,
        "payment_account": "4123987601230000",
        "notify_by_email": "email@test.com",
    }


def generate_admin_dummy():

    # Admin Service

    print('Create PaySys contracts')
    paysys_contracts = [
        post(
            url=admin_url('/payment_systems/{id}/contracts'.format(id=ps_id)),
            json_body=get_paysys_contract(curr))
        for ps_id in ['PAY_PAL', 'VISA_MASTER', 'BIT_COIN'] for curr in enum.CURRENCY_ENUM
        ]

    print('Activate PaySys')
    pay_sys = [
        put(
            url=admin_url('/payment_systems/{id}'.format(id=ps_id)),
            json_body={'active': True})
        for ps_id in ['PAY_PAL', 'VISA_MASTER']
    ]

    print('Create merchant')
    merchant = post(
        url=admin_url('/merchants'),
        json_body=get_merchant('XOPMerchant', 'xopmerchant'))

    print('Create merchant contracts')
    merchant_contracts = [
        post(
            url=admin_url('/merchants/{id}/contracts'.format(**merchant)),
            json_body=get_merchant_contract(curr))
        for curr in enum.CURRENCY_ENUM
        ]

    print('Create managers')
    managers = [
        post(
            url=admin_url('/merchants/{id}/managers'.format(**merchant)),
            json_body=get_manager('xopmanager_%d' % i))
        for i in range(5)
    ]

    print('Create stores')
    stores = [
        post(
            url=admin_url('/merchants/{id}/stores'.format(**merchant)),
            json_body=get_store())
        for _ in range(5)
    ]

    print('Connect managers to stores')
    managers_stores = [
        post(
            url=admin_url('/managers/{manager[id]}/stores/{store[id]}'.format(manager=manager, store=store)),
            json_body={})
        for i, manager in enumerate(managers) for store in stores[:len(managers) - i]
    ]

    print('Get store PaySys')
    stores_paysys = [
        get(
            url=admin_url('/stores/{store[id]}/store_paysys'.format(store=store)))
        for store in stores
    ]

    print('Enable store PaySys')
    stores_paysys = [
        put(
            url=admin_url('/store_paysys/{store_paysys[id]}'.format(store_paysys=sp)),
            json_body={'allowed': True})
        for store in stores_paysys for sp in store['store_paysys'] if sp['paysys_id'] in ('PAY_PAL', 'VISA_MASTER')
    ]

    print('Update currency')
    currency = [
        post(
            url=admin_url('/currency/update'),
            json_body={'update': get_currency_list()},
            token=get_system_token())
        for _ in range(10)
    ]


def generate_client_dummy():

    # Client Service

    print('Get merchants')
    merchant = get(
        url=admin_url('/merchants')
    )['merchants'][0]

    stores = get(
        url=admin_url('/merchants/{id}/stores'.format(**merchant))
    )['stores']

    print('Create invoices')
    invoices = [
        post(
            url=client_url('/invoices'),
            json_body=get_invoice(store['id']))
        for store in stores for _ in range(randint(5, 20))
    ]

    print('Create payments')
    payments = [
        post(
            url=client_url('/invoices/{invoice[id]}/payments'.format(invoice=invoice)),
            json_body=get_payment())
        for invoice in invoices
    ]

    print('All DONE!')


def parse_admin_account_arguments():
    parser = argparse.ArgumentParser(description='Generate XOPay dummy database', allow_abbrev=False)
    parser.add_argument('--username', default='admin', help='admin username')
    parser.add_argument('--password', default='password', help='admin password')
    args = parser.parse_args()
    return {'username': args.username, 'password': args.password}

if __name__ == '__main__':

    # Load username and password parameters
    ADMIN = parse_admin_account_arguments()

    generate_admin_dummy()
    generate_client_dummy()
