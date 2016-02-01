from flask import Flask
from flask_sqlalchemy import SQLAlchemy


__author__ = 'Kostel Serhii'

app = Flask(__name__)
app.config.from_object('config')

db = SQLAlchemy(app)

from xopay import mainpage
