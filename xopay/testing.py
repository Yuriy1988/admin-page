import unittest
from flask.ext.testing import TestCase

from xopay import app, db as xopay_db
from xopay.models import User


class BaseTestCase(TestCase):

    SQLALCHEMY_DATABASE_URI = "sqlite://"   # in memory

    def setUp(self):
        """ Setup before test case """
        xopay_db.create_all()

    def tearDown(self):
        """ Teardown after test case """
        self.db.remove()
        xopay_db.drop_all()

    @property
    def db(self):
        """ Database session, that can be used in test """
        return xopay_db.session

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


if __name__ == '__main__':

    unittest.main()
