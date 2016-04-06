from flask import redirect, url_for
from api import app

__author__ = 'Kostel Serhii'


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
