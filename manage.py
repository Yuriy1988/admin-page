#!venv/bin/python
import os
import unittest
from flask_script import Manager, Server
from flask_migrate import Migrate, MigrateCommand

from api import app, db
from api.models import payment_system as paysys, user

__author__ = 'Kostel Serhii'

migrate = Migrate(app, db)
manager = Manager(app)


# db (migrations)
manager.add_command('db', MigrateCommand)


# runserver
# TODO: move port and debug into config
server = Server(host="0.0.0.0", port=7128, use_debugger=True)
manager.add_command('runserver', server)


# test
@manager.command
def test():
    """Runs unittests into api/tests path."""
    tests_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'api', 'tests')
    suite = unittest.TestLoader().discover(tests_path, pattern='*.py')
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    return 0 if result.wasSuccessful() else 1


# create_admin
@manager.command
def create_admin():
    """Create database administrator user model"""
    username_and_email = input("Enter admin email (username):\n>>> ")
    password = input("Enter admin password:\n>>> ")

    admin_user = user.User(
        username=username_and_email,
        password=password,
        email=username_and_email,
        enabled=True,
        notify='EMAIL'
    )
    admin_user.add_to_group('admin')
    db.session.add(admin_user)
    db.session.commit()


# create_payment_systems
@manager.command
def create_payment_systems():
    """Create payment system."""
    for ps_id, ps_name in zip(paysys._PAYMENT_SYSTEMS_ID_ENUM, paysys._PAYMENT_SYSTEMS_NAME):
        model = paysys.PaymentSystem(ps_id, ps_name)
        db.session.add(model)
    db.session.commit()


# create_data
@manager.command
def create_data():
    """Create default database models data."""
    create_payment_systems()


if __name__ == '__main__':
    manager.run()
