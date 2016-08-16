import {CALL_API} from '../middleware/api';
import {SERVER_VERSION_GET} from '../lib/api'
import {TOKEN_REFRESH} from '../lib/api'
import {PAYMENT_INTERFACE_GET} from '../lib/api'

export const SERVER_VERSION_REQUEST = 'SERVER_VERSION_REQUEST';
export const SERVER_VERSION_SUCCESS = 'SERVER_VERSION_SUCCESS';
export const SERVER_VERSION_FAILURE = 'SERVER_VERSION_FAILURE';
export const SERVER_VERSION_CERROR = 'SERVER_VERSION_CERROR';

export function serverRequestError() {
    return {
        type: SERVER_VERSION_CERROR
    }
}

export function getServerVersion() {
    return {
        [CALL_API]: {
            types: [SERVER_VERSION_REQUEST, SERVER_VERSION_SUCCESS, SERVER_VERSION_FAILURE],
            cError: SERVER_VERSION_CERROR,
            endpoint: SERVER_VERSION_GET,
        }
    }
}

export const PAYMENT_INTERFACE_REQUEST = 'PAYMENT_INTERFACE_REQUEST';
export const PAYMENT_INTERFACE_SUCCESS = 'PAYMENT_INTERFACE_SUCCESS';
export const PAYMENT_INTERFACE_FAILURE = 'PAYMENT_INTERFACE_FAILURE';
export const PAYMENT_INTERFACE_CERROR = 'PAYMENT_INTERFACE_CERROR';

export function getPaymentInterfaces() {
    return {
        [CALL_API]: {
            types: [PAYMENT_INTERFACE_REQUEST, PAYMENT_INTERFACE_SUCCESS, PAYMENT_INTERFACE_FAILURE],
            cError: PAYMENT_INTERFACE_CERROR,
            endpoint: PAYMENT_INTERFACE_GET,
        }
    }
}

// > GET /api/admin/{version}/constants/payment_interface
// < 200 OK { sign_algorithm: ["privat", "aval", "pumb"] }