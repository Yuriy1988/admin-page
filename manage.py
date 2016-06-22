#!venv/bin/python

"""
 Project management commands.
 Commands variables depends on config file name.
 Default config is debug.
 Run commands only if virtual environment created (make venv_init).


 Run commands:
    ./manage.py <command> [<sub command>] [--config=<config name>]


 Config name: debug, production, test (default debug)


"""

import os
import unittest
import coverage
from flask_script import Manager
from flask_migrate import MigrateCommand

__author__ = 'Kostel Serhii'


COV = coverage.coverage(
    branch=True,
    include='api/*',
    omit=[
        'api/__init__.py',
        'api/tests/*',
        'api/*/__init__.py'
    ]
)
COV.start()

import run
from api import create_app, db
from api.models import payment_system as paysys, user
from api.schemas import UserSchema, UserCreatePasswordSchema


manager = Manager(create_app)
manager.add_option("-c", "--config", dest="config", default='debug', required=False)


# ------ Runserver -----

@manager.command
@manager.option('--reload', dest='reload', default=True)
def runserver(reload):
    run.runserver(config=manager.get_options()['config'], reload=reload)


# ------ Tests -----

def _api_test():
    tests_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'api/tests')
    suite = unittest.TestLoader().discover(tests_path, pattern='*.py')
    return unittest.TextTestRunner(verbosity=2).run(suite)


@manager.command
def test():
    """Runs unit tests into api/tests path."""
    result = _api_test()
    return 0 if result.wasSuccessful() else 1


@manager.command
def test_cover():
    """Runs the unit tests into api/tests path with coverage."""
    result = _api_test()
    if result.wasSuccessful():
        COV.stop()
        COV.save()
        print('Coverage Summary:')
        COV.report()
        basedir = os.path.abspath(os.path.dirname(__file__))
        covdir = os.path.join(basedir, 'test_cover')
        COV.html_report(directory=covdir)
        print('HTML version: file://%s/index.html' % covdir)
        COV.erase()
        return 0
    return 1


# ------ Database -----

def create_admin():
    """Create database administrator user model"""
    for _ in range(3):
        username = input('Enter admin username (default is "admin"):\n>>> ') or 'admin'
        email = input('Enter admin email:\n>>> ')

        input_user_data = dict(username=username, email=email, enabled=True, notify='EMAIL')
        admin_user_data, errors = UserSchema().load(input_user_data)
        if not errors: break

        print('Create admin errors:\n', str(errors), '\nTry again!\n')
    else:
        print('Admin user was NOT created!')
        return 1

    for _ in range(3):
        password = input("Enter admin password:\n>>> ")

        password_data, errors = UserCreatePasswordSchema().load(dict(password=password))
        if not errors: break

        print('Create admin errors:\n', str(errors), '\nTry again!\n')
    else:
        print('Admin user was NOT created!')
        return 1

    admin_user_data['password'] = password_data['password']

    admin_user = user.User(**admin_user_data)
    admin_user.add_to_group('admin')
    db.session.add(admin_user)
    db.session.commit()

    return 0


@manager.command
def create_payment_systems():
    """Create payment system."""
    for ps_id, ps_name in zip(paysys._PAYMENT_SYSTEMS_ID_ENUM, paysys._PAYMENT_SYSTEMS_NAME):
        model = paysys.PaymentSystem(ps_id, ps_name)
        db.session.add(model)
    db.session.commit()


@manager.command
def create_data():
    """Create default database models data."""
    create_payment_systems()


manager.add_command('db', MigrateCommand)


if __name__ == '__main__':
    manager.run()
