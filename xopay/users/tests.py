import unittest
from flask import url_for, get_flashed_messages

from xopay import app, db
from xopay.users.models import User
from xopay.init_testing import AbstactTestCase


class UserTest(AbstactTestCase):

    def test_user_login(self):
        response = self.login(username=self.user['username'], password='wrong')
        assert 'Username or Password is invalid' in str(response.data)
        response = self.login(username='wrong', password='wrong')
        assert 'Username or Password is invalid' in str(response.data)
        response = self.login(**self.user)
        assert 'Logged in successfully' in str(response.data)
        response = self.logout()
        assert 'You logout' in str(response.data)



if __name__ == '__main__':
    unittest.main()