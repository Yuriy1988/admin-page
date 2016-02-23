from marshmallow import Schema as MMSchema, fields, ValidationError
from marshmallow.validate import Validator

__author__ = 'Kostel Serhii'


class Schema(MMSchema):

    def __init__(self, *args, **kwargs):
        partial_nested = kwargs.pop('partial_nested', False)
        super().__init__(*args, **kwargs)
        if partial_nested:
            self._make_partial_nested()

    def _make_partial_nested(self):
        # FIXME: duty hack. Make it right
        for attr_name, value in self.__dict__.items():
            if attr_name[0] != '_' and isinstance(value, fields.Nested):
                setattr(value, 'partial', True)


class Unique(Validator):
    """Validator which succeeds if the value passed to it
    is unique for specified has model field.

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
        if not self.model.check_unique(self.field_name, value):
            raise ValidationError(self._format_error(value, self.message))

        return value
