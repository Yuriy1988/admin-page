import os
from datetime import timedelta

DEBUG = True

BASE_FOLDER = os.path.abspath(os.path.dirname(__file__))
STATIC_FOLDER = os.path.join(BASE_FOLDER, 'frontend', 'static')

# FIXME: uncomment after config update (for full invite url)
# SERVER_NAME = 'xopay.digitaloutlooks.com'

LOG_BASE_NAME = 'xop'
LOG_FORMAT = 'ADMIN  | %(levelname)-6.6s | %(name)-15.15s | %(asctime)s | %(message)s'
LOG_DATE_FORMAT = '%d.%m %H:%M:%S'

LOG_ROOT_LEVEL = 'DEBUG'
LOG_LEVEL = 'DEBUG'

# Upload
MAX_CONTENT_LENGTH = 4 * 1024 * 1024
MEDIA_BASE_FOLDER = os.path.join(BASE_FOLDER, 'media', 'admin')
MEDIA_BASE_URL = '/media/admin'

# Define the database
SQLALCHEMY_DATABASE_URI = 'postgresql://xopadmin:UC4EhhQ6HkwNn7qK@localhost/xopadmindb'
SQLALCHEMY_TRACK_MODIFICATIONS = True

CSRF_ENABLED = True
CSRF_SESSION_KEY = "mhe=d4#2xvb1348j%m+sn0d8ssdbjv18yi+f_w#&yd!+&4ic4)"

SECRET_KEY = "ugGB0uH1cJTW=1L9Vs|8roMlFfFgsWD%NA|*WBpYQ3Uytr-6rImVk2Rp%BJ+"

# TODO: generate AUTH_KEY for production and copy to every service
AUTH_ALGORITHM = 'HS512'
AUTH_KEY = 'PzYs2qLh}2$8uUJbBnWB800iYKe5xdYqItRNo7@38yW@tPDVAX}EV5V31*ZK78QS'

AUTH_TOKEN_LIFE_TIME = timedelta(minutes=30)
AUTH_SESSION_LIFE_TIME = timedelta(hours=24)
AUTH_INVITE_LIFE_TIME = timedelta(days=3)

AUTH_SYSTEM_USER_ID = 'xopay.admin'

CLIENT_API_URL = 'http://127.0.0.1:7254/api/client/dev'

# Queue:
QUEUE_HOST = '0.0.0.0'
QUEUE_PORT = 5672
QUEUE_USERNAME = 'xopay_rabbit'
QUEUE_PASSWORD = '5lf01xiOFwyMLvQrkzz7'
QUEUE_VIRTUAL_HOST = '/xopay'

QUEUE_EMAIL = 'notify_email'
QUEUE_SMS = 'notify_sms'
