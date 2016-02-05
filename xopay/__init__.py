from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask.ext.login import LoginManager


__author__ = 'Kostel Serhii'

app = Flask(__name__)
app.config.from_object('config')

lm = LoginManager()
lm.init_app(app)
lm.login_view = 'login'

db = SQLAlchemy(app)


from xopay import mainpage
from xopay.users import views
