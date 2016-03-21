from decimal import Decimal

from xopay.models import Currency

from xopay.tests import base
from xopay.utils import url_with_parameters

__author__ = 'Daniel Omelchenko'


class TestCurrency(base.BaseTestCase):

    # GET /currency/current
    CURRENT_URL = "/currency/current"

    def test_get_current_if_empty(self):
        status, body = self.get(self.CURRENT_URL)

        self.assertEqual(status, 200, msg=body.get('error', ''))
        self.assertListEqual(body["current"], [])

    def test_get_current(self):
        self.create_currency_record(self._currency_record)
        status, body = self.get(self.CURRENT_URL)

        self.assertEqual(status, 200, msg=body.get('error', ''))
        self.assertListEqual(body["current"], [self._currency_record])

    def test_get_current_multi(self):
        count = 10
        for i in range(count):
            self.create_currency_record(self._currency_record)
        status, body = self.get(self.CURRENT_URL)

        self.assertEqual(status, 200, msg=body.get('error', ''))
        self.assertEqual(len(body["current"]), count)

    def test_get_current_multi_filtering(self):
        count = 10
        for i in range(count):
            self.create_currency_record(self._currency_record, from_currency="USD", to_currency="UAH")
        for i in range(count):
            self.create_currency_record(self._currency_record, from_currency="USD", to_currency="EUR")
        for i in range(count):
            self.create_currency_record(self._currency_record, from_currency="EUR", to_currency="UAH")
        status, body = self.get(url_with_parameters(self.CURRENT_URL, from_currency="USD", to_currency="UAH"))

        self.assertEqual(status, 200, msg=body.get('error', ''))
        self.assertEqual(len(body["current"]), count)

    def test_get_current_valid_parameters(self):
        status, body = self.get(url_with_parameters(self.CURRENT_URL,
                                                    from_currency="UAH",
                                                    to_currency="USD"))
        self.assertEqual(status, 200)

    def test_get_current_incorrect_from_currency(self):
        status, body = self.get(url_with_parameters(self.CURRENT_URL, from_currency="111"))
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)

        status, body = self.get(url_with_parameters(self.CURRENT_URL, from_currency=""))
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)

    def test_get_current_incorrect_to_currency(self):
        status, body = self.get(url_with_parameters(self.CURRENT_URL, to_currency="222"))
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)

        status, body = self.get(url_with_parameters(self.CURRENT_URL, to_currency=""))
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)

    # GET /currency/history
    HISTORY_URL = "/currency/history"

    def test_get_empty_history(self):
        status, body = self.get(self.HISTORY_URL)

        self.assertEqual(status, 200, msg=body.get('error', ''))
        self.assertListEqual(body["history"], [])

    def test_get_history(self):
        self.create_currency_record(self._currency_record)
        status, body = self.get(self.HISTORY_URL)

        self.assertEqual(status, 200, msg=body.get('error', ''))
        self.assertListEqual(body["history"], [self._currency_record])

    def test_get_history_multi_filtering(self):
        count = 10
        for i in range(count):
            self.create_currency_record(self._currency_record, from_currency="USD", to_currency="UAH")
        for i in range(count):
            self.create_currency_record(self._currency_record, from_currency="USD", to_currency="EUR")
        for i in range(count):
            self.create_currency_record(self._currency_record, from_currency="EUR", to_currency="UAH")
        status, body = self.get(url_with_parameters(self.HISTORY_URL, from_currency="USD", to_currency="UAH"))

        self.assertEqual(status, 200, msg=body.get('error', ''))
        self.assertEqual(len(body["history"]), count)

    def test_get_history_multi_date_filtering(self):
        count = 10
        # before
        for i in range(count):
            self.create_currency_record(self._currency_record, commit_time='2015-12-31T23:59:59+00:00')
        # in
        for i in range(count):
            self.create_currency_record(self._currency_record, commit_time='2016-01-01T00:00:00+00:00')
        for i in range(count):
            self.create_currency_record(self._currency_record, commit_time='2016-01-31T00:00:00+00:00')
        for i in range(count):
            self.create_currency_record(self._currency_record, commit_time='2016-02-29T23:59:59+00:00')
        # after
        for i in range(count):
            self.create_currency_record(self._currency_record, commit_time='2016-03-01T01:00:00+00:00')
        status, body = self.get(url_with_parameters(self.HISTORY_URL, from_date='2016-01-01', till_date='2016-02-29'))

        self.assertEqual(status, 200, msg=body.get('error', ''))
        self.assertEqual(len(body["history"]), count * 3)

    def test_get_history_valid_parameters(self):
        status, body = self.get(url_with_parameters(self.HISTORY_URL,
                                                    from_date="2016-01-01",
                                                    till_date="2016-01-01",
                                                    from_currency="UAH",
                                                    to_currency="USD"))
        self.assertEqual(status, 200)

    def test_get_history_incorrect_from_currency(self):
        status, body = self.get(url_with_parameters(self.HISTORY_URL, from_currency="111"))
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)

        status, body = self.get(url_with_parameters(self.HISTORY_URL, from_currency="US"))
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)

        status, body = self.get(url_with_parameters(self.HISTORY_URL, from_currency=""))
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)

    def test_get_history_incorrect_to_currency(self):
        status, body = self.get(url_with_parameters(self.HISTORY_URL, to_currency="222"))
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)

        status, body = self.get(url_with_parameters(self.HISTORY_URL, to_currency="UAН"))  # when Н - Russian 'N'
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)

        status, body = self.get(url_with_parameters(self.HISTORY_URL, to_currency=""))
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)

    def test_get_history_incorrect_from_date(self):
        status, body = self.get(url_with_parameters(self.HISTORY_URL, from_date="2016-01-00"))
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)

        status, body = self.get(url_with_parameters(self.HISTORY_URL, from_date="2016-12"))
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)

        status, body = self.get(url_with_parameters(self.HISTORY_URL, from_date=""))
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)

    def test_get_history_incorrect_till_date(self):
        status, body = self.get(url_with_parameters(self.HISTORY_URL, till_date="2016-01-00"))
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)

        status, body = self.get(url_with_parameters(self.HISTORY_URL, till_date="2016-01"))
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)

        status, body = self.get(url_with_parameters(self.HISTORY_URL, till_date=""))
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)

    # POST /currency/update
    UPDATE_URL = "/currency/update"

    def test_post_currency_empty_body(self):
        update_dict = {
            "update": []
        }
        status, body = self.post(self.UPDATE_URL, update_dict)
        self.assertEqual(status, 200, msg=body.get('error', ''))

    def test_post_currency(self):
        update_dict = {
            "update": [
                self._currency_record,
                self._currency_record,
                self._currency_record,
                self._currency_record
            ]
        }
        status, body = self.post(self.UPDATE_URL, update_dict)
        self.assertEqual(status, 200, msg=body.get('error', ''))
        self.assertEqual(len(Currency.query.all()), 1)

    def test_post_currency_rate(self):
        update_dict = {
            "update": [
                self._currency_record,
            ]
        }
        status, body = self.post(self.UPDATE_URL, update_dict)
        self.assertEqual(status, 200, msg=body.get('error', ''))
        self.assertEqual(Currency.query.all()[0].rate, Decimal(self._currency_record["rate"]))

    def test_post_currency_different(self):
        update_dict = {
            "update": [
                {
                    "from_currency": "USD",
                    "to_currency": "UAH",
                    "rate": "27.5",
                },
                {
                    "from_currency": "EUR",
                    "to_currency": "UAH",
                    "rate": "1.15",
                }
            ]
        }
        status, body = self.post(self.UPDATE_URL, update_dict)
        self.assertEqual(status, 200, msg=body.get('error', ''))
        self.assertEqual(len(Currency.query.all()), 2)

    def test_post_currency_incomplete_json(self):
        update_dict = {
            "update": [
                {
                    "to_currency": "UAH",
                }
            ]
        }
        status, body = self.post(self.UPDATE_URL, update_dict)
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)

    def test_post_currency_invalid_from_currency(self):
        update_dict = {
            "update": [
                {
                    "from_currency": "",
                    "to_currency": "UAH",
                    "rate": "27.5",
                }
            ]
        }
        status, body = self.post(self.UPDATE_URL, update_dict)
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)

    def test_post_currency_invalid_to_currency(self):
        update_dict = {
            "update": [
                {
                    "from_currency": "USD",
                    "to_currency": "123",
                    "rate": "27.5",
                }
            ]
        }
        status, body = self.post(self.UPDATE_URL, update_dict)
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)

    def test_post_currency_invalid_rate(self):
        update_dict = {
            "update": [
                {
                    "from_currency": "USD",
                    "to_currency": "123",
                    "rate": "27,5",
                }
            ]
        }
        status, body = self.post(self.UPDATE_URL, update_dict)
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)
