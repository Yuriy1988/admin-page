import decimal
import logging
from functools import wraps
from flask import Flask, Blueprint, json, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from werkzeug.contrib.fixers import ProxyFix

__author__ = 'Kostel Serhii'


_app_created_subscribers = set()


def _inform_app_created(app):
    """Send app to every subscribers."""
    for func in _app_created_subscribers:
        func(app)


def after_app_created(func):
    """Subscribe function to call after app created."""
    _app_created_subscribers.add(func)
    return wraps(func)


class XOPayJSONEncoder(json.JSONEncoder):

    def default(self, obj):

        if isinstance(obj, decimal.Decimal):
            # Convert decimal instances to strings.
            return str(obj)

        if isinstance(obj, decimal.Decimal):
            # Convert decimal instances to strings.
            return str(obj)
        return super(XOPayJSONEncoder, self).default(obj)


db = SQLAlchemy()
migrate = Migrate()

app = Flask(__name__)
app.config.from_object('config')
app.static_folder = app.config["STATIC_FOLDER"]

app.wsgi_app = ProxyFix(app.wsgi_app)
app.json_encoder = XOPayJSONEncoder


log = logging.getLogger('xop.main')
log.info('Starting XOPay Admin Service...')


db.init_app(app)
migrate.init_app(app, db)


api_v1 = Blueprint('api_v1', __name__, url_prefix='/api/admin/dev')

import api.handlers
app.register_blueprint(api_v1)

import api.logger

_inform_app_created(app)

if app.config['DEBUG']:
    # enable only in debug mode. In production use nginx/apache for this purpose

    @app.route('/admin/')
    @app.route('/admin/<path:path>/')
    def admin_page(path=None):
        """
        Return single page html for xopay admin
        :param path: any valid url (used in frontend routing system)
        :return: index html page
        """
        return app.send_static_file('admin/index.html')


    @app.route('/')
    def index():
        """ Redirect from root to admin page """
        return redirect(url_for('admin_page'))
