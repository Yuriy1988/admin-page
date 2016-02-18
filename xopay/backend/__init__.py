# -*- coding: utf-8 -*-
"""
Database backend package.
Contain flask sqlalchemy db object.
Inherit all nested models.
"""
from flask_sqlalchemy import SQLAlchemy

from xopay.tools.json_tools import JsonModelMixin, json_ignore
from .enum import *

__author__ = 'Kostel Serhii'


db = SQLAlchemy()


class Base(db.Model, JsonModelMixin):
    """ Add extra methods to encode SQLAlchemy models into json. """
    __abstract__ = True
