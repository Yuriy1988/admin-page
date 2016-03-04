#!../venv/bin/python
import smtplib

from config import *
from parsers import *
from db import Currency, get_db_sesion


def send_email(email_from, email_to, subject, text):
    with smtplib.SMTP(MAIL_SERVER) as server:
        server.starttls()
        server.login(MAIL_USERNAME, MAIL_PASSWORD)
        header = "From:{}\nSubject:{}\n\n".format(email_from, subject)
        server.sendmail(email_from, email_to, header + text)


def format_currency(currency_dict):
    return '{base_ccy}/{ccy}:\t {buy}\t {sale}'.format(**currency_dict)


if __name__ == '__main__':
    try:
        parsers = {
            "Alpha bank": parse_alphabank,
            "Privat bank": parse_privat24,
            # add new source here (function that return list of currency dictionaries)
        }

        # update currency values
        exchange_rates = []
        update_errors = []
        for source_name, parser_func in parsers.items():
            rates = parser_func()
            if rates:
                exchange_rates.extend(rates)
            else:
                update_errors.append("Update from {source} failed.".format(source=source_name))

        session = get_db_sesion()
        for exchange_rate in exchange_rates:
            session.add(Currency(**exchange_rate))
        session.commit()

        # send email notification to admin
        message = MAIL_MESSAGE_TEMPLATE.format(
            rates="\n".join(map(format_currency, exchange_rates)),
            update_errors="\n".join(update_errors),
            date_time=exchange_rates[0].get("commit_time"),
        )
    except Exception as ex:
        message = MAIL_ERROR_MESSAGE.format(msg=ex)

    send_email(DEFAULT_MAIL_SENDER, ADMIN_EMAIL, MAIL_SUBJECT, message)
