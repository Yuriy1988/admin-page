import os
import unittest
from flask.ext.testing import TestCase

from config import BASE_FOLDER
from xopay import app, db
from xopay.users.models import User


class AbstractTestCase(TestCase):

    def create_app(self):
        return app

    def setUp(self):
        app.config['DEBUG'] = True
        app.config['TESTING'] = True
        app.config['CSRF_ENABLED'] = False
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(BASE_FOLDER, 'test.db')
        self.client = app.test_client()
        db.create_all()
        # self.app_context = app.app_context()
        # self.app_context.push()
        self.user = {'username': 'test',
                     'password': 'test'}
        create_users(self.user)

    def tearDown(self):
        db.session.remove()
        db.drop_all()

    def login(self, username, password):
        return self.client.post('login', data=dict(
            username=username,
            password=password
        ), follow_redirects=True)

    def logout(self):
        return self.client.get('logout', follow_redirects=True)


def create_users(user_data):
    u = User(email='john@example.com', username=user_data['username'])
    u.hash_password(user_data['password'])
    db.session.add(u)
    db.session.commit()


if __name__ == '__main__':
    unittest.main()
