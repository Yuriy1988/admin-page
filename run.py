#!venv/bin/python
"""
Run Flask app server.

Usage:
    run.py [-h] [--config CONFIG] [--reload]

Examples:
    ./run.py                              : config=debug, reload=False
    ./run.py --reload                     : config=debug, reload=True
    ./run.py --config=production --reload : config=production, reload=True
"""

import logging
import argparse

from api import create_app

__author__ = 'Kostel Serhii'

service_name = 'XOPay Admin Service'


def runserver(config='debug', reload=False):
    """
    Run server with defined configuration.
    :param config: config name: debug, test, production
    :param reload: reload server if changed
    """
    app = create_app(config)
    log = logging.getLogger('xop.main')
    log.info('Starting %s on %s://%s', service_name, app.config['PREFERRED_URL_SCHEME'], app.config['SERVER_NAME'])
    app.run(host='127.0.0.1', port=app.config['PORT'], use_reloader=reload)


if __name__ == '__main__':

    parser = argparse.ArgumentParser(description=service_name, allow_abbrev=False)
    parser.add_argument('--config', default='debug', help='load config: [debug, test, production] (default "debug")')
    parser.add_argument('--reload', action='store_true', help='reload server if changed (default False)')
    args = parser.parse_args()
    runserver(args.config, args.reload)
