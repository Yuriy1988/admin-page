from flask import Flask, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask.ext.login import LoginManager

from xopay.tools import json_tools

__author__ = 'Kostel Serhii'

app = Flask(__name__, static_folder='../frontend/static')
app.config.from_object('config')
app.json_encoder = json_tools.JSONModelEncoder

lm = LoginManager()
lm.init_app(app)
lm.login_view = 'login'

db = SQLAlchemy(app)


@app.route('/admin/')
@app.route('/admin/<path:path>/')
def admin_page(path=None):
    """
    Return single page html for xopay admin
    :param path: any valid url (used in frontend routing system)
    :return: index html page
    """
    # TODO: enable this only in debug mode. In production use apache for this purpose
    return app.send_static_file('index.html')


@app.route('/')
def index():
    """ Redirect from root to admin page """
    return redirect(url_for('admin_page'))
