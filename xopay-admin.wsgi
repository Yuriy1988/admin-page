#!/usr/bin/python
import sys
import logging
logging.basicConfig(stream=sys.stderr)
sys.path.insert(0,"/var/www/xopay/admin/")

#TODO: add production config
from FlaskApp import app as application
application.secret_key = 'Add your secret key'
