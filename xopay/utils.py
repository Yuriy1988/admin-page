import io
import pprint
import decimal
from flask import json


class MyJSONEncoder(json.JSONEncoder):

    def default(self, obj):
        if isinstance(obj, decimal.Decimal):
            # Convert decimal instances to strings.
            return str(obj)
        return super(MyJSONEncoder, self).default(obj)


def prettify(obj, depth=10):
    """"
    Return formatted string representation of Python object.
    :param obj: python object.
    :param depth: depth of recursive iteration of python object structure.
    """
    string = io.StringIO()
    pprint.pprint(obj, depth=depth, stream=string)
    return str(string.getvalue())
