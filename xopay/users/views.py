from flask import Flask, session, request, flash, url_for, redirect, render_template, abort, g
from flask.ext.login import login_user, logout_user, current_user, login_required

from xopay import app, db, lm
# from forms import LoginForm
from .models import User
from xopay.merchants.models import Merchant, Manager


@lm.user_loader
def load_user(id):
    return User.query.get(int(id))


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        return render_template('register.html')
    registered_user = User.query.filter_by(username=request.form['username']).first()
    if registered_user is None:
        user = User(username=request.form['username'],
                    email=request.form['email'],
                    last_name=request.form['last_name'],
                    first_name=request.form['first_name'],
                    phone=request.form['phone'],
                    notify=request.form['notify']
                    )
        user.hash_password(request.form['password'])
        db.session.add(user)
        db.session.commit()
        flash('User successfully registered')
        return redirect(url_for('login'))
    else:
        pass

@app.route('/login', methods=['GET', 'POST'])
def login():
    # print(g.user.is_authenticated())
    if request.method == 'GET':
        return render_template('login.html')

    username = request.form['username']
    password = request.form['password']
    remember_me = False
    if 'remember_me' in request.form:
        remember_me = True
    registered_user = User.query.filter_by(username=username).first()
    if registered_user is None or not registered_user.verify_password(password):
        flash('Username or Password is invalid', 'error')
        return redirect(url_for('login'))
    login_user(registered_user, remember=remember_me)
    flash('Logged in successfully')
    return redirect(request.args.get('next') or url_for('main_page'))


@app.route('/logout')
def logout():
    logout_user()
    flash('You logout')
    return redirect(url_for('main_page'))

@app.before_request
def before_request():
    g.user = current_user


# @app.route('/login', methods=['GET', 'POST'])
# def login():
#     # Here we use a class of some kind to represent and validate our
#     # client-side form data. For example, WTForms is a library that will
#     # handle this for us, and we use a custom LoginForm to validate.
#     form = LoginForm()
#     if form.validate_on_submit():
#         # Login and validate the user.
#         # user should be an instance of your `User` class
#         login_user(user)
#
#         flask.flash('Logged in successfully.')
#
#         next = flask.request.args.get('next')
#         # next_is_valid should check if the user has valid
#         # permission to access the `next` url
#         if not next_is_valid(next):
#             return flask.abort(400)
#
#         return flask.redirect(next or flask.url_for('index'))
#     return flask.render_template('login.html', form=form)
