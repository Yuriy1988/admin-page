from itertools import chain
from marshmallow import Schema as _Schema, fields, ValidationError, validates_schema
from marshmallow.validate import Validator as _Validator, Regexp

from api.models import PaymentSystem

__author__ = 'Kostel Serhii'


def deep_diff(new, previous):
    """
    Return dict object, that is different between object and origin.
    Do NOT get diff of the list objects! Just return them.
    :param new: initial dict for deference
    :param previous: original dict, that will be subtracted from initial
    :return: difference dict between initial and origin
    """
    if not previous or not isinstance(new, dict):
        return new

    flat = lambda obj: not isinstance(obj[1], (dict, list))
    initial_flat_pairs, origin_flat_pairs = set(filter(flat, new.items())), set(filter(flat, previous.items()))
    initial_dict_pairs = filter(lambda obj: isinstance(obj[1], dict), new.items())
    initial_list_pairs = filter(lambda obj: isinstance(obj[1], list), new.items())

    recurse_dict_pairs = ((key, deep_diff(value, previous.get(key, {}))) for key, value in initial_dict_pairs)

    diff = dict(chain(initial_flat_pairs - origin_flat_pairs,
                      filter(lambda obj: bool(obj[1]), recurse_dict_pairs),
                      initial_list_pairs))
    return diff


class BaseSchema(_Schema):

    def __init__(self, *args, **kwargs):
        partial_nested = kwargs.pop('partial_nested', False)
        if partial_nested:
            self._make_partial_nested()

        super().__init__(*args, **kwargs)

    def _make_partial_nested(self):
        for field_name, field in self._declared_fields.items():
            if isinstance(field, fields.Nested):
                setattr(field.nested, 'partial', True)

    @validates_schema
    def validate_not_blank(self, data):
        if data is None or not str(data):
            raise ValidationError('Wrong request body or Content-Type header missing')

    def load(self, data, origin_model=None, **kwargs):
        """
        Serialize and validate data json.
        :param data: dict to deserialize
        :param origin_model: model instance of the origin object. If specified, load only changed values.
        :return: UnmarshalResult
        """
        if origin_model:
            # get serialized origin dict from model
            origin = self.dump(origin_model).data
            data = deep_diff(data, origin)

        return super().load(data, **kwargs)


# Validators


class Unique(_Validator):
    """
    Validator which succeeds if the value passed to it is unique for specified model field.

    :param db.Model model: Database model class.
    :param str field_name: Name of the field in model, that will be checked.
    :param str error: Error message to raise in case of a validation error.
    """
    message = 'Field {field_name} must be unique.'

    def __init__(self, model, field_name, error=None):
        self.model = model
        self.field_name = field_name
        self.error = error

    def _repr_args(self):
        return 'model={0}, field_name={1}'.format(self.model, self.field_name)

    def _format_error(self, value, message):
        return (self.error or message).format(input=value, field_name=self.field_name)

    def __call__(self, value):
        if not self.model.unique(self.field_name, value):
            raise ValidationError(self._format_error(value, self.message))

        return value


class Phone(Regexp):

    default_message = 'Wrong phone format.'
    default_regex = '^[1-9]{1}[0-9]{3,14}$'

    def __init__(self, **kwargs):
        regex = kwargs.pop('regex', self.default_regex)
        super().__init__(regex, **kwargs)


class DigitsOnly(Regexp):

    default_message = 'Value must contains only digits.'
    default_regex = '^\d+$'

    def __init__(self, **kwargs):
        regex = kwargs.pop('regex', self.default_regex)
        error = kwargs.pop('error', self.default_message)
        super().__init__(regex, error=error, **kwargs)


class Login(Regexp):
    _login_chars = 'A-Za-z0-9._-'
    default_message = 'Value must contains only {chars} characters.'.format(chars=_login_chars)
    default_regex = '^[%s]*$' % _login_chars

    def __init__(self, **kwargs):
        regex = kwargs.pop('regex', self.default_regex)
        error = kwargs.pop('error', self.default_message)
        super().__init__(regex, error=error, **kwargs)


class AllowedPaySysId(_Validator):
    """
    Validator which succeeds if the paysys_id passed to it is allowed to use.
    """
    message = 'Payment system {paysys_id} is not allowed to use.'

    def __init__(self, error=None):
        self.error = error

    def _format_error(self, value, message):
        return (self.error or message).format(paysys_id=value)

    def __call__(self, value):
        if value not in PaymentSystem.allowed_paysys_id():
            raise ValidationError(self._format_error(value, self.message))

        return value
