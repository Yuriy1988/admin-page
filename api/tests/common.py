from copy import deepcopy

from api.tests import base
from api.schemas.base import deep_diff

__author__ = 'Kostel Serhii'


class TestDeepDiffFunction(base.BaseTestCase):

    def test_flat_new(self):
        new = dict(zip('abcdef', range(6)))
        self.assertDictEqual(deep_diff(new, {}), new)

    def test_flat_diff(self):
        previous = dict(zip('abcdef', range(6)))
        new = deepcopy(previous)
        changes = {'a': 99, 'f': 100} 
        new.update(changes)
        self.assertDictEqual(deep_diff(new, previous), changes)

    def test_nested_not_change(self):
        previous = dict(zip('abcdef', range(6)))
        previous['a'] = dict(zip('abcdef', range(6)))
        new = deepcopy(previous)
        self.assertDictEqual(deep_diff(new, previous), {})

    def test_nested_diff(self):
        previous = dict(zip('abcdef', range(6)))
        previous['a'] = dict(zip('abcdef', range(6)))
        new = deepcopy(previous)
        new['b'] = 84
        new['a']['a'] = 42
        new['a']['f'] = 21
        self.assertDictEqual(deep_diff(new, previous), {'b': 84, 'a': {'a': 42, 'f': 21}})
    
    def test_deep_nested_new(self):
        new = dict(zip('abcdef', range(6)))
        new['a'] = dict(zip('abcdef', range(6)))
        new['a']['a'] = dict(zip('abcdef', range(6)))
        self.assertDictEqual(deep_diff(new, {}), new)

    def test_deep_nested_not_change(self):
        previous = dict(zip('abcdef', range(6)))
        previous['a'] = dict(zip('abcdef', range(6)))
        previous['a']['a'] = dict(zip('abcdef', range(6)))
        new = deepcopy(previous)
        self.assertDictEqual(deep_diff(new, previous), {})
    
    def test_deep_nested_diff(self):
        previous = dict(zip('abcdef', range(6)))
        previous['a'] = dict(zip('abcdef', range(6)))
        previous['a']['a'] = dict(zip('abcdef', range(6)))
        new = deepcopy(previous)
        new['b'] = 84
        new['a']['d'] = 42
        new['a']['a']['e'] = 123
        self.assertDictEqual(deep_diff(new, previous), {'b': 84, 'a': {'d': 42, 'a': {'e': 123}}})
    
    def test_diff_with_list(self):
        previous = dict(zip('abcdef', range(6)))
        previous['a'] = dict(zip('abcdef', range(6)))
        previous['a']['a'] = dict(zip('abcdef', range(6)))
        previous['e'] = list(range(5))
        new = deepcopy(previous)
        new['b'] = 84
        self.assertDictEqual(deep_diff(new, previous), {'b': 84, 'e': list(range(5))})
