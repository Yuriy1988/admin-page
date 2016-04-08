#!venv/bin/python
import os
import unittest
import flask_script as script
import flask_migrate as migrate

from api import app, db
from api.models.payment_system import init_payment_systems

__author__ = 'Kostel Serhii'

manager = script.Manager(app)

# runserver
server = script.Server(host="0.0.0.0", port=7128, use_debugger=True)
manager.add_command('runserver', server)


# test
def test():
    tests_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'api', 'tests')
    suite = unittest.TestLoader().discover(tests_path, pattern='*.py')
    unittest.TextTestRunner(verbosity=2).run(suite)
manager.add_command('test', script.Command(test))


# db migrations
migration = migrate.Migrate(app, db)
manager.add_command('db', migrate.MigrateCommand)


# init payment systems
manager.add_command('init_paysys', script.Command(init_payment_systems))

if __name__ == '__main__':
    manager.run()
