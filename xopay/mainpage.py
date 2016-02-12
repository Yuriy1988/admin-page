# -*- coding: utf-8 -*-
from flask import Flask, render_template

from xopay import app

__author__ = 'Kostel Serhii'


#@app.route('/old')
def old_page():
    """ Return main page for xopay admin. """
    return app.send_static_file('old/index.html')

@app.route('/admin/')
@app.route('/admin/<path:path>')
def main_page(path=None):
    """ Return edited main page for xopay admin. """
    print(path)
    return app.send_static_file('index.html')