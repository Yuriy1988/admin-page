from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand

from xopay import app, db
from xopay.users.models import User
from xopay.merchants.models import Merchant, MerchantStore, StoreSettings
from xopay.pay_systems.models import PaymentSystem


migrate = Migrate(app, db)

manager = Manager(app)

manager.add_command('db', MigrateCommand)

if __name__ == '__main__':
    manager.run()