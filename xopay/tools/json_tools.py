from datetime import datetime
from flask import json
from sqlalchemy.inspection import inspect
from sqlalchemy.orm import RelationshipProperty, ColumnProperty

__author__ = 'Kostel Serhii'

DATE_TIME_FORMAT = "%Y-%m-%dT%H:%M:%S%z"


class JSONModelEncoder(json.JSONEncoder):
    """
    Json encoder to jsonify datetime and
    sqlalchemy models with specified and excluded fields.
    """

    def default(self, obj):
        """
        Method, that json decode called, when can not serialize object
        :param: obj: object to encode into json
        :return: encoded obj as dict
        """

        # Datetime object
        if isinstance(obj, datetime):
            return self._encode_datetime(obj)

        # Database model object
        return self._filter_none(self._encode_model(obj))

    @staticmethod
    def _filter_none(dict_obj):
        """ Remove none values from dict """
        return dict((k, v) for k, v in dict_obj.items() if v is not None)

    @staticmethod
    def _encode_datetime(obj, dt_format=DATE_TIME_FORMAT):
        """
        Serialize string with datetime in dt_format
        :param obj: datetime instance
        :param dt_format: datetime format
        :return: datetime string
        :exception TypeError: datetime object without timezone
        """
        if not obj.tzinfo:
            raise TypeError('Forbidden to use the datetime without time zone')
        return obj.strftime(dt_format)

    def _encode_model(self, obj):
        """
        Encode object value
        :param obj: object instance
        :return: serialized object as dict
        """

        # JSON dict method
        if hasattr(obj, 'json_dict') and callable(obj.json_dict):
            json_res = obj.json_dict()
            # continue if None
            if json_res is not None:
                return json_res

        # SQLAlchemy ORM model
        if hasattr(obj, '__table__'):
            return self._encode_table(obj)

        # Object type (Class)
        if hasattr(obj, '__dict__'):
            return self._encode_object(obj)

        # Default
        return json.JSONEncoder.default(self, obj)

    @staticmethod
    def _encode_object(obj):
        return dict((key, value) for key, value in obj.__dict__.items() if key[0] != '_')

    def _encode_table(self, obj):
        """
        Serialize the SQLAlchemy table into JSON.
        Get and than clean json fields and json exclude fields.
        One to one fields serialized recursively.
        :param obj: SQLAlchemy model instance
        :return: serialized sqlalchemy model as dict
        """
        # read specified and excluded fields
        specified_fields = getattr(obj, '_json_fields', None)
        excluded_fields = getattr(obj, '_json_exclude', None)
        if specified_fields and excluded_fields:
            raise AttributeError('Only one of json_fields or json_exclude must be set')
        # forget after first use
        setattr(obj, '_json_fields', None)
        setattr(obj, '_json_exclude', None)

        model = inspect(obj).class_
        columns, one_to_one, one_to_many, foreign_keys = self._get_fields_for_model(model)

        if specified_fields is not None:
            columns = columns.intersection(specified_fields)
            _first_level_field = set(f.split('.')[0] for f in specified_fields)
            one_to_one = one_to_one.intersection(_first_level_field)

        if excluded_fields is not None:
            columns = columns.difference(excluded_fields)
            one_to_one = one_to_one.difference(excluded_fields)

        model_dict = dict((f, getattr(obj, f, None)) for f in columns)

        # exclude id and current table from one to one fields
        oto_extra_exclude = {'id', model.__tablename__}

        for f in one_to_one:
            value = getattr(obj, f, None)
            if value is None: continue

            # filter sub tables
            one_to_one_sub_specified = self._fields_slice(specified_fields, f)
            if one_to_one_sub_specified:
                value.json_fields(one_to_one_sub_specified.difference(oto_extra_exclude))

            one_to_one_sub_exclude = self._fields_slice(excluded_fields, f)
            if one_to_one_sub_exclude:
                value.json_exclude(one_to_one_sub_exclude | oto_extra_exclude)

            if not one_to_one_sub_specified and not one_to_one_sub_exclude:
                value.json_exclude(oto_extra_exclude)

            value_dict = self.default(value)
            if not value_dict: continue
            model_dict[f] = value_dict

        # NOTE: Do not serialize one to many fields now

        return model_dict

    @staticmethod
    def _fields_slice(fields, prefix):
        """
        Slice fields set by prefix.
        Example: {'name', 'child.id', 'child.email'}, 'child' -> {'id', 'email'}
        :return: filtered fields set
        """
        prefix += '.'
        return set(f.replace(prefix, '') for f in fields if f.startswith(prefix)) if fields else None

    @staticmethod
    def _get_fields_for_model(model):
        """
        From model get fields names and divide it into groups
        :param model: sqlalchemy model for research
        :return: columns, one_to_one, one_to_many, foreign_keys sets
        """
        columns, one_to_one, one_to_many, foreign_keys = set(), set(), set(), set()

        for field in model._sa_class_manager:
            prop = getattr(model, field).property

            # related field
            if isinstance(prop, RelationshipProperty):
                if prop.uselist:
                    one_to_many.add(field)
                else:
                    one_to_one.add(field)

            # column field
            elif isinstance(prop, ColumnProperty):
                column_obj = model.__table__.c[field]

                # ignore Columns, wrapped with json_ignore function
                if getattr(column_obj, '_json_ignore', False):
                    continue

                # separate ForeignKey columns and simple Columns.
                if getattr(column_obj, 'foreign_keys'):     # foreign keys is not empty set
                    foreign_keys.add(field)
                else:
                    columns.add(field)

        return columns, one_to_one, one_to_many, foreign_keys


def json_ignore(obj):
    """
    Wrapper for model field to disable json serialization.
    Sets the _json_ignore attribute to True and returns the object.
    Used in JSONModelEncoder serialization.
    :param obj: json ignorable object
    :return: obj with extra _json_ignore attribute
    """
    setattr(obj, '_json_ignore', True)
    return obj


class JsonModelMixin:
    """ Database model with JSON serializable methods """

    def json_exclude(self, fields):
        """
        Exclude fields from json serialization.
        Save information into _json_exclude hidden attribute.
        Used in JSONModelEncoder serialization.
        Example:
            SomeModel.json_exclude('id')
            SomeModel.json_exclude(('id', 'password', 'login'))
        :param fields: name of one or many fields (string or iter of strings)
        :exception: TypeError - if fields not str and not iterable
        """
        setattr(self, '_json_exclude', {fields} if type(fields) == str else set(fields))
        return self

    def json_fields(self, fields):
        """
        Specify fields for json serialization.
        Save information into _json_fields hidden attribute.
        Used in JSONModelEncoder serialization.
        Example:
            SomeModel.json_fields('username')
            SomeModel.json_fields(('username', 'email', 'id'))
        :param fields: name of one or many fields (string or iter of strings)
        :exception: TypeError - if fields not str and not iterable
        """
        setattr(self, '_json_fields', {fields} if type(fields) == str else set(fields))
        return self

    def json_dict(self):
        """
        Overwrite this method if you need convert model to json dict manually.
        Used in JSONModelEncoder serialization.
        :return: model serialized dict or None for serialization by default
        """
        return None

    def as_dict(self):
        """
        Serialize model as dict. Use JSONModelEncoder for this purpose.
        """
        return JSONModelEncoder().default(self)
