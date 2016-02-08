# -*- coding: utf-8 -*-
from flask import Flask, render_template

from xopay import app

__author__ = 'Kostel Serhii'


@app.route('/old')
def old_page():
    """ Return main page for xopay admin. """
    return app.send_static_file('old/index.html')

@app.route('/')
def main_page():
    """ Return edited main page for xopay admin. """
    return app.send_static_file('index.html')
