from flask import Flask

__author__ = 'Kostel Serhii'

app = Flask(__name__)
app.config.from_object('config')

from xopay import mainpage
