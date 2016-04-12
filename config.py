import os

DEBUG = True

BASE_FOLDER = os.path.abspath(os.path.dirname(__file__))
STATIC_FOLDER = os.path.join(BASE_FOLDER, 'frontend', 'static')

# Upload
MAX_CONTENT_LENGTH = 4 * 1024 * 1024
UPLOAD_BASE_FOLDER = os.path.join(STATIC_FOLDER, 'admin', 'media')
UPLOAD_BASE_URL = '/static/admin/media'

# Define the database
SQLALCHEMY_DATABASE_URI = 'postgresql://xopadmin:UC4EhhQ6HkwNn7qK@localhost/xopadmindb'
SQLALCHEMY_TRACK_MODIFICATIONS = True

CSRF_ENABLED = True
CSRF_SESSION_KEY = "mhe=d4#2xvb1348j%m+sn0d8ssdbjv18yi+f_w#&yd!+&4ic4)"

SECRET_KEY = "ugGB0uH1cJTW=1L9Vs|8roMlFfFgsWD%NA|*WBpYQ3Uytr-6rImVk2Rp%BJ+"
