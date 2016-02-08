import unittest
from flask import url_for, get_flashed_messages, g
from flask.ext.login import current_user

from xopay import app, db
from xopay.users.models import User
from xopay.init_testing import AbstractTestCase


class UserTest(AbstractTestCase):

    def test_user_login(self):
        with self.client:
            a = app.app_ctx_globals_class()
            response = self.login(username=self.user['username'], password='wrong')
            self.assertFalse(g.user.is_authenticated)
            response = self.login(username='wrong', password='wrong')
            self.assertFalse(g.user.is_authenticated)
            response = self.login(**self.user)
            self.assertTrue(g.user.is_authenticated)
            response = self.logout()
            self.assertFalse(g.user.is_authenticated)




if __name__ == '__main__':
    unittest.main()