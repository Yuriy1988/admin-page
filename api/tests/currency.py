import pytz
import iso8601
from datetime import datetime, timedelta
from decimal import Decimal
from itertools import permutations

from api.tests import base
from api.models import Currency, enum

__author__ = 'Daniel Omelchenko'


class TestCurrency(base.BaseTestCase):

    # test environment

    _currency = {
        "from_currency": "USD",
        "to_currency": "UAH",
        "rate": "27.500000",
        "commit_time": "2016-01-01T00:00:00+00:00"
    }

    def create_currency_records(self, count=1, **currency_kwargs):
        currency = self._currency.copy()
        currency.update(currency_kwargs)

        currencies = [currency for _ in range(count)]
        currency_models = [Currency.create(curr) for curr in currencies]
        self.db.commit()

        return currencies

    def _generate_currency_history(self, size=5):
        currency_history = []
        commit_time = pytz.utc.localize(datetime(2016, 3, 8, 12, 0, 0))

        for i in range(1, size+1):
            for from_curr, to_curr in permutations(enum.CURRENCY_ENUM, 2):
                currency = dict(from_currency=from_curr, to_currency=to_curr, rate=i, commit_time=commit_time)
                Currency.create(currency)
                currency_history.append(currency)

            commit_time += timedelta(hours=6)

        self.db.session.commit()
        return currency_history

    # GET /currency/current

    def test_get_current_if_empty(self):
        status, body = self.get("/currency/current")

        self.assertEqual(status, 200, msg=body)
        self.assertListEqual(body["current"], [])

    def test_get_current(self):
        currencies = self.create_currency_records()
        status, body = self.get("/currency/current")

        self.assertEqual(status, 200, msg=body)
        self.assertListEqual(body["current"], currencies)

    def test_get_current_multi(self):
        count = 10
        self.create_currency_records(count=count)
        status, body = self.get("/currency/current")

        self.assertEqual(status, 200, msg=body)
        self.assertEqual(len(body["current"]), count)

    def test_get_current_valid_structure(self):
        self.create_currency_records()
        status, body = self.get("/currency/current")

        self.assertEqual(status, 200, msg=body)

        currency = body['current'][0]
        self.assertSetEqual(set(currency.keys()), set(self._currency.keys()))
        self.assertEqual(currency["commit_time"], self._currency["commit_time"])
        datetime_with_tz = iso8601.parse_date(currency["commit_time"])
        self.assertTrue(datetime_with_tz.tzinfo)

    def test_get_current_multi_filtering(self):
        count = 10
        self.create_currency_records(from_currency="USD", to_currency="UAH", count=count)
        self.create_currency_records(from_currency="USD", to_currency="EUR", count=count)
        self.create_currency_records(from_currency="EUR", to_currency="UAH", count=count)

        status, body = self.get("/currency/current", query_args={"from_currency": "USD", "to_currency": "UAH"})

        self.assertEqual(status, 200, msg=body)
        self.assertEqual(len(body["current"]), count)

    def test_get_current_valid_parameters(self):
        status, body = self.get("/currency/current", query_args={"from_currency": "UAH", "to_currency": "USD"})
        self.assertEqual(status, 200)

    def test_get_current_incorrect_from_currency(self):
        status, body = self.get("/currency/current", query_args={"from_currency": "111"})
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)

        status, body = self.get("/currency/current", query_args={"from_currency": ""})
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)

    def test_get_current_incorrect_to_currency(self):
        status, body = self.get("/currency/current", query_args={"to_currency": "222"})
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)

        status, body = self.get("/currency/current", query_args={"to_currency": ""})
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)

    # GET /currency/history

    def test_get_empty_history(self):
        status, body = self.get("/currency/history")

        self.assertEqual(status, 200, msg=body)
        self.assertListEqual(body["history"], [])

    def test_get_history(self):
        currencies = self.create_currency_records()
        status, body = self.get("/currency/history")

        self.assertEqual(status, 200, msg=body)
        self.assertListEqual(body["history"], currencies)

    def test_get_history_multi_filtering(self):
        count = 10
        self.create_currency_records(from_currency="USD", to_currency="UAH", count=count)
        self.create_currency_records(from_currency="USD", to_currency="EUR", count=count)
        self.create_currency_records(from_currency="EUR", to_currency="UAH", count=count)

        status, body = self.get("/currency/history", query_args=dict(from_currency="USD", to_currency="UAH"))

        self.assertEqual(status, 200, msg=body)
        self.assertEqual(len(body["history"]), count)

    def test_get_history_multi_date_filtering(self):
        count = 10
        # before
        self.create_currency_records(commit_time='2015-12-31T23:59:59+00:00', count=count)
        # in
        self.create_currency_records(commit_time='2016-01-01T00:00:00+00:00', count=count)
        self.create_currency_records(commit_time='2016-01-31T00:00:00+00:00', count=count)
        self.create_currency_records(commit_time='2016-02-29T23:59:59+00:00', count=count)
        # after
        self.create_currency_records(commit_time='2016-03-01T01:00:00+00:00', count=count)

        status, body = self.get("/currency/history", query_args=dict(from_date='2016-01-01', till_date='2016-02-29'))

        self.assertEqual(status, 200, msg=body)
        self.assertEqual(len(body["history"]), count * 3)

    def test_get_history_valid_parameters(self):
        query = dict(from_date="2016-01-01", till_date="2016-01-01", from_currency="UAH", to_currency="USD")
        status, body = self.get("/currency/history", query_args=query)
        self.assertEqual(status, 200)

    def test_get_history_incorrect_from_currency(self):
        status, body = self.get("/currency/history", query_args=dict(from_currency="111"))
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)

        status, body = self.get("/currency/history", query_args=dict(from_currency="US"))
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)

        status, body = self.get("/currency/history", query_args=dict(from_currency=""))
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)

    def test_get_history_incorrect_to_currency(self):
        status, body = self.get("/currency/history", query_args=dict(to_currency="222"))
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)

        status, body = self.get("/currency/history", query_args=dict(to_currency="UAН"))  # when Н - Russian 'N'
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)

        status, body = self.get("/currency/history", query_args=dict(to_currency=""))
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)

    def test_get_history_incorrect_from_date(self):
        status, body = self.get("/currency/history", query_args=dict(from_date="2016-01-00"))
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)

        status, body = self.get("/currency/history", query_args=dict(from_date="2016-12"))
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)

        status, body = self.get("/currency/history", query_args=dict(from_date="2016-01-00T00:00:00"))
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)

        status, body = self.get("/currency/history", query_args=dict(from_date="2016-01-00T00:00:00+00:00"))
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)

        status, body = self.get("/currency/history", query_args=dict(from_date=""))
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)

    def test_get_history_incorrect_till_date(self):
        status, body = self.get("/currency/history", query_args=dict(till_date="2016-01-00"))
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)

        status, body = self.get("/currency/history", query_args=dict(till_date="2016-01"))
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)

        status, body = self.get("/currency/history", query_args=dict(till_date="2016-01-00T00:00:00"))
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)

        status, body = self.get("/currency/history", query_args=dict(till_date="2016-01-00T00:00:00+00:00"))
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)

        status, body = self.get("/currency/history", query_args=dict(till_date=""))
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)

    # POST /currency/update

    def test_post_currency_empty_body(self):
        update_dict = {"update": []}
        status, body = self.post("/currency/update", update_dict, auth='system')
        self.assertEqual(status, 200, msg=body)

    def test_post_currency(self):
        update_dict = {"update": [self._currency]*4}

        status, body = self.post("/currency/update", update_dict, auth='system')
        self.assertEqual(status, 200, msg=body)
        self.assertEqual(len(Currency.query.all()), 1)

    def test_post_currency_rate(self):
        update_dict = {"update": [self._currency]}

        status, body = self.post("/currency/update", update_dict, auth='system')
        self.assertEqual(status, 200, msg=body)
        self.assertEqual(Currency.query.all()[0].rate, Decimal(self._currency["rate"]))

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
        status, body = self.post("/currency/update", update_dict, auth='system')
        self.assertEqual(status, 200, msg=body)
        self.assertEqual(len(Currency.query.all()), 2)

    def test_post_currency_incomplete_json(self):
        update_dict = {"update": [{"to_currency": "UAH"}]}

        status, body = self.post("/currency/update", update_dict, auth='system')
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
        status, body = self.post("/currency/update", update_dict, auth='system')
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
        status, body = self.post("/currency/update", update_dict, auth='system')
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
        status, body = self.post("/currency/update", update_dict, auth='system')
        self.assertEqual(status, 400)
        self.assertTrue('error' in body)
