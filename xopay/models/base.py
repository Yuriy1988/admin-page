from sqlalchemy.inspection import inspect

from xopay import db

__author__ = 'Kostel Serhii'


def _first_level_dict(obj, data):
    return dict((key, value) for key, value in data.items() if hasattr(obj, key) and not isinstance(value, dict)) \
        if data else dict()


class BaseModel(db.Model):
    """ Base model for all models """

    __abstract__ = True

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
        primary_key_fields = inspect(cls).primary_key
        if len(primary_key_fields) == 0:
            raise AttributeError('Primary key field not fount')
        if len(primary_key_fields) > 1:
            raise AttributeError('Can not check exists ')

        pk_field_name = primary_key_fields[0].name
        return cls.unique(pk_field_name, primary_key)

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
