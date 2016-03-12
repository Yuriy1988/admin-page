import { CALL_API } from '../middleware/api'


import {CURRENCY_HISTORY} from '../lib/api'
export const CURRENCY_HISTORY_REQUEST = 'CURRENCY_HISTORY_REQUEST';
export const CURRENCY_HISTORY_SUCCESS = 'CURRENCY_HISTORY_SUCCESS';
export const CURRENCY_HISTORY_FAILURE = 'CURRENCY_HISTORY_FAILURE';
export const CURRENCY_HISTORY_CERROR = 'CURRENCY_HISTORY_CERROR';
export function getHistoryCError() {
    return {
        type: CURRENCY_HISTORY_CERROR
    }
}

/**
 * Call API to fetch currency history
 * @param filters: { fromDate: "YYYY-MM-DD", tillDate: "YYYY-MM-DD", toCurrency: "USD", fromCurrency: "UAH" }
 * @returns get currency history actions, wich is calls API when dispatch
 */
export function getHistory(filters = {}) {
    let body = {};
    if (!!filters.fromDate) body.from_date = filters.fromDate;
    if (!!filters.tillDate) body.till_date = filters.tillDate;
    if (!!filters.toCurrency) body.to_currency = filters.toCurrency;
    if (!!filters.fromCurrency) body.from_currency = filters.fromCurrency;
    return {
        [CALL_API]: {
            types: [CURRENCY_HISTORY_REQUEST, CURRENCY_HISTORY_SUCCESS, CURRENCY_HISTORY_FAILURE],
            cError: CURRENCY_HISTORY_CERROR,
            endpoint: CURRENCY_HISTORY,
            body
        }
    }
}
