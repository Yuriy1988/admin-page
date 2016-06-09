import os
import decimal
import logging
import logging.handlers
from flask import Flask, Blueprint, json, redirect, url_for, request
from flask_sqlalchemy import SQLAlchemy
from werkzeug.contrib.fixers import ProxyFix

__author__ = 'Kostel Serhii'


class XOPayJSONEncoder(json.JSONEncoder):

    def default(self, obj):
        if isinstance(obj, decimal.Decimal):
            # Convert decimal instances to strings.
            return str(obj)
        return super(XOPayJSONEncoder, self).default(obj)


def logger_configure(log_config):

    if 'LOG_FILE' in log_config and os.access(os.path.dirname(log_config['LOG_FILE']), os.W_OK):
        log_handler = logging.handlers.RotatingFileHandler(
            filename=log_config['LOG_FILE'],
            maxBytes=log_config['LOG_MAX_BYTES'],
            backupCount=log_config['LOG_BACKUP_COUNT'],
            encoding='utf8',
        )
    else:
        log_handler = logging.StreamHandler()

    log_formatter = logging.Formatter(fmt=log_config['LOG_FORMAT'], datefmt=log_config['LOG_DATE_FORMAT'])
    log_handler.setFormatter(log_formatter)

    # root logger
    logging.getLogger('').addHandler(log_handler)
    logging.getLogger('').setLevel(log_config['LOG_ROOT_LEVEL'])

    # local logger
    logging.getLogger(log_config.get('LOG_BASE_NAME', '')).setLevel(log_config['LOG_LEVEL'])


app = Flask(__name__)
app.config.from_object('config')
app.static_folder = app.config["STATIC_FOLDER"]

app.wsgi_app = ProxyFix(app.wsgi_app)
app.json_encoder = XOPayJSONEncoder

logger_configure(app.config)
log = logging.getLogger('xop.main')
log.info('Starting XOPay Admin Service...')

# in production werkzeug logger does not work
# add requests log manually
if not app.config['DEBUG']:

    @app.after_request
    def log_request(response):
        request_detail = dict(
            remote_address=request.remote_addr,
            method=request.method,
            path=request.full_path if request.query_string else request.path,
            status=response.status_code
        )
        logging.getLogger('xop.request').info('[%(remote_address)s] %(method)s %(path)s %(status)s' % request_detail)
        return response

db = SQLAlchemy(app)

api_v1 = Blueprint('api_v1', __name__, url_prefix='/api/admin/dev')

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
