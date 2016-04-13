import os
import random
import string
from flask import request
from werkzeug.utils import secure_filename

from api import app
from api.errors import ValidationError

__author__ = 'Kostel Serhii'


def upload_media_file(allowed_extensions, upload_subdir):
    """
    Upload file from request and return link to this file.

    :param set allowed_extensions: Extensions, that enabled to upload (e.g. {'png', 'jpg', 'jpeg'})
    :param str upload_subdir: subdir in media folder where file will be saved (e.g. '/store/logo')
    :return: link url to uploaded file (e.g. /static/admin/media/store/logo/qksdnfa863fih.png)
    """
    file = request.files['file']
    if not (file and file.filename):
        raise ValidationError('Uploaded file missing')

    filename = secure_filename(file.filename)
    filename, extension = os.path.splitext(filename)
    if extension[1:] not in allowed_extensions:
        err_msg = 'File extension must be one of: {extensions}'.format(extensions=', '.join(allowed_extensions))
        raise ValidationError(err_msg)

    upload_file_dir = os.path.join(app.config['MEDIA_BASE_FOLDER'], upload_subdir)
    os.makedirs(upload_file_dir, exist_ok=True)

    new_filename = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(64)) + extension
    upload_file_path = os.path.join(upload_file_dir, new_filename)
    file.save(upload_file_path)

    media_link_url = upload_file_path.replace(app.config['MEDIA_BASE_FOLDER'], app.config['MEDIA_BASE_URL'])
    return media_link_url


def remove_media_file(media_link_url):
    """
    Remove media file by url.

    :param media_link_url: local media file url
    :return True/False - removed or not
    """
    if not media_link_url.startswith(app.config['MEDIA_BASE_URL']):
        return False

    media_file_path = media_link_url.replace(app.config['MEDIA_BASE_URL'], app.config['MEDIA_BASE_FOLDER'])
    try:
        os.remove(media_file_path)
    except OSError:
        return False

    return True
