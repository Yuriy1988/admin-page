# -*- coding: utf-8 -*-
from marshmallow import fields
from marshmallow.validate import Length, OneOf, Regexp

from xopay.shema import Schema, Unique
from xopay.backend import enum
from xopay.users.models import User

__author__ = 'Kostel Serhii'


class UserSchema(Schema):

    id = fields.Int(dump_only=True)
    username = fields.Str(required=True, validate=(Length(max=80), Unique(User, 'username')))

    first_name = fields.Str(validate=Length(max=80))
    last_name = fields.Str(validate=Length(max=80))

    email = fields.Email()
    phone = fields.Str(validate=Regexp('^[1-9]{1}[0-9]{3,14}$'))
    notify = fields.Str(validate=OneOf(enum.USER_NOTIFY_ENUM))

    enabled = fields.Bool(required=True, default=False)


if __name__ == '__main__':

    from flask import Flask
    from xopay import db

    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite://'
    db.init_app(app)

    with app.app_context():
        db.drop_all()
        db.create_all()

        user1 = User(username='Jon Dou', notify=None, email='was@das.du')
        user2 = User(username='Jhon Lenon', notify=None, email='len@onbe.usa')

        db.session.add(user1)
        db.session.add(user2)
        db.session.commit()

        schema = UserSchema(only=('id', 'username'), many=True)
        result = schema.dumps(User.query.all())

        print(result.data)
