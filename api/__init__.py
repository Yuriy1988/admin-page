import decimal
from flask import Flask, json, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
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


import api.handlers


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