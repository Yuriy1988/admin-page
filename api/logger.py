import os
import logging
import logging.handlers
from flask import request

from api import after_app_created

__author__ = 'Kostel Serhii'


def _default_logger_config(log_config):
    """Set default values for logger."""

    log_config.setdefault('LOG_FORMAT', '%(levelname)-6.6s | %(name)-12.12s | %(asctime)s | %(message)s')
    log_config.setdefault('LOG_DATE_FORMAT', '%d.%m %H:%M:%S')
    log_config.setdefault('LOG_LEVEL', 'INFO')
    log_config.setdefault('LOG_ROOT_LEVEL', 'INFO')
    log_config.setdefault('LOG_BASE_NAME', '')

    log_config.setdefault('LOG_FILE', None)
    log_config.setdefault('LOG_MAX_BYTES', 10*1024*1024)
    log_config.setdefault('LOG_BACKUP_COUNT', 10)


@after_app_created
def logger_configure(app):
    """
    Configure logger format and handler.
    Set level for current and root logger.
    :param app: Flask application
    """
    log_config = app.config
    _default_logger_config(log_config)

    log_file = log_config.get('LOG_FILE')
    if log_file and os.access(os.path.dirname(log_file), os.W_OK):
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

    root_logger = logging.getLogger('')

    root_logger.addHandler(log_handler)
    root_logger.setLevel(log_config['LOG_ROOT_LEVEL'])

    local_logger = logging.getLogger(log_config['LOG_BASE_NAME'])
    local_logger.setLevel(log_config['LOG_LEVEL'])


@after_app_created
def register_request_logger(app):
    """
    Add request logger (in production werkzeug logger does not work).
    :param app: Flask application
    """
    if not app.config.get('LOG_REQUESTS'):
        return

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
