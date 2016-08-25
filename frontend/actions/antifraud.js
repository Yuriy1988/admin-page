import {ANTIFRAUD_GET} from '../lib/api'
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
