"""
Decorators to autofill some handlers arguments and
limit access to handlers depending of the related objects.
"""
from functools import wraps
from inspect import signature
from flask import g

from api import db, errors, models

__author__ = 'Kostel Serhii'


def _model_id_str_to_model_obj(model_snake_name):
    components = model_snake_name.split('_')
    model_name = ''.join(x.title() for x in components)
    return getattr(models, model_name, None)


def autofill_id(handler_method):
    """
    Autofill Model id decorator.
    Create decorator, that try to fill Model id
    in the decorated handler function with the use of auth user_id information.
    Guess model name from handler request parameters name.
    :param handler_method: decorated handler method
    """
    handler_signature = signature(handler_method)
    default_parameters = [(p.name, p.default) for p in handler_signature.parameters.values()]

    @wraps(handler_method)
    def _wrapped_handler(*args, **kwargs):
        bound_params = handler_signature.bind(*args, **kwargs)
        bound_params.apply_defaults()
        params = list(bound_params.arguments.items()) or default_parameters

        for param_name, param_value in params:
            if not param_name.endswith('_id') or param_value:
                continue
            model = _model_id_str_to_model_obj(param_name[:-3])
            if not model:
                continue

            model_id = db.session.\
                query(getattr(model, 'id')).\
                join(models.User).\
                filter(models.User.id == g.user_id).\
                first()

            bound_params.arguments[param_name] = model_id[0] if model_id else param_value

        return handler_method(*bound_params.args, **bound_params.kwargs)

    return _wrapped_handler


def owner_access_only(handler_method):
    """
    Decorator that limit access for user,
    that does not connected to the requested model.
    Guess model name from handler method arguments.

    :param handler_method: decorated handler method
    """
    handler_signature = signature(handler_method)

    @wraps(handler_method)
    def _wrapped_handler(*args, **kwargs):

        if {'admin', 'system'} & set(g.groups):
            pass
        else:
            bound_params = handler_signature.bind(*args, **kwargs)

            for param_name, param_value in bound_params.arguments.items():
                if not param_name.endswith('_id'):
                    continue
                model = _model_id_str_to_model_obj(param_name[:-3])
                if not model:
                    continue

                query = model.query.filter(getattr(model, 'id') == param_value)

                if 'merchant' in g.groups:
                    query = query.join(models.Merchant)

                elif 'manager' in g.groups:
                    if model == models.Store:
                        query = query.join(models.ManagerStore)
                    query = query.join(models.Manager)

                query = query.join(models.User).filter(models.User.id == g.user_id)

                if query.count() == 0:
                    raise errors.ForbiddenError('Forbidden for such user')

        return handler_method(*args, **kwargs)

    return _wrapped_handler
