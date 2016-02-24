#!venv/bin/python

import flask_script as script
import flask_migrate as migrate

from xopay import app, db
from xopay.models import *


migration = migrate.Migrate(app, db)
manager = script.Manager(app)
manager.add_command('db', migrate.MigrateCommand)

if __name__ == '__main__':

    manager.run()
