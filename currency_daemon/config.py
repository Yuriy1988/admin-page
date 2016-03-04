import os

BASE_FOLDER = os.path.abspath(os.path.dirname(__file__))

# db path
SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(BASE_FOLDER, '..', 'xopay.db')


# mail settings TODO: unhardcode SMTP settings
MAIL_SERVER = "smtp.gmail.com"
MAIL_USERNAME = "daniel.omelchenko@digitaloutlooks.com"
MAIL_PASSWORD = "Po03yeFGd54c9jHq"
DEFAULT_MAIL_SENDER = "daniel.omelchenko@digitaloutlooks.com"


# TODO: unhardcode admin email
ADMIN_EMAIL = "dpixelstudio@gmail.com"


# message config
MAIL_SUBJECT = "XOPAY. Exchange rates update."
MAIL_MESSAGE_TEMPLATE = """
Exchange rates was successfully updated.

{rates}

Commit time (UTC): {date_time}

{update_errors}
"""
MAIL_ERROR_MESSAGE = "ERROR: {msg}"
