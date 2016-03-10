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
export function getHistory() {
    return {
        [CALL_API]: {
            types: [CURRENCY_HISTORY_REQUEST, CURRENCY_HISTORY_SUCCESS, CURRENCY_HISTORY_FAILURE],
            cError: CURRENCY_HISTORY_CERROR,
            endpoint: CURRENCY_HISTORY
        }
    }
}
