# -*- coding: utf-8 -*-

from flask_sqlalchemy import SQLAlchemy

__author__ = 'Kostel Serhii'


db = SQLAlchemy()


class BaseModel(db.Model):
    """ Base model for all models """
    __abstract__ = True
