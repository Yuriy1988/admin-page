import {ANTIFRAUD_GET} from '../lib/api'
import {ANTIFRAUD_PUT} from '../lib/api'
import {ANTIFRAUD_SETTINGS_GET} from '../lib/api'
import {ANTIFRAUD_SETTINGS_SET} from '../lib/api'
import {CALL_API} from '../middleware/api'

export const ANTIFRAUD_GET_REQUEST = 'ANTIFRAUD_GET_REQUEST';
export const ANTIFRAUD_GET_SUCCESS = 'ANTIFRAUD_GET_SUCCESS';
export const ANTIFRAUD_GET_FAILURE = 'ANTIFRAUD_GET_FAILURE';
export const ANTIFRAUD_GET_CERROR = 'ANTIFRAUD_GET_CERROR';

export function getAntiFraud () {
    return {
        [CALL_API]: {
            types: [ANTIFRAUD_GET_REQUEST, ANTIFRAUD_GET_SUCCESS, ANTIFRAUD_GET_FAILURE],
            cError: ANTIFRAUD_GET_CERROR,
            endpoint: ANTIFRAUD_GET
        }
    }
}

export const ANTIFRAUD_SETTINGS_GET_REQUEST = 'ANTIFRAUD_SETTINGS_GET_REQUEST';
export const ANTIFRAUD_SETTINGS_GET_SUCCESS = 'ANTIFRAUD_SETTINGS_GET_SUCCESS';
export const ANTIFRAUD_SETTINGS_GET_FAILURE = 'ANTIFRAUD_SETTINGS_GET_FAILURE';
export const ANTIFRAUD_SETTINGS_GET_CERROR = 'ANTIFRAUD_SETTINGS_GET_CERROR';

export function getAntiFraudSettings () {
    return {
        [CALL_API]: {
            types: [ANTIFRAUD_SETTINGS_GET_REQUEST, ANTIFRAUD_SETTINGS_GET_SUCCESS, ANTIFRAUD_SETTINGS_GET_FAILURE],
            cError: ANTIFRAUD_SETTINGS_GET_CERROR,
            endpoint: ANTIFRAUD_SETTINGS_GET
        }
    }
}

export const ANTIFRAUD_SETTINGS_SET_REQUEST = 'ANTIFRAUD_SETTINGS_SET_REQUEST';
export const ANTIFRAUD_SETTINGS_SET_SUCCESS = 'ANTIFRAUD_SETTINGS_SET_SUCCESS';
export const ANTIFRAUD_SETTINGS_SET_FAILURE = 'ANTIFRAUD_SETTINGS_SET_FAILURE';
export const ANTIFRAUD_SETTINGS_SET_CERROR = 'ANTIFRAUD_SETTINGS_SET_CERROR';

export function setAntiFraudSettings (body) {
    return {
        [CALL_API]: {
            types: [ANTIFRAUD_SETTINGS_SET_REQUEST, ANTIFRAUD_SETTINGS_SET_SUCCESS, ANTIFRAUD_SETTINGS_SET_FAILURE],
            cError: ANTIFRAUD_SETTINGS_SET_CERROR,
            endpoint: ANTIFRAUD_SETTINGS_SET,
            body
        }
    }
}

export const ANTIFRAUD_PUT_REQUEST = 'ANTIFRAUD_PUT_REQUEST';
export const ANTIFRAUD_PUT_SUCCESS = 'ANTIFRAUD_PUT_SUCCESS';
export const ANTIFRAUD_PUT_FAILURE = 'ANTIFRAUD_PUT_FAILURE';
export const ANTIFRAUD_PUT_CERROR = 'ANTIFRAUD_PUT_CERROR';



export function setAntiFraud (body, id) {
    return {
        [CALL_API]: {
            types: [ANTIFRAUD_PUT_REQUEST, ANTIFRAUD_PUT_SUCCESS, ANTIFRAUD_PUT_FAILURE],
            cError: ANTIFRAUD_PUT_CERROR,
            endpoint: ANTIFRAUD_PUT(id),
            body
        }
    }
}