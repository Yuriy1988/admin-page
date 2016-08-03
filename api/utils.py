import os
import logging
import random
import string
import pika
import requests
import pytz
from datetime import datetime
from requests import exceptions
from pika import exceptions as mq_err
from flask import g, request, json, url_for, current_app as app
from werkzeug.utils import secure_filename

from api import errors, auth, after_app_created, api_v1

__author__ = 'Kostel Serhii'


_log = logging.getLogger('xop.utils')


# Queue

def _get_queue_connection_parameters():
    """
    Return pika connection parameters object.
    """
    return pika.ConnectionParameters(
        host=app.config["QUEUE_HOST"],
        port=app.config["QUEUE_PORT"],
        virtual_host=app.config["QUEUE_VIRTUAL_HOST"],
        credentials=pika.credentials.PlainCredentials(
            username=app.config["QUEUE_USERNAME"],
            password=app.config["QUEUE_PASSWORD"],
        )
    )


def push_to_queue(queue_name, body_json):
    """
    Open connection with queue,
    declare (pass if already declared) queue name and
    publish body message.

    Declare params:
        durable = True - restore messages after broker reboot
        exclusive = False - multiple connections
        auto_delete = False - do not delete after consumer cancels or disconnects

    Publish properties params:
        delivery_mode = 2 - make message persistent

    :param str queue_name: queue name
    :param dict body_json: message to push in queue
    """
    body = json.dumps(body_json)
    params = _get_queue_connection_parameters()
    publish_properties = pika.BasicProperties(content_type='text/plain', delivery_mode=2)

    try:

        with pika.BlockingConnection(params) as connection:
            channel = connection.channel()
            channel.queue_declare(queue=queue_name, durable=True, exclusive=False, auto_delete=False)
            channel.basic_publish(exchange='', routing_key=queue_name, body=body, properties=publish_properties)

    except mq_err.AMQPConnectionError as err:
        raise errors.ServiceUnavailableError('Queue error: %s' % err)
    except (mq_err.AMQPChannelError, mq_err.AMQPError) as err:
        raise errors.InternalServerError('Queue error: %s' % err)


# Client service

def client_server_get_request(url, **params):
    """
    Make request to admin server and return response.
    :param url: url (without base prefix) to admin server
    :param params: url parameters
    :return: response as dict or raise exception
    """
    full_url = app.config["CLIENT_API_URL"] + url
    headers = {"Authorization": "Bearer %s" % auth.get_system_token()}

    try:
        response = requests.get(full_url, params=params, headers=headers, timeout=5)
    except exceptions.Timeout:
        raise errors.ServiceUnavailableError('The client server connection timeout.')
    except exceptions.ConnectionError:
        raise errors.ServiceUnavailableError('The client server connection error.')
    except exceptions.RequestException:
        raise errors.InternalServerError('The client server request error.')

    return response


# Notify service

def _send_notify(queue_name, body_json):
    """
    Send notification task to the Notify Service through the queue.
    :param queue_name: notification queue name
    :param dict body_json: notification body json
    """
    _log.info("Send notification to queue [%s]", queue_name)
    try:
        push_to_queue(queue_name, body_json)
    except Exception as err:
        # Notification error should not crash task execution
        _log.error("Notification service is unavailable now: %s", err)


def send_email(email_address, subject, message):
    """
    Send email notification.
    :param str email_address: email address
    :param str subject: email subject
    :param str message: email main message
    """
    _send_notify(app.config['QUEUE_EMAIL'], {'email_to': email_address, 'subject': subject, 'text': message})


def send_sms(phone_number, message):
    """
    Send sms notification.
    :param str phone_number: phone number
    :param str message: sms message
    """
    _send_notify(app.config['QUEUE_SMS'], {'phone': phone_number, 'text': message})


def send_invite_to_user_by_email(user_model, invite_token):
    """
    Create invite token and message and send to user email
    :param user_model: user model
    :param invite_token: unique invite token for user
    """
    invite_url = app.config['SERVER_URL'] + url_for('api_v1.user_create_password', token=invite_token)

    add_track_extra_info({'invite_url': invite_url})

    subject = 'XOPay Payment System Registration'
    invite_msg = '''
        Dear {user_name}, you have been invited to manage XOPay Payment System.
        To continue registration and set your account password click by this url {invite_url}.

        Skip this letter if your do not registered into XOPay Payment System.
    '''
    invite_msg = invite_msg.format(user_name=user_model.get_full_name(), invite_url=invite_url)

    send_email(user_model.email, subject=subject, message=invite_msg)


def add_track_extra_info(extra_info):
    """
    Add extra information into track extra info storage.
    :param dict extra_info: dict with extra information to track
    """
    if 'track_extra_info' not in g:
        g.track_extra_info = {}
    g.track_extra_info.update(extra_info)


@after_app_created
def register_request_notifier(app):
    """
    Register request notifier.
    :param app: Flask application
    """
    if not app.config.get('AFTER_REQUEST_TRACK_ENABLE'):
        return

    service_name = app.config['SERVICE_NAME']
    queue_request = app.config['QUEUE_REQUEST']

    filtered_headers = ['HTTP_USER_AGENT', 'CONTENT_LENGTH', 'CONTENT_TYPE']

    @api_v1.after_request
    def track_request(response):
        """
        After every request send information to the notify queue
        to monitor and send alerts depending on the request information.
        :param response: request response
        """
        request_detail = dict(
            service_name=service_name,

            query=dict(
                timestamp=datetime.now(tz=pytz.utc),
                path=request.full_path if request.query_string else request.path,
                method=request.method,
                status_code=response.status_code,
                remote_address=request.remote_addr,
                view_args=request.view_args,
                headers={k: v for k, v in request.headers.environ.items() if k in filtered_headers},
            ),

            user=dict(
                id=g.get('user_id'),
                name=g.get('user_name'),
                ip_addr=g.get('user_ip_addr'),
                groups=g.get('groups'),
            ),

            extra=g.get('track_extra_info', {})
        )

        _send_notify(queue_request, request_detail)

        return response


# Media files

def upload_media_file(allowed_extensions, upload_subdir):
    """
    Upload file from request and return link to this file.

    :param set allowed_extensions: Extensions, that enabled to upload (e.g. {'png', 'jpg', 'jpeg'})
    :param str upload_subdir: subdir in media folder where file will be saved (e.g. '/store/logo')
    :return: link url to uploaded file (e.g. /static/admin/media/store/logo/qksdnfa863fih.png)
    """
    file = request.files['file']
    if not (file and file.filename):
        raise errors.ValidationError('Uploaded file missing')

    filename = secure_filename(file.filename)
    filename, extension = os.path.splitext(filename)
    if extension[1:] not in allowed_extensions:
        err_msg = 'File extension must be one of: {extensions}'.format(extensions=', '.join(allowed_extensions))
        raise errors.ValidationError(err_msg)

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
