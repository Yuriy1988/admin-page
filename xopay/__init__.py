# -*- coding: utf-8 -*-

from flask import Flask
from flask.ext.login import LoginManager

from xopay.backend import db
from xopay.tools import json_tools
from config import STATIC_FOLDER

__author__ = 'Kostel Serhii'

app = Flask(__name__, static_folder=STATIC_FOLDER)
app.config.from_object('config')
app.json_encoder = json_tools.JSONModelEncoder

db.init_app(app)

lm = LoginManager()
lm.init_app(app)
lm.login_view = 'login'

import xopay.admin_page
import xopay.merchants.handlers
