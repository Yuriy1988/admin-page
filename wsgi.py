#!/usr/bin/python3
import sys
import logging

activate_this = '/var/www/xopay/admin/venv/bin/activate_this.py'
with open(activate_this) as f:
    code = compile(f.read(), activate_this, 'exec')
    exec(code, dict(__file__=activate_this))

logging.basicConfig(stream=sys.stderr)
sys.path.insert(0,"/var/www/xopay/admin")

#TODO: add production config
from xopay import app as application
application.secret_key = 'Add your secret key'