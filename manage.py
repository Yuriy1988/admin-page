#!venv/bin/python
# -*- coding: utf-8 -*-

import flask_script as script
import flask_migrate as migrate

from xopay import app, db

from xopay.users.models import User
from xopay.merchants.models import Merchant, MerchantAccount, MerchantInfo, Manager, Store
from xopay.payment_systems.models import PaymentSystem


migration = migrate.Migrate(app, db)

manager = script.Manager(app)

manager.add_command('db', migrate.MigrateCommand)

if __name__ == '__main__':

    manager.run()
