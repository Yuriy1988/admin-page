import decimal
from flask import Flask, Blueprint, json, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from werkzeug.contrib.fixers import ProxyFix

from config import STATIC_FOLDER

__author__ = 'Kostel Serhii'


class XOPayJSONEncoder(json.JSONEncoder):

    def default(self, obj):
        if isinstance(obj, decimal.Decimal):
            # Convert decimal instances to strings.
            return str(obj)
        return super(XOPayJSONEncoder, self).default(obj)


class AuthBlueprint(Blueprint):

    def route(self, rule, **options):
        """
        A decorator that is used to extend basic flask route decorator
        with authorization functionality.
        Use "auth" option to check access group::

            @api.route('/', auth='admin')
            def index():
                return 'Hello World'

        This is equivalent to::

            @app.route('/')
            @auth('admin')
            def index():
                return 'Hello World'

        :param rule: the URL rule as string
        :param options: route options
                :auth: user group or list of groups,
                that has permissions to make request for current rule.
                If None or not set - do not check permission.
        """
        from api.auth import auth

        access_groups = options.pop('auth', None)

        def decorator(f):
            auth_decorator = auth(access_groups)
            route_decorator = super(AuthBlueprint, self).route(rule, **options)
            return route_decorator(auth_decorator(f))

        return decorator


app = Flask(__name__, static_folder=STATIC_FOLDER)

app.config.from_object('config')

app.wsgi_app = ProxyFix(app.wsgi_app)
app.json_encoder = XOPayJSONEncoder

db = SQLAlchemy(app)

api_v1 = AuthBlueprint('api_v1', __name__, url_prefix='/api/admin/dev')

import api.handlers
app.register_blueprint(api_v1)


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
