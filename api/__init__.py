import decimal
from flask import Flask, json
from flask_sqlalchemy import SQLAlchemy
from flask.ext.login import LoginManager
from werkzeug.contrib.fixers import ProxyFix

from config import STATIC_FOLDER

__author__ = 'Kostel Serhii'

app = Flask(__name__, static_folder=STATIC_FOLDER)
app.config.from_object('config')

app.wsgi_app = ProxyFix(app.wsgi_app)

db = SQLAlchemy(app)


class XOPayJSONEncoder(json.JSONEncoder):

    def default(self, obj):
        if isinstance(obj, decimal.Decimal):
            # Convert decimal instances to strings.
            return str(obj)
        return super(XOPayJSONEncoder, self).default(obj)

app.json_encoder = XOPayJSONEncoder

lm = LoginManager()
lm.init_app(app)
lm.login_view = 'login'

import api.handlers

if app.config['DEBUG']:
    # enable only in debug mode. In production use nginx/apache for this purpose
    import api.admin_page
