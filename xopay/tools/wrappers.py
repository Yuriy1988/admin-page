# -*- coding: utf-8 -*-
""" Wrappers for api requests """
from flask import make_response, jsonify
from xopay import api

__author__ = 'Kostel Serhii'


@api.representation('application/json')
def output_json(data, code, headers=None):
    """
    Use jsonify function for API response serialization
    :param data: the data to be represented in the response body
    :param code: the http status code
    :param headers: a dictionary of headers
    """
    resp = make_response(jsonify(data), code)
    resp.headers.extend(headers or {})
    return resp
