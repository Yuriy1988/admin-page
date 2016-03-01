# -*- coding: utf-8 -*-
import requests

from bs4 import BeautifulSoup, CData

from xopay import db
from xopay.models import Currency


def parse_alphabank():

    # Парсим alfabank.ru
    page1 = requests.get("https://alfabank.ru/_/rss/_currency.html")
    soup1 = BeautifulSoup(page1.text, "html.parser")

    for cd in soup1.findAll(text=True):
        if isinstance(cd, CData):
            cd_data = cd.encode('cp1251')

    soup1_1 = BeautifulSoup(cd_data, "html.parser")

    # Получаем соотношение евро к рублю (покупка)
    eur_rur_buy = soup1_1.find(
        'td',
        {'id': 'ЕвроnoncashBuy'}
    ).text.replace(',', '.')

    # Получаем соотношение евро к рублю (продажа)
    eur_rur_sale = soup1_1.find(
        'td',
        {'id': 'ЕвроnoncashSell'}
    ).text.replace(',', '.')

    # Получаем соотношение доллара к рублю (покупка)
    usd_rur_buy = soup1_1.find(
        'td',
        {'id': 'Доллар СШАnoncashBuy'}
    ).text.replace(',', '.')

    # Получаем соотношение рубля к доллару (продажа)
    usd_rur_sale = soup1_1.find(
        'td',
        {'id': 'Доллар СШАnoncashSell'}
    ).text.replace(',', '.')

    return [
        Currency(
            base_ccy='RUR',
            ccy='EUR',
            buy=eur_rur_buy,
            sale=eur_rur_sale
        ),
        Currency(
            base_ccy='RUR',
            ccy='USD',
            buy=usd_rur_buy,
            sale=usd_rur_sale
        )
    ]


def parse_privat24():
    currency_records = []
    # Парсим https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5
    page2 = requests.get("https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5")
    soup2 = BeautifulSoup(page2.text, "html.parser")

    for currency in soup2.findAll('exchangerate'):

        # Obtain exchange rates for UAH (RUR, USD, EUR):
        if currency.attrs['base_ccy'] == 'UAH':
            currency_records.append(
                Currency(
                    base_ccy=currency.attrs.get('base_ccy'),
                    ccy=currency.attrs.get('ccy'),
                    buy=currency.attrs.get('buy'),
                    sale=currency.attrs.get('sale')
                ))
    return currency_records


# TODO: need research. Which exchange rate are exactly needed.
# # Парсим https://www.alfabank.by/personal/currency/
# page3 = requests.get("https://www.alfabank.by/personal/currency/")
# soup3 = BeautifulSoup(page3.text, "html.parser")
#
# cross_rate = soup3.find('cross_rate', {'code': '5'})
# cross_rate_record = cross_rate.find('cross_rate_record', {'mnem': 'EUR/USD'})
# # Получаем соотношение евро к доллару (продажа)
# eur_usd_sale = cross_rate_record['rate']

if __name__ == '__main__':
    exchange_rates = parse_alphabank() + parse_privat24()
    for exchange_rate in exchange_rates:
        db.session.add(exchange_rate)
    db.session.commit()
