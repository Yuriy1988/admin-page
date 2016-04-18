import uuid
import pytz
from datetime import datetime
from collections import defaultdict
from sqlalchemy.inspection import inspect
from flask_sqlalchemy import before_models_committed, models_committed

from api import app, db

__author__ = 'Kostel Serhii'


def _first_level_dict(obj, data):
    if not data:
        return dict()
    return dict((key, value) for key, value in data.items() if hasattr(obj, key) and not isinstance(value, (dict, list)))


class BaseModel(db.Model):
    """ Base model for all models """

    __abstract__ = True

    @classmethod
    def get_pk_field_name(cls):
        """
        Get primary key from model.
        Work ONLY with single primary key!, else raise exception.
        :return: primary key field name
        """
        primary_key_fields = inspect(cls).primary_key
        if len(primary_key_fields) == 0:
            raise AttributeError('Primary key field not fount')
        if len(primary_key_fields) > 1:
            raise AttributeError('Got more than one primary key')

        return primary_key_fields[0].name

    @classmethod
    def unique(cls, field_name, checked_value):
        """
        Check is field unique or not.
        :param field_name: name of the model field to check
        :param checked_value: value to check for unique
        :return: is checked_value unique for field with field_name for current model
        :raise Error: if field with field_name not found in current model
        """
        return cls.query.filter_by(**{field_name: checked_value}).count() == 0

    @classmethod
    def exists(cls, primary_key):
        """
        Check is row with primary key exists.
        Work ONLY with single field primary key, else raise exception.
        :param primary_key: checked primary key value
        :return: boolean value exists or not (True/False)
        """
        pk_field_name = cls.get_pk_field_name()
        return not cls.unique(pk_field_name, primary_key)

    @classmethod
    def create(cls, data, add_to_db=True):
        """
        Create new model on the base of data dict.
        :param data: dict with created fields and values
        :param add_to_db: add updated model to db session or not
        :return: new model instance
        """
        data = _first_level_dict(cls, data)
        model = cls(**data)
        if data and add_to_db:
            db.session.add(model)
        return model

    def update(self, data, add_to_db=True):
        """
        Update model from data dict
        :param data: dict with undated fields and values
        :param add_to_db: add updated model to db session or not
        """
        data = _first_level_dict(self, data)
        for key, value in data.items():
            setattr(self, key, value)
        if data and add_to_db:
            db.session.add(self)


class _EventHandler:
    """
    Class that handel sqlalchemy events.
    """
    _subscribers_store_mapper = {
        'before': defaultdict(list),
        'after': defaultdict(list)
    }

    @classmethod
    def _committed(cls, changes, subscribers_store):
        for model_instance, operation in changes:
            subscribers = subscribers_store.get((model_instance.__class__.__name__, operation))
            if subscribers is not None:
                for subscribe_func in subscribers:
                    subscribe_func(model_instance)

    @classmethod
    def before_committed(cls, sender, changes):
        cls._committed(changes, cls._subscribers_store_mapper.get('before'))

    @classmethod
    def after_committed(cls, sender, changes):
        cls._committed(changes, cls._subscribers_store_mapper.get('after'))

    @classmethod
    def register(cls, model_class, event_type, subscribe_func):
        committed_status, _, operation = event_type.partition('_')
        subscribers_store = cls._subscribers_store_mapper.get(committed_status)
        if subscribers_store is not None:
            subscribers_store[(model_class.__name__, operation)].append(subscribe_func)

before_models_committed.connect(_EventHandler.before_committed, sender=app)
models_committed.connect(_EventHandler.after_committed, sender=app)


def on_model_event(model_class, event_type):
    """
    On database event decorator.
    Subscribe function with database model class to specified event.
    Parameter "event_type" is combination of before/after prefix
    and insert/update/delete suffix connect by "_" symbol.
    Prefix:
      - before - before_commit
      - after - after_commit
    Suffix:
      - insert - create model
      - update - update model
      - delete - delete model

    :param object model_class: database class model
    :param str event_type: event type (e.g. before_insert, after_delete)
    """
    def register_event_subscribe_func(func):
        _EventHandler.register(model_class, event_type, func)
        return func
    return register_event_subscribe_func


# functions for fields default

def uuid_id():
    return str(uuid.uuid4())


def now_dt():
    return datetime.now(tz=pytz.utc)
