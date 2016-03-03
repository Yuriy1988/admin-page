import smtplib

from xopay import db
from xopay.currency.parsers import *
import config


def send_email(email_from, email_to, subject, text):
    with smtplib.SMTP(config.MAIL_SERVER) as server:
        server.starttls()
        server.login(config.MAIL_USERNAME, config.MAIL_PASSWORD)
        header = "From:{}\nSubject:{}\n\n".format(email_from, subject)
        server.sendmail(email_from, email_to, header + text)


if __name__ == '__main__':

    # update currency values
    exchange_rates = parse_alphabank() + parse_privat24()
    for exchange_rate in exchange_rates:
        db.session.add(exchange_rate)
    db.session.commit()

    # send email notification to admin
    if exchange_rates:
        message = "Exchange rates was successfully updated.\n\n{rates}\n\nCommit time (UTC): {date_time}".format(
            rates="\n".join(map(str, exchange_rates)),
            date_time=exchange_rates[0].commit_time
        )
    else:
        message = "ERROR: Exchange rates update failed."
    send_email(config.DEFAULT_MAIL_SENDER, config.ADMIN_EMAIL, "XOPAY. Exchange rates update.", message)
