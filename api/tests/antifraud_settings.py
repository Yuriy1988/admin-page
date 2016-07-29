from api.tests import base
from api import models


class TestAntifraudRules(base.BaseTestCase):

    _scoring_rule = {
        "id": "some_function",
        "score": 10.0,
        "formatted_text": "This is fake criterion.",
        "parameters": {}
    }

    _antifraud_settings = {
        "decline_threshold": '100.00',
        "three_d_secure_threshold": '30.00'
    }

    def test_get_scoring_rules(self):
        rule = models.AntiFraudScoringRule(self._scoring_rule)
        self.db.add(rule)
        self.db.commit()

        status, body = self.get("/antifraud_settings/scoring_rules")
        self.assertEqual(status, 200)
        self.assertDictEqual(body["rules"][0], self._scoring_rule)

    def test_create_scoring_rule(self):
        status, body = self.post("/antifraud_settings/scoring_rules", self._scoring_rule)
        self.assertEqual(status, 200)
        self.assertDictEqual(body, self._scoring_rule)
        rule = models.AntiFraudScoringRule.query.get(self._scoring_rule["id"])
        self.assertTrue(rule)

    def test_update_scoring_rule(self):
        rule = models.AntiFraudScoringRule(self._scoring_rule)
        self.db.add(rule)
        self.db.commit()

        rule_update = {
            "score": 5.0
        }

        old_rule = self._scoring_rule.copy()
        old_rule.update(rule_update)

        status, body = self.put("/antifraud_settings/scoring_rules/" + self._scoring_rule["id"], rule_update)
        self.assertEqual(status, 200)
        self.assertDictEqual(body, old_rule)

    def test_delete_scoring_rule(self):
        rule = models.AntiFraudScoringRule(self._scoring_rule)
        self.db.add(rule)
        self.db.commit()

        status, body = self.delete("/antifraud_settings/scoring_rules/" + self._scoring_rule["id"],)
        self.assertEqual(status, 200)

        rule = models.AntiFraudScoringRule.query.get(self._scoring_rule["id"])
        self.assertFalse(rule)

        status, body = self.delete("/antifraud_settings/scoring_rules/" + self._scoring_rule["id"], )
        self.assertEqual(status, 404)

    def test_get_antifraud_settings(self):
        settings_set = models.AntiFraudRule(**self._antifraud_settings)
        self.db.add(settings_set)
        self.db.commit()

        status, body = self.get("/antifraud_settings/settings")
        self.assertEqual(status, 200)

    def test_update_antifraud_settings(self):
        settings_set = models.AntiFraudRule(**self._antifraud_settings)
        self.db.add(settings_set)
        self.db.commit()

        settings_update = {
            "decline_threshold": '90.00',
        }

        old_settings = self._antifraud_settings.copy()
        old_settings.update(settings_update)

        status, body = self.put("/antifraud_settings/settings", settings_update)
        self.assertEqual(status, 200)
        self.assertDictEqual(body, old_settings)
