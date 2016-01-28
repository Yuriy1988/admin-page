# -*- coding: utf-8 -*-
from flask import Flask, render_template

from xopay import app

__author__ = 'Kostel Serhii'


@app.route('/')
def main_page():
    """ Return main page for xopay admin. """
    return "Hello, World!"
