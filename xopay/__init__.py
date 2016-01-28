from flask import Flask

__author__ = 'Kostel Serhii'

app = Flask(__name__)
app.config.from_pyfile('config.py')

from xopay.mainpage import view
