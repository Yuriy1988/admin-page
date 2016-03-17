from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask.ext.login import LoginManager

from config import STATIC_FOLDER
from xopay.utils import MyJSONEncoder

__author__ = 'Kostel Serhii'

app = Flask(__name__, static_folder=STATIC_FOLDER)
app.config.from_object('config')
app.json_encoder = MyJSONEncoder

db = SQLAlchemy(app)

lm = LoginManager()
lm.init_app(app)
lm.login_view = 'login'

import xopay.admin_page
import xopay.handlers
